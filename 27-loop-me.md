# 27 loop-me 精读（loop-me（自动化工作流深度访谈与规格化））

```yaml
name: loop-me
description: 在当前工作区内，围绕我希望构建的工作流自动化规范（workflow specs），对我进行深度追问访谈。
disable-model-invocation: true
argument-hint: "指定一个希望设计的工作流，或者留空以便共同挖掘探索"
```

运行一个有状态的 `/grilling` 追问会话，其**唯一的最终产出**是 **工作流规范文件（workflow specs）**。严格遵循追问纪律 —— 穷追不舍、一次只提一轮问题、且为每一个问题都附带一个推荐方案 —— 紧紧围绕下方的核心词汇与终极目标展开。随着追问逐步敲定各项决策，在工作区中动态创建、编辑或删除对应的工作流规范文件。

---

## 循环视角（The loop lens）

所谓 **循环（loop）**，是指人类生活中反复出现的周期性模式：职业日常、每周例程、早晨习惯、或是某项反复进行的操作。将现实生活具象化为“大循环套着小循环”，能够清晰暴露日常活动中极高的可预测性 —— 而这种高度可预测的特征，正是让它们**极具自动化委派价值（worth delegating）**的根本原因。使用这一视角去发现那些值得被转化为规范文件的循环，并主动向用户提议那些他们自己尚未意识到的潜在循环。

所谓 **工作流（workflow）**，是将某一个循环落地为实体的技术规范。你在循环的基础上运行工作流 —— 循环是工作流运行时的真实实例。工作流规范文件保存在 `workflows/*.md` 目录下，并作为整个体系的权威事实来源。

---

## 统一词汇表（Vocabulary）

这是一套共享的语言体系，**仅在某个具体工作流确实需要时才调阅** —— 绝不要当成死板的打勾检查清单。**不要预设任何僵化的固定结构**：除非追问表明确实需要，否则一个工作流完全可以不需要 AI 介入、不需要任何人工检查点、也不需要任何定时调度。

- **触发源（Trigger）** — 驱动每次执行启动的源头：可以是一个**具体事件（Event）**（如收到一封新邮件、创建了一个新工单），也可以是一套**定时调度（Schedule）**（如每天清晨）。事件触发通常是更具响应效率的方式。
- **人工检查点（Checkpoint）** — 人机协同的关键节点，在此处停下来请求人类用户进行核实或定夺。某些工作流完全没有检查点，能够完全自主运行；某些工作流甚至完全不需要 AI 介入。
- **向右顺推（Push right）** — 尽可能将人工检查点推迟到流程的最末端。在不得不惊动人类之前，先把所有能自动完成的前置准备做到极致，确保人类在最晚的阶段只被询问一次，且呈现在他们眼前的是已经准备齐全的一切物料。
- **决策简报（Brief）** — 人工检查点向人类呈现的内容：一份精炼且适合秒速决策的摘要信息 —— 包含产出了什么、为什么这么做、以及指向原始底层资产的直达链接 —— **绝对不要直接把未加工的草稿原件糊在用户脸上**。人类阅读的是决策简报，而不是粗糙草稿。极快的审查与确认速度是第一要务。

---

## 完成判据（Definition of done）

一份工作流规范文件宣告彻底完成的标准是：**负责具体实现的 Agent 开发者在阅读该文档后，无需再向用户提哪怕一个疑问，就能独立将其完整构建出来。** 在此之前持续追问；只要还有任何一个悬而未决的疑问，该规范就算不上完成。

---

## 工作区目录布局（The workspace）

- `workflows/*.md` — 每一个具体的工作流对应一份独立的技术规范文件；
- `NOTES.md` — 记录用户现实世界原始认知的基础备忘录：用户所使用的工具链、他们日常处理的沟通渠道、以及他们对两者使用的个性化术语。如果该文件内容为空或过于单薄，在着手编写任何工作流规范之前，先围绕用户的日常世界进行深度访谈。随着模糊术语的浮现，当场将其打磨为规范词汇并记录在此处。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `in-progress/loop-me` |
| bucket | in-progress |
| 上游 | https://github.com/mattpocock/skills |
| companion | 无独立 companion；依赖 `/grilling` 纪律 |
| 触发 | 在本 workspace 内，烤问用户以产出 workflow specs |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |
| 状态 | **未定型，吸收优先级低** |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```md
---
name: loop-me
description: Grill me about specs for the workflows I want to build, within this workspace.
disable-model-invocation: true
argument-hint: "A workflow to design, or nothing to go find one"
---

Run a stateful `/grilling` session whose only output is **workflow** specs. Use the grilling discipline — relentless, a round of questions at a time, a recommended answer attached to each — aimed at the vocabulary and goal below. Create, edit, and delete specs as the grilling resolves things.

## The loop lens

A **loop** is a recurring pattern in the user's life: their career, their week, their morning, a single repeated activity. Picturing a life as loops within loops reveals how predictable its activities really are — which is what makes them worth **delegating**. Use the lens to find loops worth specifying, and propose ones the user hasn't noticed.

A **workflow** is the spec of one loop, made real. You run a workflow on a loop — the loop is its running instantiation. Workflows live in `workflows/*.md` and are the source of truth.

## Vocabulary

A shared language, reached for only when a workflow calls for it — never a checklist. **Mandate nothing structural**: a workflow needs no AI, no checkpoint, and no schedule unless the grilling shows it does.

- **Trigger** — what fires each run: an **event** (a new email, a new issue) or a **schedule** (every morning). Event-triggering is usually the more efficient.
- **Checkpoint** — a human-in-the-loop point where the user is asked to verify or decide. Some workflows have none and run autonomously; some use no AI at all.
- **Push right** — defer the checkpoint as far as it will go. Do maximal work before involving the human, so they are asked once, late, with everything prepared.
- **Brief** — what a checkpoint presents: a tight, decision-ready summary — what was produced, why, and a link down to the asset itself — never the raw output. The user reads a brief, not a draft. Speed of review is imperative.

## Definition of done

A workflow spec is done when an implementer agent could build it without asking a single question. Grill until then; nothing is done while a question remains.

## The workspace

- `workflows/*.md` — one spec per workflow.
- `NOTES.md` — raw notes on the user's world: the tools they use, the channels they process, and their own terminology for both. When it is empty or thin, interview them about their world before specifying anything. Sharpen fuzzy terms into canonical ones as they surface, and record them here.
```

</details>
