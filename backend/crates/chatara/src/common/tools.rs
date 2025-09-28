use std::ops::{Deref, DerefMut};

use chatara_tool::{
    asr::AutomaticSpeechRecognitionTool, chat::ChatTool, common::PresettedOpenAIClient,
    meta::GenMetaTool, profile::CharacterProfileTool, tts::Text2SpeechTool,
};
use log::error;
use openai_api_rs::v1::api::OpenAIClientBuilder;
use rocket::{
    async_trait,
    http::Status,
    request::{FromRequest, Outcome},
    Request,
};

use crate::config::ChataraConfig;

#[derive(Debug)]
pub struct ASRClient(AutomaticSpeechRecognitionTool);

impl Deref for ASRClient {
    type Target = AutomaticSpeechRecognitionTool;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<'r> FromRequest<'r> for ASRClient {
    type Error = ();
    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let config = request.rocket().state::<ChataraConfig>().unwrap();
        let config = config.tool.asr.clone();

        let client = AutomaticSpeechRecognitionTool::new(config.url, config.model, config.token);

        Outcome::Success(ASRClient(client))
    }
}

#[derive(Debug)]
pub struct CharacterProfileGenerator(CharacterProfileTool);

impl Deref for CharacterProfileGenerator {
    type Target = CharacterProfileTool;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<'r> FromRequest<'r> for CharacterProfileGenerator {
    type Error = ();
    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let config = request.rocket().state::<ChataraConfig>().unwrap();
        let config = config.tool.profile.clone();

        let Ok(openai_client) = OpenAIClientBuilder::new()
            .with_endpoint(config.url)
            .with_api_key(config.token.clone())
            .build()
            .inspect_err(|e| error!("failed constructing OpenAIClient: {e}"))
        else {
            return Outcome::Error((Status::InternalServerError, ()));
        };
        let client = PresettedOpenAIClient::new(openai_client, config.model);

        Outcome::Success(CharacterProfileGenerator(CharacterProfileTool::new(client)))
    }
}

#[derive(Debug)]
pub struct TTSClient(Text2SpeechTool);

impl Deref for TTSClient {
    type Target = Text2SpeechTool;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<'r> FromRequest<'r> for TTSClient {
    type Error = ();
    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let config = request.rocket().state::<ChataraConfig>().unwrap();
        let config = config.tool.tts.clone();

        let client = Text2SpeechTool::new(config.url, config.model, config.token);

        Outcome::Success(TTSClient(client))
    }
}

#[allow(unused)]
#[derive(Debug)]
pub struct GenMetaClient(GenMetaTool);

impl Deref for GenMetaClient {
    type Target = GenMetaTool;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<'r> FromRequest<'r> for GenMetaClient {
    type Error = ();
    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let config = request.rocket().state::<ChataraConfig>().unwrap();
        let config = config.tool.meta.clone();

        let Ok(openai_client) = OpenAIClientBuilder::new()
            .with_endpoint(config.url)
            .with_api_key(config.token.clone())
            .build()
            .inspect_err(|e| error!("failed constructing OpenAIClient: {e}"))
        else {
            return Outcome::Error((Status::InternalServerError, ()));
        };
        let client = PresettedOpenAIClient::new(openai_client, config.model);

        Outcome::Success(GenMetaClient(GenMetaTool::new(client)))
    }
}

#[derive(Debug)]
pub struct ChatClient(ChatTool);

impl DerefMut for ChatClient {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl Deref for ChatClient {
    type Target = ChatTool;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<'r> FromRequest<'r> for ChatClient {
    type Error = ();
    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let config = request.rocket().state::<ChataraConfig>().unwrap();
        let config = config.tool.chat.clone();

        let Ok(openai_client) = OpenAIClientBuilder::new()
            .with_endpoint(config.url)
            .with_api_key(config.token.clone())
            .build()
            .inspect_err(|e| error!("failed constructing OpenAIClient: {e}"))
        else {
            return Outcome::Error((Status::InternalServerError, ()));
        };
        let client = PresettedOpenAIClient::new(openai_client, config.model);

        Outcome::Success(ChatClient(ChatTool::new(client)))
    }
}
