# 前端架构设计

## 技术栈

### 核心框架
- **React 19.1.1** - 启用 React Compiler 实现自动优化
- **TypeScript 5.8** - 完整的类型安全保障
- **Vite (rolldown-vite)** - 快速构建工具

### 路由与状态管理
- **TanStack Router** - 文件系统路由，完整 TypeScript 类型推断
- **Jotai** - 原子化状态管理，支持 localStorage 持久化

### UI 与样式
- **HeroUI** - React 组件库
- **Tailwind CSS 4.1** - 实用优先的 CSS 框架
- **Phosphor Icons** - 统一图标系统

### 数据获取与认证
- **SWR** - 数据获取和缓存，支持自动重新验证
- **Auth0** - 身份认证和授权

## 目录结构

```
src/
├── components/          # React 组件
│   ├── chat/           # 聊天相关组件
│   ├── layout/         # 布局组件
│   └── ui/             # 通用 UI 组件
├── routes/             # 路由页面
│   ├── _chat/          # 聊天相关页面
│   └── auth/           # 认证相关页面
├── lib/                # 工具库
│   ├── api/            # API 封装
│   ├── fetcher.ts      # HTTP 请求封装
│   └── helper/         # 辅助函数
├── store/              # 全局状态
├── mocks/              # MSW 模拟数据
└── styles/             # 全局样式
```

## 核心模块

### 认证

使用 Auth0 JWT 认证：
- 用户通过 Auth0 登录获取 JWT token
- `@auth0/auth0-react` 自动管理 token 生命周期
- `fetcher.ts` 自动为请求添加 `Authorization` 头
- TanStack Router 提供路由守卫

### API 通信

#### Fetcher (src/lib/fetcher.ts)

统一的 HTTP 请求封装：
- 自动添加 JWT token
- 请求超时控制（默认 10s）
- 自动解析 JSON 响应
- 统一错误处理

#### API Hooks

基于 SWR 的数据获取 hooks：

**角色 API** (src/lib/api/characters.ts)
```typescript
useCharacters()           // 获取角色列表
useCharacter(id)          // 获取单个角色
useCreateCharacter()      // 创建角色
useDeleteCharacter()      // 删除角色
```

**历史记录 API** (src/lib/api/histories.ts)
```typescript
useHistoryIndexes()               // 获取会话列表
useHistoryMessages(indexId)       // 获取会话消息
useCreateHistoryIndex()           // 创建新会话
useCreateHistoryMessage()         // 发送消息
useDeleteHistory()                // 删除会话
```

**工具 API** (src/lib/api/tools.ts)
```typescript
useAsr()                  // 语音识别
useTts()                  // 语音合成
```

### 状态管理

使用 Jotai 进行原子化状态管理：

**侧边栏状态** (src/store/sidebarStore.ts)
- 侧边栏宽度
- 折叠状态

所有持久化状态通过 `atomWithStorage` 自动同步到 localStorage。

### 路由设计

使用 TanStack Router 文件系统路由：

```
/                                    # 首页
/auth/login                          # 登录页
/chat                                # 聊天入口
/chat/:characterId                   # 角色聊天（新会话）
/chat/:characterId/:sessionId        # 具体会话
/discover                            # 角色发现
/profile                             # 用户资料
```

所有 `/chat/*` 路由共享 `_chat.tsx` 布局。

### 聊天功能

#### 消息发送流程

```
用户输入消息
    │
    ├─ 文本输入 ──────────────┐
    │                         │
    ├─ 语音录制               │
    │   └─ VAD 检测沉默       │
    │       └─ 停止录制       │
    │           └─ POST /tool/asr
    │               └─ 获取识别文本
    │                         │
    └─────────────────────────┘
                │
    显示 pending 消息（半透明）
                │
    POST /histories/:id (发送消息)
                │
    mutate() 刷新消息列表
                │
    清除 pending 状态
```

#### 语音识别 (ASR)

- 使用 MediaRecorder API 录制音频（OGG 格式）
- VAD 通过 Web Audio API 分析频率
- 检测 2 秒沉默后自动停止
- 录制后上传至 `/tool/asr` 获取文本

#### 消息状态管理

- **Pending 状态**：发送消息时显示半透明气泡
- **乐观更新**：使用 SWR 的 `mutate()` 刷新列表
- **错误处理**：失败时清除 pending 状态

### UI/UX 设计

#### 响应式布局
- **桌面端**：三列布局（左侧导航 + 侧边栏 + 主内容）
- **移动端**：单列布局 + 底部导航

#### 主题系统
- 支持浅色/深色模式
- 使用 HeroUI 主题系统
- 状态持久化到 localStorage

#### 图标系统
- 用户：真实头像（Avatar 组件）
- 角色：emoji 表情

## 开发模式

### Mock Service Worker

使用 MSW 在开发环境模拟后端 API（`src/mocks/handlers.ts`）

### 类型安全

所有 API 响应使用统一格式：
```typescript
interface CommonResponse<T> {
  code: number
  msg?: string
  payload?: T
}
```

## 构建与部署

### 构建命令
```bash
pnpm dev      # 开发服务器
pnpm build    # 生产构建
pnpm lint     # 代码检查
pnpm preview  # 预览构建
```

### 环境变量
```env
VITE_API_BASE_URL=<后端 API 地址>
VITE_AUTH0_DOMAIN=<Auth0 域名>
VITE_AUTH0_CLIENT_ID=<Auth0 客户端 ID>
VITE_AUTH0_AUDIENCE=<Auth0 API 标识符>
```

详见 .env.example

### 部署
- 构建产物输出到 `dist/`
- 可部署到任何静态托管服务
- 需配置 SPA 路由回退