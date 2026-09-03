# 07. to-spec（归纳生成需求规范）

```yaml
name: to-spec
description: 将当前对话内容整理归纳为一份需求规范（spec），并发布到项目的工单跟踪系统 —— 无需再次访谈，仅综合梳理你们已经讨论过的所有结论。
disable-model-invocation: true
```

本 skill 读取当前的对话上下文以及对代码库的理解，直接生成一份需求规范（spec）。**切勿再次向用户发起访谈或盘问** —— 仅忠实综合提炼你已经掌握的所有信息。

工单系统（issue tracker）与分类标签（triage labels）的词汇表应该已经预先配置完毕 —— 如果尚未配置，请先运行 `/setup-matt-pocock-skills`。

## 流程

1. **探索代码库**：如果之前尚未探索，先摸清代码库的现状。在整篇需求规范中，始终使用项目的领域词汇表（domain glossary），并遵循所触及区域已有的架构决策记录（ADRs）。
2. **拟定测试切入接缝（Seams）**：构思将用于测试该功能特性的测试接缝。优先使用代码库现有的接缝，尽量在最顶层的接缝进行测试。如果必须新增接缝，也请在尽可能高的层级提出。整个代码库上的测试接缝越少越好 —— **最理想的数量是仅有一个统一接缝**。  
   向用户确认这些接缝设计是否符合他们的预期。
3. **编写并发布规范**：根据下方模板编写需求规范，并将其发布到项目的工单系统中。为该工单直接打上 `ready-for-agent` 标签 —— 无需再进行额外的分类分流（triage）。

### 需求规范模板（Spec Template）

```markdown
## Problem Statement（问题陈述）
从最终用户的视角，清晰描述用户当前所面临的核心问题与痛点。

## Solution（解决方案）
从最终用户的视角，描述用于解决上述问题的整体方案。

## User Stories（用户故事）
一份详尽且编号的完整用户故事列表。每个故事的格式应为：
1. 作为一个 <角色 actor>，我希望 <功能 feature>，以便于 <价值 benefit>。

   示例：作为一名手机银行客户，我希望查看名下账户的余额，以便更好地做出消费决策。

（该列表应极其详尽全面，覆盖该功能特性的方方面面。）

## Implementation Decisions（实现决策）
在前期讨论中已经敲定的技术实现决策列表。可包含：
- 即将构建或修改的具体模块
- 这些模块即将被修改的接口定义
- 来自开发者的技术细节澄清
- 核心架构设计决策
- 数据库 Schema / 结构变更
- API 协议契约与交互细节

注意：**不要包含具体的文件路径或代码片段**，因为它们往往会极其迅速地过时失效。  
*例外情况*：如果之前的原型（prototype）产出了某段比自然语言文字更能精确编码决策的代码片段（例如状态机 state machine、状态规约函数 reducer、Schema 定义、或核心类型声明），可以将该片段内联到对应的决策项中，并简要注明其来自原型。只保留富含决策信息的核心部分 —— 不需要贴出完整的可运行演示，只需关键结构。

## Testing Decisions（测试决策）
已确定的测试策略列表，包含：
- 什么是高质量的测试（只验证外部可观察行为，不测内部实现细节）
- 哪些模块将被覆盖测试
- 代码库中已有的同类测试范式（Prior Art）

## Out of Scope（不在范围之内）
明确界定并列出本次需求规范中明确不做的事项与边界。

## Further Notes（补充说明）
关于该功能的任何其他补充说明或上下文。
```

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `engineering`
- path: `skills/engineering/to-spec/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/to-spec
- 触发方式：`disable-model-invocation: true` → **user-invoked only**
- companion 文件：
  - `agents/openai.yaml`

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: to-spec
description: Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user — just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the spec using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
```

</details>
