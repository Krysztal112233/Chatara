use log::error;

use crate::{common::PresettedOpenAIClient, consts, error::Error};

#[derive(Debug)]
pub struct GenMetaTool {
    openai: PresettedOpenAIClient,
}

impl GenMetaTool {
    pub fn new(openai: PresettedOpenAIClient) -> Self {
        Self { openai }
    }

    /// 为聊天生成简单的总结
    pub async fn generate_short_summary<T>(&mut self, text: T) -> Result<String, Error>
    where
        T: Into<String> + Send,
    {
        let req = self
            .openai
            .with_system_prompt(consts::PROMPT_SHORT_SUMMARY)
            .add_user(text)
            .build();

        let resp = self
            .openai
            .chat_completion(req)
            .await
            .inspect_err(|e| error!("while requesting OpenAI API: {e}"))?
            .choices;
        let response = resp
            .first()
            .ok_or(Error::Unknown(format!(
                "cannot get first response of OpenAI request, sized {}",
                resp.len()
            )))?
            .message
            .content
            .clone()
            .unwrap_or_default();

        Ok(response)
    }

    /// 输入角色的 prompt 会生成简短的描述
    pub async fn generate_character_description<T>(&mut self, text: T) -> Result<String, Error>
    where
        T: Into<String>,
    {
        let req = self
            .openai
            .with_system_prompt(consts::PROMPT_CHARACTER_DESCRIPTION)
            .add_user(text)
            .build();

        let resp = self
            .openai
            .chat_completion(req)
            .await
            .inspect_err(|e| error!("while requesting OpenAI API: {e}"))?
            .choices;
        let response = resp
            .first()
            .ok_or(Error::Unknown(format!(
                "cannot get first response of OpenAI request, sized {}",
                resp.len()
            )))?
            .message
            .content
            .clone()
            .unwrap_or_default();

        Ok(response)
    }
}
