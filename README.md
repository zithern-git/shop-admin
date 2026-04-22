# Shop-Admin 电商后台管理系统

## 项目背景

Shop-Admin 是一套基于 **Vue 3 + TypeScript** 的电商后台管理系统，旨在为电商平台提供完整的后台管理解决方案。系统涵盖商品管理、权限控制、数据可视化等核心业务场景，实现了从用户认证、角色授权到商品全生命周期（SPU/SKU）管理的完整闭环。

本项目采用前后端分离架构，前端基于 Vue 3 生态，后端使用 Express + JSON Server 提供数据接口，通过 JWT 实现安全认证。项目适合作为 Vue 3 企业级中后台项目的学习与实战参考。

---

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| **核心框架** | Vue 3.5 + TypeScript 5.9 | Composition API + `<script setup>` |
| **构建工具** | Vite 7.3 | 极速开发体验，HMR 热更新 |
| **UI 框架** | Element Plus 2.13 | 企业级 Vue 3 组件库 |
| **CSS 方案** | WindiCSS + SCSS | 原子化 CSS + 预处理器 |
| **状态管理** | Pinia 3.0 | Vue 3 官方推荐状态管理 |
| **路由** | Vue Router 5.0 | Hash 模式 + 动态路由 + 路由守卫 |
| **网络请求** | Axios 1.13 | 二次封装，统一拦截 |
| **图表可视化** | ECharts 5.6 + echarts-liquidfill | 数据大屏可视化 |
| **工具库** | @vueuse/core, dayjs, lodash, fuse.js | 实用工具集 |
| **后端服务** | Express + JSON Server | 模拟 RESTful API |
| **认证方案** | JWT (jsonwebtoken) | Token 鉴权，2h 有效期 |
| **代码规范** | ESLint + OxLint + Prettier | 多层 Lint 保障代码质量 |
| **单元测试** | Vitest | Vite 原生测试框架 |
| **Mock 数据** | vite-plugin-mock + MockJS | 开发阶段数据模拟 |

---

## 功能模块

### 1. 用户认证
- 账号密码登录（表单校验：用户名 ≥ 4 位，密码 ≥ 6 位）
- JWT Token 认证，自动携带请求头
- Token 过期自动跳转登录页
- 登录后根据时段问候（早上好/下午好/晚上好）

### 2. 权限管理 (ACL)

| 子模块 | 功能 |
|--------|------|
| **用户管理** | 用户 CRUD、搜索/重置、批量删除、分配角色、分页展示 |
| **角色管理** | 角色 CRUD、搜索、分配权限（菜单/按钮级别） |
| **菜单管理** | 树形菜单展示、添加菜单/功能按钮、编辑、删除 |

**权限控制机制：**
- **菜单权限**：根据用户角色动态生成路由（常量路由 + 异步路由），不同角色看到不同菜单
- **按钮权限**：自定义指令 `v-has="'btn.add'"`，无权限按钮自动移除 DOM
- 超级管理员 (admin) 拥有全部权限，普通用户仅拥有部分权限

### 3. 商品管理

| 子模块 | 功能 |
|--------|------|
| **品牌管理** | 品牌 CRUD、品牌 Logo 上传、分页展示 |
| **属性管理** | 三级分类联动、平台属性 CRUD、属性值管理 |
| **SPU 管理** | 三级分类联动、SPU 列表/新增/修改、SPU 图片管理、销售属性 |
| **SKU 管理** | SKU 列表、上架/下架切换、SKU 详情查看 |

**电商核心概念：**
- **SPU**（标准化产品单元）：代表一类商品，如"华为 Mate 60"
- **SKU**（库存量最小单位）：代表具体可购买的商品实例，如"华为 Mate 60 黑色 256G"

### 4. 数据大屏
- 自适应缩放（基于 1920×1080 设计稿，等比缩放适配任意分辨率）
- 游客统计（数字翻牌器动画）
- 性别比例分析（玫瑰图）
- 年龄分布（柱状图）
- 全国地图可视化（中国地图 + 散点标注）
- 年度销售趋势（折线图）
- 热门商品排名（水平柱状图）
- 年度销售对比（环形图）
- 实时计数器

