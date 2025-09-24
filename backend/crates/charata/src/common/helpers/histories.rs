use rocket::async_trait;

use crate::entity::prelude::Histories;

#[async_trait]
pub trait HistoriesHelper {}

impl HistoriesHelper for Histories {}
