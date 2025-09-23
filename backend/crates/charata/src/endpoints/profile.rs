use rocket::fairing::AdHoc;

pub struct CharacterProfileEndpoint;

impl CharacterProfileEndpoint {
    pub fn adhoc() -> AdHoc {
        AdHoc::on_ignite("CharacterProfile Endpoint", |r| async move { r })
    }
}
