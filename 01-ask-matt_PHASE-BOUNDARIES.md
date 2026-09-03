# 01-ask-matt / PHASE-BOUNDARIES.md 精读（阶段边界决策树与上下文管理哲学（Phase Boundaries））

所谓 **阶段（Phase）**，是指一次 Agent 交互会话内部的一大块独立工作单元 —— 例如前期的深度访谈（Grilling）、中期的代码实现（Implementation）、或后期的质量保证（QA）。这个定义故意保持适度的模糊性：当你心中闪过 *“好了，这部分工作已经搞定了”* 的念头时，一个阶段便宣告结束。

所谓 **阶段边界（Phase boundary）**，正是连接前后两个阶段的交接缝隙 —— **这也是唯一允许做出上下文切换决策的法定时刻**。在阶段推进的**正中间（Mid-phase）**，不存在任何切换决策可言 —— 要么一鼓作气继续执行，要么将剩余工作拆解派发给子代理。**在阶段中途盲目执行上下文压缩（compact），必然会导致 Agent 彻底迷失思路**。

---

## 阶段边界的五大核心操作选项

| 操作选项 | 核心行为与底层机制 |
|---|---|
| **原地继续（Continue）** | 停留在当前会话内继续推进。完全零上下文切换开销。 |
| **清屏重开（`/clear`）** | 彻底清空当前上下文窗口，从零开始开启崭新会话。 |
| **交接归档（`/handoff`）** | 编写一份可自由移植的 Markdown 交接文件，可在任意新环境中直接播种启动新会话。 |
| **派发子代理（Subagent）** | 将特定子任务派发到其独立的上下文窗口中静默执行，随后仅收回精简的执行报告。 |
| **会话压缩（`/compact`）** | 提炼压缩当前上下文，并以生成的摘要为种子在当前环境就地启动新会话。 |

---

## 阶段边界有序决策树（从上到下单向判断，首个命中即终结）

在阶段边界处，严格从第 1 题开始自顶向下依次判定，**只要遇到第一个得出“是（Yes）”的选项，立即作为最终决断并停止后续判断**：

### 1. 你能直接在当前会话中继续推进吗？（Can you continue?）
满足以下两条之一即可判定为“是”：
- 下一个阶段需要将当前阶段的完整交互过程作为**一手事实源（Primary source）**；
- 你的上下文窗口中仍保有充足的**智能黄金区（[Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)，约剩余 150k tokens 的充裕空间）**，足以完整容纳下一阶段的全部开销。

*典型范例*：从“深度访谈（Grilling）”进入“实施（Implementation）”是标准的 Continue 场景 —— 代码实现阶段极度需要前文访谈推导的原汁原味细节，而不是被二道贩子压缩过的抽象摘要。**原地继续既不消耗压缩时间，也绝不丢失任何信息**，因此必须最优先考虑它。

### 2. 既有上下文是否与接下来的工作毫无关联？（Is context irrelevant?）
如果当前会话中的一切内容 —— 包括早期的发散探索、各项临时决定、排查碰壁的死胡同 —— 对下一步彻底失去了参考价值，果断执行 **`/clear`**。
这是棋盘上成本最低廉的招式：它瞬间执行完毕，且把一整个纯净完整的上下文窗口交还给你。更重要的是，`/clear` 并非毁灭性的，旧会话依然在历史记录中随时可回溯。

> [!WARNING]
> **做错此决定的代价是不可逆的单向损失**。如果你误清空了一个包含关键背景的会话，你将永远丢失这套代码当初为何如此构建的**核心原因（the why）** —— 后续哪怕反复研读 Git Diff，也绝不可能将其完美还原。

### 3. 你是否需要进行跨边界交接？（Do you need to hand off?）
`/handoff` 的适用场景极其窄小且严苛。你**只有**在满足以下特定条件之一时才需要使用它：
- 切换到**全新运行平台（Harness）**（例如从 Claude 切换到 Codex / 终端环境）；
- 跨越到**全新的项目目录或代码仓库**；
- 将当前工作无缝移交给**人类同事**；
- 在**阶段中途**偶然发现了一项旁路分支任务，需要将其分叉出去执行，而绝不干扰当前的主线心流。

上述清单即是全部适用场景。`/handoff` 买来的是**跨环境的便携移植性（Portability）** —— 一份可以到处流转的独立文件。如果没有任何内容需要跨环境迁移，你根本不需要它。

### 4. 目标任务能否在无人值守下独立完成？（Can the task be done AFK?）
该任务的边界是否清晰到哪怕你离开键盘、不进行任何实时微操介入，Agent 也能完全自主跑通？
如果可以，将其派发给**子代理（Subagent）**，当前主会话保持不动。
*典型范例*：自动化代码审查 —— Agent 独立阅读 Diff 并汇总提交报告，在此期间完全不需要人类在场。

### 5. 若上述全不满足，执行会话压缩（Otherwise, `/compact`）
如果上下文高度相关、运行在同一个平台、停留在同一个代码库内、且你必须时刻留在人机协同回路中 —— 决策树最终便会稳稳落在此处，而且这种情况相当常见。在压缩时务必附带明确的指示说明（例如 `/compact 我们接下来将针对该区域展开全面质量审查`），确保压缩生成的摘要能够精准保留下一阶段最急需的关键信息。

