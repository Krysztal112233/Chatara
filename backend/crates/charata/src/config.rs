use std::str;

use educe::Educe;
use rocket::figment::{
    providers::{Env, Format, Serialized, Toml},
    Figment, Profile,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct ChataraConfig {
    pub cors: CorsConfig,
    pub database: DatabaseConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize, Educe)]
#[educe(Default)]
pub struct CorsConfig {
    #[educe(Default = "*")]
    pub origin: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, Educe)]
#[educe(Default)]
pub struct DatabaseConfig {
    #[educe(Default = "postgres://postgres:postgres@postgres/postgres")]
    pub url: String,

    #[educe(Default = 16)]
    pub connect_timeout: u64,

    #[educe(Default = 128)]
    pub max_connections: u32,

    #[educe(Default = 8)]
    pub min_connections: u32,

    #[educe(Default = true)]
    pub run_migration: bool,
}

impl ChataraConfig {
    pub fn get_figment() -> Figment {
        Figment::default()
            .merge(Serialized::defaults(rocket::Config::default()))
            .merge(Serialized::defaults(ChataraConfig::default()))
            .merge(Toml::file("./chatara.toml").nested())
            .merge(Env::prefixed("CHATARA_").split("__").global())
            .select(Profile::from_env_or("CHATARA_PROFILE", "debug"))
    }
}
