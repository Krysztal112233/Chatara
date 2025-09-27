use rocket::{http::Status, response::Responder};
use sea_orm::DbErr;
use thiserror::Error;

use crate::common::CommonResponse;

#[derive(Debug, Error)]
pub enum Error {
    #[error("{0}")]
    Db(#[from] sea_orm::DbErr),

    #[error("{0}")]
    Io(#[from] std::io::Error),

    #[error("{0}")]
    Reqwest(#[from] reqwest::Error),

    #[error("{0}")]
    Sqid(#[from] sqids::Error),

    #[error("{0}")]
    Jwt(#[from] jsonwebtoken::errors::Error),

    #[error("{0}")]
    Storage(#[from] chatara_storage::error::Error),
}

impl From<Error> for CommonResponse<()> {
    fn from(value: Error) -> Self {
        match value {
            Error::Db(DbErr::RecordNotFound(r)) => {
                CommonResponse::with_msg(Status::NotFound.code, format!("`{r}` not found"))
            }
            _ => CommonResponse::from(Status::InternalServerError),
        }
    }
}

impl<'r, 'o: 'r> Responder<'r, 'o> for Error {
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        CommonResponse::from(self).respond_to(request)
    }
}
