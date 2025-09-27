use std::path::PathBuf;

use chatara_storage::ChataraStorage;
use log::info;
use rocket::{
    State,
    fairing::AdHoc,
    form::{Form, Strict},
    post, routes,
};
use uuid::Uuid;

use crate::{
    common::{CommonResponse, guards::auth::AuthGuard, tools::ASRClient},
    endpoints::tool::response::ASRMultipart,
    entity::sea_orm_active_enums::ResourceType,
    error::Error,
};

pub struct AgentEndpoint;

impl AgentEndpoint {
    pub fn stage() -> AdHoc {
        AdHoc::on_ignite("Tool Endpoint", |r| async move {
            r.mount("/tool", routes![create_asr, create_tts, create_character])
        })
    }
}

#[post("/asr", data = "<audio>")]
async fn create_asr(
    mut audio: Form<Strict<ASRMultipart<'_>>>,

    auth: AuthGuard,
    storage: &State<ChataraStorage>,
    asr: ASRClient,
) -> Result<CommonResponse<()>, Error> {
    let id = Uuid::now_v7();
    let typ = ResourceType::Audio;

    let persist_path = PathBuf::from("/tmp").join(id.to_string());

    audio.file.persist_to(&persist_path).await?;

    info!("try fetching presign url for uploaded path...");
    let presign_url = storage
        .upload_presign(persist_path.display().to_string())
        .await?;

    todo!()
}

#[post("/tts")]
async fn create_tts() {}

#[post("/character")]
async fn create_character() {}

mod response {
    use rocket::{FromForm, fs::TempFile};

    #[derive(Debug, FromForm)]
    pub struct ASRMultipart<'r> {
        pub file: TempFile<'r>,
    }
}
