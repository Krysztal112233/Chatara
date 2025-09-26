use rocket::{fairing::AdHoc, options, routes};

pub struct RootEndpoint;

impl RootEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("Root Endpoint", |r| async move {
            r.mount("/", routes![all_options])
        })
    }
}

#[options("/<_..>")]
pub async fn all_options() {}
