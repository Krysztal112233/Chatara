use rocket::{
    fairing::{Fairing, Info, Kind},
    http::Header,
    Request, Response,
};

use crate::config::ChataraConfig;

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Fairing",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        let config = request.rocket().state::<ChataraConfig>().unwrap();

        response.set_header(Header::new(
            "Access-Control-Allow-Origin",
            &config.cors.origin,
        ));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, PATCH, PUT, DELETE, HEAD, OPTIONS, GET",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}
