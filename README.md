# Matt Pocock Agent Skills 中文版

本项目是 [mattpocock/skills](https://github.com/mattpocock/skills) 的中文翻译与精读指南。

收录了原仓库全部 35 个 Agent Skills 及 22 个 Companion 协议文档，提供中英双语对照、通俗意译与可直接跳转的完整导航，适合在使用 Claude Code / Cursor / Cline 等工具时作为技能（Skills）参考。

---

## 📌 项目说明

- **上游仓库**：[mattpocock/skills](https://github.com/mattpocock/skills)
- **版本快照**：基于 **2026 年 8 月 8 日** 上游仓库快照翻译整理（紧接 2026-08-05 的 Commit [`355fa74`](https://github.com/mattpocock/skills/commit/355fa74) `feat: add wait-what`；*注：上游仓库后续若有演进变动，本项目不保证实时跟进同步*）。
- **涵盖范围**：全量 35 个主 Skill（`01`~`35`）+ 22 个 Companion 附属协议/规范文件，共计 57 篇文档。
- **阅读建议**：按编号 `01` 到 `35` 循序渐进阅读：
  - **核心必读**：`01` ~ `14`（构建完整 Idea → Spec → Tickets → TDD → Implement → Review 工程主闭环）
  - **横切支柱**：`15`（领域建模）、`16`（深模块设计）、`19`（Wayfinder 复杂工程破局）
  - **其他扩展**：按具体场景查阅（效能沟通、写作、脚手架等）。

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

- `setup-matt-pocock-skills` → [01. 工程环境脚手架](./01-setup-matt-pocock-skills.md)（前置必读）
- `ask-matt` → [02. 技能全景路由与阶段边界](./02-ask-matt.md)（导航总览）
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

### 📦 misc/（基础设施与工具）

- `git-guardrails-claude-code` → [32. Git 操作护栏](./32-git-guardrails-claude-code.md)
- `migrate-to-shoehorn` → [33. 迁移至 Shoehorn](./33-migrate-to-shoehorn.md)
- `scaffold-exercises` → [34. 编程练习题脚手架](./34-scaffold-exercises.md)
- `setup-pre-commit` → [35. 配置 pre-commit 检查](./35-setup-pre-commit.md)
