use std::{
    fmt::Debug,
    sync::{Arc, OnceLock},
};

use jsonwebtoken::{Algorithm, DecodingKey, TokenData, Validation, decode, jwk::JwkSet};
use rocket::tokio::sync::RwLock;
use serde::{Deserialize, Serialize, de::DeserializeOwned};

use crate::error::Error;

#[derive(Debug, Serialize, Clone, Deserialize)]
pub struct Auth0Claim {
    pub sub: String,
}

pub struct JwtValidator {
    pub jwks: Arc<RwLock<Vec<DecodingKey>>>,
}

impl JwtValidator {
    pub async fn new(url: &str) -> Result<Self, Error> {
        let jwks = reqwest::get(url).await?.json::<JwkSet>().await?;

        let jwks = Arc::new(RwLock::new(
            jwks.keys
                .into_iter()
                .flat_map(|it| DecodingKey::from_jwk(&it))
                .collect(),
        ));

        Ok(Self { jwks })
    }

    pub async fn decode<C>(&self, jwt: &str) -> Result<TokenData<C>, Error>
    where
        C: DeserializeOwned + Clone,
    {
        static ALG: OnceLock<Validation> = OnceLock::new();
        let alg = ALG.get_or_init(|| Validation::new(Algorithm::RS256));

        let binding = self
            .jwks
            .read()
            .await
            .iter()
            .flat_map(|it| decode::<C>(jwt, it, alg))
            .collect::<Vec<_>>();
        let result = binding.first();

        result.cloned().ok_or(Error::Jwt(
            jsonwebtoken::errors::ErrorKind::InvalidToken.into(),
        ))
    }
}

impl Debug for JwtValidator {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("JwtValidator")
            .field("jwks[{}]", &"?")
            .finish()
    }
}
