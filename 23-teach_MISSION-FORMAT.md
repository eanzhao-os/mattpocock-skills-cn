# 23-teach / MISSION-FORMAT.md 精读（教学核心使命文档格式规范（MISSION.md Format））

## 1. 标准极简模板（Template）

```markdown
# 学习使命：{具体学习主题}

## 为什么学（Why）
{用 1 到 3 句话交代：用户正在追逐的现实世界具体目标是什么？一旦掌握了这项技能，他们的生活或工作将发生什么切实改变？杜绝像“为了理解 X”这种虚头巴脑的抽象表述 —— 必须死磕到底层的实质产出结果。}

## 成功的具体模样（Success looks like）
- {学员届时能够独立完成的一项具体、可观察的真实成果}
- {另一项具体可验证的能力体现}
- {……}

## 现实约束边界（Constraints）
- {可用时间、预算、既有承诺、学习风格偏好，以及任何限制推进路径的客观约束}

## 超出范围清单（Out of scope）
- {学员当前阶段显式拒绝涉足的临近扩展主题 —— 坚决捍卫学员的“最近发展区（ZPD）”不被超纲内容冲垮}
```

---

## 2. 编写铁律（Rules）

- **单个工作区内有且仅有一份使命（One mission per workspace）**：如果用户想学两门毫不相干的知识，请将其拆分为两个独立的工作区；
- **具象结果彻底碾压抽象口号（Concrete over abstract）**：“在 10 月前跑完一次半程马拉松”彻底碾压“变得更健康”；“为团队交付一个可运行的 Rust CLI 工具”彻底碾压“学习 Rust 语言”；
- **坚决反击模糊不清的企图（Push back on vagueness）**：如果学员说不清自己到底为什么想学，在动手写下任何字句前必须展开深度追问访谈。**一份模糊低劣的使命比完全没有使命还要糟糕百倍**；
- **随现实变化动态修订（Revise when reality shifts）**：目标会随着认知深化而迁移。一旦学员的终极愿景发生漂移，立即就地更新本文件 —— 绝不允许一份过时的陈旧使命继续误导未来的教学会话；
- **篇幅必须极其短小克制（Keep it short）**：如果 `MISSION.md` 的长度超过了一屏，它就已经不再是定海神针般的罗盘，而是退化为了一份僵死的计划表。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `23-teach` |
| bucket | productivity |
| 上游路径 | `skills/productivity/teach/MISSION-FORMAT.md` |
| 角色定位 | 教学工作区核心目标文档规范（MISSION.md Specification） |
| 关联模块 | `23-teach`、`24-to-questionnaire` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# MISSION.md Format

## Template

```md
# Mission: {Topic}

## Why
{1-3 sentences. The concrete real-world goal the user is chasing. What changes in their life or work when they have this skill? Avoid abstract framings like "to understand X" — push for the underlying outcome.}

## Success looks like
- {A specific, observable thing the user will be able to do}
- {Another specific thing}
- {…}

## Constraints
- {Time, budget, prior commitments, learning preferences, anything that bounds the approach}

## Out of scope
- {Adjacent topics the user explicitly does not want to chase right now — protects the zone of proximal development}
```

## Rules

- **One mission per workspace.** If the user wants to learn two unrelated things, that is two workspaces.
- **Concrete over abstract.** "Run a half marathon by October" beats "get fitter." "Ship a Rust CLI to my team" beats "learn Rust."
- **Push back on vagueness.** If the user cannot articulate why, interview them before writing anything. A bad mission is worse than no mission.
- **Revise when reality shifts.** Missions change. When the user's goal moves, update this file — don't leave a stale mission steering future sessions.
- **Keep it short.** If `MISSION.md` runs past a screen, it has stopped being a compass and started being a plan.
````

</details>
