use rocket::{
    Response,
    http::{ContentType, Status},
    response::Responder,
    serde::{Deserialize, Serialize},
};

pub mod catcher;
pub mod fairings;
pub mod guards;
pub mod helpers;
pub mod jwt;
pub mod requests;
pub mod tools;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommonResponse<T> {
    code: u16,

    #[serde(skip_serializing_if = "String::is_empty")]
    msg: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    payload: Option<T>,
}

#[allow(unused)]
impl<T> CommonResponse<T>
where
    T: Serialize,
{
    pub fn new(code: u16) -> Self {
        Self {
            code,
            msg: "".to_owned(),
            payload: None,
        }
    }

    pub fn with_msg(code: u16, msg: String) -> Self {
        Self {
            code,
            msg,
            payload: None,
        }
    }

    pub fn set_data(self, data: T) -> Self {
        Self {
            payload: Some(data),
            ..self
        }
    }
}

impl<T> Default for CommonResponse<T> {
    fn default() -> Self {
        Self {
            code: Status::Ok.code,
            msg: Status::Ok.to_string(),
            payload: None,
        }
    }
}

impl<T> From<Status> for CommonResponse<T>
where
    T: Serialize,
{
    fn from(value: Status) -> Self {
        Self::with_msg(value.code, value.to_string())
    }
}

impl<'r, 'o: 'r, T> Responder<'r, 'o> for CommonResponse<T>
where
    T: Serialize,
{
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        let status = Status::new(self.code);
        let body = serde_json::to_string(&self).map_err(|_| Status::new(500))?;

        Response::build_from(body.respond_to(request)?)
            .status(status)
            .header(ContentType::JSON)
            .ok()
    }
}

#[derive(Debug, Serialize)]
pub struct PagedData<T> {
    size: usize,
    next: bool,
    content: Vec<T>,
}

impl<T> PagedData<T>
where
    T: Serialize,
{
    pub fn with_entire<I>(data: I) -> Self
    where
        I: IntoIterator<Item = T>,
    {
        let data = data.into_iter().collect::<Vec<_>>();
        Self {
            size: data.len(),
            next: false,
            content: data,
        }
    }
}

impl<T> Default for PagedData<T> {
    fn default() -> Self {
        Self {
            size: Default::default(),
            next: Default::default(),
            content: Default::default(),
        }
    }
}
