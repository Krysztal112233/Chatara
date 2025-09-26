use std::time::Duration;

use log::LevelFilter;
use migration::MigratorTrait;
use mimalloc::MiMalloc;
use openidconnect::core::CoreJsonWebKeySet;
use rocket::{catchers, Rocket};
use sea_orm::{ConnectOptions, Database, DatabaseConnection};

use crate::{
    common::fairings::Cors,
    config::{ChataraConfig, DatabaseConfig},
    endpoints::{
        character::CharacterProfileEndpoint, history::HistoryEndpoint, root::RootEndpoint,
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
    let _ = env_logger::builder()
        .filter_level(LevelFilter::Info)
        .try_init();

    let figment = ChataraConfig::get_figment();
    let chatara_config: ChataraConfig = figment.extract().unwrap();

    let database = setup_database(&chatara_config.database).await.unwrap();
    // let initial_jwks = setup_jwks(&chatara_config.jwks).await.unwrap();
    let sqid = setup_sqids(&chatara_config).await.unwrap();

    Rocket::custom(figment)
        .register("/", catchers![common::catcher::default])
        .manage(chatara_config)
        .manage(database)
        // .manage(initial_jwks)
        .manage(sqid)
        .attach(Cors)
        .attach(HistoryEndpoint::adhoc())
        .attach(RootEndpoint::adhoc())
        .attach(CharacterProfileEndpoint::adhoc())
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

#[allow(unused)]
async fn setup_jwks(jwks: &str) -> Result<CoreJsonWebKeySet, Error> {
    Ok(reqwest::get(jwks).await?.json().await?)
}

async fn setup_sqids(config: &ChataraConfig) -> Result<sqids::Sqids, sqids::Error> {
    sqids::SqidsBuilder::new()
        .alphabet(config.sqid_dict.chars().collect())
        .build()
}
