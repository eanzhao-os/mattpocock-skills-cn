# 30. writing-fragments（Writing Fragments（碎片式灵感大开采））

```yaml
name: writing-fragments
description: 内容写作（发散探索阶段）—— 广泛开采原始灵感碎片（fragments），此时暂不设立任何固定结构。
disable-model-invocation: true
```

### 核心任务

这是纯粹的 **发散探索阶段（Explore）**：尽最大可能拓展“未来可能写成什么”的构想空间，坚决不提前承诺或锁定文章结构 —— 锁定结构属于后续 **收敛开采阶段（Exploit）** 的职责，由专属的独立技能负责。运行一场以产出碎片为目的的追问会话，围绕用户想要表达的任何主题进行穷追不舍的深度访谈。**强加阶段划分、设计提纲大纲或搭建文章框架，一律严格超出本技能的职责范围**。

随着对话双方在交流中不断碰撞出灵感碎片，将它们依次追加到**单个** Markdown 文件中。

如果用户在调用时未指定存储路径，询问一次保存位置，并在本会话的后续过程中牢牢记住该路径。

从用户说出的第一句话（包括最初的提示词）开始，就主动捕捉并记录其中的灵感碎片。

首次写入文件时，在文件最顶部只保留一个一级标题（H1）作为临时工作标题（后续可随时更改），此外别无他物 —— 绝不包含任何元数据（metadata）、绝不包含目录索引（TOC）、也绝不包含创建日期。

---

## 什么是灵感碎片（What is a fragment）

所谓灵感碎片，是指**任何有可能在最终成文中得以保留的一段文字**。它的唯一硬性要求是**对作者本人清晰可读** —— 即作者自己一眼就能明白它的确切含义 —— 但它完全不需要当场定义术语，也不强求任何未曾参与上下文的冷眼读者一眼就能看懂。这里的准入门槛是**“这是一段精彩的文字吗？”**，而不是“这是一套自成一体的完整论证吗？”。

灵感碎片故意保持高度的**异构多样性**。可以成为碎片的典型示例包括：
- 一句你未来极想找机会派上用场、但眼下还不知道塞到哪里的犀利金句；
- 一个附带一行极简论据支持的核心主张；
- 一个生动的小插曲（Vignette）：发生过的真实故事、一段精悍的代码片段、一个具体业务场景、或一个精妙的类比；
- 一个半成品的思维火花：“关于 X 的感觉为何像 Y，日后必须找时间深挖展开”；
- 一句名言引用、一段逼真的对话原声、或偶然偷听到的一句妙语；
- 一组凭借直觉感受天然聚合在一起的关联观察清单；
- 一句辛辣的吐槽、一段真诚的自我剖白、或一个幽默的笑点包袱；
- 一个**核心引导词（Leading word）** —— 一个能够让整篇文章紧紧挂靠在上面的紧凑隐喻或专有造词（即用一个极简词汇命名一整套行为模式，正如 *tracer bullets 纵深穿透切片* 或 *fog of war 战争迷雾* 一样）。

在以上所有形态中，**能够捕捉到一个核心引导词是探索阶段最宝贵的收获**。它是真正承重的支柱：在发散探索阶段一旦精准命名了一个词，后续的整篇架构、过渡转折乃至文章标题都会随之自然成型 —— 并在整个收敛开采阶段持续释放巨大的杠杆红利。每当对话开始围绕某个反复出现的模糊想法打转时，全力推动用户为它提炼并创造一个专属词汇。

小说家的日常日记正是这里的绝佳参考模型：日积月累记录下数年未经整理的生活洞察，日后成为开采巨著的丰富矿藏。灵感碎片就是这样的一声声生活洞察。

---

## 文件存储格式规范（File format）

```markdown
# 临时工作标题

这里记录第一个灵感碎片。

它可以是长篇累牍的多个自然段。也可以自由包含列表、代码片段、名言引用 —— 
以该碎片自然采取的任何合理形态进行排版。

---

这里记录第二个灵感碎片。

---

> 用户希望长期保留的一行摘录金句。

针对该金句的一小段即兴点评与感受。

---

- 一组彼此相关的细微观察
- 凭借作者直觉紧密聚合在一起
- 渴望在版面上相互挨在一起
```

