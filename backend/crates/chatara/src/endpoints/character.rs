use rocket::{delete, fairing::AdHoc, get, http::Status, post, routes, serde::json::Json, State};
use sea_orm::DatabaseConnection;
use sqids::Sqids;

use crate::{
    common::{
        guards::auth::AuthGuard, helpers::character_profiles::CharacterProfilesHelper,
        requests::Sqid, CommonResponse, PagedData,
    },
    endpoints::character::response::{CharacterProfileVO, CreateCharacterProfileRequest},
    entity::prelude::*,
    error::Error,
};

pub struct CharacterProfileEndpoint;

impl CharacterProfileEndpoint {
    pub fn stage() -> AdHoc {
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
async fn get_characters(
    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<PagedData<CharacterProfileVO>>, Error> {
    let result = CharacterProfiles::get_characters_of_user(auth.uid, db.inner())
        .await?
        .into_iter()
        .map(|it| CharacterProfileVO::from_model(it, sqid.inner()))
        .collect::<Vec<_>>();

    Ok(CommonResponse::default().set_data(PagedData::with_entire(result)))
}

#[delete("/<character>")]
async fn delete_character(
    character: Sqid,

    auth: AuthGuard,
    sqid: &State<Sqids>,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<()>, Error> {
    let character = character.to_uuid(sqid)?;

    CharacterProfiles::delete_character_of_user(character, auth.uid, db.inner()).await?;

    Ok(CommonResponse::default())
}

#[get("/<character>")]
async fn get_character(
    character: Sqid,

    sqid: &State<Sqids>,
    auth: AuthGuard,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<CharacterProfileVO>, Error> {
    let id = character.to_uuid(sqid)?;

    let character = CharacterProfiles::get_character_of_user(id, auth.uid, db.inner()).await?;

    match character {
        Some(character) => Ok(CommonResponse::default()
            .set_data(CharacterProfileVO::from_model(character, sqid.inner()))),
        None => Ok(CommonResponse::with_msg(
            Status::NotFound.code,
            "Character not found.".to_owned(),
        )),
    }
}

#[post("/", data = "<profile>")]
async fn create_character(
    profile: Json<CreateCharacterProfileRequest>,

    sqid: &State<Sqids>,
    auth: AuthGuard,
    db: &State<DatabaseConnection>,
) -> Result<CommonResponse<CharacterProfileVO>, Error> {
    let profile = profile.0;

    let result = CharacterProfiles::create_character(
        profile.name,
        profile.settings,
        profile.prompt,
        profile.description,
        auth.uid,
        profile.avatar,
        db.inner(),
    )
    .await?;

    Ok(CommonResponse::default().set_data(CharacterProfileVO::from_model(result, sqid)))
}

mod response {

    use chrono::{DateTime, FixedOffset};
    use serde::{Deserialize, Serialize};
    use serde_json::Value;
    use sqids::Sqids;

    use crate::{
        common::requests::{Sqid, ToSqid},
        entity::character_profiles,
    };

    #[derive(Debug, Serialize)]
    pub struct CharacterProfileVO {
        id: Sqid,
        name: String,
        created_at: DateTime<FixedOffset>,
        description: String,
        avatar: Option<String>,
    }

    impl CharacterProfileVO {
        pub fn from_model(model: character_profiles::Model, sqid: &Sqids) -> Self {
            Self {
                id: model.id.to_sqid_with(sqid),
                name: model.name,
                created_at: model.created_at,
                description: model.description,
                avatar: model.avatar,
            }
        }
    }

    #[derive(Debug, Deserialize)]
    pub struct CreateCharacterProfileRequest {
        pub name: String,
        pub settings: Value,
        pub prompt: String,
        pub description: String,
        pub avatar: Option<String>,
    }
}
