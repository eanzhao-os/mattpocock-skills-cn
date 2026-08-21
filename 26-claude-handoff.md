# 26 claude-handoff 精读（Claude Handoff（派发后台接力 Agent））

```yaml
name: claude-handoff
description: 将当前对话会话无缝交接给一个即刻接手工作的全新后台 Agent（background agent）。
argument-hint: "下一个会话将主要用于做什么？"
disable-model-invocation: true
```

撰写一份当前会话的交接总结（handoff summary），以便一个崭新的 Agent 能够无缝接力继续推进工作。**不同于将其保存为静态文件**，而是直接启动一个以该交接总结作为初始 Prompt 提示词的后台 Agent：`claude --bg --name "<描述性名称>" "<交接总结>"`。它在当前工作目录下启动并立即返回控制权；用户可以通过 `claude agents` 命令对其进行管理。

始终通过 `-n` / `--name` 传入一个具有清晰业务含义的名称（例如 `--name "修复登录缺陷"`） —— 这将决定任务列表、会话选择器以及终端标题中显示的直观名称。

在交接总结中**必须包含一个 “建议调用的技能（suggested skills）” 章节**，明确建议接班的 Agent 应当主动激活哪些 skill。

**严禁重复复制已经在其他工件中记录过的内容**（包括 spec 规范、执行计划、ADR 决策记录、工单、Git 提交记录、代码 diff 等）。改为直接通过文件路径或 URL 链接进行精准引用。

**严格脱敏一切敏感机密信息** —— 包括 API 密钥、数据库密码或个人隐私数据 —— 因为该交接总结将直接暴露为新 Agent 的初始提示词。

如果用户在调用时传入了参数，将其视为下一个会话应当聚焦的核心任务描述，并据此针对性裁剪交接总结的内容。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `in-progress/claude-handoff` |
| bucket | in-progress |
| 上游 | https://github.com/mattpocock/skills |
| companion | 无写作 companion |
| 触发 | 把当前对话交给立刻开工的 fresh background agent |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |
| 状态 | **未定型，吸收优先级低** |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```md
---
name: claude-handoff
description: Hand the current conversation off to a fresh background agent that picks up the work immediately.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff summary of the current conversation so a fresh agent can continue the work. Instead of saving it, launch a background agent seeded with the summary as its prompt: `claude --bg --name "<descriptive name>" "<handoff summary>"`. It starts in the current working directory and returns immediately; the user manages it with `claude agents`.

Always pass `-n`/`--name` with a descriptive name (e.g. `--name "Fix login bug"`) — it sets the display name shown in the job list, session picker, and terminal title.

Include a "suggested skills" section in the summary, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information — the summary becomes the agent's prompt.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the summary accordingly.
```

</details>
