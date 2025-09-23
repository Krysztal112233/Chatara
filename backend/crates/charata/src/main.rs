use log::LevelFilter;
use mimalloc::MiMalloc;
use rocket::Rocket;

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

    Rocket::build()
}
