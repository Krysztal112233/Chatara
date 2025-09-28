# 端点设计与调用流程

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
POST    /tool/asr                   -> 将语音转换为文字
POST    /tool/tts                   -> 将文字转换为语音
POST    /tool/character/settings    -> 从小说文本中提取角色信息
POST    /tool/character/prompt      -> 从角色信息中生成角色使用的 prompt
```

## 调用流程

我们以通过小说文本创建一个新角色并且与其进行对话这个任务作为目的，有效覆盖了整个流程

### 创建新的角色

首先我们需要持有一段小说文本，接下来我们需要将该文本利用 `/tool/character/settings` 端点创建角色配置文件

角色的配置文件是以 JSON 存在的，他的目的主要是用于使用另外一条 prompt 来基于其进行创建角色 prompt。

我们将获得的 JSON 利用 `/tool/character/prompt` 端点创建 prompt，然后再利用 `/characters/` 端点创建属于角色的 prompt，这样我们的角色就生成成功了！

### 创建新的聊天

在完成以上步骤后我们会得到一个属于角色的 ID，这个 ID 将用于我们创建新的聊天。

我们利用 `/histories/?<profile>` 端点创建一个新的聊天，得到一个会话 ID。

接着，我们可以利用这个会话 ID 来进行真正的聊天了！

### 继续聊天

通过 `/histories/<history_index>` 端点以及我们上文提到的会话 ID，我们向这个端点 POST 聊天内容后就会接到来自后端的响应，这样我们的聊天流程就结束了！
