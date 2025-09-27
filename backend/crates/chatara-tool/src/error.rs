use thiserror::Error;

pub(crate) type Result<T> = ::std::result::Result<T, Error>;

#[derive(Debug, Error)]
pub enum Error {
    #[error("{0}")]
    OpenAI(#[from] openai_api_rs::v1::error::APIError),

    #[error("{0}")]
    Serde(#[from] serde_json::error::Error),

    #[error("{0}")]
    Unknown(String),
}
