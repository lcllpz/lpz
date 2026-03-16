---
title: react-component-library
createTime: 2026/03/17 00:12:19
permalink: /AI/AI/7pc8ff0c/t05h3m1r/
---
# React 私有组件库使用规则

## 核心原则（最高优先级）

在开发 React 项目时，**必须优先使用**以下私有库，**禁止**在私有库已提供同等功能的情况下引入第三方组件库（如 antd、Material UI、Chakra UI 等）：

- UI 组件库：`@cyit/lowcode-ui`
- 图标库：`@cyit/lowcode-icons`

## 私有 NPM 仓库

私有包发布在 Verdaccio 私有仓库：

```
https://verdaccio.cqcyit.com/
```

项目根目录需要配置 `.npmrc`：

```
@cyit:registry=https://verdaccio.cqcyit.com/
```

## 安装依赖

```bash
# 安装 UI 组件库和图标库
npm install @cyit/lowcode-ui @cyit/lowcode-icons

# 必要的 peer dependencies（@cyit/lowcode-ui 的运行时依赖，但用户代码不应直接 import antd）
npm install react react-dom antd classnames
```

> **注意**：`antd` 作为 `@cyit/lowcode-ui` 的 peer dependency 必须安装，但用户代码中**不应直接从 `antd` 导入**，所有组件统一从 `@cyit/lowcode-ui` 导入。

## 样式配置（关键，必须严格遵守）

### 构建工具 LESS 变量配置（必须）

项目构建配置中**必须**添加以下 `modifyVars` 配置，以启用 antd CSS 变量模式，避免样式冲突：

**Vite 项目**（`vite.config.ts`）：

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@root-entry-name': 'variable',
        },
        javascriptEnabled: true,
      },
    },
  },
});
```

**Webpack 项目**（`webpack.config.js` 或 `config-overrides.js`）：

```js
// less-loader 配置
{
  loader: 'less-loader',
  options: {
    lessOptions: {
      modifyVars: {
        '@root-entry-name': 'variable',
      },
      javascriptEnabled: true,
    },
  },
}
```

**Umi 项目**（`.umirc.ts` 或 `config/config.ts`）：

```ts
export default {
  lessLoader: {
    modifyVars: {
      '@root-entry-name': 'variable',
    },
  },
};
```

> `@root-entry-name: variable` 会让 antd 使用 CSS 变量模式（`antd.variable.min.css`）而非静态样式，这是 `@cyit/lowcode-ui` 主题系统正常工作的前提。

### 禁止手动导入样式文件

**严禁**在代码中手动导入以下任何样式文件，否则会导致样式冲突和重复加载：

```tsx
// ❌ 禁止：不要导入 antd 样式
// import 'antd/dist/antd.css';
// import 'antd/dist/antd.less';
// import 'antd/dist/antd.variable.min.css';

// ❌ 禁止：不要导入 lowcode-ui 组件样式（构建工具会自动处理）
// import '@cyit/lowcode-ui/es/index.css';
// import '@cyit/lowcode-ui/es/index.less';
// import '@cyit/lowcode-ui/es/pro-layout/style/index.less';
// import '@cyit/lowcode-ui/es/pro-search/style/index.less';
// import '@cyit/lowcode-ui/es/button/style/index.less';
// ... 以及其他任何 @cyit/lowcode-ui 的子路径样式文件

// ✅ 正确：只需要配置 modifyVars，不需要手动导入任何样式
```

> 配置好 `modifyVars` 后，构建工具会自动处理样式加载，**无需也不应**在入口文件中手动导入 antd 或 lowcode-ui 的样式文件。

---

## @cyit/lowcode-ui 组件库

### 基于 Ant Design 4.x 封装，提供增强和扩展组件

该库对 Ant Design 组件进行了二次封装，并新增了自定义组件。**所有 Ant Design 组件都应从 `@cyit/lowcode-ui` 导入，而不是直接从 `antd` 导入。**

### 导入方式

```tsx
// ✅ 正确：从 @cyit/lowcode-ui 导入
import { Button, Table, Form, Input, Select, Modal } from '@cyit/lowcode-ui';
import type { ButtonProps, TableProps } from '@cyit/lowcode-ui';

