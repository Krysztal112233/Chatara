use std::time::Duration;

use jsonwebtoken::{DecodingKey, jwk::JwkSet};
use log::{error, info};
use rocket::{
    Orbit, Request, Response, Rocket, async_trait,
    fairing::{Fairing, Info, Kind},
    http::Header,
    tokio::{self, time},
};

use crate::{common::jwt::JwtValidator, config::ChataraConfig};

pub struct Cors;

#[async_trait]
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

pub struct JwtValidatorRefresher;

#[async_trait]
impl Fairing for JwtValidatorRefresher {
    fn info(&self) -> Info {
        Info {
            name: "`JwtValidator` Refresher",
            kind: Kind::Liftoff,
        }
    }

    async fn on_liftoff(&self, rocket: &Rocket<Orbit>) {
        let url = rocket.state::<ChataraConfig>().unwrap().jwks.clone();
        let jwt_validator = rocket.state::<JwtValidator>().unwrap().jwks.clone();

        tokio::spawn(async move {
            let mut ticker = time::interval(Duration::from_secs(300));

            loop {
                ticker.tick().await;
                info!("refreshing jwks......");

                let Ok(jwks) = reqwest::get(url.to_owned())
                    .await
                    .inspect_err(|e| error!("failed to fetch jwks.json from server: {e}"))
                else {
                    continue;
                };
                let Ok(jwks) = jwks
                    .json::<JwkSet>()
                    .await
                    .inspect_err(|e| error!("failed parsing jwks.json: {e}"))
                else {
                    continue;
                };

                let jwks = jwks
                    .keys
                    .into_iter()
                    .flat_map(|it| DecodingKey::from_jwk(&it))
                    .collect::<Vec<_>>();

                *jwt_validator.write().await = jwks;
                info!("jwks refreshed!")
            }
        });
    }
}
