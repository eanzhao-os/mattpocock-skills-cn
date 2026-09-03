# 18-triage / AGENT-BRIEF.md 精读（Agent 任务执行简报编写规范（Writing Agent Briefs））

**Agent 执行简报（Agent Brief）**，是当一个工单或 PR 被分流打上 `ready-for-agent` 就绪标签时，以结构化评论的形式回贴在工单中的权威技术规范。它是无人值守（AFK）Agent 展开编码工作的唯一执行依据。原工单的正文和所有往来讨论仅作为参考背景 —— **唯有这份 Agent 简报才是具有约束力的最终契约**。

简报清晰陈述了 **Agent 应当完成什么**：
- 对于普通 Issue，是从零构建功能；
- 对于 Pull Request，是指**在既有 Diff 之上**完成剩余的收尾工作 —— 补齐边界、修复问题、回应审查意见。

无论 Issue 还是 PR，适用的都是同一套简报撰写原则。

---

## 1. 简报撰写的四大黄金原则（Principles）

### 原则一：经久耐用性高于瞬态精确性（Durability over precision）
工单在打上 `ready-for-agent` 后，可能会在待办队列中静止数天甚至数周。在此期间代码库会不断演进、文件可能被重命名或迁移。简报必须写得足够经久耐用，哪怕目录结构发生了重构依然有效：
- **必须**描述接口、类型与行为契约；
- **必须**明确指出 Agent 应当寻找或修改的具体类型名称、函数签名或配置形态；
- **严禁直接写死硬编码的具体文件路径**（文件路径极其容易随着时间腐化失效）；
- **严禁写死具体的代码行号（如第 42 行）**；
- **严禁假定当前的代码内部实现组织永远一成不变**。

### 原则二：聚焦业务行为，杜绝微操过程（Behavioral, not procedural）
清晰描述系统应当具备的**外部行为（WHAT）**，而不是具体怎么写（HOW）。Agent 在执行时会从零探查最新代码库并自主做出最优实现抉择：
- **优秀示范**：“`SkillConfig` 类型应增加一个可选的 `schedule` 字段，类型为 `CronExpression`”；
- *劣质反例*：“打开 `src/types/skill.ts` 并在第 42 行添加一个 schedule 字段”；
- **优秀示范**：“当用户无参运行 `/triage` 时，应看到需要跟进的工单汇总看板”；
- *劣质反例*：“在 main 处理器函数中加一个 switch 分支”。

### 原则三：穷尽无遗漏的验收判定清单（Complete acceptance criteria）
Agent 必须拥有极其清晰的完工判据。每份简报都必须给出具体、可测试的验收标准，且每一条都应可被独立验证：
- **优秀示范**：“运行 `gh issue list --label needs-triage` 能够正确返回经过初步分类的工单”；
- *劣质反例*：“让分流功能正常工作”。

### 原则四：显式画出范围红线（Explicit scope boundaries）
显式列出**超出本次范围（Out of scope）的禁令清单**。这是防止 Agent 自作聪明过度发挥（Gold-plating）或对临近特性擅自做出假设的唯一刹车闸。

---

## 2. 标准任务简报模板（Template）

```markdown
## Agent Brief

**Category:** bug / enhancement（缺陷修复 / 功能增强）
**Summary:** 一句话精炼概括待发生的核心变更

**Current behavior（当前既有行为）:**
清晰描述当前现状。对于 Bug 是当前的破坏表现；对于 Enhancement 是当前作为基础的既有现状。

**Desired behavior（预期达成行为）:**
清晰描述 Agent 完工后系统应具备的完整行为。对边缘情况和异常报错场景务必具体交代。

**Key interfaces（核心接口契约）:**
- `TypeName` 类型 — 需要发生什么变更以及原因
- `functionName()` 函数返回类型 — 当前返回什么 vs 预期应返回什么
- 配置形态 — 任何需要新增的配置项结构

**Acceptance criteria（验收标准清单）:**
- [ ] 具体且可独立测试验证的标准 1
- [ ] 具体且可独立测试验证的标准 2
- [ ] 具体且可独立测试验证的标准 3

**Out of scope（严禁触碰的范围外事项）:**
- 本次任务严禁修改或触碰的事项
- 看起来相关但实际属于独立演进的临近特性
```

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `18-triage` |
| bucket | engineering |
| 上游路径 | `skills/engineering/triage/AGENT-BRIEF.md` |
| 角色定位 | 面向无人值守 Agent 的任务执行简报编写契约（Agent Brief Specification） |
| 关联模块 | `18-triage`、`22-writing-for-agents`、`08-to-tickets` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# Writing Agent Briefs

An agent brief is a structured comment posted on a GitHub issue or PR when it moves to `ready-for-agent`. It is the authoritative specification that an AFK agent will work from. The original body and discussion are context — the agent brief is the contract.

The brief states **what the agent should do**, which stretches to both surfaces: for an issue, that's building the change from nothing; for a PR, it's what's left to do *to the existing diff* — finish it, close gaps, address review points. Same principles either way; the PR example below shows the difference.

## Principles

### Durability over precision

The issue may sit in `ready-for-agent` for days or weeks. The codebase will change in the meantime. Write the brief so it stays useful even as files are renamed, moved, or refactored.

- **Do** describe interfaces, types, and behavioral contracts
- **Do** name specific types, function signatures, or config shapes that the agent should look for or modify
- **Don't** reference file paths — they go stale
- **Don't** reference line numbers
- **Don't** assume the current implementation structure will remain the same

### Behavioral, not procedural

Describe **what** the system should do, not **how** to implement it. The agent will explore the codebase fresh and make its own implementation decisions.

