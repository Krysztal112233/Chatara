use rocket::{delete, fairing::AdHoc, get, post, routes, serde::json::Json};
use serde_json::Value;
use uuid::Uuid;

pub struct CharacterProfileEndpoint;

impl CharacterProfileEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("CharacterProfile Endpoint", |r| async move {
            r.mount(
                "/characters",
                routes![
                    create_character,
                    delete_character,
                    get_character,
                    get_characters,
                ],
            )
        })
    }
}

#[get("/")]
async fn get_characters() {}

#[delete("/<character>")]
async fn delete_character(character: Uuid) {}

#[get("/<character>")]
async fn get_character(character: Uuid) {}

#[post("/", data = "<profile>")]
async fn create_character(profile: Json<Value>) {}
