use chrono::Local;
use rocket::async_trait;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, Condition, ConnectionTrait, DbErr,
    EntityTrait, QueryFilter,
};
use uuid::Uuid;

use crate::{
    entity::{history_indexes, prelude::*},
    error::Error,
};

#[async_trait]
pub trait HistoryIndexesHelper {
    async fn delete_session_of_user<T, C>(index: Uuid, user: T, db: &C) -> Result<(), Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        Self::delete_sessions_of_user(vec![index], user, db).await?;
        Ok(())
    }

    async fn delete_sessions_of_user<I, T, C>(ids: I, user: T, db: &C) -> Result<(), Error>
    where
        I: IntoIterator<Item = Uuid> + Send,
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        let user = user.into();
        HistoryIndexes::delete_many()
            .filter(
                Condition::all()
                    .add(history_indexes::Column::Id.is_in(ids))
                    .add(history_indexes::Column::BelongUser.eq(user)),
            )
            .exec(db)
            .await?;
        Ok(())
    }

    async fn create_session<T, C>(
        user: T,
        character: Uuid,
        db: &C,
    ) -> Result<history_indexes::Model, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        Ok(history_indexes::ActiveModel {
            id: Set(Uuid::now_v7()),
            created_at: Set(Local::now().into()),
            updated_at: Set(Local::now().into()),
            belong_user: Set(user.into()),
            belong_character_profile: Set(character),
        }
        .insert(db)
        .await?)
    }

    async fn get_sessions_of_user<T, C>(
        user: T,
        db: &C,
    ) -> Result<Vec<history_indexes::Model>, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        Ok(HistoryIndexes::find()
            .filter(history_indexes::Column::BelongUser.eq(user.into()))
            .all(db)
            .await?)
    }

    async fn get_session_of_user<T, C>(
        user: T,
        id: Uuid,
        db: &C,
    ) -> Result<history_indexes::Model, Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        let user = user.into();

        Ok(HistoryIndexes::find()
            .filter(
                Condition::all()
                    // .add(history_indexes::Column::BelongUser.eq(&user))
                    .add(history_indexes::Column::Id.eq(id)),
            )
            .one(db)
            .await?
            .ok_or(Error::Db(DbErr::RecordNotFound(format!("{user}/?"))))?)
    }
}

impl HistoryIndexesHelper for HistoryIndexes {}
