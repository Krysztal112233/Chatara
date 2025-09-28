use im::Vector;
use log::error;
use openai_api_rs::v1::chat_completion::ChatCompletionMessage;

use crate::{common::PresettedOpenAIClient, error::Error};

#[derive(Debug)]
pub struct ChatTool {
    openai: PresettedOpenAIClient,

    memories: Vector<ChatCompletionMessage>,
}

impl ChatTool {
    pub fn new(openai: PresettedOpenAIClient) -> Self {
        Self {
            openai,
            memories: Vector::default(),
        }
    }

    /// 持有记忆
    pub fn fill_memories<I>(&mut self, memories: I)
    where
        I: IntoIterator<Item = ChatCompletionMessage>,
    {
        self.memories.extend(memories);
    }

    pub async fn initial_chat<T>(&mut self, sys: T, msg: T) -> Result<String, Error>
    where
        T: Into<String>,
    {
        let cha = self.openai.with_system_prompt(sys).add_user(msg).build();

        let res = self
            .openai
            .chat_completion(cha)
            .await
            .inspect_err(|e| error!("{e}"))?
            .choices
            .first()
            .ok_or(Error::Unknown("llm response empty message".to_owned()))
            .inspect_err(|e| error!("{e}"))?
            .message
            .content
            .clone()
            .ok_or(Error::Unknown("empty message from llm".to_owned()))
            .inspect_err(|e| error!("{e}"))?;

        Ok(res)
    }

    // 聊天
    pub async fn chat<T>(&mut self, msg: T) -> Result<String, Error>
    where
        T: Into<String>,
    {
        let cha = self
            .openai
            .with_memories(self.memories.clone())
            .add_user(msg)
            .build();

        let res = self
            .openai
            .chat_completion(cha)
            .await
            .inspect_err(|e| error!("{e}"))?
            .choices
            .first()
            .ok_or(Error::Unknown("llm response empty message".to_owned()))
            .inspect_err(|e| error!("{e}"))?
            .message
            .content
            .clone()
            .ok_or(Error::Unknown("empty message from llm".to_owned()))
            .inspect_err(|e| error!("{e}"))?;

        Ok(res)
    }
}
