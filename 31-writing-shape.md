# 31. writing-shape（Writing Shape（段落式架构收敛内容成文））

```yaml
name: writing-shape
description: 内容写作（收敛开采阶段）—— 将原始素材逐段打磨成型为一篇完整文章。
disable-model-invocation: true
```

### 核心任务

用户已经提供（或即将提供）一份包含原始素材（raw material）的 Markdown 文件。将其视为你的输入素材堆（input pile） —— 它可以是清晰的灵感碎片列表、一段未经整理的散文长篇、或者一段录音转录文本。其排版格式无关紧要。**在执行任何操作之前，从头到尾完整阅读该素材文件**。

随后运行一场篇章塑形会话，生成一份**独立的全新文章文档**。当前处于 **收敛开采阶段（Exploit）**：发散探索已经彻底结束，素材堆已经固定锁死 —— 你的任务是明确文章骨架并深度开采素材堆以填充该骨架。**严禁编辑原始素材文件** —— 对本技能而言，原始素材始终处于只读状态。

如果用户在调用时未指明文章保存路径，询问一次并在本会话中牢牢记住该路径。

---

## 逐段成文主循环（The loop）

1. **通读素材堆（Read the pile）**：完整阅读输入的原始文件，对其中的所有素材建立全面的心智感知；
2. **确立前置认知（Establish the prerequisites）**：与用户敲定读者在阅读开篇时已经自带的基础常识 —— 即开篇前就已经**认知立足（grounded）**的既有概念。其余的所有新概念，都必须由前方的某个段落块完成阐释铺垫后，后续段落才能借力引用。详见下文[认知铺垫与立足机制](#认知铺垫与立足机制)；
3. **起草 2 到 3 个候选开篇（Draft candidate openings）**：每一个备选开篇都应当代表一个不同的核心论点或切入视角。将它们全部展示出来，由用户亲自挑选一个、或者拼装出一个混合方案。选定的开篇将决定整篇文章后续必须履行的全部论证使命；
4. **逐段展开生长（Grow paragraph by paragraph）**：开篇敲定后，向用户提问：“基于当前的开篇，读者接下来最需要听到什么？”。从原始素材堆中提取素材来回答该问题。下一个段落块只能依赖已经立足的既有概念，并在自身落地时负责立足新概念。**围绕下一个内容块应采取的具体排版形态展开探讨** —— 是普通段落、无序列表、结构表格、高亮提示块、名言引用、还是代码块。每一种排版形态的选择都必须经过深思熟虑且理由充分；
5. **实时追加写入文章文件（Append to the article file as you go）**：切勿批量攒批写入。每当一个段落或内容块达成一致，立即将其写入文章文件，让用户亲眼目睹文章一步步成型；
6. **循环执行步骤 4，直至全文完稿**：由用户最终定夺文章何时正式收尾。

---

## 认知铺垫与立足机制（Grounding）

每一个**概念（concept）**在被某个段落块借力使用之前，都必须已经完成**认知立足（grounded）**：读者要么在开篇前就已熟知，要么在前文的某个段落中已经读懂。如果某个段落强行引用了尚未铺垫的陌生概念，就会瞬间让读者脱节。这里的最小度量单元是**概念本身**，而不是某个具体的生词 —— 哪怕通篇没有半点专业黑话，如果一个段落依赖了读者未曾建立的抽象想法，同样会导致理解断层。当一个概念拥有专属名称（**术语 term**）时，完成立足意味着将该想法与术语名称一并让读者彻底心领神会。

概念通过以下两种途径之一实现立足：
- **前置自带认知（Prerequisite）** — 在开篇之前就已经立足。读者入场自带。在开篇之初便已固定；
- **文内新引认知（Introduced）** — 由文中的某个段落块负责阐明确立，自此之后便对文章后文的所有内容永久生效。

在协作过程中实时维护一份已立足概念的动态清单。当你提问“读者接下来最需要听到什么”时，如果下一步必须依赖某个尚未立足的概念，答案本身就是：**首先把该概念铺垫立足清楚** —— 无论是在当前段落铺垫还是在更早的段落补充 —— 否则该论述根本无法成立。这是将[从素材库中汲取养分](#从素材库中汲取养分)的缺口命名逻辑提升了一个层级：在素材层面缺的是原材料，而在文章层面缺的是认知的基石地基。

核心控制杠杆依然在于：**哪些划为前置常识，哪些在文内逐步交代**。前置门槛设得过高会把读者拒之门外；文内铺垫过多则会让开篇彻底淹没在繁杂的概念定义中。在确立前置条件时与用户妥善平衡好这一张力。

---

## 探讨式的交互气质（Conversational feel）

这本质上是一场**反向的追问访谈（grilling session inverted）**。在早期的发散构想阶段，提问的焦点是“你实际观察到了哪些零散事实？”；而在此处的成文阶段，提问的焦点彻底翻转为：“**这篇文章究竟在论证什么核心观点？读者需要按照什么严密顺序依次听到这些论据？**”。勇于提出反对意见，坚决不让软弱无力的过渡滑水蒙混过关。如果某个段落无法证明自身存在的独特价值，果断将其砍掉。

在协作中保持使用以下具体推敲句式：
- “相比上一段，这个新段落为读者带来了什么不可替代的新增价值？”
- “如果我们把这一段彻底删掉，后文的哪个论证逻辑会当场断裂？”
- “这里应该写成一段叙述散文、还是排成一个要点列表？为什么必须是散文？”
- “这句话同时承担了两个不同的职能 —— 要么将其拆成两句，要么二选其一。”
- “开篇承诺了要阐明 X，但我们不知不觉漂移到了 Y。要么重新把主线拉回 X，要么回过头去修改开篇。”

---

## 从素材库中汲取养分（Pulling from the pile）

将原始素材堆视为采石场，而不是死板宣读的剧本。从中提取一个素材碎片，精心重写打磨以完美契合上下文段落的语气，然后安插就位。一个原始碎片可以被拆散分流到多个段落中，也可以与另一个碎片合并，或是重新意译表述。素材堆的使命是被深度开采；而文章的使命则是**通篇读起来浑然一体、出自同一个坚定声音**。

如果素材堆中恰好缺失了成文所必需的关键论据，**明确向用户点名该缺口**：“此处急需一个具体案例来支撑，但素材堆中并无相关内容 —— 现在当场补充一个，否则我们必须将本节果断砍掉。”

---

## 显式权衡排版格式（Format arguments to actually have）

在决定某个内容块采用何种排版展现时，与用户在对话中**公开权衡利弊**，切勿默默替用户做主：
- **普通散文 vs. 要点列表**：散文承载连贯的逻辑论证；列表承载并列的并排要素。如果各项内容之间并非严格并列，散文表达更佳；如果确实是规整的并列条目，列表能让扫读更高效；
- **行内叙述 vs. 引用提示块（Callout）**：小窍门、警告提醒以及旁白插话适合放入引用提示块（如 `> [!TIP]`、`> [!NOTE]`） —— 但前提是如果将其直接混在行文内会严重带偏主线论证。否则保持在行内自然叙述；
- **结构表格 vs. 重复段落**：如果完全相同的字段与格式结构重复出现了 3 次以上，果断使用表格；否则采用带加粗前缀的散文段落；
- **原文直接引用 vs. 意译概括**：只有当原话的字面措辞本身就是核心论点时才直接引用；如果仅仅是核心思想有用，一律采用意译概括；
- **独立代码块 vs. 行内代码**：多行、可运行、或结构演示性的代码使用独立代码块；单个 Token、标识符或命令使用行内代码。

---

## 写作节奏与纪律（Writing rhythm）

每当一个内容块讨论达成共识，立即追加到文章文件中。**在每一次动笔写入之前，必须从磁盘重新完整读取文件** —— 用户可能在对话轮次之间自行对文件进行了编辑。严禁盲目覆盖；如果用户希望重写某一段，就地精准修改该段，文章其余部分保持原样。

---

## 超出本技能范围的事项（Out of scope）

- 搜寻或发散素材堆中完全不存在的崭新碎片（缺口严格按照上文“从素材库中汲取养分”中的规则处理）；
- 编辑修改原始素材输入文件；
- 发布文章、针对特定平台做定制化排版、或添加用户未曾要求的 Frontmatter 元数据。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `in-progress`
- path: `skills/in-progress/writing-shape/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/in-progress/writing-shape
- 触发方式：`disable-model-invocation: true` → **user-invoked only**
- description 标签：`Writing, exploit` — 与 `writing-fragments`（explore）成对；与 `writing-beats` 同属 exploit 但节奏不同
- companion 文件：
  - `agents/openai.yaml`
- **内容写作向 skill；工程吸收优先级低。** 主场景是把 raw pile 塑成文章，不是工程实现流。

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: writing-shape
description: Writing, exploit — shape raw material into an article, paragraph by paragraph.
disable-model-invocation: true
---

<what-to-do>

The user has passed (or will pass) a markdown file of raw material. Treat it as the input pile — anything from a tidy list of fragments to a wall of unstructured prose to a transcript. The format does not matter. Read it end-to-end before doing anything else.

Then run a shaping session that produces a separate article document. This is **exploit**: the exploring is done, the pile is fixed — commit to a structure and mine the pile to fill it. Do not edit the raw material file — it is read-only to this skill.

If the user did not say where to save the article, ask once and remember the path.

</what-to-do>

<supporting-info>

## The loop

1. **Read the pile.** Read the input file in full. Form a sense of what's in it.
2. **Establish the prerequisites.** Settle with the user what the reader knows walking in — the concepts that are **grounded** from the start. Everything else must be grounded by a block before a later block can lean on it. See [Grounding](#grounding).
3. **Draft 2–3 candidate openings.** Each opening should imply a different thesis or angle for the article. Show all of them. Force the user to pick or compose a hybrid. The chosen opening defines what the rest of the article must do.
4. **Grow paragraph by paragraph.** After the opening lands, ask "given this opening, what does the reader need to hear next?" Pull material from the pile to answer. The next block may only lean on grounded concepts, and grounds new ones as it lands. Argue about the form the next block takes — a paragraph, a list, a table, a callout, a quote, a code block. Each format choice should be deliberate and defensible.
5. **Append to the article file as you go.** Don't batch. Write each agreed paragraph or block immediately so the user can see the article taking shape.
6. **Loop step 4 until the article is done.** The user decides when it's done.

## Grounding

Every **concept** has to be **grounded** before a block can lean on it: the reader either walked in knowing it or met it in an earlier block. A block that reaches for an ungrounded concept loses the reader. The unit is the concept, not the word for it — a block can lean on an idea the reader lacks even with no jargon in sight. Where a concept has a name — a **term** — grounding it means landing the idea and the term together.

A concept gets grounded one of two ways:

- **Prerequisite** — grounded before the opening. The reader brings it. Fixed at the start.
- **Introduced** — a block establishes it, and from then on it's grounded for the rest of the article.

Keep a running list of what's grounded. When you ask "what does the reader need to hear next?", an ungrounded concept the next move needs is itself the answer: ground it first — here or in an earlier block — or you can't make the move. This is the gap-naming of [Pulling from the pile](#pulling-from-the-pile) one level up: there the pile is missing material; here the article is missing a foundation.

The lever is what you make a prerequisite versus what you ground inside the article. Demand too much up front and you shut readers out; ground too much inside and the opening drowns in definitions. Settle it with the user when you establish prerequisites.

## Conversational feel

This is a grilling session inverted. In ideation, the question was "what are you actually noticing?" Here it's "what is this article actually arguing, and in what order does the reader need to hear it?" Push back. Refuse to let weak transitions slide. If a paragraph doesn't earn its place, cut it.

Specific moves to keep using:

- "What does this paragraph do for the reader that the previous one didn't?"
- "If I cut this, what breaks?"
- "Is this prose, or should it be a list? Why prose?"
- "This sentence is doing two jobs — split it or pick one."
- "The opening promised X. We've drifted to Y. Either re-thread it or change the opening."

## Pulling from the pile

Treat the raw material as a quarry, not a script. Pull a fragment, rework it to fit the surrounding paragraph, and place it. A fragment may be split across multiple paragraphs, merged with another, or paraphrased. The pile's job is to be mined; the article's job is to read as one voice.

If the pile lacks something the article needs, name the gap explicitly: "We need an example here and the pile doesn't have one — give me one now or we cut this section."

## Format arguments to actually have

When choosing how to render a block, weigh these tradeoffs out loud with the user, not silently:

- **Prose vs. list.** Prose carries argument; lists carry parallel items. If items aren't truly parallel, prose is better. If they are, a list is faster to scan.
- **Inline vs. callout.** Tips, warnings, and asides go in callouts (`> [!TIP]`, `> [!NOTE]`) — but only if they'd genuinely derail the main argument inline. Otherwise leave them inline.
- **Table vs. repeated structure.** If the same shape repeats 3+ times with the same fields, a table. Otherwise prose with bold leads.
- **Quote vs. paraphrase.** Quote when the original wording is the point. Paraphrase when only the idea matters.
- **Code block vs. inline code.** Multi-line, runnable, or illustrative → block. Single token or identifier → inline.

## Writing rhythm

Append to the article file as each block is agreed. Re-read the file from disk before every write — the user may have edited between turns. Never overwrite blindly. If the user wants a paragraph rewritten, edit that specific paragraph in place; leave the rest alone.

## Out of scope

- Mining for new fragments that aren't in the pile (handle gaps as in "Pulling from the pile").
- Editing the raw material file.
- Publishing, formatting for a specific platform, or adding frontmatter the user didn't ask for.

</supporting-info>
```

</details>
