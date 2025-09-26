use rocket::{delete, fairing::AdHoc, get, http::Status, post, routes, State};
use sea_orm::DatabaseConnection;
use sqids::Sqids;
use uuid::Uuid;

use crate::{
    common::{
        guards::auth::AuthGuard, helpers::history_indexes::HistoryIndexesHelper, requests::Sqid,
        CommonResponse, PagedData,
    },
    endpoints::history::response::HistoryIndexVO,
    entity::prelude::HistoryIndexes,
    error::Error,
};

pub struct HistoryEndpoint;

impl HistoryEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("History Endpoint", |r| async move {
            r.mount(
                "/histories",
                routes![
                    create_histories,
                    create_history_index,
                    delete_histories,
                    get_histories,
                    get_history_indexes,
                    get_history_indexes_of_user,
                ],
            )
        })
    }
}

#[get("/?<user>")]
async fn get_history_indexes_of_user(user: Sqid, sqid: &State<Sqids>) {}

#[get("/")]
async fn get_history_indexes(
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
async fn create_history_index(
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
    HistoryIndexes::delete_history_of_user(
        vec![history_index.to_uuid(sqid)?],
        auth.uid,
        db.inner(),
    )
    .await?;

    Ok(CommonResponse::default())
}

#[post("/<history_index>")]
async fn create_histories(history_index: Sqid) {}

#[get("/<history_index>")]
async fn get_histories(
    history_index: Sqid,

    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<HistoryIndexVO>, Error> {
    let model = HistoryIndexes::get_history_index_of_user(
        auth.uid,
        history_index.to_uuid(sqid)?,
        db.inner(),
    )
    .await?;

    Ok(CommonResponse::default().set_data(HistoryIndexVO::from_model(sqid, model)))
}

mod response {
    use chrono::{DateTime, FixedOffset};
    use serde::Serialize;
    use sqids::Sqids;

    use crate::{
        common::requests::{Sqid, ToSqid},
        entity::history_indexes,
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
}
