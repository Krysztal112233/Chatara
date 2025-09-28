use chrono::Local;
use log::{error, info};
use reqwest::Client;
use serde::Deserialize;
use serde_json::{json, Value};

use crate::error::Error;

#[derive(Debug)]
pub struct Text2SpeechTool {
    openai_url: String,
    model: String,
    token: String,

    client: Client,
}

impl Text2SpeechTool {
    pub fn new(openai_url: String, model: String, token: String) -> Self {
        Self {
            openai_url,
            model,
            token,
            client: Client::new(),
        }
    }

    /// 返回的是一个 url
    pub async fn do_tts(&self, text: String) -> Result<String, Error> {
        self.do_tts_with(text, None, None).await
    }

    pub async fn do_tts_with(
        &self,
        text: String,
        voice: Option<String>,
        lang: Option<String>,
    ) -> Result<String, Error> {
        let voice = voice.unwrap_or("Cherry".into());
        let lang = lang.unwrap_or("Lang".into());

        let body = build_json(&self.model, &text, lang, voice);

        info!("starting TTS with text lenght `{}`", text.len());

        let start_at = Local::now();
        let response = self
            .client
            .post(&self.openai_url)
            .bearer_auth(&self.token)
            .json(&body)
            .send()
            .await
            .inspect_err(|e| error!("failed to send request to do TTS: {e}"))?
            .json::<Root>()
            .await
            .inspect_err(|e| error!("parsing failed: {e}"))?;
        info!(
            "TTS succeed - cost {}ms",
            Local::now().timestamp_millis() - start_at.timestamp_millis()
        );

        let response = dbg!(response);

        Ok(response.output.audio.url)
    }
}

fn build_json(model: &str, text: &str, lang: String, voice: String) -> Value {
    json!({
        "model": model,
        "input": {
            "text": text,
            "voice": voice,
            "language_type": lang,
        }
    })
}

#[derive(Debug, Deserialize)]
struct Root {
    output: Output,
}

#[derive(Debug, Deserialize)]
struct Output {
    audio: Audio,
}

#[derive(Debug, Deserialize)]
struct Audio {
    url: String,
}

#[cfg(test)]
mod tests {

    use super::*;

    const EXAMPLE: &str = include_str!("./exp2.json");

    #[test]
    fn test_name() {
        let _: Root = serde_json::from_str(EXAMPLE).unwrap();
    }
}
