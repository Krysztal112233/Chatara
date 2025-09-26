use reqwest::StatusCode;
use rocket::{fairing::AdHoc, get, http::Status, options, routes};
use serde_json::{json, Value};

use crate::{
    common::{guards::auth::AuthGuard, CommonResponse},
    error::Error,
};

pub struct RootEndpoint;

impl RootEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("Root Endpoint", |r| async move {
            r.mount("/", routes![all_options, test_auth0])
        })
    }
}

#[options("/<_..>")]
pub async fn all_options() {}

#[get("/")]
pub async fn test_auth0(auth: Option<AuthGuard>) -> CommonResponse<Value> {
    match auth {
        Some(a) => CommonResponse::from(Status::Ok).set_data(json!({"uid": a.uid})),
        None => {
            CommonResponse::with_msg(Status::NotFound.code, "nah...JWT test failed.".to_owned())
        }
    }
}
