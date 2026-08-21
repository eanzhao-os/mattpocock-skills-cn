# 29. writing-beats（Writing Beats（节拍式渐进内容写作））

```yaml
name: writing-beats
description: 内容写作（收敛开采阶段）—— 将原始素材组装成一段节奏紧凑的旅程节奏（beats），确保每个术语在被后续节奏依赖之前，其概念已经在前文得到扎实铺垫（grounded）。
disable-model-invocation: true
```

### 核心任务

用户已经提供（或即将提供）一份包含原始素材（raw material）的 Markdown 文件。当前处于 **收敛开采阶段（Exploit）**：发散探索已经彻底结束，素材堆已经固定锁死 —— 你的任务是选定一条穿过这些素材的叙事路径，并从素材库中深度挖掘以填实每一个节拍（beat）。

如果用户尚未指明文章保存到哪个具体路径，主动询问一次并牢牢记住该路径。

随后以“互动式冒险书（choose-your-own-adventure）”的协作风格，展开按节拍逐个推进的写作之旅：

1. **确立前置认知（Establish the prerequisites）**：在动笔编写任何节拍之前，首先与用户敲定读者在阅读开篇时已经具备的基础知识 —— 即从最开始就已经被**认知立足（grounded）**的既有概念。除此之外的所有其他新概念，都必须先由前方的某个节拍完成铺垫立足之后，后续的节拍才能顺理成章地借力使用。详见下文[认知铺垫与立足机制](#认知铺垫与立足机制)。
2. 从原始素材库中提炼出 2 到 3 个备选的**开篇起始节拍（Starting beats）**。每一个候选方案都代表文章的一个不同切入点。每一个候选节拍都只能依赖已经确立的前置认知；同时清晰注明每个方案分别会为读者立足哪些崭新的概念。在正式写入文章文件之前，先将这些备选节拍展示给用户。由用户亲自挑选一个。顺带向用户预览该选择将解锁后续的哪些前行路径 —— 就像让用户清晰窥见前方的一小段延伸路线。
3. 一旦用户选定了起始节拍，**仅仅将该节拍的内容**追加写入文章文件中。一个节拍可以是一句话，也可以是若干段落 —— 以该节拍自然所需的合理篇幅为准。写完该节拍后立刻停笔。
4. **从磁盘中重新完整读取文章文件**。随后再次提供 2 到 3 个候选的**后续节拍（Next beats）** —— 代表从文章当前进展处可以顺势转向演进的不同发展方向。每一个候选节拍都必须能够从当前已经立足的认知集合中顺利推演而来；并注明各自将新立足什么概念。
5. 循环往复执行步骤 3 到 5，直到文章行文抵达自然的终点。

---

## 认知铺垫与立足机制（Grounding）

每一个**概念（concept）**在被某个节拍借力使用之前，都必须已经完成**认知立足（grounded）**：读者要么在开篇前就已经自带该知识储备，要么在前文的某个节拍中刚刚领会了它。如果某个节拍贸然使用了尚未铺垫的生僻概念，就会瞬间让读者脱节掉队 —— 这是整个写作旅程中绝对不可犯下的严重错误。这里的最小度量单元是**概念本身**，而不是某个具体的生词：哪怕全篇毫无术语黑话，如果一个节拍借用了一个读者完全缺乏背景认知的抽象思想，同样会造成理解断层。当一个概念拥有专属名称（**术语 term**）时，完成立足意味着将该思想与术语名称一并让读者彻底心领神会。

一个概念仅通过以下两种方式之一实现认知立足：
- **前置自带认知（Prerequisite）** — 在第一个节拍动笔前就已经立足。读者自身入场时自带。在开篇之初便已固定。
- **文内新引认知（Introduced）** — 由前方的某个节拍负责阐述确立，自此之后便对所有的后续节拍永久处于已立足状态。

因此，每一个节拍都同时承担着两项使命：它必须**前置依赖（requires）**那些已经立足的既有概念，并且负责为后文**新立足（grounds）**崭新的概念。在整个过程中实时维护一份“截至目前已立足概念”的动态清单，每当一个新节拍成功落地就同步更新。

这一机制直接塑造了互动式路径选择的核心逻辑：一个候选节拍只有当它所依赖的全部前提概念都已立足时，才具备可选性；选中一个负责立足概念 X 的节拍，就会瞬间解锁后方所有正在苦苦等待 X 的后续节拍。当你向用户呈现备选节拍时，它们必须全部都是基于当前认知集切实可达的 —— 并且清晰指出每一个方案将新立足什么，让用户一目了然看清每一条选择所能打开的未来路径。

最关键的控制杠杆在于：**哪些概念划定为前置认知，哪些概念放在文内逐步铺垫**。如果开篇的前置门槛设得过高，就会将缺乏该背景的读者拒之门外；如果文内需要从零铺垫的概念过多，开头的几个节拍就会彻底被繁琐的概念定义所淹没。在最初确立前置条件时与用户敲定该边界，并且每当一个极具诱惑力的优质节拍因为依赖了前文未曾立足的概念而受阻时，随时与用户重新商议 —— 解决手段要么是在它前面插一个专门用于铺垫的过渡节拍，要么将该概念直接提升为全文的前置认知。

---

## 什么是节拍（What is a beat）

一个节拍是行文旅程中的**一个单一推进动作**。它只聚焦做好一件事 —— 搭建一个场景、阐明一个核心论点、抛出一个引人深思的问题、插叙一段生动的旁白、或者进行一次巧妙的视角反转。随后戛然而止，将读者平稳留在下一个节拍可以顺势展开的新支点上。

节拍的大小完全由其自身的表达需要来决定：
- 如果该动作只需一句话就能交代利落，那就写一句话（例如：“随后整整三周，什么都没有发生。”）；
- 如果该动作需要铺垫前情，则写一个精炼的短段落；
- 如果该节拍是一个自成一体的微小故事、严密论证或具体案例，则可以使用多个段落。

如果一个所谓的“节拍”需要写上足足五大段还要嵌套三个小标题，那它绝不是单个节拍 —— 而是把两个节拍强行粘在了一起。**必须将其果断拆开**。

---

## 从原始素材库中汲取养分（Pulling from the pile）

从用户的原始素材堆中提取内容来充实每一个节拍。你可以自由进行意译改写、拆分要点、重新组合或原汁原味地直接引用。原始素材堆就是你的采石场。

---

## 宣告旅程结束（Ending the journey）

文章在**行文旅程彻底圆满完成**时宣告收尾 —— 而不是在原始素材堆被彻底掏空时才结束。绝大多数素材堆都会遗留一些最终未能入选的素材碎片。这完全正常且合理；拥有比最终成文更多的原始素材储备，本就是素材收集的意义所在。

---

## 严格的写作节奏与纪律（Writing rhythm）

- **一次只追加写入一个节拍**。严禁擅自超前抢写后续内容；
- **在每一次动笔写入之前，必须从磁盘重新完整读取文章文件**。绝对且无条件地尊重并保留用户在本地编辑器中所做的任何手动修改；
- 如果用户大幅修改了先前的某个节拍，主动调整后续节拍的走向以适应用户的最新改动；
- 如果用户要求“重写刚才那个节拍”或“退回一步换第 3 节拍的另一条分支试试”，严格照办 —— 就地修改该节拍，不破坏文章的其余部分。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `in-progress`
- path: `skills/in-progress/writing-beats/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/in-progress/writing-beats
- 触发方式：`disable-model-invocation: true` → **user-invoked only**
- description 标签：`Writing, exploit` — 与 `writing-fragments`（explore）成对
- companion 文件：
  - `agents/openai.yaml`（display_name: Writing Beats；`allow_implicit_invocation: false`）
- **内容写作向 skill；工程吸收优先级低。** 机制可对照 agent 会话节奏，但主场景是文章写作，不是 codebase 工程流。

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: writing-beats
description: Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it.
disable-model-invocation: true
---

<what-to-do>

The user has passed (or will pass) a markdown file of raw material. This is **exploit**: the exploring is done, the pile is fixed — commit to a path through it and mine the pile to fill each beat.

If the user did not say where to save the article, ask once and remember the path.

Then run a beat-by-beat journey, choose-your-own-adventure style:

1. **Establish the prerequisites.** Before any beats, settle with the user what the audience already knows walking in — the concepts that are **grounded** from the start. Everything else must be grounded by a beat before a later beat can use it. See [Grounding](#grounding).
2. Write 2–3 candidate **starting beats**, drawn from the raw material. Each is a different entry point into the article. Each may only lean on grounded concepts; note what new concepts each one grounds. Show the user the beats before writing to the article file. The user picks one. Preview what beats that pick unlocks — as if the user is seeing a little way down the path.
3. Once the user picks a starting beat, write **only that beat** to the article file. A beat may be one sentence or several paragraphs — whatever that beat naturally is. Stop there.
4. Re-read the article file from disk. Then offer 2–3 candidate **next beats** — different directions the journey could pivot to from where the article now stands. Each must be reachable from the current grounded set; note what each one grounds.
5. Loop steps 3–5 until the article reaches a natural end.

</what-to-do>

<supporting-info>

## Grounding

Every **concept** has to be **grounded** before a beat can lean on it: the audience either walked in knowing it or met it in an earlier beat. A beat that reaches for an ungrounded concept loses the reader — that is the one move the journey can't make. The unit is the concept, not the word for it: a beat can lean on an idea the reader lacks even with no jargon in sight. Where a concept has a name — a **term** — grounding it means landing the idea and the term together.

A concept gets grounded one of two ways:

- **Prerequisite** — grounded before the first beat. The audience brings it. Fixed at the start.
- **Introduced** — a beat establishes it, and from then on it's grounded for every later beat.

So each beat does two jobs: it **requires** concepts that are already grounded, and it **grounds** new ones. Keep a running list of what's grounded so far, and update it each time a beat lands.

This is what shapes the choose-your-own-adventure. A candidate beat is only reachable if everything it requires is already grounded; picking a beat that grounds concept X unlocks every beat that was waiting on X. When you offer next beats, they must all be reachable from the current grounded set — and say what each one grounds, so the user can see which paths it opens.

The big lever is what you make a prerequisite versus what you ground inside the piece. Demand too much up front and you shut out readers who don't have it; ground too much inside and the early beats drown in definitions. Settle this with the user when you establish prerequisites, and revisit it whenever a tempting beat turns out to require a concept nothing has grounded yet — the fix is either a grounding beat before it, or promoting the concept to a prerequisite.

## What is a beat

A beat is one move in the journey. It does one thing — sets a scene, lands a point, asks a question, drops an aside, twists the angle. Then it stops, leaving the reader at a place where the next beat can pivot.

A beat is sized by what it needs:

- A single sentence if that's all the move is ("And then nothing happened for three weeks.").
- A short paragraph if the move needs setup.
- Multiple paragraphs if the beat is a self-contained vignette, argument, or example.

If a "beat" needs five paragraphs and three subheadings, it's not a beat — it's two beats glued together. Split it.

## Pulling from the pile

Pull material from the raw pile to populate each beat. You can paraphrase, split, recombine, or quote. The pile is a quarry.

## Ending the journey

The article ends when the journey is complete — not when the pile is empty. Most piles will have leftover fragments that don't make it in. That is fine; that is the point of having more raw material than you need.

## Writing rhythm

- Append one beat at a time. Never write ahead.
- Re-read the article file from disk before every write. Preserve user edits absolutely.
- If the user edits a previous beat substantially, let it change what comes next.
- If the user says "rewrite that beat" or "go back and try a different beat 3", do it — edit in place, leave the rest alone.

</supporting-info>
```

</details>
