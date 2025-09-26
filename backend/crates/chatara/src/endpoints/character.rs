use rocket::{State, delete, fairing::AdHoc, get, post, routes, serde::json::Json};
use sea_orm::{DatabaseConnection, EntityTrait, QueryOrder};
use serde_json::{Value, json};
use uuid::Uuid;

use crate::{
    common::{CommonResponse, requests::Sqid},
    entity::{character_profiles, prelude::*},
    error,
};

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
async fn get_characters(db: &State<DatabaseConnection>) {
    let result = CharacterProfiles::find()
        .order_by_asc(character_profiles::Column::CreatedAt)
        .all(db.inner())
        .await;
}

#[delete("/<character>")]
async fn delete_character(character: Sqid) {}

#[get("/<character>")]
async fn get_character(character: Sqid) {}

#[post("/", data = "<profile>")]
async fn create_character(profile: Json<Value>) {}
