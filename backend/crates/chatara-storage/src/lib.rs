use std::ops::Deref;
use std::str::FromStr;

use s3::creds::Credentials;
use s3::Bucket;
use s3::Region;

use crate::error::Error;
use crate::error::Result;

pub mod error;

#[derive(Debug, Clone)]
pub struct ChataraStorage {
    bucket: Box<Bucket>,
}

impl ChataraStorage {
    pub fn new(name: &str, regeion: &str, access_key: &str, secret_key: &str) -> Result<Self> {
        let cred = Credentials::default().map_err(|e| Error::Unknown(e.to_string()))?;
        let bucket = s3::Bucket::new(
            name,
            Region::from_str(regeion).map_err(|e| Error::Unknown(e.to_string()))?,
            Credentials {
                access_key: Some(access_key.to_string()),
                secret_key: Some(secret_key.to_string()),
                ..cred
            },
        )?;
        Ok(Self { bucket })
    }
}

unsafe impl Send for ChataraStorage {}
unsafe impl Sync for ChataraStorage {}

impl Deref for ChataraStorage {
    type Target = Box<Bucket>;

    fn deref(&self) -> &Self::Target {
        &self.bucket
    }
}
