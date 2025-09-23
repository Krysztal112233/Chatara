use rocket::fairing::AdHoc;

pub struct RootEndpoint;

impl RootEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("Root Endpoint", |r| async move { r })
    }
}
