## 端点设计

```http
POST    /histories/?<profile>       -> 根据角色配置文件创建一条新的历史记录
GET     /histories/                 -> 获取所有历史记录（管理员使用）
GET     /histories/?<user>          -> 获取用户的所有历史记录
POST    /histories/<history_index>  -> 追加一条新的聊天记录
DELETE  /histories/<history_index>  -> 删除一整个历史记录
GET     /histories/<history_index>  -> 获取一整个历史记录
POST    /characters/                -> 创建一个新的角色
GET     /characters/                -> 获取角色列表
DELETE  /characters/<character>     -> 删除指定角色
GET     /characters/<character>     -> 获取指定角色的信息
```
