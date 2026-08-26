# YanQing AI 办公助手

一个可直接部署到 GitHub Pages 的纯静态 AI 办公任务助手。

在线访问：<https://cyanqing1012.github.io/yanqing-ai-assistant/>

## 功能

- 将自然语言工作需求拆成清晰的执行路线
- 按任务类型推荐 DeepSeek、Kimi、WPS AI 等工具
- 生成可复制、可继续编辑的专属 Prompt
- 支持材料研发、数据分析、AI 日报、PPT 汇报与内容写作
- 响应式布局，可在手机微信和桌面浏览器中使用

## 技术说明

项目只使用 HTML、CSS 和原生 JavaScript，不依赖构建工具、CDN 或外部字体。所有任务分类与 Prompt 生成都在浏览器本机完成，不会上传输入内容。

> 当前版本是“任务分析 + Prompt 路由”前端助手。如需让网站直接返回大模型回答，应增加安全的后端 API，不能把模型密钥写进前端代码。
