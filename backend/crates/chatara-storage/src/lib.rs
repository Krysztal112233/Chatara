use std::ops::Deref;

use chrono::Local;
use futures::TryStreamExt;
use log::{error, info};
use reqwest::Client;
use s3::creds::Credentials;
use s3::Bucket;
use s3::Region;

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
        let path = path.as_ref();
        self.upload(path).await?;
        // 获取可以被下载的 presign 链接
        Ok(self.presign_get(path, 60 * 60, None).await?)
    }

    pub async fn upload<P>(&self, path: P) -> Result<usize>
    where
        P: AsRef<str>,
    {
        let path = path.as_ref();
        let started = Local::now();

        info!("uploading file {path} to S3...");
        let mut file = tokio::fs::File::open(&path)
            .await
            .inspect_err(|e| error!("failed to upload file `{path}`: {e}"))?;
        let response = self.put_object_stream(&mut file, path).await?;

        info!(
            "uploaded file `{path}` with status {} sized {} bytes - cost {}ms",
            response.status_code(),
            response.uploaded_bytes(),
            Local::now().timestamp_millis() - started.timestamp_millis()
        );

        Ok(response.uploaded_bytes())
    }

    /// 在后台上传文件，但该方法上传失败不会有任何提示
    pub async fn background_upload(&self, url: String, path: String) -> Result<()> {
        let client = Client::new();

        let resp = client
            .get(&url)
            .send()
            .await
            .inspect_err(|e| error!("cannot request body stream for `{url}`: {e}"))?;

        let bucket = self.bucket.clone();
        tokio::spawn(async move {
            let started = Local::now().timestamp_millis();
            let resp = resp.bytes_stream().map_err(std::io::Error::other);
            // 感谢伟大的 tokio-utils 我不知道怎么回事反正他跑起来了。
            let mut stream = tokio_util::io::StreamReader::new(resp);

            let r = bucket.put_object_stream(&mut stream, path).await;
            match r {
                Ok(response) => info!(
                    "streamed url `{url}` with status {} sized {} bytes - cost {}ms",
                    response.status_code(),
                    response.uploaded_bytes(),
                    Local::now().timestamp_millis() - started
                ),
                Err(e) => error!("failed streaming url `{url}` to S3: {e}"),
            };
        });

        Ok(())
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