// ✅ 正确：导入主题配置
import { defaultTheme, defaultBusinessTheme } from '@cyit/lowcode-ui';

// ❌ 错误：直接从 antd 导入
import { Button, Table } from 'antd';
```

### 完整组件清单

#### 自定义扩展组件（非 Ant Design 原生）

| 组件 | 说明 | 使用场景 |
|------|------|----------|
| `ProLayout` | 专业布局组件 | 页面整体布局，包含品牌 logo、头部导航（面包屑、租户、语言切换、用户、通知、搜索）和侧边栏菜单 |
| `ProSearch` | 高级搜索组件 | 表单搜索/筛选区域，支持 input、select、date、dateRange、rangePicker 字段类型，可折叠行，自定义渲染 |
| `AceEditor` | 代码编辑器 | 代码编辑场景，基于 react-ace |
| `MdEditor` | Markdown 编辑器 | Markdown 内容编辑，基于 @uiw/react-md-editor |
| `Theme` | 主题配置 | 全局主题定制，动态注入 CSS 变量 |

#### Ant Design 封装组件（完整列表）

**布局类：** Affix, Layout（含 Sider, Content）, Grid（Row, Col）, Space, Divider

**导航类：** Anchor, Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs

**表单类：** Form, Input, InputNumber, Select, Checkbox, Radio, Switch, Cascader, DatePicker, TimePicker, Upload, AutoComplete, Mentions, TreeSelect, Rate, Slider, Calendar

**数据展示类：** Table, List, Card, Carousel, Collapse, Descriptions, Empty, Image, Statistic, Timeline, Tooltip, Tag, Badge, Avatar, Comment, Result, Skeleton, Transfer, Tree, Typography, Segmented

**反馈类：** Alert, Modal, Drawer, Notification, Message, Popconfirm, Popover, Progress, Spin

**其他：** BackTop, PageHeader, ConfigProvider, Button

### 增强特性

#### Button 组件增强

```tsx
import { Button } from '@cyit/lowcode-ui';

// 额外支持的 props：
// - success: boolean — 成功状态按钮（绿色）
// - warning: boolean — 警告状态按钮（橙色）
// - preventDuplicateClick: boolean（默认 true）— 防重复点击，自动追踪 Promise 完成状态

<Button success onClick={async () => { await saveData(); }}>
  保存
</Button>

<Button warning>警告操作</Button>
```

#### Table 组件增强

```tsx
import { Table } from '@cyit/lowcode-ui';

// 增强特性：
// - 可拖拽调整列宽，宽度自动持久化
// - 批量操作支持
// - 自定义空状态
// - 滚动条缓冲处理
```

#### ProLayout 专业布局

```tsx
import { ProLayout } from '@cyit/lowcode-ui';
import type { ProLayoutProps, MenuItem, DropdownItem } from '@cyit/lowcode-ui';

// ProLayout props 接口：
// - brand?: { logo?: string; title?: string; onClick?: () => void }
// - header?: HeaderConfig
// - sider?: { menu?: { items: MenuItem[] }; slot?: ReactNode }
// - theme?: { layoutMode?: 'side' | 'top' | 'mix'; headerHeight?: number; siderWidth?: number; collapsedWidth?: number; contentPadding?: number | string }
//   注意：theme 一般不需要配置，使用默认值即可
// - children?: ReactNode

// MenuItem 结构：
// { key: string; icon?: ReactNode; label: string; children?: MenuItem[] }

// DropdownItem 结构：
// { key?: string; icon?: ReactNode; label?: string; type?: 'divider'; active?: boolean; disabled?: boolean; danger?: boolean }

// 注意：
// 1. theme 属性默认不配置，除非有特殊的布局定制需求
// 2. ProLayout 内容区域（children）的最外层元素默认没有边距（padding/margin），
//    如需边距请在业务代码的子元素上自行添加

