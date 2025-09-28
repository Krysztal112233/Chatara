use chrono::Local;
use rocket::async_trait;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ConnectionTrait, EntityTrait};

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
        let user: String = user.into();
        let finded = Users::find_by_id(user.clone()).one(db).await?;

        if finded.is_none() {
            users::ActiveModel {
                id: Set(user),
                created_at: Set(Local::now().into()),
            }
            .insert(db)
            .await?;
        }

        Ok(())
    }
}

impl UserHelper for Users {}
