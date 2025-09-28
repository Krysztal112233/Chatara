## 数据库设计

当前一共有四张表

- `character_profiles`
  - 角色配置文件
  - 角色名称
  - 角色的各方面设定（暂定使用 JSON 来储存）
- `histories`
  - 单条历史记录
  - 记录了该条历史记录属于哪次聊天
    - 外键：`history_indexes.id`
  - 记录了该条历史记录的角色
  - 记录了该条历史记录的内容
- `history_indexes`
  - 历史记录索引
  - 记录了该条历史索引归属于哪儿个用户
    - 外键：`users.id`
  - 记录了该条历史索引使用了哪儿个角色配置
    - 外键：`character_profiles.id`
- `users`
  - 用户表
- `attached_resource`
  - 资源列表
