use rocket::async_trait;

use crate::entity::prelude::CharacterProfiles;

#[async_trait]
pub trait CharacterProfilesHelper {}

impl CharacterProfilesHelper for CharacterProfiles {}
