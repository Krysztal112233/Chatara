use log::error;
use rocket::{
    async_trait,
    http::Status,
    request::{FromRequest, Outcome},
    Request,
};
use sea_orm::DatabaseConnection;

use crate::entity::prelude::*;
use crate::{
    common::{
        helpers::user::UserHelper,
        jwt::{Auth0Claim, JwtValidator},
    },
    error::Error,
};

#[derive(Debug)]
pub struct AuthGuard {
    pub uid: String,
}

#[async_trait]
impl<'r> FromRequest<'r> for AuthGuard {
    type Error = Error;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth_header = req.headers().get_one("Authorization");
        let token = match auth_header.and_then(|v| v.strip_prefix("Bearer ")) {
            Some(t) => t.trim(),
            None => {
                return Outcome::Error((
                    Status::Unauthorized,
                    jsonwebtoken::errors::Error::from(
                        jsonwebtoken::errors::ErrorKind::MissingRequiredClaim("auth".to_owned()),
                    )
                    .into(),
                ));
            }
        };

        let validator = req
            .rocket()
            .state::<JwtValidator>()
            .expect("`JwtValidator` not managed");

        let claim = validator.decode::<Auth0Claim>(token).await;
        match claim {
            Ok(ref t) => t,
            Err(e) => {
                error!("failed decoding jwt {e}");
                return Outcome::Error((Status::Unauthorized, e));
            }
        };

        let uid = claim.unwrap().claims.sub;

        let db = req.rocket().state::<DatabaseConnection>().unwrap();
        let _ = Users::create(&uid, db)
            .await
            .inspect_err(|e| error!("failed to created user: {e}"));

        Outcome::Success(AuthGuard { uid })
    }
}