<ProLayout
  brand={{
    logo: '/logo.svg',
    title: '管理系统',
    onClick: () => navigate('/'),
  }}
  header={{
    breadcrumb: {
      items: [{ key: 'home', label: '首页' }, { key: 'users', label: '用户管理' }],
      onItemClick: (key) => navigate(`/${key}`),
    },
    tenant: {
      items: [{ key: 'org1', label: '组织一' }, { key: 'org2', label: '组织二' }],
      current: 'org1',
      onChange: (key) => switchTenant(key),
    },
    language: {
      items: [{ key: 'zh', label: '中文' }, { key: 'en', label: 'English' }],
      current: 'zh',
      onChange: (key) => switchLang(key),
    },
    user: {
      avatar: <Avatar src="/avatar.png" />,
      username: '管理员',
      items: [
        { key: 'profile', label: '个人中心' },
        { type: 'divider' },
        { key: 'logout', label: '退出登录', danger: true },
      ],
      onItemClick: (key) => handleUserAction(key),
    },
    notification: {
      count: 5,
      slot: <NotificationList />,
    },
    search: {
      title: '搜索',
      width: 300,
      onOk: (value) => handleSearch(value),
    },
  }}
  sider={{
    menu: {
      items: [
        { key: 'dashboard', icon: <SystemDashboardOutlined />, label: '仪表盘' },
        { key: 'users', icon: <UserOutlined />, label: '用户管理', children: [
          { key: 'user-list', label: '用户列表' },
          { key: 'user-roles', label: '角色管理' },
        ]},
      ],
    },
  }}
>
  {/* 内容区域默认无边距，按需在子元素上添加 */}
  <Outlet />
</ProLayout>
```

#### ProSearch 高级搜索

```tsx
import { ProSearch } from '@cyit/lowcode-ui';
import { Form } from '@cyit/lowcode-ui';

// ProSearch props 接口：
// - searchForm: SearchField[] — 搜索字段配置数组
// - form?: FormInstance — 外部传入的 Form 实例
// - onSearch?: (values) => void — 搜索回调
// - onReset?: () => void — 重置回调
// - clearForm?: boolean — 重置时是否清空表单
// - initValues?: object — 表单初始值
// - collapsedRows?: number — 折叠后显示的行数
// - fieldsPerRow?: number — 每行显示的字段数

// SearchField 字段配置：
// - formItemType?: 'input' | 'select' | 'date' | 'dateRange' | 'rangePicker'
// - name?: string — 字段名
// - label?: string — 字段标签
// - customizePlaceholder?: string — 自定义 placeholder
// - options?: { label: string; value: string | number }[] — 下拉选项（select 类型使用）
// - renderTrigger?: (value, onChange, form) => ReactNode — 自定义字段渲染

const [form] = Form.useForm();

<ProSearch
  form={form}
  searchForm={[
    { formItemType: 'input', name: 'keyword', label: '关键词', customizePlaceholder: '请输入关键词' },
    { formItemType: 'select', name: 'status', label: '状态', options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'disabled' },
    ]},
    { formItemType: 'dateRange', name: 'dateRange', label: '日期范围' },
    { formItemType: 'input', name: 'creator', label: '创建人' },
    {
      name: 'custom',
      label: '自定义',
      renderTrigger: (value, onChange, form) => (
        <MyCustomField value={value} onChange={onChange} />
      ),
    },
  ]}
  onSearch={(values) => fetchData(values)}
  onReset={() => fetchData({})}
  collapsedRows={1}
  fieldsPerRow={3}
  initValues={{ status: 'active' }}
/>
```

### 主题配置

```tsx
import { Theme, defaultTheme, defaultBusinessTheme } from '@cyit/lowcode-ui';

// 方式一：使用内置主题
Theme.config({ themeVars: defaultTheme });         // 绿色主题（主色 #00B781）
Theme.config({ themeVars: defaultBusinessTheme }); // 蓝色主题（主色 #3c6cfe）

