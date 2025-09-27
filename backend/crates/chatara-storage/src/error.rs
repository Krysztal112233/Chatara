use thiserror::Error;

pub(crate) type Result<T> = ::std::result::Result<T, Error>;

#[derive(Debug, Error)]
pub enum Error {
    #[error("{0}")]
    S3(#[from] s3::error::S3Error),

    #[error("{0}")]
    Unknown(String),
}
