use std::collections::HashMap;

use chrono::Local;
use openai_api_rs::v1::chat_completion::{self, ChatCompletionMessage, MessageRole};
use rocket::async_trait;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, Condition, ConnectionTrait, EntityTrait,
    QueryFilter, QueryOrder, QuerySelect,
};
use uuid::Uuid;

use crate::{
    entity::{histories, prelude::Histories, sea_orm_active_enums::ChatRole},
    error::Error,
};

#[allow(unused)]
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

    async fn get_all_histories<C>(index: Uuid, db: &C) -> Result<Vec<histories::Model>, Error>
    where
        C: ConnectionTrait,
    {
        Ok(Histories::find()
            .filter(histories::Column::BelongHistoryIndex.eq(index))
            .all(db)
            .await?
            .into_iter()
            .collect())
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
            with_resource: Set(None),
        }
        .insert(db)
        .await?;

        Ok(model)
    }

    /// 提取作为记忆的历史记录
    async fn get_memory<C>(of_history_index: Uuid, db: &C) -> Result<Vec<histories::Model>, Error>
    where
        C: ConnectionTrait,
    {
        Ok(Histories::find()
            .filter(histories::Column::BelongHistoryIndex.eq(of_history_index))
            .all(db)
            .await?)
    }
}

impl HistoriesHelper for Histories {}

pub trait IntoChatCompletion {
    fn into_chat_completion(self) -> ChatCompletionMessage;
}

impl IntoChatCompletion for histories::Model {
    fn into_chat_completion(self) -> ChatCompletionMessage {
        let role = match self.chat_role {
            ChatRole::System => MessageRole::system,
            ChatRole::User => MessageRole::user,
            ChatRole::Character => MessageRole::assistant,
        };

        ChatCompletionMessage {
            role,
            content: chat_completion::Content::Text(self.content),
            name: None,
            tool_calls: None,
            tool_call_id: None,
        }
    }
}

pub trait FromChatCompletion {
    fn from_chat_completion(chat: ChatCompletionMessage, history_index: Uuid) -> Self;
}

impl FromChatCompletion for histories::Model {
    fn from_chat_completion(chat: ChatCompletionMessage, history_index: Uuid) -> Self {
        let chat_role = match chat.role {
            MessageRole::user => ChatRole::User,
            MessageRole::system => ChatRole::System,
            MessageRole::assistant => ChatRole::Character,
            _ => ChatRole::Character,
        };

        let content = match chat.content {
            chat_completion::Content::Text(t) => t,
            chat_completion::Content::ImageUrl(_) => "".into(),
        };

        histories::Model {
            id: Uuid::now_v7(),
            created_at: Local::now().into(),
            chat_role,
            belong_history_index: history_index,
            content,
            with_resource: None,
        }
    }
}
