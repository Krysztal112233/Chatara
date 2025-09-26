use rocket::{form::FromForm, request::FromParam};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::Error;

#[derive(Debug, Serialize, Deserialize, FromForm)]
#[serde(transparent)]
pub struct Sqid(String);

impl Sqid {
    pub fn from_uuid(sqids: sqids::Sqids, uuid: Uuid) -> Result<Self, Error> {
        let (hi, lo) = uuid.as_u64_pair();
        let short = sqids.encode(&[hi, lo])?;
        Ok(Self(short))
    }

    pub fn to_uuid(&self, sqids: sqids::Sqids) -> Result<Uuid, Error> {
        let nums = sqids.decode(&self.0);

        if nums.len() != 2 {
            return Err(Error::Sqid(sqids::Error::AlphabetUniqueCharacters));
        }

        Ok(Uuid::from_u64_pair(nums[0], nums[1]))
    }
}

impl<'a> FromParam<'a> for Sqid {
    type Error = Error;
    fn from_param(param: &'a str) -> Result<Self, Self::Error> {
        Ok(Sqid(param.to_owned()))
    }
}
