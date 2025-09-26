use educe::Educe;
use rocket::{
    Response,
    http::{ContentType, Status},
    response::Responder,
    serde::{Deserialize, Serialize, json::Value},
};

pub mod catcher;
pub mod fairings;
pub mod guards;
pub mod helpers;
pub mod jwt;
pub mod requests;

#[derive(Debug, Clone, Serialize, Deserialize, Educe)]
#[educe(Default)]
pub struct CommonResponse {
    #[educe(Default = 200)]
    code: u16,

    #[educe(Default = "")]
    #[serde(skip_serializing_if = "String::is_empty")]
    msg: String,

    #[serde(skip_serializing_if = "Value::is_null", flatten)]
    data: Value,
}

#[allow(unused)]
impl CommonResponse {
    pub fn new(code: u16) -> Self {
        Self {
            code,
            ..Default::default()
        }
    }

    pub fn with_msg(code: u16, msg: String) -> Self {
        Self {
            code,
            msg,
            ..Default::default()
        }
    }

    pub fn set_data(self, data: Value) -> Self {
        Self { data, ..self }
    }
}

impl From<Status> for CommonResponse {
    fn from(value: Status) -> Self {
        Self::with_msg(value.code, value.to_string())
    }
}

impl<'r, 'o: 'r> Responder<'r, 'o> for CommonResponse {
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        let status = Status::new(self.code);
        let body = serde_json::to_string(&self).map_err(|_| Status::new(500))?;

        Response::build_from(body.respond_to(request)?)
            .status(status)
            .header(ContentType::JSON)
            .ok()
    }
}
