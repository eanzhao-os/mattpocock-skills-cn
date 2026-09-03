# 22 writing-for-agents 精读（Writing for Agents（面向 Agent 的文档与指令编写规范））

```yaml
name: writing-for-agents
description: 为 Agent 编写指导文档。当创建或编辑 Skill，或者修改 AGENTS.md / CLAUDE.md 时使用。
```

编写任何供 Agent 消费的文档 —— 无论是具体的 Skill、`AGENTS.md` / `CLAUDE.md`、还是通过指针引用的参考文档 —— 的权威参考指南。虽然外在封装形态各异，但写作内核完全一致：**通过相同的一套杠杆机制来确保 Agent 行为的高度可预测性** —— 确保 Agent 在每次运行中都能严格遵循相同的**执行过程（process）**，而不是机械地强求每次产出完全相同的字面输出。

当你要编写的文档本身是一个 Skill 时，请先阅读 [SKILL-MECHANICS.md](./22-writing-for-agents_SKILL-MECHANICS.md) 以了解 Frontmatter 元数据、调用模式的选择以及路由型 Skill 的设计。

---

## 上下文指针（Context Pointers）

**上下文指针（Context pointer）** 是常驻在 Agent 上下文中的一条引用：它命名了一段**当前位于上下文之外**的参考资料，并清晰编码了“何时应当去调阅它”的触发条件。一个 Skill 的 `description` 描述就是这样一个指针；在 `AGENTS.md` 中指向某篇参考文档的某一行文字本质上也是同一个对象。决定 Agent **何时、以及多大可靠性**去调阅该资料的，是**指针本身的措辞**，而不是目标文件本身。如果一段核心资料配上了一条措辞含糊的指针，就会导致严重的**执行发散性 Bug（variance bug）**：首先应当打磨锐化指针的措辞；只有在反复打磨依然无效时，才考虑将资料内容直接内联到主文件中。

一条指针承担着两项核心职责：明确指出该资料是什么，并清晰列出应当触发查阅的**分支场景（branches）**（分支是指文档处理的不同业务场景，不同的运行可能会走不同的路径）。一条常驻加载的指针中的每一个词，在每一轮对话中都在持续消耗上下文预算，因此它比正文更需要严苛的修剪与精简：
- **核心引导词前置（Front-load the leading word）** —— 指针正是依靠头部的核心词来发挥其触发招募作用；
- **每个分支只配一个触发器（One trigger per branch）** —— 用同义词去重新表述同一个分支，本质上是把同一个分支写了两遍；将其合并，仅保留真正互斥且明确的分支；
- **剔除正文本身已经携带的冗余身份信息**。

---

## 两种核心认知负载（The Two Loads）

你添加的每一篇文档和每一个指针，都在消耗两种预算之一：
- **上下文负载（Context load）** —— 常驻内容对 Agent 上下文窗口造成的持续开销：`AGENTS.md` 中的一行文字、Skill 的 description 描述、以及每一轮对话中都死占窗口的任何内容，无论它当前是否被触发，都在无休止地消耗 Token 和注意力。
- **人类认知负载（Cognitive load）** —— 人类开发者需要承受的记忆负担：系统中到底存在哪些文档、以及何时该去翻阅哪一篇。人类在此充当了索引的角色。**这并不是一个必须被彻底消灭的成本** —— 它是人类拥有掌控权（human agency）所必须付出的对价；在需要人类主观裁量的地方舍得花费它，在不需要人类介入的地方彻底剔除它。

仅通过指针进行按需调阅的资料，成功摆脱了常驻的上下文负载，其代价仅仅是指针本身所占的那一行文本；而完全不配置任何指针的资料，则其被调用的契机完全依赖于人类的认知负载。

---

## 信息层级阶梯（Information Hierarchy）

任何文档都是由两种基本内容类型构成的 —— **步骤（Steps）**（Agent 按序执行的具体动作）与 **参考资料（Reference）**（按需查阅的定义、规则与事实） —— 两者可以自由混合：全步骤形态（操作配方）、全参考资料形态（审查规则、本技能自身）、或两者兼备。核心设计决策在于将每一块内容安置在**信息层级阶梯**的哪一个档位上，该阶梯按照“Agent 究竟多迫切需要该资料”从高到低排列：

