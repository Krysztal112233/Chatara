use migration::index;
use rocket::{
    data, delete, fairing::AdHoc, get, http::Status, post, routes, serde::json::Json, State,
};
use sea_orm::DatabaseConnection;
use sqids::Sqids;
use uuid::Uuid;

use crate::{
    common::{
        guards::auth::AuthGuard,
        helpers::{histories::HistoriesHelper, history_indexes::HistoryIndexesHelper},
        requests::Sqid,
        CommonResponse, PagedData,
    },
    endpoints::history::response::{CreateHistoryRequest, HistoryIndexVO, HistoryVO},
    entity::prelude::*,
    error::Error,
};

pub struct HistoryEndpoint;

impl HistoryEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("History Endpoint", |r| async move {
            r.mount(
                "/histories",
                routes![
                    create_history,
                    create_index,
                    delete_histories,
                    get_histories,
                    get_indexes,
                    get_indexes_of_user,
                ],
            )
        })
    }
}

#[get("/?<user>")]
async fn get_indexes_of_user(
    user: String,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<PagedData<HistoryIndexVO>>, Error> {
    let h = HistoryIndexes::get_history_indexes_of_user(user, db.inner())
        .await?
        .into_iter()
        .map(|it| HistoryIndexVO::from_model(sqid, it))
        .collect::<Vec<_>>();

    let data = PagedData::with_entire(h);
    Ok(CommonResponse::from(Status::Ok).set_data(data))
}

#[get("/")]
async fn get_indexes(
    auth: AuthGuard,
    db: &State<DatabaseConnection>,
    sqid: &State<Sqids>,
) -> Result<CommonResponse<PagedData<HistoryIndexVO>>, Error> {
    let h = HistoryIndexes::get_history_indexes_of_user(auth.uid, db.inner())
        .await?
        .into_iter()
        .map(|it| HistoryIndexVO::from_model(sqid, it))
        .collect::<Vec<_>>();

    let data = PagedData::with_entire(h);
    Ok(CommonResponse::from(Status::Ok).set_data(data))
}

#[post("/?<profile>")]
async fn create_index(
    profile: Sqid,
    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<HistoryIndexVO>, Error> {
    let result =
        HistoryIndexes::create_history(auth.uid, profile.to_uuid(sqid)?, db.inner()).await?;

    Ok(CommonResponse::from(Status::Ok).set_data(HistoryIndexVO::from_model(sqid, result)))
}

#[delete("/<history_index>")]
async fn delete_histories(
    history_index: Sqid,

    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<()>, Error> {
    HistoryIndexes::delete_index_of_user(history_index.to_uuid(sqid)?, auth.uid, db.inner())
        .await?;

    Ok(CommonResponse::default())
}

#[post("/<index>", data = "<data>")]
async fn create_history(index: Sqid, data: Json<CreateHistoryRequest>) {
    //TODO: 实现流式回复
    let data = data.0;
}

#[get("/<index>")]
async fn get_histories(
    index: Sqid,

    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<PagedData<HistoryVO>>, Error> {
    let index =
        HistoryIndexes::get_history_index_of_user(auth.uid, index.to_uuid(sqid)?, db.inner())
            .await?;

    let historie = Histories::get_all_histories(index.id, db.inner())
        .await?
        .into_iter()
        .map(|it| HistoryVO::from_model(sqid, it))
        .collect::<Vec<_>>();

    Ok(CommonResponse::default().set_data(PagedData::with_entire(historie)))
}

mod response {
    use chrono::{DateTime, FixedOffset};
    use serde::{Deserialize, Serialize};
    use sqids::Sqids;

    use crate::{
        common::requests::{Sqid, ToSqid},
        entity::{histories, history_indexes, sea_orm_active_enums::ChatRole},
    };

    #[derive(Debug, Serialize)]
    pub struct HistoryIndexVO {
        id: Sqid,
        character: Sqid,
        updated_at: DateTime<FixedOffset>,
    }

    impl HistoryIndexVO {
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
        content: String,
    }
}