### 5. 系统功能
- 面包屑导航（根据路由自动生成）
- 侧边栏菜单折叠/展开
- 全屏切换
- 暗黑模式（Element Plus 暗黑主题）
- 主题色自定义（CSS 变量动态切换）
- 退出登录（清除 Token + 重置路由）
- NProgress 路由进度条
- 404 页面兜底

---

## 核心亮点

1. **动态路由权限**：根据后端返回的路由标识，前端动态注册异步路由，实现菜单级别的权限控制，无需硬编码路由表
2. **按钮级权限控制**：自定义指令 `v-has`，一行代码控制按钮显隐，无权限直接移除 DOM 节点，安全彻底
3. **数据大屏自适应**：基于 `transform: scale()` 的等比缩放方案，监听 `window.resize` 实时响应，一套代码适配所有屏幕
4. **Axios 二次封装**：统一请求/响应拦截、Token 自动注入、HTTP 错误码统一提示（401/403/404/500）
5. **三级分类联动**：商品管理模块的一二三级分类联动选择器，数据驱动的组件化封装
6. **SPU/SKU 完整流程**：从品牌管理 → 属性管理 → SPU 管理 → SKU 管理的电商全链路覆盖
7. **暗黑模式 + 主题定制**：通过 CSS 变量实现暗黑模式切换和主题色自定义，无缝对接 Element Plus
8. **TypeScript 全量类型**：API 层、Store 层、组件层均有完整的类型定义，开发体验友好

---

## 性能数据

| 指标 | 数据 |
|------|------|
| 构建工具 | Vite 7（冷启动 < 500ms） |
| 路由模式 | 全量懒加载（`() => import()`） |
| UI 按需导入 | unplugin-auto-import + unplugin-vue-components |
| SVG 图标 | vite-plugin-svg-icons 按需加载 |
| 请求超时 | 5s 超时控制 |
| Token 有效期 | 2 小时自动过期 |
| 大屏渲染 | ECharts 按需引入 + 1920×1080 基准缩放 |
| Node 最低版本 | 20.19.0+ |

---

## 在线预览

