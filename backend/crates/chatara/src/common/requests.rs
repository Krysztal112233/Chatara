use std::fmt::Display;

use log::info;
use rocket::{form::FromForm, request::FromParam};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::Error;

#[derive(Debug, Serialize, Deserialize, FromForm)]
#[serde(transparent)]
pub struct Sqid(String);

impl Sqid {
    pub fn from_uuid(sqids: &sqids::Sqids, uuid: Uuid) -> Result<Self, Error> {
        let (hi, lo) = uuid.as_u64_pair();
        let short = sqids.encode(&[hi, lo])?;
        Ok(Self(short))
    }

    pub fn to_uuid(&self, sqids: &sqids::Sqids) -> Result<Uuid, Error> {
        let nums = dbg!(sqids.decode(&self.0));

        if nums.len() != 2 {
            return Err(Error::Sqid(sqids::Error::AlphabetUniqueCharacters));
        }

        let uid = Uuid::from_u64_pair(nums[0], nums[1]);

        info!("from Sqid to Uuid: {} -> {}", self.0, uid);

        Ok(uid)
    }
}

impl<'a> FromParam<'a> for Sqid {
    type Error = Error;
    fn from_param(param: &'a str) -> Result<Self, Self::Error> {
        Ok(Sqid(param.to_owned()))
    }
}

impl Display for Sqid {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

#[allow(unused)]
pub trait ToSqid {
    fn to_sqid(self) -> Sqid;
    fn to_sqid_with(self, codec: &sqids::Sqids) -> Sqid;
}

impl ToSqid for Uuid {
    fn to_sqid(self) -> Sqid {
        let (hi, lo) = self.as_u64_pair();
        Sqid(sqids::Sqids::default().encode(&[hi, lo]).unwrap())
    }

    fn to_sqid_with(self, codec: &sqids::Sqids) -> Sqid {
        Sqid::from_uuid(codec, self).unwrap()
    }
}
