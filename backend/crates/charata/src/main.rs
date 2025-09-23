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
    Rocket::build()
}