<!-- 部署后替换为实际地址 -->
🔗 **预览地址**：[https://github.com/zithern-git/shop-admin](https://github.com/zithern-git/shop-admin)

> 本地启动预览：
> ```bash
> # 1. 启动后端服务
> cd server && npm install && npm run dev
>
> # 2. 启动前端项目
> npm install && npm run dev
> ```

**测试账号：**
| 角色 | 用户名 | 密码 |
|------|--------|------|
| 超级管理员 | admin | atguigu123 |
| 普通用户 | 硅谷333 | 111111 |

---

## 项目架构图

```
shop-admin/
├── public/                          # 静态资源
│   ├── china.json                   # 中国地图 GeoJSON 数据
│   ├── favicon.ico                  # 网站图标
│   └── logo.png                     # 项目 Logo
├── server/                          # 后端服务（Express + JSON Server）
│   ├── index.js                     # 服务端入口（RESTful API + JWT 鉴权）
│   ├── uploads/                     # 上传文件目录（品牌Logo/SPU图片）
│   └── package.json
├── mock/                            # Mock 数据（vite-plugin-mock）
│   └── user.ts                      # 用户模块 Mock
├── src/
│   ├── api/                         # API 接口层（按模块拆分）
│   │   ├── acl/                     # 权限管理接口
│   │   │   ├── menu/                # 菜单接口 + 类型定义
│   │   │   ├── role/                # 角色接口 + 类型定义
│   │   │   └── user/                # 用户接口 + 类型定义
│   │   ├── product/                 # 商品管理接口
│   │   │   ├── attr/                # 属性接口
│   │   │   ├── sku/                 # SKU 接口
│   │   │   ├── spu/                 # SPU 接口
│   │   │   └── trademark/           # 品牌接口
│   │   └── user/                    # 登录/用户信息接口
│   ├── assets/                      # 静态资源
│   │   ├── icons/                   # SVG 图标
│   │   ├── logo.svg
│   │   ├── base.css
│   │   └── main.css
│   ├── components/                  # 全局公共组件
│   │   ├── Category/                # 三级分类联动组件
│   │   ├── Pagination/              # 分页组件
│   │   ├── SvgIcon/                 # SVG 图标组件
│   │   └── index.ts                 # 全局注册入口
│   ├── directive/                   # 自定义指令
│   │   └── has.ts                   # 按钮权限指令 v-has
│   ├── layout/                      # 布局组件
│   │   ├── index.vue                # 主布局（左侧菜单 + 顶部导航 + 内容区）
│   │   ├── logo/                    # Logo 组件
│   │   ├── menu/                    # 递归菜单组件
│   │   ├── main/                    # 内容区组件
│   │   └── tabbar/                  # 顶部导航栏
│   │       ├── breadcrumb/          # 面包屑导航
│   │       └── setting/             # 设置（刷新/全屏/暗黑/主题色/退出）
│   ├── router/                      # 路由配置
│   │   ├── index.ts                 # 路由实例（Hash 模式）
│   │   └── routes.ts                # 常量路由 + 异步路由 + 任意路由
│   ├── store/                       # Pinia 状态管理
│   │   ├── index.ts                 # Store 入口
│   │   └── modules/
│   │       ├── user.ts              # 用户状态（Token/菜单/权限/动态路由）
│   │       ├── category.ts          # 分类状态
│   │       ├── setting.ts           # 布局配置状态
│   │       └── types/               # 类型定义
│   ├── styles/                      # 全局样式
│   │   ├── index.scss               # 样式入口
│   │   ├── reset.scss               # 样式重置
│   │   └── variable.scss            # SCSS 全局变量
│   ├── utils/                       # 工具函数
│   │   ├── request.ts               # Axios 二次封装
│   │   ├── token.ts                 # Token 存取工具
│   │   └── time.ts                  # 时间问候语
│   ├── views/                       # 页面组件
│   │   ├── 404/                     # 404 页面
│   │   ├── home/                    # 首页
│   │   ├── login/                   # 登录页
│   │   ├── acl/                     # 权限管理
│   │   │   ├── uesr/                # 用户管理
│   │   │   ├── role/                # 角色管理
│   │   │   └── permission/          # 菜单管理
│   │   ├── product/                 # 商品管理
│   │   │   ├── trademark/           # 品牌管理
│   │   │   ├── attr/                # 属性管理
│   │   │   ├── spu/                 # SPU 管理
│   │   │   └── sku/                 # SKU 管理
│   │   └── screen/                  # 数据大屏
│   │       ├── index.vue            # 大屏主容器（自适应缩放）
│   │       ├── components/          # 大屏子组件
│   │       │   ├── Top/             # 顶部标题栏
│   │       │   ├── tourist/         # 游客统计
│   │       │   ├── sex/             # 性别比例
│   │       │   ├── age/             # 年龄分布
│   │       │   ├── map/             # 中国地图
│   │       │   ├── line/            # 折线趋势图
│   │       │   ├── rank/            # 排行榜
│   │       │   ├── year/            # 年度销售
│   │       │   └── counter/         # 计数器
│   │       └── images/              # 大屏图片资源
│   ├── App.vue                      # 根组件
│   ├── main.ts                      # 应用入口
│   ├── permission.ts                # 路由鉴权（全局前置/后置守卫）
│   ├── setting.ts                   # 项目配置（标题/Logo）
│   └── vite-env.d.ts                # 环境变量类型声明
├── .env.development                 # 开发环境变量
├── vite.config.ts                   # Vite 配置（代理/SVG/Mock/SCSS）
├── windi.config.ts                  # WindiCSS 配置
├── tsconfig.json                    # TypeScript 配置
├── eslint.config.ts                 # ESLint 配置
├── vitest.config.ts                 # Vitest 配置
├── server.cjs                       # JSON Server 启动脚本
├── db.json                          # JSON Server 数据文件
└── package.json                     # 项目依赖
```

---

## 核心功能截图

> 以下为各核心页面的功能示意，部署后可替换为实际截图

### 登录页
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   欢迎光临                          欢迎回来         │
│   这是一个后台管理系统。            账号密码登录     │
│                                     ┌──────────┐     │
│                                     │ 👤 请输入用户名│
│    (左侧品牌区)                     ├──────────┤     │
│                                     │ 🔒 请输入密码  │
│                                     ├──────────┤     │
│                                     │   登 录   │     │
│                                     └──────────┘     │
└──────────────────────────────────────────────────────┘
```

### 首页
```
┌──────────────────────────────────────────────────────┐
│  🏠 首页 > 首页              🔄 🖥 ⚙ 👤 admin ▾   │
├──────┬───────────────────────────────────────────────┤
│      │                                               │
│ 菜单 │   👤 早上好！admin                             │
│      │      后台测试管理系统                           │
│ 🏠首页│                                               │
│ 📦商品│      ┌──────────────────────────┐             │
│  品牌 │      │                          │             │
│  属性 │      │     Welcome SVG 图标      │             │
│  SPU │      │                          │             │
│  SKU │      └──────────────────────────┘             │
│ 🔐权限│                                               │
│  用户 │                                               │
│  角色 │                                               │
│  菜单 │                                               │
│ 📊大屏│                                               │
└──────┴───────────────────────────────────────────────┘
```

### 用户管理
```
┌──────────────────────────────────────────────────────┐
│ 用户名：[________]               [搜索] [重置]       │
├──────────────────────────────────────────────────────┤
│ [+ 添加] [批量删除]                                   │
│ ┌────┬────┬──────┬──────┬────┬──────┬──────┬───────┐ │
│ │ ☑  │ #  │  ID  │用户名│名称│ 角色 │创建时间│ 操作  │ │
│ ├────┼────┼──────┼──────┼────┼──────┼──────┼───────┤ │
│ │ ☑  │ 1  │  1   │admin │... │admin │ ...  │分配 编辑│ │
│ │ ☑  │ 2  │  2   │user1 │... │user │ ...  │分配 编辑│ │
│ └────┴────┴──────┴──────┴────┴──────┴──────┴───────┘ │
│                              < 1 2 3 >   每页 5 条   │
└──────────────────────────────────────────────────────┘
```

### 数据大屏
```
┌──────────────────────────────────────────────────────┐
│              📊 电商数据实时监控大屏                    │
├──────────┬────────────────────┬──────────────────────┤
│ 游客统计  │                    │ 热门商品排行           │
│ 125,809  │                    │  1. 华为 Mate 60     │
├──────────┤   🗺 中国地图      ├──────────────────────┤
│ 性别比例  │   (散点标注)       │ 年度销售对比           │
│ ♂ 62%   │                    │  ╭──╮                │
│ ♀ 38%   ├────────────────────┤  │52%│                │
├──────────┤ 📈 年度趋势折线图   ├──────────────────────┤
│ 年龄分布  │                    │ 实时计数器             │
│ ██▓▓░░  │                    │  999,999             │
└──────────┴────────────────────┴──────────────────────┘
```

---

## 快速开始

### 环境要求

- Node.js >= 20.19.0
- npm >= 9.0.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/zithern-git/shop-admin.git
cd shop-admin

# 安装前端依赖
npm install

# 启动后端服务（新终端）
cd server
npm install
npm run dev
# 服务运行在 http://localhost:3003

# 启动前端开发服务器
npm run dev
# 前端运行在 http://localhost:5173

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint

# 单元测试
npm run test:unit
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_APP_TITLE` | 项目标题 | 后台管理系统 |
| `VITE_APP_BASE_API` | API 基础路径 | /api |
| `VITE_SERVER` | 后端服务地址 | http://localhost:3003 |

---

## 项目脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（Vite） |
| `npm run mock` | 启动 JSON Server（开发辅助） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run build-only` | 仅构建（跳过类型检查） |
| `npm run preview` | 预览生产构建 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run lint` | OxLint + ESLint 检查修复 |
| `npm run format` | Prettier 格式化 |
| `npm run test:unit` | 运行单元测试 |

---

## 推荐开发环境

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（请禁用 Vetur）
- 浏览器安装 [Vue.js Devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

---

## License

ISC