// 方式二：自定义主题变量
Theme.config({
  themeVars: {
    'primary-color': '#00B781',
    'primary-color-hover': '#26C399',
    'primary-color-active': '#009E6B',
    'primary-1': '#E0F7F2',
    'primary-7': '#009E6B',
    'success-color': '#52c41a',
    'error-color': '#f5222d',
    'warning-color': '#faad14',
    'info-color': '#00B781',
  },
  prefixCls: 'ant',  // CSS 变量前缀，默认 'ant'
});

// 方式三：从远程加载主题 JSON
Theme.config({
  source: 'https://example.com/theme.json',
});
```

### 函数式调用组件

以下组件通过函数调用使用，不是 JSX 组件：

```tsx
import { Message, Notification } from '@cyit/lowcode-ui';

// Message 消息提示
Message.success('操作成功');
Message.error('操作失败');
Message.warning('请注意');
Message.info('提示信息');
Message.loading('加载中...');

// Notification 通知
Notification.open({
  message: '通知标题',
  description: '通知内容详情',
});
Notification.success({ message: '成功', description: '保存成功' });
Notification.error({ message: '失败', description: '保存失败' });
```

---

## @cyit/lowcode-icons 图标库

### 导入方式

```tsx
// ✅ 正确：从 @cyit/lowcode-icons 导入自定义图标
import { SystemSettingOutlined, SystemDeleteFilled, BuildingOutlined } from '@cyit/lowcode-icons';

// ✅ 正确：Ant Design 原生图标也从 @cyit/lowcode-icons 导入（已 re-export）
import { SearchOutlined, PlusOutlined, EditOutlined } from '@cyit/lowcode-icons';

