use rocket::fairing::AdHoc;

pub struct HistoryEndpoint;

impl HistoryEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("History Endpoint", |r| async move { r })
    }
}