1. **文件内原位步骤（In-file step）** —— 第一核心层级：Agent 必须按顺序严格执行的动作。
2. **文件内原位参考（In-file reference）** —— 随叫随到的就地查阅资料。通常是一组平级的规则集合（例如代码审查中的并列规则） —— 这是一种优良的设计编排，绝不是代码坏味道。
3. **按需外展参考（Disclosed reference）** —— 剥离推入独立的文件中，仅靠上下文指针进行索引，并且**仅在指针被命中时才加载**。其形态可以涵盖同目录下的兄弟文件，也可以是全仓共享的全局外部参考文档。

往下推得太少，顶层主文件就会臃肿不堪；往下推得太多，又会不小心把 Agent 执行当下真正需要的关键信息雪藏起来。**平衡好这种张力就是整个层级设计的全部精髓所在。**

**渐进式外展（Progressive disclosure）** 是沿着阶梯向下迁移的操作 —— 将内容移出主文件并藏在指针背后 —— 从而确保顶层指令始终清晰可读。这绝不仅仅是一项 Token 节省优化，而是捍卫信息层级的核心手段。**分支拆分是检验渐进式外展最干净的试金石**：把每个分支都共同需要的核心内容直接内联，把只有特定分支才会触达的细节推到指针之后。如果一篇文档本身包含执行步骤，那些本该外展的参考资料就会将步骤死死淹没，导致 Agent 对核心步骤的注意力变成扔硬币碰运气 —— 这是一个直接影响执行稳定性的**方差控制杠杆**，而不仅仅是关乎排版美观。

**同地内聚（Co-location）** 是文件内部的组织伴侣：如果说信息阶梯决定了一块材料“应该下沉到多深”，那么同地内聚则决定了材料沉淀下来之后“应当与什么挨在一起”。将某个概念的定义、规则与注意事项全部收纳在同一个标题下，而不是散落在各处，这样一旦阅读该部分就能顺带将其近邻上下文一并捕获。检验标准：该文档读起来必须像一份专门为 Agent 量身定做的技术规范 —— 归类聚合的内容具备这种质感，而零碎散落的内容则完全不具备。（这与“内容重复 duplication”截然不同：重复是把同一个意思在两处抄写；散落则是把原本完整的一个意思撕碎到多处。）

**内容蔓延失控（Sprawl）** 是此处的典型失败模式：文档写得实在太长了，即使其中的每一行都是有效的且不重复。过长的内容会严重稀释 Agent 的注意力，且每多写一行就意味着日后要多维护一行。解药正是信息阶梯：将参考资料隐藏到指针背后，并按业务分支或执行时序进行切分，让每一条执行路径只背负其当下所需的极简内容。

---

## 步骤与完成判据（Steps and Completion Criteria）

每一个执行步骤都必须以一个**明确的完成判据（Completion criterion）**作为收尾 —— 即向 Agent 明确指示当前步骤的工作已经彻底完成的判定条件。判据之所以是一项强大的控制杠杆，源于其两个关键属性：

- **清晰度（Clarity）** —— Agent 能否毫不含糊地辨别“已完成”与“未完成”？模糊的边界（例如“达成充分理解”）极易诱发 **过早宣布完成（Premature completion）**：步骤尚未真正做扎实就被草草收尾，Agent 的注意力过早滑向了“做完收工”。后方依然可见的后续步骤 —— 即**收尾后步骤（Post-completion steps）** —— 构成了拉扯注意力的诱惑；而判据本身的清晰度则是抵御诱惑的阻力。防守顺序：**首先锐化打磨判据边界**（成本极低且效果立竿见影）；只有当边界确实不可避免地带有模糊性**且**你已经亲眼观察到 Agent 出现了抢跑苗头时，才通过拆分步骤序列将后续步骤隐藏起来 —— **而且隐藏只在真正的上下文物理边界上生效**（通过交接 handoff 或子代理派发；如果是同一上下文内的内联调用，后续步骤依然裸露在窗口中，起不到任何隐藏作用）。
- **要求严苛度（Demand）** —— 判据对执行深度所设定的门槛有多高。“确保每一个被修改的模型都被逐一清点对齐”会强迫 Agent 进行深入彻底的排查，而“产出一份变更清单”则无法做到这一点。严苛度直接驱动了 Agent 在任务内部所展开的**扎实深挖（Legwork）** —— 这种深挖潜藏在严谨的用词之中，而无需生硬拆成独立的步骤。而且它并不局限于时序步骤：“确保每一条审查规则都被逐一应用”能够约束一组平级的参考资料，正如“确保每一个步骤都执行完毕”能够约束一套时序动作一样。

