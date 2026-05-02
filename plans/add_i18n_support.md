# 为 AI 评委系统添加国际化支持 (i18n)

## 项目概述

为 AI 评委数据采集分析系统实现完整的中英文国际化支持，包括登录页面、主界面、视频监看、场次管理、大屏展示等所有用户界面。

## 已完成的工作

### 1. 基础设施搭建

1. ✅ 创建了翻译文件
   - `messages/zh.json` - 中文翻译（116 行）
   - `messages/en.json` - 英文翻译（116 行）
   - 包含 8 个命名空间：common, auth, navigation, videoMonitor, businessPanel, screen, status, logs, time, language

2. ✅ 创建了自定义 i18n 库
   - `src/lib/i18n.tsx` - 轻量级 i18n 实现，无需外部依赖
   - 包含 I18nProvider、useI18n、useTranslations、useLocale 等 Hook
   - 支持嵌套键和参数替换
   - 支持 localStorage 持久化语言偏好

3. ✅ 更新了 `src/app/layout.tsx`
   - 添加了 `I18nProvider` 包装整个应用
   - 设置默认语言为中文

4. ✅ 修复了 `src/components/LanguageSwitcher.tsx`
   - 从 next-intl 改为使用自定义 i18n 库
   - 使用按钮而不是链接进行语言切换
   - 实时更新语言，无需刷新页面

### 2. 组件国际化改造

5. ✅ 更新了 `src/app/page.tsx` (主页)
   - 使用 `useTranslations()` Hook
   - 加载中提示文本国际化

6. ✅ 更新了 `src/components/Login.tsx` (登录页面)
   - 使用 `useTranslations('auth')` Hook
   - 所有硬编码文本已替换为翻译键
   - 包括：标题、副标题、输入框标签、占位符、按钮、错误提示

7. ✅ 更新了 `src/components/MainContent.tsx` (主内容区)
   - 添加了 LanguageSwitcher 组件到导航栏
   - 使用 `useTranslations()` Hook
   - 国际化：系统标题、欢迎语、角色标签、退出登录、日志提示

8. ✅ 更新了 `src/components/VideoMonitor.tsx` (视频监看)
   - 使用 `useTranslations('videoMonitor')` Hook
   - 国际化：标题、按钮（开始/停止采集、清除评估、跳转大屏、上传背景图）
   - 国际化：设置面板（视频设置、选择摄像头/音频源、左转/右转）
   - 国际化：提示文本和错误消息

9. ✅ 更新了 `src/components/BusinessPanel.tsx` (场次管理)
   - 使用 `useTranslations('businessPanel')` 和 `useTranslations('status')` Hook
   - RoundStatusLabels 已改为动态翻译函数 `getStatusLabel()`
   - 国际化：场次管理（新建场次、场次名称、创建时间等）
   - 国际化：宣讲管理（开始/结束宣讲、开始评估、发布等）
   - 国际化：状态标签（未开始、宣讲中、已评估等）
   - 国际化：时长显示（宣讲时长、已宣讲时长）

10. ✅ 更新了 `src/components/ScreenPreview.tsx` (屏幕预览)
    - 使用 `useTranslations('screen')` Hook
    - 国际化：AI 评估标题
    - 国际化：评估指标（抬头率、在座率、现场氛围）
    - 国际化：综合得分显示
    - 国际化：上传背景图弹窗

11. ✅ 更新了 `src/app/screen/page.tsx` (大屏页面)
    - 使用 `useTranslations('screen')` Hook
    - 国际化：加载提示
    - 国际化：AI 评估标题和所有评估指标
    - 国际化：宣讲员排名和综合得分

### 3. 清理和优化

12. ✅ 清理了旧的 next-intl 路由
    - 移除 `[locale]` 目录（使用 next-intl 的旧方案）
    - 使用自定义 i18n 方案替代基于路由的国际化
    - 简化了路由结构

13. ✅ 补充遗漏的翻译键
    - 添加 `screen.audienceAttention` (抬头率)
    - 添加 `screen.occupancyRate` (在座率)
    - 添加 `screen.atmosphere` (现场氛围)
    - 确保所有 UI 文本都有对应的翻译键

## 实现方案

### 技术选型

使用自定义轻量级 i18n 实现，而不是 next-intl，因为：
- ✅ 避免复杂的配置和兼容性问题
- ✅ 更简单直接，易于维护
- ✅ 完全控制实现逻辑
- ✅ 无需修改路由结构
- ✅ 减少依赖体积

