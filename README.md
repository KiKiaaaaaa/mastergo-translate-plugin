# MasterGo 翻译插件

一个用于 [MasterGo](https://mastergo.com) 的轻量翻译插件：选中画布上的文字图层，一键调用 DeepSeek 大模型翻译成目标语言，并直接回写到图层里。

适合做多语言界面稿时快速替换文案，省去「复制文字 → 打开翻译网站 → 粘贴回来 → 改字体」的重复劳动。

> [!IMPORTANT]
> **使用前必做：把占位符换成你自己的 API Key**
>
> 仓库里的 `DEEPSEEK_API_KEY` 是占位符 `sk-xxxxxxxxxxx`，**不替换就翻译不了**（请求会被 DeepSeek 拒绝）。
> 下载后打开 `index.html`，找到第 33 行 `const DEEPSEEK_API_KEY = "sk-xxxxxxxxxxx";`，把引号内的内容换成你自己的 [DeepSeek API Key](https://platform.deepseek.com/api_keys)，保存，再在 MasterGo 里重新运行插件即可。
> 完整步骤见下方[配置](#配置)一节。

## 功能

- 批量翻译：一次处理选中范围内的所有文字图层
- 四种目标语言：简体中文、繁体中文、美式英语、英式英语（想添加更多可以在代码里加入）
- 保留原有排版：翻译结果直接写回 `characters`，字体、字号、颜色、图层位置均不变
- 面向 UI 场景的提示词：要求模型只输出纯译文，不带引号、音标、解释或客套话

## 支持语言

**源语言：不限制。** 插件把图层原文原样交给 DeepSeek，由模型自行识别语种，英文稿、日文稿、稿件里已有的任意语言都可以作为输入。

**目标语言：目前 4 种**，由 UI 下拉框固定给出：

| 目标语言 | 说明 |
| --- | --- |
| 简体中文 | 默认选项 |
| 繁体中文 | |
| 美式英语 | |
| 英式英语 | 与美式英语分开，避免拼写、用词被统一成美式 |

想增加语言不需要动请求逻辑，只要在 `index.html` 的 `<select>` 里补一行即可，选项的值会被原样拼进提示词：

```html
<option value="日语">日语</option>
```

## 安装

1. 下载本插件：[Releases](https://github.com/KiKiaaaaaa/mastergo-translate-plugin/releases) 里的 `mastergo-translate-plugin-v1.0.0.zip`（解压即用），或点 `Code` → `Download ZIP`，或 `git clone`
2. 打开 MasterGo 桌面端，在插件面板中选择「导入本地插件」
3. 选中解压目录下的 `manifest.json` 完成导入
4. **别急着用**：先按下方[配置](#配置)填入你自己的 API Key

## 配置

插件不自带 API Key，需要填入你自己的 DeepSeek Key。

1. 前往 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys) 申请 API Key
2. 打开 `index.html`，找到这一行：

   ```js
   const DEEPSEEK_API_KEY = "sk-xxxxxxxxxxx";
   ```

3. 把 `sk-xxxxxxxxxxx` 替换成你的 Key，保存后在 MasterGo 里重新运行插件

> ⚠️ 请勿把你的真实 Key 提交到公开仓库。插件运行在本地 UI 容器里，Key 会随客户端分发，无法真正做到保密；仅建议自用或小范围内部使用。若要在团队中共享，建议改为由自建服务端代理请求，客户端不持有 Key。

## 使用

1. 在画布上选中一个或多个**文字图层**（`TEXT` 节点；选择框、编组等容器内不含文字节点时不会生效）
2. 运行插件，在下拉框里选择目标语言
3. 点击「一键翻译选中文字」，等待提示「翻译完成」

若提示字体加载失败，通常是因为该文字使用了当前环境未安装的自定义字体，改用默认字体或安装对应字体即可。

## 项目结构

```
.
├── manifest.json   # 插件清单：ID、入口、UI、支持的编辑器类型与能力声明
├── index.js        # 主线程逻辑：读取选区、提取文字、回写译文、加载字体
└── index.html      # 插件 UI：语言选择、按钮，以及调用 DeepSeek 接口的请求逻辑
```

## 已知限制

- 只处理 `TEXT` 类型节点，不做图层树递归查找
- 逐条串行请求，图层很多时耗时较长
- 译文长度变化较大时可能出现文本溢出，需手动调整文本框

## 免责声明

本插件为个人开发的效率工具，与 MasterGo 及 DeepSeek 官方无隶属关系。使用第三方接口产生的费用与合规责任由使用者自行承担。

## 开源协议

[MIT](LICENSE) © KiKiaaaaaa

欢迎提 Issue 和 PR，也欢迎直接 fork 改成你自己的版本。
