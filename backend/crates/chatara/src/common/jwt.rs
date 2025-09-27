use std::{
    fmt::Debug,
    sync::{Arc, OnceLock},
};

use jsonwebtoken::{
    decode, decode_header,
    jwk::{AlgorithmParameters, JwkSet},
    Algorithm, DecodingKey, TokenData, Validation,
};
use log::error;
use rocket::{serde::json, tokio::sync::RwLock};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::{config::AuthConfig, error::Error};

#[derive(Debug, Serialize, Clone, Deserialize)]
pub struct Auth0Claim {
    pub sub: String,
}

pub struct JwtValidator {
    pub jwks: Arc<RwLock<JwkSet>>,
}

static VALID: OnceLock<Validation> = OnceLock::new();

impl JwtValidator {
    pub async fn new(url: &str, config: &AuthConfig) -> Result<Self, Error> {
        let jwks = reqwest::get(url).await?.json::<JwkSet>().await?;

        let jwks = Arc::new(RwLock::new(jwks));

        let _ = VALID.get_or_init(|| {
            let mut validation = Validation::new(Algorithm::RS256);
            validation.set_audience(&config.aud);
            validation.set_issuer(std::slice::from_ref(&config.iss));
            validation
        });

        Ok(Self { jwks })
    }

    pub async fn decode<C>(&self, jwt: &str) -> Result<TokenData<C>, Error>
    where
        C: DeserializeOwned + Clone,
    {
        let header = decode_header(jwt)?;
        let kid = header
            .kid
            .ok_or(Error::Jwt(jsonwebtoken::errors::Error::from(
                jsonwebtoken::errors::ErrorKind::MissingRequiredClaim("kid".to_owned()),
            )))?;

        let jwks = self.jwks.read().await.clone();

        let jwk = jwks
            .find(&kid)
            .ok_or(Error::Jwt(jsonwebtoken::errors::Error::from(
                jsonwebtoken::errors::ErrorKind::MissingAlgorithm,
            )))?;

        let AlgorithmParameters::RSA(ref param) = jwk.algorithm else {
            return Err(Error::Jwt(
                jsonwebtoken::errors::ErrorKind::MissingAlgorithm.into(),
            ));
        };
        let decoding = DecodingKey::from_rsa_components(&param.n, &param.e)?;

        let validation = VALID.get().unwrap();
        let token = decode(jwt, &decoding, validation)?;

        Ok(token)
    }
}

impl Debug for JwtValidator {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("JwtValidator")
            .field("jwks[{}]", &"?")
            .finish()
    }
}
