use chrono::Local;
use rocket::async_trait;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, ConnectionTrait, EntityTrait, QueryFilter,
};
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
            belong_user: Set(user),
            belong_character_profile: Set(character),
        }
        .insert(db)
        .await?)
    }
}

impl HistoryIndexesHelper for HistoryIndexes {}
