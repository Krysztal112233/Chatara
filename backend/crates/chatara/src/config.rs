use educe::Educe;
use rocket::figment::{
    Figment, Profile,
    providers::{Env, Format, Serialized, Toml},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct ChataraConfig {
    pub cors: CorsConfig,
    pub database: DatabaseConfig,
    pub sqid_dict: String,
    pub auth: AuthConfig,
    pub s3: S3Config,
    pub tool: ToolConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize, Educe)]
#[educe(Default)]
pub struct CorsConfig {
    #[educe(Default = "*")]
    pub origin: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AuthConfig {
    pub jwks: String,
    pub iss: String,
    pub aud: Vec<String>,
    pub client_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct S3Config {
    pub access_key: String,
    pub endpoint: String,
    pub name: String,
    pub regeion: String,
    pub secret_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ToolConfig {}

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
