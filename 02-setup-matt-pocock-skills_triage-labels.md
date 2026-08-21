# 02-setup-matt-pocock-skills / triage-labels.md 精读

## Meta

| 字段 | 值 |
|---|---|
| 对应主 Skill | `02-setup-matt-pocock-skills` |
| bucket | engineering |
| 上游路径 | `skills/engineering/setup-matt-pocock-skills/triage-labels.md` |
| 角色定位 | 规范工单分流角色与实际标签映射字典（Canonical Triage Label Mapping） |
| 关联模块 | `18-triage`、`08-to-tickets` |

---

## 原文 (Markdown)

```markdown
# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.
```

---

## 中文翻译

# 规范工单分流角色与实际标签映射字典（Triage Labels）

在整个技能生态体系中，各个 Skill 均统一使用**五大约定分流角色（canonical triage roles）**进行抽象思考与流转。本文档负责将这些抽象角色无缝映射到当前代码仓库工单系统中所真实采用的具体标签字符串（Label strings）上。

---

## 角色与实际标签对照表

| 技能系统中的抽象角色名 | 当前仓库实际使用的工单标签 | 核心语义与适用场景 |
|---|---|---|
| `needs-triage` | `needs-triage` | **待分流**：维护者或分流 Agent 亟需介入评估该工单 |
| `needs-info` | `needs-info` | **等待信息补充**：正在等待报告人补充重现步骤、日志或澄清疑问 |
| `ready-for-agent` | `ready-for-agent` | **Agent 就绪**：技术规范已穷尽无遗漏，适合无人值守（AFK）Agent 独立动工 |
| `ready-for-human` | `ready-for-human` | **人工介入就绪**：涉及高度主观裁量或外部权限，必须由人类工程师亲自动手 |
| `wontfix` | `wontfix` | **不予处理**：超出当前项目范围、或已被判定为不可行并关闭 |

---

## 执行指南

- 当某个技能指示“赋予 AFK-ready 就绪标签”或类似分流指令时，查阅本表右侧对应的具体标签字符串进行标注；
- 每个具体代码仓库均可自由定制修改右侧的实际标签列，以完美匹配团队既有的工单标签体系与命名习惯。
