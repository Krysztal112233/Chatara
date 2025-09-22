use mimalloc::MiMalloc;
use rocket::Rocket;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

#[rocket::launch]
async fn rocket() -> _ {
    Rocket::build()
}