// ❌ 错误：直接从 @ant-design/icons 导入
import { SearchOutlined } from '@ant-design/icons';
```

### 图标命名规则

自定义图标的命名格式：`{图标名}{样式后缀}`

样式后缀：
- `Filled` — 实心图标
- `Outlined` — 线框图标
- `TwoTone` — 双色图标

> **注意**：部分图标名称带有类别前缀（如 `System`、`Direction`、`Document` 等）用于与 Ant Design 原生同名图标区分。不带前缀的图标名即为唯一名称，无需添加前缀。

### 图标分类（9 大类）及实际导出名称

#### system — 系统/UI 图标

常用图标：
`SystemSettingFilled` / `SystemSettingOutlined`, `SystemDashboardFilled` / `SystemDashboardOutlined`, `SystemLockFilled` / `SystemLockOutlined`, `SystemNotificationFilled` / `SystemNotificationOutlined`, `SystemDeleteFilled` / `SystemDeleteOutlined`, `SystemCalendarFilled` / `SystemCalendarOutlined`, `SystemCheckCircleFilled` / `SystemCheckCircleOutlined`, `SystemAppstoreFilled` / `SystemAppstoreOutlined`, `SystemAlarmFilled` / `SystemAlarmOutlined`

#### architecture — 建筑/结构图标

`BuildingFilled` / `BuildingOutlined` / `BuildingTwoTone`, `ClinicFilled` / `ClinicOutlined`, `ComplexFilled` / `ComplexOutlined`, `ArchitectureHomeFilled` / `ArchitectureHomeOutlined`, `HomepageFilled` / `HomepageOutlined`, `HospitalFilled` / `HospitalOutlined`, `PropertyFilled` / `PropertyOutlined`, `TowerFilled` / `TowerOutlined`, `ArchitectureEditOutlined`

#### communication — 通讯/消息图标

`ChatFilled` / `ChatOutlined`, `ContactFilled` / `ContactOutlined`, `ConverseFilled` / `ConverseOutlined`, `ConverseTextFilled` / `ConverseTextOutlined`, `DiscussionFilled` / `DiscussionOutlined`, `ExchangeFilled` / `ExchangeOutlined`, `TalkFilled` / `TalkOutlined`, `CallIncomingFilled` / `CallIncomingOutlined`, `CallOutFilled` / `CallOutOutlined`, `OnThePhoneFilled` / `OnThePhoneOutlined`, `ComminicatePhoneFilled` / `ComminicatePhoneOutlined`, `ComminicateMessageFilled` / `ComminicateMessageOutlined`, `ReadSMSFilled` / `ReadSMSOutlined`, `UnreadSMSFilled` / `UnreadSMSOutlined`

#### direction — 方向/箭头图标

箭头方向类：`DirectionArrowDownOutlined`, `DirectionArrowLeftOutlined`, `DirectionArrowRightOutlined`, `DirectionArrowUpOutlined` 等

Caret 三角类：`DirectionCaretDownFilled`, `DirectionCaretUpFilled`, `DirectionCaretLeftFilled`, `DirectionCaretRightFilled` 等

导航操作类：`StepForwardFilled`, `StepBackwardFilled`, `SwapOutlined`, `RetweetOutlined` 等

#### document — 文件/文档图标

`DocumentFileFilled` / `DocumentFileOutlined`, `DocumentFolderFilled` / `DocumentFolderOutlined`, `DocumentFolderOpenFilled` / `DocumentFolderOpenOutlined`, `DocumentFileTextFilled` / `DocumentFileTextOutlined`, `DocumentFileExcelFilled` / `DocumentFileExcelOutlined`, `DocumentFilePptFilled` / `DocumentFilePptOutlined`, `DocumentFileWordFilled` / `DocumentFileWordOutlined`, `DocumentFileZipFilled` / `DocumentFileZipOutlined`, `DocumentFileUnknownFilled` / `DocumentFileUnknownOutlined`, `BoxFilled` / `BoxOutlined`, `CloudDownloadFilled` / `CloudDownloadOutlined`, `CloudUploadFilled` / `CloudUploadOutlined`, `ExportFilled` / `ExportOutlined`

#### finance — 金融/支付图标

`FinanceWalletFilled` / `FinanceWalletOutlined`, `FinanceDollarCircleFilled` / `FinanceDollarCircleOutlined`, `BillfoldFilled` / `BillfoldOutlined`, `CouponFilled` / `CouponOutlined`, `GoldCoinFilled` / `GoldCoinOutlined`, `RedPacketFilled` / `RedPacketOutlined`, `ShoppingBagFilled` / `ShoppingBagOutlined`, `ShoppingCartFilled` / `ShoppingCartOutlined`, `TicketFilled` / `TicketOutlined`, `TrolleyFilled` / `TrolleyOutlined`

#### transportation — 交通/出行图标

`TransportationCarFilled` / `TransportationCarOutlined`, `TransportationTruckFilled` / `TransportationTruckOutlined`, `AirplaneFilled` / `AirplaneOutlined`, `BusFilled` / `BusOutlined`, `TrainFilled` / `TrainOutlined`, `SteamshipFilled` / `SteamshipOutlined`, `LocationFilled` / `LocationOutlined`, `MapFilled` / `MapOutlined`, `NavigationFilled` / `NavigationOutlined`, `PinpointFilled` / `PinpointOutlined`, `CoordinateFilled` / `CoordinateOutlined`, `GasStationFilled` / `GasStationOutlined`

#### user — 用户/人物图标

`UserFilled` / `UserUserOutlined`, `UserAddFilled` / `UserUserAddOutlined`, `UserDeleteFilled` / `UserUserDeleteOutlined`, `UserInfoFilled` / `UserInfoOutlined`, `UserSearchFilled` / `UserSearchOutlined`, `UserControlFilled` / `UserControlOutlined`, `UserVerificationFilled` / `UserVerificationOutlined`, `UserAbortFilled` / `UserAbortOutlined`, `IndividualFilled` / `IndividualOutlined`, `SupplierFilled` / `SupplierOutlined`, `TeamFilled` / `UserTeamOutlined`

#### other — 其他图标

`OtherCameraFilled` / `OtherCameraOutlined`, `OtherDatabaseFilled` / `OtherDatabaseOutlined`, `OtherEditFilled` / `OtherEditOutlined`, `OtherPictureFilled` / `OtherPictureOutlined`, `BarChartFilled` / `BarChartOutlined`, `RiseChartFilled` / `RiseChartOutlined`, `ServerFilled` / `ServerOutlined`, `SealFilled` / `SealOutlined`, `PencilFilled` / `PencilOutlined`, `CamcorderFilled` / `CamcorderOutlined`, `FilmFilled` / `FilmOutlined`

### 使用示例

```tsx
import {
  SystemSettingOutlined,
  SystemDeleteFilled,
  DocumentFileOutlined,
  SearchOutlined,        // Ant Design 原生图标，从此处统一导入
  PlusOutlined,          // Ant Design 原生图标
} from '@cyit/lowcode-icons';
import { Button, Space } from '@cyit/lowcode-ui';

