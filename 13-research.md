# 13. research（research（一手资料深度调研））

```yaml
name: research
description: 对照高信任的一手权威资料（primary sources）深入调研一个问题，并将调研发现记录为代码库中的 Markdown 文件。当用户希望调研某个主题、收集官方文档或 API 客观事实、或把长篇文献阅读工作委派给后台 Agent 时使用。
```

启动一个**后台子代理（background agent）**去开展资料调研，以便在其查阅阅读的同时，你可以继续推进手头的主线工作。

它的核心职责：

1. **严格对照一手权威资料（primary sources）调查问题** —— 查阅官方文档、原始源代码、技术规范与第一方 API 协议 —— 绝不采信任何未经核实的二手博客或网文转述。每一项结论断言，都必须能够沿着线索追溯到拥有该结论的权威源头。
2. **将调研发现汇总写入一份单独的 Markdown 文件**，并为每一条事实断言明确标注其引用的原始出处。
3. **将文件保存在代码库已有类似笔记的规范目录中**；始终契合项目现有的目录约定，如果没有现成约定，将其存放在合理的目录中并明确告知用户具体路径。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/research/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/research |
| name | `research` |
| 触发 | description：对照高信任 primary sources 调查问题，并将发现写成仓内 Markdown；用户要研究 topic、收集 docs/API 事实、或把阅读 legwork 委派给 background agent |
| 调用策略 | 默认可触发（无 disable-model-invocation） |
| companions | 无独立 companion 文件 |
| 执行形态 | **Background agent** 做研究；主会话继续工作 |
| 产出 | 单份 Markdown，每条 claim 引用 primary source；落点跟仓内既有 convention |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** — official docs, source code, specs, first-party APIs — not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
```

</details>
