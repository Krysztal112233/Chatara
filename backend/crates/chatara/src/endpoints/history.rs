use chatara_tool::chat::ChatTool;
use migration::index;
use rocket::{
    data, delete, fairing::AdHoc, get, http::Status, post, routes, serde::json::Json, State,
};
use sea_orm::{DatabaseConnection, TransactionTrait};
use sqids::Sqids;
use uuid::Uuid;

use crate::{
    common::{
        guards::auth::AuthGuard,
        helpers::{
            histories::{HistoriesHelper, IntoChatCompletion},
            history_indexes::{self, HistoryIndexesHelper},
        },
        requests::Sqid,
        tools::ChatClient,
        CommonResponse, PagedData,
    },
    endpoints::history::response::{ChatVO, CreateHistoryRequest, HistoryVO, SessionVO},
    entity::{prelude::*, sea_orm_active_enums::ChatRole},
    error::Error,
};

pub struct HistoryEndpoint;

impl HistoryEndpoint {
    pub fn stage() -> AdHoc {
        AdHoc::on_ignite("History Endpoint", |r| async move {
            r.mount(
                "/histories",
                routes![
                    create_history,
                    create_session,
                    delete_session,
                    get_histories,
                    get_session,
                    get_sessions_of_user,
                ],
            )
        })
    }
}

#[get("/?<user>")]
async fn get_sessions_of_user(
    user: String,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<PagedData<SessionVO>>, Error> {
    let h = HistoryIndexes::get_sessions_of_user(user, db.inner())
        .await?
        .into_iter()
        .map(|it| SessionVO::from_model(sqid, it))
        .collect::<Vec<_>>();

    let data = PagedData::with_entire(h);
    Ok(CommonResponse::from(Status::Ok).set_data(data))
}

#[get("/")]
async fn get_session(
    auth: AuthGuard,
    db: &State<DatabaseConnection>,
    sqid: &State<Sqids>,
) -> Result<CommonResponse<PagedData<SessionVO>>, Error> {
    let h = HistoryIndexes::get_sessions_of_user(auth.uid, db.inner())
        .await?
        .into_iter()
        .map(|it| SessionVO::from_model(sqid, it))
        .collect::<Vec<_>>();

    let data = PagedData::with_entire(h);
    Ok(CommonResponse::from(Status::Ok).set_data(data))
}

#[post("/?<profile>")]
async fn create_session(
    profile: Sqid,
    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<SessionVO>, Error> {
    let result =
        HistoryIndexes::create_session(auth.uid, profile.to_uuid(sqid)?, db.inner()).await?;

    Ok(CommonResponse::from(Status::Ok).set_data(SessionVO::from_model(sqid, result)))
}

#[delete("/<index>")]
async fn delete_session(
    index: Sqid,

    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<()>, Error> {
    HistoryIndexes::delete_session_of_user(index.to_uuid(sqid)?, auth.uid, db.inner()).await?;

    Ok(CommonResponse::default())
}

#[post("/<index>", data = "<data>")]
async fn create_history(
    index: Sqid,
    data: Json<CreateHistoryRequest>,

    mut chat: ChatClient,
    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<ChatVO>, Error> {
    let index = index.to_uuid(sqid)?;
    let db = db.inner().begin().await?;
    let data = data.0;

    let _ = HistoryIndexes::get_session_of_user(auth.uid, index, &db).await?;

    // 成功提取到记忆
    let memories = Histories::get_memory(index, &db)
        .await?
        .into_iter()
        .map(|it| it.into_chat_completion())
        .collect::<Vec<_>>();
    chat.fill_memories(memories.clone());
    let response = chat.chat(&data.content).await?;
    let m_chat = Histories::create_history(index, ChatRole::User, data.content, &db).await?;
    let m_hist = Histories::create_history(index, ChatRole::System, response, &db).await?;
    db.commit().await?;

    Ok(CommonResponse::default().set_data(ChatVO::new(sqid, m_chat, m_hist)))
}

#[get("/<index>")]
async fn get_histories(
    index: Sqid,

    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<PagedData<HistoryVO>>, Error> {
    let index =
        HistoryIndexes::get_session_of_user(auth.uid, index.to_uuid(sqid)?, db.inner()).await?;

    let historie = Histories::get_all_histories(index.id, db.inner())
        .await?
        .into_iter()
        .map(|it| HistoryVO::from_model(sqid, it))
        .collect::<Vec<_>>();

    Ok(CommonResponse::default().set_data(PagedData::with_entire(historie)))
}

mod response {
    use core::hash;

    use chrono::{DateTime, FixedOffset};
    use serde::{Deserialize, Serialize};
    use sqids::Sqids;

    use crate::{
        common::requests::{Sqid, ToSqid},
        entity::{histories, history_indexes, sea_orm_active_enums::ChatRole},
    };

    #[derive(Debug, Serialize)]
    pub struct SessionVO {
        id: Sqid,
        character: Sqid,
        updated_at: DateTime<FixedOffset>,
    }

    impl SessionVO {
        pub fn from_model(sqid: &sqids::Sqids, model: history_indexes::Model) -> Self {
            Self {
                id: model.id.to_sqid_with(sqid),
                character: model.belong_character_profile.to_sqid_with(sqid),
                updated_at: model.updated_at,
            }
        }
    }

    #[derive(Debug, Serialize)]
    pub struct HistoryVO {
        id: Sqid,
        role: ChatRole,
        content: String,
        created_at: DateTime<FixedOffset>,
    }

    impl HistoryVO {
        pub fn from_model(sqid: &sqids::Sqids, model: histories::Model) -> Self {
            Self {
                id: model.id.to_sqid_with(sqid),
                role: model.chat_role,
                content: model.content,
                created_at: model.created_at,
            }
        }
    }

    #[derive(Debug, Deserialize)]
    pub struct CreateHistoryRequest {
        pub content: String,
    }

    #[derive(Debug, Serialize)]
    pub struct ChatVO {
        pub chat: HistoryVO,
        pub history: HistoryVO,
    }

    impl ChatVO {
        pub fn new(sqid: &sqids::Sqids, chat: histories::Model, hist: histories::Model) -> Self {
            Self {
                chat: HistoryVO::from_model(sqid, chat),
                history: HistoryVO::from_model(sqid, hist),
            }
        }
    }
}
