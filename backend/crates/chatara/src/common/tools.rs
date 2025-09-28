use std::ops::Deref;

use chatara_tool::{
    asr::AutomaticSpeechRecognitionTool, common::PresettedOpenAIClient,
    profile::CharacterProfileTool,
};
use log::error;
use openai_api_rs::v1::api::{OpenAIClient, OpenAIClientBuilder};
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
