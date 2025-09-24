use std::collections::HashMap;

use chrono::Local;
use rocket::async_trait;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, ConnectionTrait, EntityTrait, QueryFilter,
};
use serde_json::json;
use uuid::Uuid;

use crate::{
    entity::{history_indexes, prelude::*},
    error::Error,
};

#[async_trait]
pub trait HistoryIndexesHelper {
    async fn delete_history<I, C>(ids: I, db: &C) -> Result<(), Error>
    where
        I: IntoIterator<Item = Uuid> + Send,
        C: ConnectionTrait,
    {
        HistoryIndexes::delete_many()
            .filter(history_indexes::Column::Id.is_in(ids))
            .exec(db)
            .await?;
        Ok(())
    }

    async fn create_history<C>(
        user: Uuid,
        character: Uuid,
        db: &C,
    ) -> Result<history_indexes::Model, Error>
    where
        C: ConnectionTrait,
    {
        Ok(history_indexes::ActiveModel {
            id: Set(Uuid::now_v7()),
            created_at: Set(Local::now().into()),
            updated_at: Set(Local::now().into()),
            belong_user: Set(user),
            belong_character_profile: Set(character),
        }
        .insert(db)
        .await?)
    }

    async fn get_histories_of_user<C>(
        user: Uuid,
        db: &C,
    ) -> Result<HashMap<Uuid, serde_json::Value>, Error>
    where
        C: ConnectionTrait,
    {
        Ok(HistoryIndexes::find()
            .filter(history_indexes::Column::BelongUser.eq(user))
            .all(db)
            .await?
            .into_iter()
            .map(|it| {
                (
                    it.id,
                    json!({
                    "created_at": it.created_at,
                    "updated_at": it.updated_at,
                    "belong_character_profile": it.belong_character_profile,
                    }),
                )
            })
            .collect::<HashMap<_, _>>())
    }
}

impl HistoryIndexesHelper for HistoryIndexes {}