最坚不可摧的完成判据，必然同时兼备**高度可检验性（Checkable）**与**绝对穷尽性（Exhaustive）**。

---

## 何时应当拆分文档（When to Split）

将一份文档拆分成两份，必然会消耗两种认知负载之一，因此只有当拆分能够带来实质收益时才执行：
- **按时序执行拆分（By sequence）** —— 当后方未执行的步骤会严重诱惑 Agent 在当前步骤草率抢跑时，将这一连串步骤拆开。将后续步骤隔离在视线之外，能够逼迫 Agent 在当前任务上投入更扎实的深挖工作。反之亦然：如果盲目将多个序列强行合并，就会把后续步骤过早暴露，从而引发过早完成的毛病。
- **按调用方式拆分（By invocation）** —— 针对 Skill 的特有拆分规则：详见 [SKILL-MECHANICS.md](./22-writing-for-agents_SKILL-MECHANICS.md)。

---

## 核心引导词（Leading Words）

**核心引导词（Leading word）** 是指已经在底层大模型的预训练语料中根深蒂固存在的紧凑专业概念（如 *lesson 教训*、*fog of war 战争迷雾*、*tracer bullets 纵深穿透切片*），Agent 在执行文档时会直接调用这些概念进行思维推理。以专有名词 Token 的形式反复出现、而不是展开成长篇累牍的句子，它能够通过自然招募大模型底层的先验知识（priors），用极少数的 Token 牢牢锚定一整片复杂的行为模式。你自己造词也可以，但前提是必须给出详尽定义 —— 自造词无法调用模型的预训练先验，你必须自己用大量的定义 Token 去买单，而预训练词汇则是完全免费的红利；因此始终优先选用既有的专业词汇。

引导词具备双重锚定效应：
- 在正文内部，它锚定**具体执行（Execution）**：该词每出现一次，Agent 就会立刻调动起完全相同的标准行为；在平级的参考资料中，它能精准聚焦 Agent 的注意力去寻找特定类别的目标。
- 在指针内部，它锚定**调用时机（Invocation）**：当同一个词同时出现在你的提示词、项目文档以及代码库中时，Agent 能够自然将这些共享语言与目标资料紧密勾连，从而大幅提升调用的准确率与可靠性。

主动寻找利用核心引导词重构精简文档的机会。如果一个三位一体的概念在三处被啰嗦展开，或者一条指针花费了整整一句话去含糊暗示某个想法 —— 这些都是极度渴望被浓缩为单个核心词的典型段落：
- “快速、确定性、开销极低” → **紧凑（tight）**（例如构建一个 *tight* 反馈闭环）；
- “一个你完全信赖的测试闭环” → **红绿（red）** —— 将模糊的准入门槛转化为肉眼可见的二元确定状态（该闭环在 Bug 上必须能够变 **red** 报错，否则就视作不合格）。

这样做能够带来双重红利：不仅节省了 Token 开销，更赋予了 Agent 一个极其锐利的思维挂钩。默认假设每一篇文档中都包含大量可以被核心引导词彻底淘汰的废话复述 —— 主动把它们找出来。

**否定句（Negation）** 是与该杠杆相伴相生的严重失败模式：试图通过“禁止做某事”来引导行为，会不可避免地把被禁止的行为强行拽入上下文，反而让该行为变得**更加**容易被模型唤醒。*“不要去想粉色大象”*，结果脑子里全是粉色大象；否定词本身只是个极弱的修饰语，极易被高度激活的核心概念彻底冲垮，导致禁令在模型眼里读起来半截变成了“去执行那件事”的指令。**始终采用正向提示（Prompt the positive）** —— 直接明确陈述目标行为（例如“编写单行注释”），从而让被禁止的错误行为在文本中彻底绝迹。禁令只有在充当无法用正向语言表述的硬性安全底线时才有一席之地；即便如此，也必须为其配上正向的目标动作，确保 Agent 的注意力能够稳稳落在“应该做什么”上。

