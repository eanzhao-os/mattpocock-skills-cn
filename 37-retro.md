# 37. retro（编码会话复盘）

```yaml
name: retro
description: 对一次编码会话进行复盘（retrospective），产出针对 Agent 运行环境的改进建议。
disable-model-invocation: true
```

用户已经提出要做一次**复盘（retrospective）**。你此刻的任务，是针对编码 Agent 的**运行环境（environment）**提出改进建议，让未来的运行表现更好。

## 执行步骤（Steps）

1. 先通过 Skill 工具调用 [22. 编写 Agent 友好文档](./22-writing-for-agents.md)（`writing-for-agents`），获取写作风格指南。

2. 阅读用户所指定的那次会话的一手材料（primary sources）—— 这可能意味着要在这台机器上翻查会话日志。如果用户没有指定会话，默认复盘当前会话。

3. 从以下类别中寻找改进候选项。

- **导航（Navigation）**：Agent 找到正确文件有多容易？文件之间是否存在隐式依赖？加一条**导航指针（navigation pointer）**会不会让查找更轻松？*适用条件（Use when）*：这次会话花了很长时间才找到某条信息。
- **自动化检查（Automated checks）**：有没有本可以拦下 Agent 所犯错误的自动化检查？Lint、类型检查、测试、文件系统 linter？*适用条件*：Agent 犯了一个本可被自动化检查捕获的错误。
- **编码规范（Coding standards）**：是否应该给**评审者 Agent（reviewer agent）**增加一条由它执行的新规则？是否应该删除或澄清某条现有规则？*适用条件*：评审者 Agent 未能拦下某个错误。
- **全局 AGENTS.md**：有没有本应迁移到编码规范（或自动化检查）中的引导指令（steering instructions）？*适用条件*：AGENTS.md 文件过于庞大 —— 无论是在仓库中，还是在用户的全局作用域中。
- **工具开销（Tool economy）**：Agent 是否发起过本可精简的高成本工具调用？有没有格外耗费 token 的自定义工具（CLI、MCP）？*适用条件*：Agent 发起过一次昂贵的工具调用。
- **空转指令（No-ops）**：寻找引导文件（steering files）中那些并不会真正改变 Agent 行为的指令。*适用条件*：引导文件庞大而臃肿。
- **信息访问（Information access）**：寻找扩大 Agent 信息获取面的机会 —— 比如用 tee 留存 dev server 日志、为第三方服务开通只读访问。*适用条件*：有一条关键信息当时根本不在 Agent 的可及范围之内。

4. 将这些候选改进项按严重程度排序后呈现给用户。

## 参考准则（Reference）

### 实现阶段与评审阶段（Implementation vs Review）

请记住，所有工作都要经历两个阶段：实现（implementation）与评审（review）。实现阶段的 Agent 承受着最大的**上下文压力（context pressure）** —— 探索、编写代码、调试失败，全都由它一肩挑起。

评审阶段的 Agent 上下文压力最小 —— 它收到的是一份现成的 diff，无需探索，通常也不必编写代码或调试。

因此，负责施加编码规范的应当是评审 Agent，而不是实现 Agent。

### 相关文件（Files）

仓库中有以下几个文件可供你使用：

- `CLAUDE.md` / `AGENTS.md`：这些文件会被推入任何一个在本仓库中工作的 Agent 的上下文窗口。使用它们时应当极其克制 —— 通常只应放置指向其他文件的**导航指针（navigation pointers）**。
- `CODING_STANDARDS.md`：这份文件在评审阶段被读取，而非实现阶段。一旦规范文件超过 1,000 行，就应添加指向 docs 目录的**导航指针**。
- 文档（Docs）：把文档用作参考文件，由其他文件指向引用。在编写新文档之前，先找找是否已有现成的。
- 技能（Skills）：用技能来承载文档（因为技能的 description 会进入 Agent 的上下文窗口），或承载用户主动调用的命令。请遵循 [22. 编写 Agent 友好文档](./22-writing-for-agents.md)（`writing-for-agents`）技能中的建议。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `in-progress/retro` |
| bucket | in-progress |
| 上游 | https://github.com/mattpocock/skills |
| companion | 无独立 companion |
| 触发 | 对一次编码会话做复盘，改进 Agent 运行环境 |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |
| 状态 | **未定型，吸收优先级低** |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs.

## Steps

1. Call the Skill tool with `writing-for-agents` for the writing style guide.

2. Read the primary sources for the session the user specifies. This may mean searching through session logs on this machine. If the user doesn't specify a session, default to the current one.

3. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? _Use when_ the agent made a mistake that could have been caught by an automated check.
- **Coding standards**: should the **reviewer agent** be given a new rule to enforce? Should an existing rule be removed or clarified? _Use when_ the reviewer agent failed to catch a mistake.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

4. Present these candidates to the user, in order of severity.

## Reference

### Implementation vs Review

Remember that all work goes through two stages: implementation and review. The implementation agent has the most **context pressure**. They are responsible for exploration, writing code, and debugging failures.

The review agent has the least context pressure - it receives a diff, so no exploration needed. It often does not need to write code or debug.

This means that the review agent should be responsible for imposing coding standards, not the implementation agent.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: this file is read during review, not implementation. Add **navigation pointers** to docs folders if the standards file gets more than 1,000 lines long.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands. Follow the advice in the `writing-for-agents` skill.
```

</details>
