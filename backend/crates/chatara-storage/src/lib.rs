use std::ops::Deref;

use s3::Bucket;
use s3::Region;
use s3::creds::Credentials;

use crate::error::Result;

pub mod error;

#[derive(Debug, Clone)]
pub struct ChataraStorage {
    bucket: Box<Bucket>,
}

impl ChataraStorage {
    pub fn new(
        name: &str,
        regeion: &str,
        access_key: &str,
        secret_key: &str,
        endpoint: &str,
    ) -> Result<Self> {
        let bucket = s3::Bucket::new(
            name,
            Region::Custom {
                region: regeion.to_owned(),
                endpoint: endpoint.to_owned(),
            },
            Credentials {
                access_key: Some(access_key.to_string()),
                secret_key: Some(secret_key.to_string()),
                security_token: None,
                session_token: None,
                expiration: None,
            },
        )?;
        Ok(Self { bucket })
    }

    pub async fn upload_presign<P>(&self, path: P) -> Result<String>
    where
        P: AsRef<str>,
    {
        Ok(self.presign_put(path, 60 * 60, None, None).await?)
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
