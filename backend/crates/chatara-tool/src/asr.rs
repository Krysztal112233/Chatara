use chrono::Local;
use log::{error, info};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use crate::error::Error;

#[derive(Debug)]
pub struct AutomaticSpeechRecognitionTool {
    openai_url: String,
    model: String,
    token: String,

    client: Client,
}

impl AutomaticSpeechRecognitionTool {
    pub fn new(openai_url: String, model: String, token: String) -> Self {
        Self {
            openai_url,
            model,
            token,
            client: Client::new(),
        }
    }

    pub async fn do_asr(&self, s3_url: &str) -> Result<String, Error> {
        let body = &build_json(&self.model, s3_url);

        info!("starting do ASR for `{s3_url }`");
        let start_at = Local::now();
        let response = self
            .client
            .post(&self.openai_url)
            .bearer_auth(&self.token)
            .json(body)
            .send()
            .await
            .inspect_err(|e| error!("failed to send request for `{s3_url}`: {e}"))?
            .json::<Value>()
            .await
            .inspect_err(|e| error!("parsing failed: {e}"))?;
        info!(
            "do ASR succeed - cost {}ms",
            Local::now().timestamp_millis() - start_at.timestamp_millis()
        );

        Ok(Root::try_from(response)?
            .output
            .choices
            .first()
            .ok_or(Error::Unknown("cannot do asr for input".to_string()))?
            .message
            .content
            .first()
            .ok_or(Error::Unknown("empty content detected".to_string()))?
            .text
            .clone())
    }
}

/// Holy shit.
fn build_json(model: &str, s3url: &str) -> serde_json::Value {
    json!( {
    "model": model,
    "input": {
        "messages": [
            {
                "content": [
                    {
                        "audio": s3url
                    }
                ],
                "role": "user"
            }
        ]
    },
    "parameters": {
        "asr_options": {
            "enable_lid": true,
            "enable_itn": false
        }
    }})
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Root {
    output: Output,
}

impl TryFrom<Value> for Root {
    type Error = Error;

    fn try_from(value: Value) -> Result<Self, Self::Error> {
        Ok(serde_json::from_value(value)?)
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Output {
    choices: Vec<Choice>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Choice {
    pub message: Message,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Message {
    pub content: Vec<Content>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Content {
    pub text: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE: &str = include_str!("./exp.json");

    #[test]
    fn test_choice() {
        let value: Value = serde_json::from_str(EXAMPLE).unwrap();

        Root::try_from(value).unwrap();
    }
}
