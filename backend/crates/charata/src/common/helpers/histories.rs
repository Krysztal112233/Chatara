use std::collections::HashMap;

use chrono::Local;
use rocket::async_trait;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, ConnectionTrait, EntityTrait, QueryFilter,
};
use uuid::Uuid;

use crate::{
    entity::{histories, prelude::Histories, sea_orm_active_enums::ChatRole},
    error::Error,
};

#[async_trait]
pub trait HistoriesHelper {
    async fn delete_histories<I, C>(id: I, db: &C) -> Result<(), Error>
    where
        I: IntoIterator<Item = Uuid> + Send,
        C: ConnectionTrait,
    {
        Histories::delete_many()
            .filter(histories::Column::Id.is_in(id))
            .exec(db)
            .await?;
        Ok(())
    }

    async fn get_histories<I, C>(ids: I, db: &C) -> Result<HashMap<Uuid, histories::Model>, Error>
    where
        I: IntoIterator<Item = Uuid> + Send,
        C: ConnectionTrait,
    {
        Ok(Histories::find()
            .filter(histories::Column::Id.is_in(ids))
            .all(db)
            .await?
            .into_iter()
            .map(|it| (it.id, it))
            .collect::<HashMap<_, _>>())
    }

    async fn create_history<T, C>(
        of_history_index: Uuid,
        role: ChatRole,
        content: T,
        db: &C,
    ) -> Result<histories::Model, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        let model = histories::ActiveModel {
            id: Set(Uuid::now_v7()),
            created_at: Set(Local::now().into()),
            chat_role: Set(role),
            belong_history_index: Set(of_history_index),
            content: Set(content.into()),
        }
        .insert(db)
        .await?;

        Ok(model)
    }
}

impl HistoriesHelper for Histories {}