---

## 严苛修剪与去冗余法则（Pruning）

- **单一事实来源（Single source of truth）**：每一个具体的含义有且仅有一个权威定义位置，从而确保日后修改系统行为时只需在一处改动。**内容重复（Duplication）** —— 即将同一个含义在多处反复抄写 —— 既增加了维护成本、浪费了 Token，更在信息阶梯上不当地拔高了该含义的权重。（这与核心引导词恰恰相反：引导词是故意重复使用相同的术语 Token，而绝不重复表述含义。）
- **客观环境本身也是权威的事实来源** —— 包括 `package.json` 中的 scripts 脚本、配置文件、目录组织结构、`--help` 命令行输出等 —— 任何去复述这些内容的文档本质上都只是**缓存（cache）**：即一次查询结果的副本，只有当环境查询极其昂贵耗时时，文档缓存才值得占据负载。只去缓存那些 Agent 光靠看环境根本找不到的内容：未写在明面上的潜规则、某项选择背后的深层原因、任何配置文件都未坦白的暗坑。至于那些只要看一眼文件或执行一条命令就能明了的事实，统统留给客观环境本身，因为环境中的真相永远不会过时失效。
- **逐行审查相关性（Relevance）**：这句话是否依然直接关乎文档当下要做的事？一行文字可能因为与当前任务完全无关而失去价值（纯粹的背景闲聊、或者本该渐进外展的具体分支），也可能随着代码行为或外部世界的演进而已然过时。越短的文档越容易保持高度相关。如果没有严明的修剪纪律，文档的默认宿命就是**地层沉淀（sediment）**：过时的僵化层不断堆积，因为大家总觉得“加一行很安全，删一行很危险”，直到你必须像地质学家一样向下深挖钻孔，才能勉强找到那些依然活着的真实有效指令。
- **逐句猎杀无用空话（No-ops）**：如果一句话所要求的指令是底层大模型在默认情况下本来就会自觉遵守的，那么写出这句话纯粹是在白白烧钱说废话。检验标准 —— **这句话相比于模型的默认行为，是否真正改变了其输出动作？** —— 这个标准是**相对于模型能力而言的**，而不是相对于人类读者的感知：如果两个人对某句话是否是废话产生分歧，他们本质上是对模型的默认能力基线产生了分歧，这应当通过实际运行文档来验证，而不是靠打嘴仗。一旦判定某句话是无用空话，直接整句删除，而不是扣字眼修修补补。该检验同样适用于核心引导词：如果一个引导词过于软弱以至于无法战胜模型的默认惯性（例如在 Agent 本来就挺认真时还在那写 *be thorough 请彻底一点*），它就是一个无效的空话词，真正的解药是换一个强度更硬的词（例如 *relentless 穷追不舍*），而不是换一套无谓的提示工程技巧。

## Companion 摘要：[SKILL-MECHANICS.md](./22-writing-for-agents_SKILL-MECHANICS.md)

角色：`writing-for-agents` 的 **skill 专用分支**——正文写 skill 时再读；不改变通用写作原则。

要点：

1. **Invocation 二分**
   - **model-invoked**：保留 description，agent 可自治触发，其他 skill 也可 reach；description 是 always-loaded 的 top-level context pointer，用 context load 换 discoverability。
   - **user-invoked**：`disable-model-invocation: true`，description 变 human-facing 一行摘要；零 context load，认知负载回到人（人是 index）。
