use std::ops::Deref;

use chatara_tool::asr::AutomaticSpeechRecognitionTool;
use rocket::{
    Request, async_trait,
    request::{FromRequest, Outcome},
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
