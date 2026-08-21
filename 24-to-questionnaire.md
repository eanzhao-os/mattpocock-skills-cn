# 24 to-questionnaire 精读（to-questionnaire（决策盲区问卷转化器））

```yaml
name: to-questionnaire
description: 将你自身无法完全解答的决策难题，转化为一份可供他人填写的深度问卷。
disable-model-invocation: true
```

将用户自身无法独立解答的技术或业务难题转化为一份 **调查问卷（questionnaire）** —— 一份可以直接以异步方式发给某位具体协作者填写、或在同步会议中共同过一遍的 Markdown 文档。受访者掌握着用户所欠缺的核心知识；问卷的职责正是把这些关键知识从他们脑中精准抽取出来。

**追问关注发送本身，而不是去盘问技术主体（Grill the send, not the subject）**。仅仅围绕**“发送”**这一层面去访谈用户，因为关于发送的事实用户必定能回答得上来：这份问卷发给谁、以及需要从对方那里收回什么结论。随后，文档中的各个具体问题再去精准瞄准**“受访者所掌握的知识”与“用户当下的实际需求”之间的信息差（gap）**。

1. **这份问卷将发给谁？（Who is it going to?）** 通过单轮对话，明确受访者的职位角色、专业特长、以及与用户的协作关系。这决定了问卷应采取的语气基调以及问卷内部需要交代多少背景上下文。**完成判据：** 彻底搞清受访者是谁，以及他们掌握了哪些用户目前所不知道的知识。
2. **你需要从对方那里收回什么结论？（What do you need back?）** 通过单轮对话，明确用户自身无法独立拍板、必须依赖该受访者提供的具体决策或客观事实。**完成判据：** 梳理出一份清晰具体的结果清单 —— 即问卷收回后，用户必须能够依此采取行动或做出定夺的明确事项。
3. **编写问卷文档（Write the questionnaire）**。针对步骤 1 和步骤 2 中暴露出的信息断层起草问题，严格遵循下方的文档结构规范。将问卷写入当前目录下的 `to-questionnaire-<slug>.md`（slug 取自主题缩写），并向用户汇报该文件路径。**完成判据：** 文件已真实落盘，且用户在步骤 2 中点名的每一项诉求都被具体的问题完整覆盖。

---

## 问卷文档结构规范（Document structure）

将文档定调为一份**探索发现型问卷（discovery questionnaire）**：用户缺乏背景认知，而受访者坐拥一手知识。按照**最重要问题排在最前**的原则排列 —— 异步协作往往意味着你只有这一次提问机会 —— 当问题超过少数几个时，在 `##` 二级标题下按主题分类聚合。严格采用如下模板进行编写：

```markdown
# <问卷标题>

**Purpose（问卷目的）:** 阐明本问卷为何存在，以及依托于此的重大决策。

**From:** <发起人/用户> — **To:** <受访人> — **How your answers will be used（结论将如何被使用）:** <答案将流向何处>

## Context（背景说明）

用一段话为未曾参与此前思考的受访人交代必要背景。篇幅刚好足够对方做出高质量回答即可，不要长篇大论写上一整页。

## How to answer（填答指引）

明确截止日期与大致需要付出的精力。不完整的部分回答或直接填写“我不清楚”同样极具价值 —— 对于任何拿不准的事项，请明确标出其不确定性，而不是直接略过不填。

## <主题分类 1>

每个业务主题设立一个 `##` 章节。在章节下，按重要性由高到低陈列各个问题。每个问题必须只表达一个单一且清晰的想法 —— 绝不提出复合连环问 —— 问题下方直接预留引用块作为作答区域；仅在问题容易被误读或极易引来敷衍回答时，才附带一行“为什么这很重要（Why this matters）”的简短解释。

### 系统在上线初期预期需要承载多大的并发负载？

_Why this matters: 这将决定我们是现在就为突发流量采购资源，还是延后处理。_

> [请在此处填写回答]

## Anything else?（补充与兜底）

最后的兜底提问：是否有任何我们未曾问到、但您认为我们必须知晓的关键事实？
```

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `productivity/to-questionnaire` |
| bucket | productivity |
| 上游 | https://github.com/mattpocock/skills |
| companion | 无独立 companion 文件；模板内嵌于 `SKILL.md` |
| 触发 | 用户有决策答不全，需做成给别人填的问卷 |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```md
---
name: to-questionnaire
description: Turn a decision you can't fully answer into a questionnaire for someone else to fill in.
disable-model-invocation: true
---

Turn something the user can't answer alone into a **questionnaire** — a Markdown document they hand to one person to fill in async, or fill out together over a meeting. The recipient holds knowledge the user lacks; the questionnaire pulls it out of them.

**Grill the send, not the subject.** Interview the user only about the _send_, which they can always answer: who it goes to, and what they need back. The questions in the document then target the **gap** between what the recipient knows and what the user needs.

1. **Who is it going to?** Ask, in one exchange, the recipient's role, expertise, and relationship to the user. This fixes the questionnaire's tone and how much context it must carry. Done when you know who the recipient is and what they know that the user doesn't.

2. **What do you need back?** Ask, in one exchange, the specific decisions or facts the user can't resolve alone and needs from this person. Done when you have a concrete list of what the user must walk away able to do or decide.

3. **Write the questionnaire.** Draft questions aimed at the gap from steps 1–2, following the Document structure below. Write it to `to-questionnaire-<slug>.md` in the current directory (slug from the topic) and report the path. Done when the file exists and every item the user named in step 2 is covered by a question.

## Document structure

Frame the document as a **discovery questionnaire**: the user lacks context, the recipient holds it. Order questions most-important-first — async means you may only get one pass — and group them under `##` headings by theme once there are more than a handful. Write it using the template below.

<questionnaire-template>

# <Questionnaire title>

**Purpose:** why this questionnaire exists and the decision riding on it.

**From:** <the user> — **To:** <the recipient> — **How your answers will be used:** <where they go>

## Context

One paragraph orienting a recipient who wasn't in the user's head. Enough to answer well, not a page.

## How to answer

Deadline and rough effort. Partial answers and "I don't know" are useful — flag anything you're unsure of rather than skipping it.

## <Theme heading>

One `##` section per theme. Under each, its questions, most-important-first. Every question is one idea — never compound — with an answer stub directly beneath, and a one-line _why this matters_ only where the question could be misread or invite a throwaway answer.

<question-example>
### What load is the system expected to handle at launch?

_Why this matters: it decides whether we provision for burst traffic now or defer it._

>
</question-example>

## Anything else?

A closing catch-all: anything we didn't ask that we should know?

</questionnaire-template>
```

</details>
