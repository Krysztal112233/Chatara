use log::error;
use serde::Serialize;

use crate::{
    common::PresettedOpenAIClient,
    consts,
    error::{Error, Result},
};

#[derive(Debug)]
pub struct CharacterProfileTool {
    openai: PresettedOpenAIClient,
}

impl CharacterProfileTool {
    pub fn new(openai: PresettedOpenAIClient) -> Self {
        Self { openai }
    }

    /// 生成角色配置的逻辑
    ///
    /// 传入的是一个小说的片段，如果片段信息量足够的话就会生成一个角色的配置文件。这个配置文件是一个
    /// [Vec] 装起来 [serde_json::Value]，具体的内容请看对应的 prompt
    pub async fn generate_profile<T>(&mut self, input: T) -> Result<Vec<serde_json::Value>>
    where
        T: Into<String>,
    {
        let req = self
            .openai
            .with_system_prompt(consts::PROMPT_PROFILE_GENERATE)
            .add_user(input)
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

        Ok(serde_json::from_str(&response)?)
    }

    pub async fn generate_character_prompt<T>(&mut self, input: T) -> Result<String>
    where
        T: Serialize,
    {
        // 先转换为 json 文本
        let input = serde_json::to_string_pretty(&input)?;

        let req = self
            .openai
            .with_system_prompt(consts::PROMPT_CHARACTER_GENERATOR)
            .add_user(input)
            .build();

        // 然后用 json 文本去构建角色用的 Prompt
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
