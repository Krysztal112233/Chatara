use migration::OnConflict;
use rocket::async_trait;
use sea_orm::{ActiveValue::Set, ConnectionTrait, EntityTrait};

use crate::{
    entity::{prelude::*, users},
    error::Error,
};

#[async_trait]
pub trait UserHelper {
    async fn create<T, C>(user: T, db: &C) -> Result<(), Error>
    where
        T: Into<String> + Send,
        C: ConnectionTrait,
    {
        users::Entity::insert(users::ActiveModel {
            id: Set(user.into()),
            ..Default::default()
        })
        .on_conflict(
            OnConflict::column(users::Column::Id)
                .do_nothing()
                .to_owned(),
        )
        .exec(db)
        .await?;
        Ok(())
    }
}

impl UserHelper for Users {}
