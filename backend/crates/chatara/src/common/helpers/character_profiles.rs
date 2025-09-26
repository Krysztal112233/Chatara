use chrono::Local;
use rocket::async_trait;
use sea_orm::{ActiveValue::*, ConnectionTrait, EntityTrait, prelude::*};
use serde_json::json;

use crate::{
    entity::{character_profiles, prelude::CharacterProfiles},
    error::Error,
};

#[async_trait]
pub trait CharacterProfilesHelper {
    async fn get_character<C>(id: Uuid, db: &C) -> Result<Option<character_profiles::Model>, Error>
    where
        C: ConnectionTrait,
    {
        Ok(CharacterProfiles::find_by_id(id).one(db).await?)
    }

    async fn create_character<T, C>(
        name: T,
        settings: serde_json::Value,
        db: &C,
    ) -> Result<character_profiles::Model, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        Ok(character_profiles::ActiveModel {
            id: Set(Uuid::now_v7()),
            created_at: Set(Local::now().into()),
            name: Set(name.into()),
            settings: Set(settings),
        }
        .insert(db)
        .await?)
    }

    async fn get_characters<C>(db: &C) -> Result<Vec<serde_json::Value>, Error>
    where
        C: ConnectionTrait,
    {
        let all = CharacterProfiles::find().all(db).await?;
        let mapped = all
            .into_iter()
            .map(|it| {
                json!({
                    "name": it.name,
                    "settings": it.settings,
                })
            })
            .collect::<Vec<_>>();
        Ok(mapped)
    }
}

impl CharacterProfilesHelper for CharacterProfiles {}
