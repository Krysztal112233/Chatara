use std::{fmt::Debug, ops::Deref};

use jsonwebtoken::{jwk::JwkSet, DecodingKey};
use serde::{Deserialize, Serialize};

#[derive(Clone)]
pub struct JwtValidator {
    jwks: Vec<DecodingKey>,
}

impl JwtValidator {
    pub fn new<T>(json: T) -> Self
    where
        T: Into<String>,
    {
        let jwks = serde_json::from_str::<JwkSet>(&json.into()).unwrap().keys;

        let jwks = jwks
            .into_iter()
            .flat_map(|it| DecodingKey::from_jwk(&it))
            .collect();

        Self { jwks }
    }

    pub fn validat<T>(jwt: T)
    where
        T: Into<String>,
    {
    }
}

impl Debug for JwtValidator {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("JwtValidator")
            .field("jwks[{}]", &self.jwks.len())
            .finish()
    }
}