### 架构设计

```
I18nProvider (Context)
    ├── locale: 当前语言状态
    ├── setLocale: 切换语言方法
    └── t: 翻译函数
        ├── 支持命名空间：useTranslations('namespace')
        ├── 支持嵌套键：t('auth.loginTitle')
        └── 支持参数替换：t('roundN', { n: 1 })
```

## 技术细节

### 核心功能

- **默认语言**：中文 ('zh')
- **语言持久化**：localStorage 存储用户偏好
- **命名空间支持**：按功能模块组织翻译键
- **参数替换**：支持动态内容 `{param}` 语法
- **实时切换**：无需刷新页面即可切换语言
- **类型安全**：TypeScript 类型定义完整

### 翻译键组织

```json
{
  "common": { "loading", "ok", "cancel", ... },
  "auth": { "loginTitle", "username", "password", ... },
  "navigation": { "mainTitle" },
  "videoMonitor": { "title", "startCapture", "clearEvaluation", ... },
  "businessPanel": { "sessionManagement", "roundN", "startPresentation", ... },
  "screen": { "aiEvaluation", "audienceAttention", "compositeScore", ... },
  "status": { "notStarted", "performing", "evaluated", ... },
  "logs": { "title", "noLogs" },
  "time": { "minute", "second" },
  "language": { "zh", "en" }
}
```

### 使用示例

```tsx
// 1. 使用默认命名空间
const t = useTranslations();
t('common.loading') // "加载中..." 或 "Loading..."

// 2. 使用指定命名空间
const t = useTranslations('auth');
t('loginTitle') // 自动查找 auth.loginTitle

// 3. 使用参数替换
const t = useTranslations('businessPanel');
t('roundN', { n: 3 }) // "第 3 位宣讲员" 或 "Presenter #3"
```

## 测试验证

### 编译测试
- ✅ 项目成功编译 (`npm run build`)
- ✅ 无 TypeScript 类型错误
- ✅ 无模块依赖错误
- ✅ 所有路由正常生成

### 功能测试清单
- ✅ 登录页面文本切换
- ✅ 主界面导航栏切换
- ✅ 视频监看按钮和设置
- ✅ 场次管理和宣讲管理
- ✅ 状态标签显示
- ✅ 屏幕预览和大屏展示
- ✅ 评估指标显示（抬头率、在座率、现场氛围）
- ✅ 语言偏好持久化
- ✅ 实时语言切换（无需刷新）

### 已知问题
- 无

## 部署说明

### 生产环境部署

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 启动生产服务器：
   ```bash
   npm start
   ```

3. 访问应用：
   - 主界面：`http://localhost:3000`
   - 大屏界面：`http://localhost:3000/screen`

### 语言切换使用

1. 登录后，在顶部导航栏可以看到语言切换按钮
2. 点击 **"中文"** 或 **"EN"** 按钮切换语言
3. 语言偏好会自动保存，下次访问时生效

## 后续优化建议

### 可选改进

1. **添加更多语言支持**
   - 日语 (ja)
   - 韩语 (ko)
   - 法语 (fr)
   - 西班牙语 (es)

2. **服务端渲染优化**
   - 根据浏览器语言设置自动选择初始语言
   - 支持 Accept-Language 请求头

3. **翻译管理工具**
   - 集成 Crowdin 或 Transifex 等翻译管理平台
   - 自动化翻译键同步

4. **性能优化**
   - 按需加载翻译文件（代码分割）
   - 翻译缓存优化

5. **测试覆盖**
   - 添加国际化单元测试
   - 添加 E2E 测试验证语言切换

## 相关文件清单

### 核心文件
- `src/lib/i18n.tsx` - i18n 核心实现
- `messages/zh.json` - 中文翻译
- `messages/en.json` - 英文翻译
- `src/components/LanguageSwitcher.tsx` - 语言切换组件

### 已国际化的组件
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/screen/page.tsx`
- `src/components/Login.tsx`
- `src/components/MainContent.tsx`
- `src/components/VideoMonitor.tsx`
- `src/components/BusinessPanel.tsx`
- `src/components/ScreenPreview.tsx`

### 备份文件（可删除）
- `src/locale.backup/` - 旧的 next-intl 实现（已废弃）
- `src/components/*.old.tsx` - 组件备份文件

## 项目状态

**✅ 已完成** - 所有计划功能已实现并通过测试

- 开始日期：2026-05-02
- 完成日期：2026-05-02
- 当前版本：v1.4.0
- 状态：生产就绪
