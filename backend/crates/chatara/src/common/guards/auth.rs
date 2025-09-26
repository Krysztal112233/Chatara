use std::marker::PhantomData;

use rocket::{
    async_trait,
    http::Status,
    request::{FromRequest, Outcome},
    Request,
};
use uuid::Uuid;

#[derive(Debug)]
pub struct AuthGuard<T> {
    pub uid: String,
    _p: PhantomData<T>,
}

#[async_trait]
impl<'r, T> FromRequest<'r> for AuthGuard<T>
where
    T: AuthenticationProviderDetector,
{
    type Error = jsonwebtoken::errors::Error;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth_header = req.headers().get_one("Authorization");
        let token = match auth_header.and_then(|v| v.strip_prefix("Bearer ")) {
            Some(t) => t.trim(),
            None => {
                return Outcome::Error((
                    Status::Unauthorized,
                    jsonwebtoken::errors::Error::from(
                        jsonwebtoken::errors::ErrorKind::MissingRequiredClaim("auth".to_owned()),
                    ),
                ))
            }
        };

        let uid = match T::detect_uid(token) {
            Some(uid) => uid,
            None => {
                return Outcome::Error((
                    Status::Unauthorized,
                    jsonwebtoken::errors::Error::from(
                        jsonwebtoken::errors::ErrorKind::MissingRequiredClaim("auth".to_owned()),
                    ),
                ))
            }
        };

        Outcome::Success(AuthGuard {
            uid,
            _p: PhantomData::<T>,
        })
    }
}

trait AuthenticationProviderDetector {
    fn detect_uid<T>(jwt: T) -> Option<String>
    where
        T: Into<String>;
}

pub struct Auth0Detector;

impl AuthenticationProviderDetector for Auth0Detector {
    fn detect_uid<T>(jwt: T) -> Option<String>
    where
        T: Into<String>,
    {
        todo!()
    }
}