function ActionButtons() {
  return (
    <Space>
      <Button icon={<SystemSettingOutlined />}>设置</Button>
      <Button danger icon={<SystemDeleteFilled />}>删除</Button>
      <Button icon={<DocumentFileOutlined />}>文件</Button>
      <Button type="primary" icon={<PlusOutlined />}>新增</Button>
      <Button icon={<SearchOutlined />}>搜索</Button>
    </Space>
  );
}
```

### 重要说明

`@cyit/lowcode-icons` 已经 re-export 了所有 `@ant-design/icons`，因此项目中**所有图标**都应统一从 `@cyit/lowcode-icons` 导入，无需单独安装 `@ant-design/icons`。

---

## AI 开发行为准则

### 必须遵守

1. **组件导入**：所有 UI 组件必须从 `@cyit/lowcode-ui` 导入，不得从 `antd` 直接导入
2. **图标导入**：所有图标必须从 `@cyit/lowcode-icons` 导入，不得从 `@ant-design/icons` 直接导入
3. **样式配置**：项目构建配置中必须添加 `modifyVars: { '@root-entry-name': 'variable' }`，**禁止**在代码中手动 import 任何 antd 或 lowcode-ui 的样式文件（CSS/LESS）
4. **新建项目**：初始化 React 项目时，自动配置 `.npmrc` 指向私有仓库，安装 `@cyit/lowcode-ui` 和 `@cyit/lowcode-icons`，并在构建配置中添加 `modifyVars`
5. **功能优先级**：实现 UI 功能时，先查阅本文档确认 `@cyit/lowcode-ui` 是否已提供对应组件，已有则直接使用
6. **扩展组件优先**：优先使用 ProLayout、ProSearch、AceEditor、MdEditor 等扩展组件，而非自行实现类似功能
7. **Props 准确性**：使用 ProLayout 时传 `header`/`sider`/`brand`（非 headerConfig/sidebarConfig），`theme` 默认不配置；使用 ProSearch 时传 `searchForm`（非 fields），字段配置用 `formItemType`（非 type）
8. **ProLayout 内容区域**：ProLayout 的 children 最外层元素默认没有边距（padding/margin），如需边距请在业务子元素上自行添加，不要给 ProLayout 配置 theme.contentPadding

### 禁止行为

1. **禁止**在 `@cyit/lowcode-ui` 已覆盖的场景下引入 antd、Material UI、Chakra UI、Headless UI 等第三方 UI 库
2. **禁止**直接安装或导入 `@ant-design/icons`，应使用 `@cyit/lowcode-icons`
3. **禁止**直接安装或导入 `antd` 组件到业务代码，`antd` 仅作为 peer dependency 安装
4. **禁止**自行实现 `@cyit/lowcode-ui` 已提供的组件功能（如布局、搜索、代码编辑器、Markdown 编辑器等）
5. **禁止**在代码中手动 import 任何样式文件，包括但不限于：`antd/dist/antd.css`、`antd/dist/antd.less`、`@cyit/lowcode-ui/es/index.css`、`@cyit/lowcode-ui/es/index.less`、以及任何 `@cyit/lowcode-ui/es/*/style` 路径下的样式文件。样式由构建工具的 `modifyVars` 配置自动处理

### 仅当以下情况可使用第三方库

- `@cyit/lowcode-ui` 确实不提供所需功能（如图表库 echarts、地图库等）
- 需要高度专业化的组件（如富文本编辑器 TinyMCE、视频播放器等）
- 使用前应在回复中明确说明原因
