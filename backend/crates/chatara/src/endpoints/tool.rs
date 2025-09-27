use rocket::{fairing::AdHoc, post, routes};

pub struct AgentEndpoint;

impl AgentEndpoint {
    pub fn stage() -> AdHoc {
        AdHoc::on_ignite("Tool Endpoint", |r| async move {
            r.mount("/tool", routes![create_asr, create_tts, create_character])
        })
    }
}

#[post("/asr")]
async fn create_asr() {}

#[post("/tts")]
async fn create_tts() {}

#[post("/character")]
async fn create_character() {}
