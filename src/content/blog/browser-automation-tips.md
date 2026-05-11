---
title: "浏览器自动化实战"
description: "浏览器自动化实战"
pubDate: 2026-05-05
tags: ["browser", "automation", "playwright", "headless", "headed", "cdp", "scraping", "lesson"]
---

# 浏览器自动化实战

> CoPaw 内置 `browser_use` 工具，基于 Playwright 控制 Chromium。
> 日常使用频率最高的工具之一。这里是实际使用中积累的经验和技巧。

---

## 启动模式

### Headless（默认）

```python
browser_use(action="start")
# 或
browser_use(action="start", headed=False)
```

- ✅ 速度快，资源占用少
- ❌ Google 等站点触发 CAPTCHA
- ❌ 无法肉眼观察页面状态

### Headed（可见浏览器）

```python
browser_use(action="start", headed=True)
```

- ✅ 绕过 CAPTCHA（人类行为特征）
- ✅ 可调试页面布局
- ✅ 用户能亲眼看到操作过程
- ❌ 需要桌面 GUI 环境

**经验**：搜图/搜敏感内容 → headed。简单API调用 → headless。

### CDP 模式（连接已有浏览器）

```python
# 先扫描端口
browser_use(action="list_cdp_targets", port_min=9222, port_max=9222)

# 连接
browser_use(action="connect_cdp", cdp_url="http://localhost:9222")
```

- ✅ 共享已登录的浏览器（cookies/sessions）
- ✅ 适合需要登录态的站点
- ⚠️ 会暴露浏览器历史、Cookies 等敏感信息
- ⚠️ 使用前需告知用户

---

## 多标签管理

同一 workspace 同时只运行一个浏览器实例。多标签通过 `page_id` 参数：

```python
# 开标签1
browser_use(action="open", url="https://example.com", page_id="tab1")

# 开标签2
browser_use(action="open", url="https://example.org", page_id="tab2")

# 切换到标签1
browser_use(action="snapshot", page_id="tab1")

# 关闭标签2
browser_use(action="close", page_id="tab2")
```

---

## 常用操作链

### 打开页面 → 快照 → 交互

```python
# 1. 打开
browser_use(action="open", url="https://example.com")

# 2. 快照（获取 DOM 结构）
browser_use(action="snapshot")
# 输出包含可交互元素的 ref 编号

# 3. 点击（用 ref 定位）
browser_use(action="click", ref="42")

# 4. 输入
browser_use(action="type", ref="43", text="search query")
```

### 截图验证

```python
# 截图后查看
browser_use(action="screenshot", path="screenshot.png")

# AI 查看图片
view_image(image_path="screenshot.png")
```

### 等待元素

```python
# 等待页面加载
browser_use(action="wait_for", wait_time=2)

# 等待文本消失
browser_use(action="wait_for", text_gone="Loading...")
```

### 表单填写

```python
browser_use(action="fill_form", fields_json='{"name": "value", "email": "a@b.com"}')
```

### 文件上传

```python
browser_use(action="file_upload", paths_json='["C:\\path\\file.pdf"]')
```

---

## 反爬与绕过

### CAPTCHA

| 策略 | 效果 |
|:-----|:------|
| Headless 模式 | ❌ Google/Bing 必触发 |
| Headed 模式（可见窗口） | ✅ 大部分绕过 |
| CDP 连接已登录浏览器 | ✅ cookies 可跳过 |
| 设置 `--incognito` 参数 | ❌ 新窗口仍然触发 |
| 手动处理 + wait | ✅ 暂停等用户手动过验证 |

### 常见站点行为

| 站点 | Headless | Headed | 备注 |
|:-----|:---------|:-------|:------|
| Google 搜索 | ❌ CAPTCHA | ✅ | 搜图必须 headed |
| Baidu | ✅ | ✅ | 较宽松 |
| GitHub | ✅ | ✅ | API 不限浏览器模式 |
| PornHub | ✅ | ✅ | 无验证 |
| Reddit | ✅ | ✅ | 标准页面 |
| Cloudflare 站点 | ❌ | ⚠️ | 需要额外处理 |

---

## 浏览器参数

可以通过 `browser_args` 传递自定义 Chromium 启动参数：

```python
# 隐身模式
browser_use(action="start", browser_args="--incognito")

# 代理
browser_use(action="start", browser_args="--proxy-server=http://127.0.0.1:7890")
```

### 常见 Chromium 参数

| 参数 | 用途 |
|:-----|:------|
| `--incognito` | 无痕模式（不保存历史/cookies） |
| `--proxy-server=http://host:port` | 指定代理 |
| `--disable-web-security` | 关闭 CORS（开发调试） |
| `--disable-features=IsolateOrigins,site-per-process` | 减少内存占用 |
| `--no-sandbox` | Linux 下绕过沙箱 |
| `--disable-gpu` | 无 GPU 环境 |

---

## 运行时调试

### 查看控制台日志

```python
browser_use(action="console_messages")
# 查看 console.log/warn/error 输出
```

### 查看网络请求

```python
browser_use(action="network_requests")
# 查看发出的所有网络请求
```

### 执行 JavaScript

```python
# 返回结果
browser_use(action="eval", code="document.title")

# 执行不返回值
browser_use(action="run_code", code="console.log('hello')")
```

### 清除状态

```python
# 清除浏览器缓存
browser_use(action="clear_browser_cache")

# 管理 Cookies
browser_use(action="cookies_get")     # 获取所有 cookies
browser_use(action="cookies_set", ...) # 设置 cookies
browser_use(action="cookies_clear")    # 清除 cookies
```

---

## 常见故障

### 浏览器卡住/无响应

```python
# 停止当前浏览器实例
browser_use(action="stop")
# 重新启动
browser_use(action="start")
```

### CDP 连接失败

```python
# 确认端口开放
netstat -an | findstr :9222

# 确认浏览器启动时带了 --remote-debugging-port=9222
```

### 元素找不到

**原因**：页面未完全加载、iframe、动态渲染。
**解决**：
1. `wait_for(wait_time=3)` 等待页面加载
2. `snapshot` 重新获取 DOM
3. 检查是否在 iframe 中：`browser_use(frame_selector="iframe#main")`

### snapshot 输出太长

大型页面 snapshot 可能被截断。使用 `ref` 定位具体元素后
用 `screenshot` 查看可视状态。

---

## 相关页面

- [copaw-debugging](/docs/copaw-debugging) — CoPaw 调试知识库
- [mcp-debugging](/docs/mcp-debugging) — MCP 调试方法论
- [copaw-notes](/docs/copaw-notes) — CoPaw 平台知识库
- [hermes-web-pet](/docs/hermes-web-pet) — 桌面宠物（浏览器也是渲染引擎）