2. **何时 model-invoked**：仅当 agent 必须自己触达，或其他 skill 必须触达；纯手触则 user-invoked。
3. **By invocation 拆分**：有独立 leading word 应自触发，或别的 skill 要 reach 时，才拆出 model-invoked skill。
4. **Router skill**：user-invoked 技能多到记不住时，用一个 user-invoked router 命名其他 skill 及何时用；只能 hint，不能 fire（因为对方无 description）。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `productivity/writing-for-agents` |
| bucket | productivity |
| 上游 | https://github.com/mattpocock/skills |
| companion | [SKILL-MECHANICS.md](./22-writing-for-agents_SKILL-MECHANICS.md)（仅摘要角色，不全文） |
| 触发 | 写/改 skill，或改 `AGENTS.md` / `CLAUDE.md` |
| 调用方式 | model-invoked（有 description） |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```md
---
name: writing-for-agents
description: Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.
---

Reference for writing any document an agent consumes — a skill, an `AGENTS.md` / `CLAUDE.md`, a doc reached by a pointer. The packaging differs; the writing does not: the same levers make each one predictable — the agent taking the same _process_ every run, not producing the same output.

When the document you're writing is a skill, read [SKILL-MECHANICS.md](./22-writing-for-agents_SKILL-MECHANICS.md) for frontmatter, invocation choice, and router skills.

## Context pointers

A **context pointer** is a reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. A skill's description is one; a line in `AGENTS.md` naming a doc is the same object. The pointer's _wording_, not its target, decides when the agent reaches the material — and how reliably. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, and inline the material only if sharpening fails.

A pointer does two jobs — state what the material is, and list the **branches** that should trigger reaching it (a branch is a distinct case the document handles, so different runs take different paths through it). Every word of an always-loaded pointer costs on every turn, so it earns even harder pruning than the body:

- **Front-load the leading word** — the pointer is where it does its triggering work.
- **One trigger per branch.** Synonyms that rename a single branch are one branch written twice; collapse them and keep only genuinely distinct branches.
- **Cut identity the body already carries.**

## The two loads

Every document and pointer you add spends one of two budgets:

- **Context load** — the cost of always-loaded material on the agent's window: an `AGENTS.md` line, a skill description, anything sitting in context every turn, spending tokens and attention whether or not it fires.
- **Cognitive load** — the cost on the human: which documents exist and when to reach for each. The human is the index. Not a cost to minimise — it is the price of human agency; spend it where human judgement matters, remove it where it does not.

Material reached only through a pointer escapes context load at the price of the pointer's own line; material with no pointer at all rides entirely on cognitive load.

## Information hierarchy

A document is built from two content types — **steps** (the ordered actions the agent performs) and **reference** (definitions, rules, facts consulted on demand) — that mix freely: all steps (a recipe), all reference (a review's rules, this skill), or both. The core decision is where each piece sits on the **information hierarchy**, a ladder ranked by how immediately the agent needs the material:

1. **In-file step** — the primary tier: what the agent does, in order.
2. **In-file reference** — consulted on demand. Often a legitimately flat peer-set (every rule of a review on one rung) — a fine arrangement, not a smell.
3. **Disclosed reference** — pushed out into a separate file, reached by a context pointer, loaded only when the pointer fires. Spans a sibling file in the same folder through fully external reference that lives anywhere and any document can point at.

Push too little down and the top bloats; push too much and you hide material the agent actually needs. That tension is the whole decision.

**Progressive disclosure** is the move down the ladder — out of the main file and behind a pointer — so the top stays legible. Not primarily a token optimisation: it is how the hierarchy is protected. Branching is the cleanest disclosure test: inline what every branch needs, and push behind a pointer what only some branches reach. When a document has steps, in-file reference that should be disclosed buries them and turns attending to them into a coin-flip — a variance lever, not just a legibility one.

**Co-location** is the within-file companion: where the ladder decides _how far down_ a piece sits, co-location decides _what sits beside it_ once there. Keep a concept's definition, rules, and caveats under one heading rather than scattered, so reading one part brings its neighbours with it. The test: the document should read like documentation written for the agent — grouped material reads that way; scattered material does not. (Distinct from duplication: that repeats one meaning in two places; scattering fragments one meaning across many.)

**Sprawl** is the failure mode here: a document simply too long, even when every line is live and unique. Attention thins across the excess, and every extra line is one more to keep relevant. The cure is the ladder: disclose reference behind pointers, and split by branch or sequence so each path carries only what it needs.

## Steps and completion criteria

Every step ends on a **completion criterion** — the condition that tells the agent the work is done. Two properties make it a lever:

- **Clarity** — can the agent tell done from not-done? A vague bound ("understanding reached") invites **premature completion**: ending the step before it is genuinely done, attention slipping to _being done_. The visible steps still ahead — the **post-completion steps** — supply the pull; the criterion's clarity is the resistance. Defend in order: **sharpen the bound first** (local and cheap); only if it is irreducibly fuzzy _and_ you observe the rush, hide the later steps by splitting the sequence — and hiding only works across a real context boundary (a hand-off or a subagent dispatch; an inline call leaves the later steps in context and clears nothing).
- **Demand** — how much it requires. "Every modified model accounted for" forces thorough work where "produce a change list" does not. Demand drives **legwork** — the digging the agent does within the work, latent in the wording rather than written as its own step — and it is not step-bound: "every rule applied" binds a body of flat reference just as "every step done" binds a sequence, which is how an all-reference document still carries an exhaustiveness bar.

The strongest criteria are both checkable and exhaustive.

## When to split

Splitting one document into two spends one of the two loads, so split only when the cut earns it:

- **By sequence** — split a run of steps where the post-completion steps tempt the agent to rush the one in front of it. Keeping them out of view drives more legwork on the current task. Beware the reverse: merging sequences exposes each step's later steps to what follows, inviting premature completion.
- **By invocation** — skill-specific: see [SKILL-MECHANICS.md](./22-writing-for-agents_SKILL-MECHANICS.md).

## Leading words

A **leading word** is a compact concept already living in the model's pretraining that the agent thinks with while running the document (_lesson_, _fog of war_, _tracer bullets_). Repeated as a token, never as a sentence, it accumulates a distributed definition and anchors a whole region of behaviour in the fewest tokens, by recruiting priors the model already holds. Coining your own works if you define it clearly, but a made-up word recruits no priors — you pay in definition tokens what a pretrained word gives free; reach for an existing word first.

It anchors twice. In the body, _execution_: the agent reaches for the same behaviour every time the word appears, and inside flat reference it focuses attention on a class of thing to look for. In a pointer, _invocation_: when the same word lives in your prompts, your docs, and your codebase, the agent links that shared language to the material and reaches it more reliably.

Hunt for opportunities to refactor with leading words. A triad spelled out at three sites, a pointer spending a sentence to gesture at one idea — each is a passage begging to collapse into a single token:

- "fast, deterministic, low-overhead" → _tight_ (a _tight_ loop).
- "a loop you believe in" → _red_ — a fuzzy gate becomes a binary observable state (the loop goes _red_ on the bug, or it doesn't).

You win twice: fewer tokens, and a sharper hook for the agent to hang its thinking on. Assume every document is carrying restatements that leading words retire — go find them.

**Negation** is the failure mode beside this lever: steering by prohibition drags the forbidden behaviour into context and makes it _more_ available, not less. _Don't think of an elephant_, and the elephant is all there is; the negation is a weak modifier the strongly-activated concept overruns, so the ban half-reads as an instruction to do the thing. Prompt the **positive** — state the target behaviour ("write one-line comments") so the banned one is never spoken. A prohibition earns its place only as a hard guardrail you cannot phrase positively; even then, pair it with the positive target so attention lands on what to do.

## Pruning

- Keep each meaning in a **single source of truth**: one authoritative place, so changing the behaviour is a one-place edit. **Duplication** — the same meaning in more than one place — costs maintenance and tokens, and inflates a meaning's prominence on the ladder past its real rank. (The accidental inverse of a leading word, which repeats a token on purpose, never the meaning.)
- The **environment** is a source of truth too — `package.json` scripts, config files, the directory layout, `--help` output — and a document that restates it is a **cache**: a copy of a lookup, earning its load only when the lookup is expensive. Cache what the agent cannot find by looking: the unwritten convention, the reason behind a choice, the gotcha no config confesses. Leave the one-file, one-command lookups to the environment, where they cannot go stale.
- Check every line for **relevance**: does it still bear on what the document does? A line loses relevance by never bearing on the task (mere exposition, or a branch that should be disclosed) or by going stale as the behaviour or world it describes changes. Shorter documents are easier to keep relevant. Without a pruning discipline the default fate is **sediment**: stale layers that settle because adding feels safe and removing feels risky, until you must core down through them to find what is still live.
- Hunt **no-ops** sentence by sentence: an instruction the model already obeys by default pays load to say nothing. The test — does it change behaviour versus the default? — is model-relative, not reader-relative: two people disagreeing about a no-op disagree about the default, and settle it by running the document, not by debate. When a sentence fails, delete the whole sentence rather than trim words from it. The test also grades leading words: a word too weak to beat the default (_be thorough_ when the agent is already thorough-ish) is a no-op, and the fix is a stronger word (_relentless_), not a different technique.
```

</details>
