use std::time::Duration;

use chatara_storage::ChataraStorage;
use dotenvy::dotenv;
use log::LevelFilter;
use migration::MigratorTrait;
use mimalloc::MiMalloc;
use rocket::{Rocket, catchers};
use sea_orm::{ConnectOptions, Database, DatabaseConnection};

use crate::{
    common::{
        fairings::{Cors, JwtValidatorRefresher},
        jwt::JwtValidator,
    },
    config::{AuthConfig, ChataraConfig, DatabaseConfig, S3Config},
    endpoints::{
        tool::AgentEndpoint, character::CharacterProfileEndpoint, history::HistoryEndpoint,
        root::RootEndpoint,
    },
    error::Error,
};

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

mod common;
mod config;
mod endpoints;
#[allow(unused)]
mod entity;
mod error;

#[rocket::launch]
async fn rocket() -> _ {
    dotenv().ok();

    let _ = env_logger::builder()
        .filter_level(LevelFilter::Info)
        .try_init();

    let figment = ChataraConfig::get_figment();
    let chatara_config: ChataraConfig = figment.extract().unwrap();

    let database = setup_database(&chatara_config.database).await.unwrap();
    let jwt_validator = setup_jwks(&chatara_config.auth.jwks, &chatara_config.auth)
        .await
        .unwrap();
    let sqid = setup_sqids(&chatara_config).await.unwrap();
    let storage = setup_filestorage(&chatara_config.s3).await.unwrap();

    Rocket::custom(figment)
        .register("/", catchers![common::catcher::default])
        .manage(chatara_config)
        .manage(database)
        .manage(jwt_validator)
        .manage(sqid)
        .manage(storage)
        .attach(Cors)
        .attach(JwtValidatorRefresher)
        .attach(AgentEndpoint::stage())
        .attach(CharacterProfileEndpoint::stage())
        .attach(HistoryEndpoint::stage())
        .attach(RootEndpoint::stage())
}

async fn setup_database(config: &DatabaseConfig) -> Result<DatabaseConnection, Error> {
    let mut opt = ConnectOptions::new(config.url.to_owned());
    opt.min_connections(config.min_connections)
        .max_connections(config.max_connections)
        .connect_timeout(Duration::from_secs(config.connect_timeout));

    let database = Database::connect(opt).await?;

    if config.run_migration {
        migration::Migrator::up(&database, None).await?
    }

    Ok(database)
}

async fn setup_jwks(url: &str, config: &AuthConfig) -> Result<JwtValidator, Error> {
    let jwt_validator = JwtValidator::new(url, config).await?;
    Ok(jwt_validator)
}

async fn setup_sqids(config: &ChataraConfig) -> Result<sqids::Sqids, sqids::Error> {
    sqids::SqidsBuilder::new()
        .alphabet(config.sqid_dict.chars().collect())
        .build()
}

async fn setup_filestorage(config: &S3Config) -> Result<ChataraStorage, Error> {
    Ok(ChataraStorage::new(
        &config.name,
        &config.regeion,
        &config.access_key,
        &config.secret_key,
        &config.endpoint,
    )?)
}
