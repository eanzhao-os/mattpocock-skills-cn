# Matt Pocock Agent Skills 中文版

本项目是 [mattpocock/skills](https://github.com/mattpocock/skills) 的中文翻译与精读指南。

📖 **在线阅读**：<https://eanzhao-os.github.io/mattpocock-skills-cn/>（由 `gh-pages` 分支持续部署）

收录了原仓库全部 37 个 Agent Skills 及 22 个 Companion 协议文档，提供中英双语对照、通俗意译与可直接跳转的完整导航，适合在使用 Claude Code / Cursor / Cline 等工具时作为技能（Skills）参考。

---

## 📌 项目说明

- **上游仓库**：[mattpocock/skills](https://github.com/mattpocock/skills)
- **版本快照**：基于 **2026 年 8 月 24 日** 上游仓库快照翻译整理（Commit [`6654f6b`](https://github.com/mattpocock/skills/commit/6654f6b) `feat: add 'Information access' category to retrospective skill`；*注：上游仓库后续若有演进变动，本项目不保证实时跟进同步*）。
- **涵盖范围**：全量 37 个主 Skill（`01`~`37`）+ 22 个 Companion 附属协议/规范文件，共计 59 篇文档。
- **阅读建议**：
  - 🌟 **首篇必读**：[01. ask-matt](./01-ask-matt.md) —— 先建立对整套体系的**全景路线图（Idea → Spec → Tickets → TDD → Implement）与阶段边界决策**的全局认知。
  - **核心闭环**：`02` ~ `14` —— 从工程脚手架配置到完整人机协作工程落地。
  - **横切支柱**：`15`（领域建模与 ADR）、`16`（深模块设计）、`19`（Wayfinder 复杂工程破局）。
  - **其他扩展**：按具体业务场景查阅（效能沟通、写作、脚手架等）。

---

## 🗂️ 分类分层（Bucket）

| 分类（Bucket） | 定位角色 | 推荐阅读优先级 |
|---|---|---|
| `engineering/` | 日常工程开发、Spec、Ticket、TDD、Review | 极高（核心主流程） |
| `productivity/` | 深度访谈澄清、Handoff 跨环境交接、教学 | 高 |
| `in-progress/` | 探索中 / 未完全定型的技能 | 中 |
| `misc/` | 辅助工具与脚手架（Git 护栏、Pre-commit 等） | 按需 |

---

## 📚 完整技能导航

### 🛠️ engineering/（工程核心主流程）

- `ask-matt` → [01. 技能全景路由与阶段边界](./01-ask-matt.md)（🌟 强烈推荐首篇阅读 / 导航总览）
- `setup-matt-pocock-skills` → [02. 工程环境脚手架](./02-setup-matt-pocock-skills.md)（实战接入前置）
- `grill-with-docs` → [05. 需求深度访谈与文档沉淀](./05-grill-with-docs.md)（主澄清入口）
- `to-spec` → [07. 对话转技术规范](./07-to-spec.md)
- `to-tickets` → [08. 规范拆解为工单](./08-to-tickets.md)
- `tdd` → [09. 测试驱动开发](./09-tdd.md)
- `implement` → [10. 单工单精准实现](./10-implement.md)
- `code-review` → [11. 严格代码审查](./11-code-review.md)
- `prototype` → [12. 交互式快速原型](./12-prototype.md)
- `research` → [13. 后台文献调研](./13-research.md)
- `diagnosing-bugs` → [14. 缺陷诊断与归因](./14-diagnosing-bugs.md)
- `domain-modeling` → [15. 领域建模与 ADR](./15-domain-modeling.md)（横切底层词汇）
- `codebase-design` → [16. 深模块设计哲学](./16-codebase-design.md)（架构底层词汇）
- `improve-codebase-architecture` → [17. 架构重构与报告](./17-improve-codebase-architecture.md)
- `triage` → [18. 工单分类与分诊](./18-triage.md)
- `wayfinder` → [19. 复杂工程迷局破局](./19-wayfinder.md)（超大规划）
- `wizard` → [20. 人工操作引导脚本](./20-wizard.md)
- `resolving-merge-conflicts` → [25. 代码合并冲突消解](./25-resolving-merge-conflicts.md)

### 💡 productivity/（效能与人机协作）

- `grill-me` → [03. 无状态通用深度访谈](./03-grill-me.md)
- `grilling` → [04. 访谈算法核心原语](./04-grilling.md)
- `handoff` → [06. 跨环境/跨 Harness 交接](./06-handoff.md)
- `wait-what` → [21. 沟通脱节即时纠偏](./21-wait-what.md)
- `writing-for-agents` → [22. 编写 Agent 友好文档](./22-writing-for-agents.md)
- `teach` → [23. 系统化交互式教学](./23-teach.md)
- `to-questionnaire` → [24. 逆向生成他人填写的问卷](./24-to-questionnaire.md)

### 🔬 in-progress/（探索与演进）

- `claude-handoff` → [26. Claude 专用交接](./26-claude-handoff.md)
- `loop-me` → [27. 持续循环反馈](./27-loop-me.md)
- `setup-ts-deep-modules` → [28. TypeScript 深模块脚手架](./28-setup-ts-deep-modules.md)
- `writing-beats` → [29. 节拍写作法](./29-writing-beats.md)
- `writing-fragments` → [30. 碎片写作法](./30-writing-fragments.md)
- `writing-shape` → [31. 结构形态写作法](./31-writing-shape.md)
- `implement-spec` → [36. 规范整体落地实现](./36-implement-spec.md)（多子代理并行实现一份 Spec）
- `retro` → [37. 编码会话复盘](./37-retro.md)（改进 Agent 运行环境）

### 📦 misc/（基础设施与工具）

- `git-guardrails-claude-code` → [32. Git 操作护栏](./32-git-guardrails-claude-code.md)
- `migrate-to-shoehorn` → [33. 迁移至 Shoehorn](./33-migrate-to-shoehorn.md)
- `scaffold-exercises` → [34. 编程练习题脚手架](./34-scaffold-exercises.md)
- `setup-pre-commit` → [35. 配置 pre-commit 检查](./35-setup-pre-commit.md)

---

## 🔄 同步记录

### 2026-09-04 · 同步至上游 2026-08-24 快照（`6654f6b`）

- **新增技能**：`implement-spec`（36，规范整体落地实现）、`retro`（37，编码会话复盘）。
- **技能迁移**：`wait-what` 由 `in-progress/` 转正至 `productivity/`。
- **内容修订**（同步至对应译文）：`grilling` 每轮问题间以水平线分隔；`grill-with-docs` 删除「单一写者」假设章节；`domain-modeling` 触发条件改为显式基于 `CONTEXT.md`/ADR 写入与术语讨论；`diagnosing-bugs` 子代理派发措辞中立化（harness-neutral）；`wizard` 描述重写为 model-invoked 定位；`ask-matt` 中 `prototype`（保留为 `prototype/<name>` 分支上的一手事实源）与 `improve-codebase-architecture`（survey 而非 rescue）定位更新；`wayfinder`「调查工单」改为「决策工单（decision tickets）」；`retro` 新增「信息访问（Information access）」复盘类别。
- **全仓库风格**：上游移除全部 em-dash、frontmatter description 含冒号者加引号，全部内嵌英文原文已同步刷新。
- **基线修正**：`setup-matt-pocock-skills` 的三篇 companion（`domain`、`issue-tracker-github`、`issue-tracker-gitlab`）此前翻译基线早于 2026-08-05 快照、整章缺失（Conventions、wayfinder:map 模型等），本次已按最新上游**整体重写补齐**。
- 上游删除了 `skills/personal/` 与 `skills/deprecated/` 下未收录技能，对本项目无影响。
