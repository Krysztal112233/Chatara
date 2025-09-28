use std::ops::{Deref, DerefMut};

use im::Vector;
use openai_api_rs::v1::{
    api::OpenAIClient,
    chat_completion::{self, ChatCompletionMessage, ChatCompletionRequest, Content},
};

#[derive(Debug)]
pub struct PresettedOpenAIClient {
    openai: OpenAIClient,
    model: String,
}

impl PresettedOpenAIClient {
    pub fn new<T>(client: OpenAIClient, model: T) -> Self
    where
        T: Into<String>,
    {
        Self {
            openai: client,
            model: model.into(),
        }
    }

    pub fn with_system_prompt<T>(&self, msg: T) -> PlainMessageBuilder
    where
        T: Into<String>,
    {
        PlainMessageBuilder::new(&self.model).add_system(msg)
    }

    pub fn with_memories<I>(&self, memories: I) -> PlainMessageBuilder
    where
        I: IntoIterator<Item = ChatCompletionMessage>,
    {
        PlainMessageBuilder::with_memories(&self.model, memories)
    }
}

impl DerefMut for PresettedOpenAIClient {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.openai
    }
}

impl Deref for PresettedOpenAIClient {
    type Target = OpenAIClient;

    fn deref(&self) -> &Self::Target {
        &self.openai
    }
}

#[derive(Debug, Clone)]
pub struct PlainMessageBuilder {
    model: String,
    msg: Vector<ChatCompletionMessage>,
}

impl PlainMessageBuilder {
    pub fn new<T>(model: T) -> Self
    where
        T: Into<String>,
    {
        Self {
            model: model.into(),
            msg: Vector::default(),
        }
    }

    pub fn with_memories<T, I>(model: T, memories: I) -> Self
    where
        T: Into<String>,
        I: IntoIterator<Item = ChatCompletionMessage>,
    {
        Self {
            model: model.into(),
            msg: Vector::from_iter(memories),
        }
    }

    pub fn add_system<T>(self, msg: T) -> Self
    where
        T: Into<String>,
    {
        self.add_msg(chat_completion::MessageRole::system, msg)
    }

    pub fn add_user<T>(self, msg: T) -> Self
    where
        T: Into<String>,
    {
        self.add_msg(chat_completion::MessageRole::user, msg)
    }

    pub fn add_msg<T>(self, role: chat_completion::MessageRole, msg: T) -> Self
    where
        T: Into<String>,
    {
        let mut new_msgs = self.msg.clone();
        new_msgs.push_back(ChatCompletionMessage {
            role,
            name: None,
            tool_calls: None,
            tool_call_id: None,
            content: Content::Text(msg.into()),
        });
        Self {
            msg: new_msgs,
            ..self
        }
    }

    pub fn build(self) -> ChatCompletionRequest {
        ChatCompletionRequest::new(self.model, self.msg.into_iter().collect())
    }
}