> [!IMPORTANT]
> **`/compact` 应当是深思熟虑后的兜底方案，而不是不假思索的第一选择**。它被安置在决策树的最底部，正是因为排在它前面的四个选项要么开销更低，要么指向性更精准。开发者最常犯的严重错误就是一上来就盲目 compact，导致生成一个崭新但由于摘要丢失了关键决策细节而“信心满满却全盘做错”的残缺会话。

---

## 一手事实源与二手信息源的本质博弈

除了“原地继续（Continue）”之外，上述的所有其他操作本质上都是**将“一手事实源（Primary source）”降级为“二手源（Secondary source）”** —— 用事后提炼的浓缩摘要彻底替代了真实发生过的完整会话历史。这背后的核心权衡始终如一：

| 信息来源层级 | 信息完整度 | 噪声水平 | 剩余行动与探索空间 |
|---|---|---|---|
| **一手源（Continue 原地继续）** | 100% 绝对完整 | 包含较多探索噪声 | 较小（受制于上下文预算） |
| **二手源（`/compact` / `/handoff`）** | **有损（Lossy）** | 极度精简干净 | 极大（释放了海量 Token 预算） |

这正是第 1 个问题必须永远排在首位的原因：**只有当停留在当前会话的开销确实大于其带来的收益时，才值得去支付信息有损的代价**。

---

## 决策裁量的艺术

上述五个问题并非冷酷死板的客观算法 —— 每一处都蕴含着架构品味与主观判断，同一个阶段边界在不同情境下完全可能产生两种不同的抉择。这一决策树最核心的不可替代价值在于：**强迫你在阶段更迭的法定边界上、严格按照上述顺序依次进行自我拷问，而不是在工作进行到半途中盲目折腾上下文**。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `01-ask-matt` |
| bucket | engineering |
| 上游路径 | `skills/engineering/ask-matt/PHASE-BOUNDARIES.md` |
| 角色定位 | 会话阶段边界决策树与上下文管理哲学（Phase Boundaries Decision Tree） |
| 关联模块 | `01-ask-matt`、`06-handoff` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Phase boundaries

A **phase** is a chunk of work inside a session: the grilling, the implementation, the QA. The definition is fuzzy on purpose: a phase ends when you think *"ok, we're done with that"*.

The **phase boundary** is the gap between two phases, and it is the only place this decision belongs. Mid-phase there is no decision to make: continue, or split the work that's left into subagents. Compacting mid-phase makes the agent lose the thread.

## The five options

| Option       | What it does                                                    |
| ------------ | --------------------------------------------------------------- |
| **Continue** | Stay in the session. No context switch at all.                    |
| **`/clear`** | Empty the context window and start from nothing.                  |
| **`/handoff`** | Write a portable markdown file and seed a session anywhere with it. |
| **Subagent** | Send the task to its own context window and get a report back.     |
| **`/compact`** | Compress this context and seed a fresh session with the summary.  |

## The tree

Work top to bottom at the boundary. The first **yes** wins.

**1. Can you continue in this session?** Two things make the answer yes: the next phase needs this phase as a **primary source**, or you have enough [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) left (~150k tokens) for the next phase to fit. Grilling → implementation is the standard yes: the implementation wants the reasoning verbatim, not a summary of it. Continue costs nothing and loses nothing, so rule it out before anything else.

**2. Is the context irrelevant to what comes next?** Is everything in this session (the exploration, the decisions, the dead ends) disposable? If so, **`/clear`**. It is the cheapest move on the board: it takes no time and hands back the whole window. `/clear` also isn't terminal: the old session stays resumable.

The cost of getting this wrong is one-way. Clear a *relevant* context and you lose the **why** behind what you built, and no amount of reading the diff back gets it returned.

**3. Do you need to hand off?** `/handoff` is narrow. You need it only when you are:

- swapping to a **new harness** (Claude → Codex),
- moving to a **new directory** or repo,
- sending the work to a **colleague**,
- or forking a side task you found **mid-phase** without derailing what you're doing.

That list is the whole clause. What `/handoff` buys is **portability**: a file that travels. If nothing is travelling, you don't need it.

**4. Can the task be done AFK?** Is it scoped tightly enough to run with you away from the keyboard, no steering? Then send it to a **subagent** and leave this session untouched. Automated review is the standard case: the agent reads the diff and reports, and you aren't needed while it does.

**5. Otherwise, `/compact`.** Relevant context, same harness, same directory, and you need to stay in the loop: this is where the tree lands, and it lands here often. Pass it an instruction (`/compact we're going to QA this area`) so the summary keeps what the next phase needs.

`/compact` is the **default, not the first reach**. It sits at the bottom because the four questions above it are all cheaper or more precise. The failure mode when people start here is a fresh session that is confidently wrong about a decision the summary flattened.

## Primary and secondary sources

Every move except **Continue** turns a **primary source** into a **secondary source**: the session as it happened, replaced by a summary of it. The trade is always the same shape:

| Source                            | Information | Noise | Room to move |
| --------------------------------- | ----------- | ----- | ------------ |
| Primary (Continue)                | Full        | Lots  | Little       |
| Secondary (`/compact`, `/handoff`) | Lossy       | Less  | Lots         |

This is why question 1 comes first. You only pay the lossiness when staying costs more than it saves.

## These are judgement calls

The questions are not objective: each has taste in it, and the same boundary can go two ways on two days. The value is in asking them **in order**, at the boundary rather than in the middle of the work.
```

</details>
