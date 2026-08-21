# 15. domain-modeling

## Meta（bucket/path/url/触发方式/companions）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/domain-modeling/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling |
| name | `domain-modeling` |
| 触发方式 | description：钉死 domain 术语 / ubiquitous language、记录架构决策、或其他 skill 需要维护 domain model 时（model-invoked） |
| companions | [CONTEXT-FORMAT.md](./15-domain-modeling_CONTEXT-FORMAT.md)、[ADR-FORMAT.md](./15-domain-modeling_ADR-FORMAT.md)——本页只列角色，不全文翻译 |
| 产物 | 根或 context 内 `CONTEXT.md`（glossary）；`docs/adr/`（决策，按需） |
| 消费方 | `grill-with-docs`、`to-spec`、`to-tickets`、`tdd`、`triage`、`wayfinder`、`improve-codebase-architecture` 等几乎所有 engineering skill |

## 原文 (SKILL.md)

```markdown
---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* `CONTEXT.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./15-domain-modeling_CONTEXT-FORMAT.md).

`CONTEXT.md` should be totally devoid of implementation details. Do not treat `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./15-domain-modeling_ADR-FORMAT.md).
```

## 中文翻译

```yaml
name: domain-modeling
description: 主动构建并打磨项目的领域模型（domain model）。当用户希望敲定领域术语或通用统一语言（ubiquitous language）、记录架构决策、或当其他 skill 需要维护领域模型时触发。
```

# Domain Modeling（领域建模与统一语言维护）

在设计过程中，**主动**构建并不断打磨项目的领域模型。这是一项**积极介入**的工程纪律 —— 主动质疑模糊术语、构思极端边界场景、并在词汇与决策一旦成型的瞬间立刻将其落盘为词汇表和架构决策记录。（仅仅在调用其他 skill 时为了获取术语而*阅读* `CONTEXT.md` 并不属于本 skill —— 那是任何 skill 都可以顺带做的一行常规操作。本 skill 专门用于当你需要**改变和演进领域模型**、而不仅是被动**消费**它的时候。）

## 文件与目录结构

绝大部分单体代码仓库只有单个领域上下文：

```
/
├── CONTEXT.md                    ← 领域词汇表（Glossary）
├── docs/
│   └── adr/                      ← 架构决策记录（ADRs）
└── src/
```

如果代码库根目录下存在 `CONTEXT-MAP.md`，说明该仓库拥有多个限界上下文（Bounded Contexts）。上下文地图（Context Map）会指向各个上下文的具体存放位置：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                      ← 全局系统级决策
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md            ← 订单上下文词汇表
│   │   └── docs/adr/             ← 订单上下文特定决策
│   └── billing/
│       ├── CONTEXT.md            ← 计费上下文词汇表
│       └── docs/adr/
```

**按需惰性创建（Lazy）** —— 只有当你确实有内容要写入时才去创建对应文件。如果尚未存在 `CONTEXT.md`，在厘清并敲定第一个领域术语时顺手创建。如果尚未存在 `docs/adr/`，在需要记录第一篇 ADR 时顺手创建。

## 会话进行期间的核心介入动作

### 1. 对照既有词汇表主动质疑（Challenge against the glossary）
当用户使用的术语与 `CONTEXT.md` 中已经记录的定义发生冲突时，立刻指出来。例如：“在你的词汇表中，‘cancellation（取消）’ 被定义为 X，但你刚才的表述似乎是指 Y —— 究竟应该以哪一个为准？”

### 2. 澄清打磨模糊或过载的语言（Sharpen fuzzy language）
当用户使用模糊不清或职责过载的术语时，主动提议一个精确且权威的规范词汇。例如：“你刚才使用了 ‘account（账户）’ 这个词 —— 你指的是 Customer（客户主体）还是 User（登录用户）？在我们的领域中这两者是截然不同的概念。”

### 3. 构造具体场景进行压力测试（Discuss concrete scenarios）
在讨论领域概念之间的关系时，用极其具体的业务场景对其进行压力测试。主动构思那些能够刺探边界情况的具体用例，迫使用户在概念的划分与边界上给出毫不含糊的精确定义。

### 4. 与现有代码进行交叉印证（Cross-reference with code）
当用户口述某项业务应该如何运作时，主动核对当前的代码实现是否真的如此。一旦发现矛盾，立刻摆到台面上：“你的现有代码实现是直接取消整张订单（Order），但你刚才说应该支持部分取消 —— 哪一个是正确的发展方向？”

### 5. 实时原位更新 CONTEXT.md（Update CONTEXT.md inline）
当一个领域术语达成一致后，**当场立刻**更新 `CONTEXT.md`。不要攒到最后批量写 —— 达成一项就记录一项。格式严格遵循 [CONTEXT-FORMAT.md](./15-domain-modeling_CONTEXT-FORMAT.md)。

`CONTEXT.md` 中**绝对不能包含任何具体的代码实现细节**。切勿将 `CONTEXT.md` 当成需求规范、草稿备忘录、或实现决策的垃圾桶。**它只是一份纯粹的领域词汇表，除此之外什么都不是。**

### 6. 极度克制地提出编写 ADR（Offer ADRs sparingly）
只有当且仅当以下三项条件**全部满足**时，才向用户提议创建 ADR：
1. **难以逆转（Hard to reverse）** —— 如果日后想要推翻此决定并改变主意，需要付出极其高昂的实质性代价；
2. **缺乏背景时令人困惑（Surprising without context）** —— 未来的接手者如果不了解当时的历史背景，会本能地产生疑问：“他们当初为什么要这么做？”；
3. **真实权衡取舍的结果（The result of a real trade-off）** —— 明确存在真实可行的其他替代方案，而你们因为非常具体的理由最终权衡挑选了当前这一种。

如果以上三项中缺少任何一项，直接跳过 ADR 的创建。编写格式严格遵循 [ADR-FORMAT.md](./15-domain-modeling_ADR-FORMAT.md)。
