# Chatara - 卡塔拉

和你喜欢的角色对话跨时空聊天

演示视频位于 docs/intro.mp4

线上 Demo： https://chatara.dev

## 前置条件

在尝试部署该应用之前，你需要将 `.env.sample` 文件复制一份成为 `.env` 文件，并且获取如下的凭证：

- 阿里百炼
- Auth0
- 任意一个兼容 S3 并且提供和 AWS 兼容的 presign 服务的服务提供商的 S3 凭证
  - 本项目测试使用 Cloudflare R2

在获取到如上凭证后，填入到 .env 文件中，并且适当的修改如下字段

- `CHATARA_AUTH__AUD`
  - 该字段一般为 Auth0 租户地址和应用的登录地址
- `POSTGRES_PASSWORD`
  - 该字段为数据库的密码

## 部署

在完成如上的配置后，可以使用如下的命令拉起我们预设的 Docker Compose

```bash
docker compose up -d
```

然后您可以使用反向代理等方式管理您的应用，这里不再赘述。

就是如此简单的部署，完毕 :)

## 程序设计

请参阅 [架构](./docs/ARCH.md) 文档，这里有着整个程序的设计思路。
