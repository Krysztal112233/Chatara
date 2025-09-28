use chrono::Local;
use rocket::async_trait;
use sea_orm::{prelude::*, ActiveValue::*, ConnectionTrait, EntityTrait};

use crate::{
    entity::{character_profiles, prelude::CharacterProfiles},
    error::Error,
};

#[allow(unused)]
#[async_trait]
pub trait CharacterProfilesHelper {
    async fn get_character_of_user<T, C>(
        id: Uuid,
        user: T,
        db: &C,
    ) -> Result<Option<character_profiles::Model>, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        Ok(CharacterProfiles::find_by_id(id)
            .filter(character_profiles::Column::BelongUser.eq(user.into()))
            .one(db)
            .await?)
    }

    async fn create_character<T, C>(
        name: T,
        settings: serde_json::Value,
        prompt: T,
        description: T,
        user: T,
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
            prompt: Set(prompt.into()),
            description: Set(description.into()),
            belong_user: Set(user.into()),
        }
        .insert(db)
        .await?)
    }

    async fn get_characters_of_user<T, C>(
        user: T,
        db: &C,
    ) -> Result<Vec<character_profiles::Model>, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        let all = CharacterProfiles::find()
            .filter(character_profiles::Column::BelongUser.eq(user.into()))
            .all(db)
            .await?;

        Ok(all)
    }

    async fn delete_character_of_user<T, C>(id: Uuid, user: T, db: &C) -> Result<(), Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        CharacterProfiles::delete_by_id(id)
            .filter(character_profiles::Column::BelongUser.eq(user.into()))
            .exec(db)
            .await?;
        Ok(())
    }
}

impl CharacterProfilesHelper for CharacterProfiles {}