各个碎片之间统一使用水平分割线（`\n---\n`）进行物理切分。正文内部**绝不使用二级三级等任何章节标题**。不打标签。除了添加时的先后时序之外，不强加任何人为的排序。

---

## 协同写作节奏与纪律（Writing rhythm）

- **静默追加记录**。绝不要在每次记录碎片前繁琐请示许可。在对话回复中间接提及已追加即可（例如“已将刚才那点记入素材库”），切勿用保存弹窗或确认提示打断顺畅的对话心流；
- **在每一次动笔写入之前：必须从磁盘重新完整读取文件**。用户可能在对话轮次之间自行对文件中的碎片进行了手动编辑、重排顺序或删减 —— 绝对尊重并保留用户的改动。**严禁盲目全量覆盖文件**；始终只执行追加（或者在用户明确要求时，就地精准修改某一个特定碎片）；
- 用户可以随时发出“把刚才那条删掉”、“把那一条改得更犀利一些”、或“把那两条合并成一个”等口令。将这些要求视为一等公民指令严格照办。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `in-progress`
- path: `skills/in-progress/writing-fragments/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/in-progress/writing-fragments
- 触发方式：`disable-model-invocation: true` → **user-invoked only**
- description 标签：`Writing, explore` — 与 `writing-beats` / `writing-shape`（exploit）成对
- companion 文件：
  - `agents/openai.yaml`
- **内容写作向 skill；工程吸收优先级低。** 产出是异构 fragments 堆，不是 ticket/spec/代码。

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
---
name: writing-fragments
description: Writing, explore — mine raw fragments, no structure yet.
disable-model-invocation: true
---

<what-to-do>

This is pure **explore**: widen the space of what could be written without committing to structure — committing is _exploit_, a separate skill's job. Run a grilling session that produces fragments, interviewing the user relentlessly about whatever they want to write about. Imposing phases, outlines, or article structure is out of scope here.

As fragments emerge from either side of the conversation, append them to a single markdown file.

If the user did not pass a path, ask once where to save the document, then remember it for the rest of the session.

Capture fragments from the very first thing the user says, including the initial prompt.

On first write, put a single H1 at the top with a working title (it can change later) and nothing else — no metadata, no TOC, no date.

</what-to-do>

<supporting-info>

## What is a fragment

A fragment is any piece of text that might survive into the final article. It must be _readable by the author_ — the author can tell what it means — but it does not need to define its terms or be comprehensible to a cold reader. The bar is "is this a piece of good writing?", not "is this a self-contained argument?"

Fragments are deliberately heterogeneous. Examples of what could be a fragment:

- A sharp sentence you'd want to deploy somewhere but don't yet know where.
- A claim with a one-line justification.
- A vignette: a thing that happened, a code snippet, a scenario, an analogy.
- A half-thought: "something about how X feels like Y, work this out later."
- A quote, a piece of dialogue, an overheard line.
- A list of related observations that hang together by feel.
- A complaint, a confession, a punchline.
- A **leading word** — a compact metaphor or coinage the whole piece can hang on (one term that names the idea, the way _tracer bullets_ or _fog of war_ names a whole pattern).

Of these, the leading word is the most valuable fragment to land. It is load-bearing: name the right one in explore and it shapes the structure, the transitions, and the title later — paying dividends through the entire exploit phase. When the conversation circles a recurring idea, push to coin a word for it.

The novelist's diary is the model: years of unstructured noticings that later get mined for raw material. Fragments are noticings.

## File format

```markdown
# Working title

A first fragment lives here.

It can be multiple paragraphs. It can include lists, code, quotes — whatever
shape the fragment naturally takes.

---

A second fragment.

---

> A quoted line that the user wants to keep around.

A reaction to it.

---

- A cluster of related observations
- That hang together by feel
- And want to be near each other
```

Fragments are separated by a horizontal rule (`\n---\n`). No headings inside the body. No tags. No order beyond the order they were added.

## Writing rhythm

Append silently. Don't ask permission for each fragment. Mention what you added in passing ("adding that"), but don't interrupt the conversation with save dialogs.

Before every write: re-read the file from disk. The user may have edited, reordered, or deleted fragments between turns — preserve their changes. Never overwrite the file; only append (or, if the user asks, edit a specific fragment in place).

The user can say "cut the last one", "rewrite that one sharper", "merge those two" at any time. Treat those as first-class instructions.

</supporting-info>
````

</details>
