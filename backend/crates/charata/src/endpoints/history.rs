use rocket::{delete, fairing::AdHoc, get, post, routes};
use uuid::Uuid;

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
async fn get_history_indexes_of_user(user: Uuid) {}

#[get("/")]
async fn get_history_indexes() {}

#[post("/?<profile>")]
async fn create_history_index(profile: Uuid) {}

#[delete("/<history_index>")]
async fn delete_histories(history_index: Uuid) {}

#[post("/<history_index>")]
async fn create_histories(history_index: Uuid) {}

#[get("/<history_index>")]
async fn get_histories(history_index: Uuid) {}
