use rocket::async_trait;

use crate::entity::prelude::HistoryIndexes;

#[async_trait]
pub trait HistoryIndexesHelper {}

impl HistoryIndexesHelper for HistoryIndexes {}