- **Good:** "The `SkillConfig` type should accept an optional `schedule` field of type `CronExpression`"
- **Bad:** "Open src/types/skill.ts and add a schedule field on line 42"
- **Good:** "When a user runs `/triage` with no arguments, they should see a summary of issues needing attention"
- **Bad:** "Add a switch statement in the main handler function"

### Complete acceptance criteria

The agent needs to know when it's done. Every agent brief must have concrete, testable acceptance criteria. Each criterion should be independently verifiable.

- **Good:** "Running `gh issue list --label needs-triage` returns issues that have been through initial classification"
- **Bad:** "Triage should work correctly"

### Explicit scope boundaries

State what is out of scope. This prevents the agent from gold-plating or making assumptions about adjacent features.

## Template

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** one-line description of what needs to happen

**Current behavior:**
Describe what happens now. For bugs, this is the broken behavior.
For enhancements, this is the status quo the feature builds on.

**Desired behavior:**
Describe what should happen after the agent's work is complete.
Be specific about edge cases and error conditions.

**Key interfaces:**
- `TypeName` — what needs to change and why
- `functionName()` return type — what it currently returns vs what it should return
- Config shape — any new configuration options needed

**Acceptance criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] Specific, testable criterion 3

**Out of scope:**
- Thing that should NOT be changed or addressed in this issue
- Adjacent feature that might seem related but is separate
```

## Examples

### Good agent brief (bug)

```markdown
## Agent Brief

**Category:** bug
**Summary:** Skill description truncation drops mid-word, producing broken output

**Current behavior:**
When a skill description exceeds 1024 characters, it is truncated at exactly
1024 characters regardless of word boundaries. This produces descriptions
that end mid-word (e.g. "Use when the user wants to confi").

**Desired behavior:**
Truncation should break at the last word boundary before 1024 characters
and append "..." to indicate truncation.

**Key interfaces:**
- The `SkillMetadata` type's `description` field — no type change needed,
  but the validation/processing logic that populates it needs to respect
  word boundaries
- Any function that reads SKILL.md frontmatter and extracts the description

**Acceptance criteria:**
- [ ] Descriptions under 1024 chars are unchanged
- [ ] Descriptions over 1024 chars are truncated at the last word boundary
      before 1024 chars
- [ ] Truncated descriptions end with "..."
- [ ] The total length including "..." does not exceed 1024 chars

**Out of scope:**
- Changing the 1024 char limit itself
- Multi-line description support
```

### Good agent brief (enhancement)

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Add `.out-of-scope/` directory support for tracking rejected feature requests

**Current behavior:**
When a feature request is rejected, the issue is closed with a `wontfix` label
and a comment. There is no persistent record of the decision or reasoning.
Future similar requests require the maintainer to recall or search for the
prior discussion.

**Desired behavior:**
Rejected feature requests should be documented in `.out-of-scope/<concept>.md`
files that capture the decision, reasoning, and links to all issues that
requested the feature. When triaging new issues, these files should be
checked for matches.

**Key interfaces:**
- Markdown file format in `.out-of-scope/` — each file should have a
  `# Concept Name` heading, a `**Decision:**` line, a `**Reason:**` line,
  and a `**Prior requests:**` list with issue links
- The triage workflow should read all `.out-of-scope/*.md` files early
  and match incoming issues against them by concept similarity

**Acceptance criteria:**
- [ ] Closing a feature as wontfix creates/updates a file in `.out-of-scope/`
- [ ] The file includes the decision, reasoning, and link to the closed issue
- [ ] If a matching `.out-of-scope/` file already exists, the new issue is
      appended to its "Prior requests" list rather than creating a duplicate
- [ ] During triage, existing `.out-of-scope/` files are checked and surfaced
      when a new issue matches a prior rejection

**Out of scope:**
- Automated matching (human confirms the match)
- Reopening previously rejected features
- Bug reports (only enhancement rejections go to `.out-of-scope/`)
```

### Good agent brief (PR)

For a PR, "Current behavior" describes the state of the diff, and the brief asks the agent to finish or fix it rather than build from scratch.

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Finish the contributor's `--json` output flag for `triage list`

**Current behavior:**
The PR adds a `--json` flag that serializes the issue list to JSON. The happy
path works and the diff matches the project's command structure. Two gaps
remain: errors are still printed as human text (not JSON), and the new flag has
no test coverage.

**Desired behavior:**
With `--json`, all output — including errors — is well-formed JSON on stdout,
and the command's exit codes are unchanged. The existing human-readable output
is untouched when the flag is absent.

**Key interfaces:**
- The command's error path should emit `{ "error": string }` under `--json`
  instead of the plain-text error
- Reuse the existing serializer the PR already added; don't introduce a second

**Acceptance criteria:**
- [ ] `triage list --json` emits valid JSON for both success and error cases
- [ ] Exit codes match the non-JSON command
- [ ] A test covers the `--json` success output and one error case
- [ ] Default (non-JSON) output is byte-for-byte unchanged

**Out of scope:**
- Adding `--json` to any other command
- Changing the JSON shape of the success payload the PR already defined
```

### Bad agent brief

```markdown
## Agent Brief

**Summary:** Fix the triage bug

**What to do:**
The triage thing is broken. Look at the main file and fix it.
The function around line 150 has the issue.

**Files to change:**
- src/triage/handler.ts (line 150)
- src/types.ts (line 42)
```

This is bad because:
- No category
- Vague description ("the triage thing is broken")
- References file paths and line numbers that will go stale
- No acceptance criteria
- No scope boundaries
- No description of current vs desired behavior
````

</details>
