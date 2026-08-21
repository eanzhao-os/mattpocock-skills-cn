# 19. wayfinder（Wayfinder（超大工程迷雾路线图与决策工单流转））

## 中文翻译

```yaml
name: wayfinder
description: 将远超单次 Agent 会话容量的超大型工作，规划为工单系统（issue tracker）上一张由“决策工单（decision tickets）”组成的共享导航地图，并逐一攻克求解，直至通往最终目标的路线彻底清晰。
disable-model-invocation: true
```

一个庞大而模糊的想法摆在眼前 —— 它体量巨大，单次 Agent 会话根本装不下，且通篇笼罩在未知迷雾之中：从当前起点通往**最终目标（destination）**的具体路径尚不可见。Wayfinding 的核心使命是**探明并踩通这条路**，而不是盲目鲁莽地直接向终点发起冲锋。本 skill 会在代码仓库的工单跟踪系统上，将整个路线绘制为一张**共享导航地图（shared map）**，然后逐一攻关其中的**决策工单（decision tickets）** —— 这些工单的目标是**敲定一项决策**，而不是去执行具体的代码构建切片 —— 一次攻克一张决策，直至整条前行路线彻底明朗。

最终目标（destination）因任务不同而千差万别，**为其准确定名是绘制地图的第一要务** —— 它将直接塑造每一张子工单的形态。目标可能是一份可交接并持续迭代的需求规范（spec）、一项在详细规划前必须锁死的重大技术决议、或者是像底层数据结构迁移那样就地落地的架构变更。地图本身是领域无关的 —— 无论是复杂的工程重构、体系化课程编写、还是任何符合此形态的巨型事项均可适用。

---

## 规划定夺，而非直接动手（Plan, don't do）

Wayfinder 在默认情况下**完全聚焦于规划决策**：每张工单负责敲定一项核心决策，当通往终点的路线彻底清晰、在某人去具体动手编码之前不再遗留任何悬而未决的决策盲区时，整张地图便告完成。那种“想直接把代码撸出来”的冲动，通常是你在向导地图上已经抵达前沿边缘并应当正式交接给实现阶段的信号。某项大型工程可以在其 **Notes 备忘** 中覆盖此规则 —— 将部分具体执行动作纳入地图本身 —— 但在没有特别说明的情况下，**只产出敲定的决策，不产出最终可交付代码**。

---

## 始终以明确名称进行指代（Refer by name）

由于每一张地图和每一张子工单都是工单系统中的一个真实 Issue，因此它都拥有一个**人类可读的名称（Title）**。在所有供人类阅读的文本中 —— 无论是过程叙述、还是地图上的“截至目前已敲定决策”列表中 —— **始终使用其正式名称进行指代**，绝不要使用生硬的裸编号、纯数字或 slug 标识符。满屏的 `#42, #43, #44` 是毫无可读性的天书；而具体的名字让人一眼就能理解其意图。工单的 ID 和链接并未消失 —— 名称本身包裹了该链接 —— 但 ID 是*附着在名称内部*提供跳转，绝不能喧宾夺主替代名字本身。

---

## 导航地图的组织结构（The Map）

导航地图是当前仓库工单系统中的一个单独 Issue，被打上 `wayfinder:map` 标签 —— 这是整个工程的**权威凭据产物（canonical artifact）**。所有的具体决策工单都是该地图 Issue 下属的子 Issue。

地图本质上是一份**索引目录（index）**，而不是数据的倾倒仓库。它汇总列出已经敲定的各项决策，并精准指向承载这些决策细节的对应工单；每一项决策有且仅有一个归属地 —— 即其专属的决策工单 —— 因此地图本身绝不会对细节进行车轱辘话复述，仅提供一句话要点概括与跳转链接。

**地图及其子工单、前置阻塞依赖以及决策前沿的物理存储与表达方式取决于具体的工单系统**。工单系统的配置应当已经同步给你 —— 如果尚未同步，请运行 `/setup-matt-pocock-skills`。查阅工单系统文档中的“Wayfinding 操作”章节，了解当前仓库是如何表达它们的。如果未提供任何具体工单系统配置，默认采用本地 Markdown 文件的工单跟踪模式。

### 地图正文结构（The map body）

地图正文是以低分辨率呈现的全局全貌，每次会话仅需加载一次。**未决进行中的工单不要直接平铺在正文里** —— 它们是地图的活跃子 Issue，通过系统查询即可获取。

```markdown
## Destination（终点目标）

<抵达本张地图终点时呈现的形态 —— 本次宏大工程最终要探明的 spec 规范、重大技术决策或代码变更。一到两行概括；每次会话在选择认领工单前必须先阅读它以校准方向。>

## Notes（背景备忘）

<业务领域背景；每次会话都应查阅的关键 skills；本次工程中长期有效的偏好约定>

## Decisions so far（截至目前已敲定决策）

<!-- 核心索引区 —— 每个已关闭工单占一行：足以让读者判断相关性，点击链接即可深潜查看工单内详尽细节 -->

- [<已关闭工单标题>](link) — <一句话决策答案提炼>

## Not yet specified（尚未具象化的迷雾区）

<!-- 参阅“战争迷雾”：属于本次范围之内但当前尚无法细化拆票的未知盲区；随着探索前沿的推进而逐步晋升为具体工单 -->

## Out of scope（明确排除在范围之外的事项）

<!-- 参阅“超出范围”：明确裁定超出本次终点目标的工作；直接关闭，永不晋升为后续工单 -->
```

### 决策工单结构（Tickets）

每一张工单都是地图的一个**子 Issue**；工单系统分配的 Issue ID 即为其唯一身份标识。工单正文就是待解答的核心问题，粒度严格控制在单个 100K token Agent 会话所能驾驭的体量：

```markdown
## Question（核心问题）

<本工单需要攻克并敲定的核心技术决策或调研方向>
```

每张工单都打上 `wayfinder:<type>` 标签 —— 分别为 `research`、`prototype`、`grilling`、`task` 之一（详见下方[工单类型定义](#工单类型定义)）。

**工单认领机制**：会话在展开任何实际工作之前，**首先**将工单指派给正在驱动地图的开发者来**认领（claim）**它，以确保并发运行的其他会话会自觉跳过该工单。该被指派人*本身就代表着*认领状态：未指派的打开工单即视为尚未认领。

**前置依赖阻塞（Blocking）**使用工单系统**原生**的依赖关系 —— 这一点至关重要，因为工单系统自身的 UI 能够将决策推进的前沿**直观可视化呈现**出来，使人类无需打开地图正文就能一眼看清当前哪些工单已解锁可被执行。只有在工单系统缺乏原生阻塞关联时，才降级使用正文约定的方式。当一张工单的所有前置阻塞工单全部关闭后，该工单即处于**解除阻塞（unblocked）**状态；**决策前沿（frontier）**就是所有处于打开、已解除阻塞、且尚未被认领的子工单 —— 即人类认知已知的边界。

决策的最终答案并不直接写在初始正文中 —— 它是解决完成时被记录下来的。在解决工单期间生成的资产（原型分支、报告等）通过链接挂载在 Issue 上，不要直接全篇粘贴在正文里。

---

## 工单类型定义（Ticket Types）

每张工单要么属于 **人机在环（HITL）** —— 即与一位能够自主表达意志的真实人类协同推进；要么属于 **无人值守（AFK）** —— 完全由 Agent 独立自主驱动。人机在环工单**必须**通过实时的交流互动才能达成决议；Agent 绝对不能擅自替人类代劳回答（一个自己向自己提问并自己作答的追问 Agent 彻底破坏了这一原则）。

- **调研型（Research）** (AFK)：查阅官方文档、第三方 API 协议、或代码库内的本地知识库，挖掘出某项决策所苦苦等待的关键客观事实。由 `/research` **子代理**独立解决。当需要查阅当前工作目录之外的知识时使用。
- **原型型（Prototype）** (HITL)：通过构建极低成本、粗糙但具体的代码产物来大幅拉高沟通探讨的保真度 —— 一个大纲、一份粗略构想、一个测试桩，或通过 `/prototype` skill 编写的 UI/逻辑原型。在工单中将原型作为资产进行外链。当“它应该长什么样”或“它应该如何运转”是核心症结时使用。
- **追问访谈型（Grilling）** (HITL)：深度对话探讨。这是最默认的标准形态。始终联动调用 `/grilling` 和 `/domain-modeling` skill。
- **前置任务型（Task）** (HITL 或 AFK)：在能够做出某项*决策*之前所必须完成的手工前置准备工作 —— 此处不存在需要决策、做原型或调研的内容，但如果不把这项工作做完，后续的决策讨论就会被死死阻塞。例如：注册某项云服务以便评估其 API、开通访问权限、清洗并搬迁数据以便观察其数据形态。这是**唯一一种“去实际做事而不是做决策”**的工单类型 —— 它的存在价值完全在于**解锁后续的某项决策**，而不是直接交付终点目标。在 Agent 能够独立自主完成的地方全自动执行（AFK）；否则向人类列出极其精准的操作清单（HITL）。当该项准备工作彻底搞定后工单即告解决；最终答案需详细记录所完成的事项以及产生的客观事实（凭据存放位置、新生成的 URL、数据行数等），以供后续依赖它的工单消费。

---

## 战争迷雾（Fog of war）

导航地图是**刻意保持不完整的**：绝不要去绘制你当前还根本看不见的事物。在当前活跃工单的视界之外，笼罩着**战争迷雾（fog of war）** —— 即你能隐约感知到它们必将来临、但由于前置问题尚未敲定而目前根本无法精确量化定义的决策与调研盲区。解决当前的一张工单能够逐步驱散其前方的迷雾，将现在已经能够清晰具象化的内容**晋升（graduate）**为一张张崭新的子工单 —— 循序渐进推进，直到通往终点目标的路线彻底清晰，且不再遗留任何待办工单。

地图上的 **“尚未具象化的迷雾区（Not yet specified）”** 板块正是用来记录这些模糊远景的地方：推测可能会涉及的问题、未来需要重新审视的技术领域。它是通往终点方向**尚未探明的未知前沿** —— 这里记录的所有内容都完全在本次工程的范围之内，只是当前还不够锐利清晰、无法拆成工单。按照当前视界所允许的清晰度自由书写；它同时充当了路标，方便后续协作者理解本次工程的整体推进方向。

**究竟是该建工单还是留作迷雾？** 核心判据在于你**当前能否极其精确地陈述出该问题** —— 而*不是*你当前能否解答它。
- **创建工单**：只要该问题当前已经被定义得极其精准 —— 即使它目前被其他工单阻塞而暂时无法动手，也要建工单。
- **留在迷雾区**：如果你当前还无法将其表述得足够犀利精准。不要把迷雾过早强行切成一个个工单大小的碎片：迷雾的颗粒度远比工单要粗，一旦探索前沿真正抵达此处，一块迷雾可能会晋升出好几张工单，也可能直接烟消云散无需建单。

**尚未具象化的迷雾区**严格排除了：已经敲定的决策（已在 Decisions so far 中）、已经存在的活跃工单、以及明确超出范围的事项（下一板块）。

---

## 明确超出范围的事项（Out of scope）

战争迷雾只会在**通往终点目标的方向上**聚集。终点目标锚定了整个工程的边界，因此任何超出该终点之外的工作都属于 **明确超出范围（out of scope）** —— 它们不是迷雾，也绝对不属于**尚未具象化的迷雾区**。它们在地图上拥有专属的 **“明确超出范围的事项（Out of scope）”** 板块：即你在本次工程中**自觉且明确予以排除**的工作。是将它们归入此处的决定性因素是“边界范围”，而不是“清晰程度”。

超出范围的工作**永远不会晋升为工单** —— 探索前沿在抵达终点目标后便戛然而止 —— 因此只有当终点目标被彻底重绘时它们才可能被重新纳入考量，届时它们将作为全新的工程启动，而不是本次工程的续集。

裁定某件事超出范围是一项**划定边界的管理动作**，而不是路线图上的一个前进台阶。当一张已经存在的工单被证实其实位于终点目标之外时 —— 无论是在最初绘制地图时划错了范围，还是被某项决策的结果暴露出来 —— **直接将其关闭**（已关闭的工单能够毫不含糊地脱离决策前沿），并在地图的 **Out of scope** 板块留下一行说明：概括要点并解释为何超出范围，同时附上该关闭工单的链接。它绝对不要出现在 **Decisions so far** 中，因为后者记录的是实际走过的路线 —— 边界裁定并不属于前进的一个步伐。

---

## 调用方式与执行规则（Invocation）

包含两种核心运作模式。无论哪种模式，**单次会话中严禁解决超过一张工单** —— 唯一的例外是可以并行派发 research 调研类工单。

### 1. 绘制初始地图（Chart the map）

用户带着一个粗糙庞大的想法调用本命令：
1. **为终点目标命名（Name the destination）**：运行一次 `/grilling` 和 `/domain-modeling` 会话，精准敲定这张地图最终要探明什么 —— 最终是一份 spec 需求规范、一项重大决策、还是具体的代码重构。终点目标界定了整体范围，必须最先达成共识。
2. **绘制前沿全貌（Map the frontier）**：再次进行追问访谈，这一次采用**广度优先（breadth-first）**：在整个问题空间中广泛铺开，而不是在某一个特定分支上过度深潜，全面暴露当前所有未决的重大决策以及当前第一步能够立刻开展的动作。**如果一番梳理下来发现没有任何迷雾** —— 即通往终点的路线早已一清二楚，整个旅程小到一次会话就能搞定 —— 说明根本不需要大费周章建地图。停下来询问用户希望如何直接推进。
3. **创建地图 Issue**（打上 `wayfinder:map` 标签）：填好 Destination（终点）和 Notes（备忘），Decisions-so-far 留空，将当前隐约可见的模糊盲区勾勒到 **Not yet specified** 中。
4. **创建当前已经能够明确定义的子工单** 作为地图的子 Issue —— 随后在**第二轮遍历中连接前置阻塞依赖关系**（Issue 必须先具备 ID 才能相互引用）。通过依赖关系将它们自然划分为“前沿可执行工单”与“被阻塞工单”；所有当前尚无法明确拆单的内容全部留在迷雾区（**Not yet specified**）。
5. **并行派发调研子代理**：针对刚刚创建的每一张 `research` 调研工单，拉起一个 `/research` 子代理进行并行查阅，将其调研结论保存在用后即弃的 `research/<name>` 分支上，并在工单中留下上下文指针。
6. 结束当前会话 —— 绘制地图是单次会话的完整工作；在此阶段不要顺手去手动解决任何业务决策工单。

### 2. 推进地图工单（Work through the map）

用户携带地图标识（URL 或 Issue 编号）调用本命令。指定具体工单编号是**可选的** —— 如果未指定，由你来根据前沿挑选下一项决策，而不是甩给用户选。

1. 加载**地图** —— 只需阅读低分辨率的全局概貌，不要一次性把所有子工单的正文全部加载进来。
2. 选择工单：如果用户指定了某张工单，直接采用；否则按顺序认领决策前沿上的第一张未阻塞工单。**立刻认领该工单**：在动手前先将工单指派给自己，避免并发会话重复领取。该指派状态*本身就是*认领凭据：未指派的工单即视为未认领。
3. 攻克解决该工单 —— **按需下钻（zoom as needed）**：按需拉取关联工单或历史关闭工单的完整正文；调用地图 `## Notes` 中指定的各项 skills。如有疑问，默认联动使用 `/grilling` 和 `/domain-modeling`。
4. 记录决议结果：将最终答案作为**决议评论**发表在工单下，**关闭**该 Issue，并在地图的 Decisions-so-far 板块中**追加一行上下文指针**。
5. 追加新暴露出的工单（创建并连接阻塞关系）；将答案所驱散的迷雾**晋升为崭新工单**，并从 **Not yet specified** 中彻底移除已晋升的迷雾板块。如果决议表明某张工单（当前工单或其他工单）其实已经超出了终点范围，**将其裁定为超出范围（rule it out of scope）**，而不是当作正常路线去解决。如果该项决议推翻作废了地图上的其他分支，同步更新或删除对应的工单。

用户可能会在后台并行推进多张解除阻塞的工单，因此随时要预期工单系统可能会被其他并发会话同时编辑。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/wayfinder/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder |
| name | `wayfinder` |
| 触发方式 | description：Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on your issue tracker（user-invoked） |
| companions | 无独立 companion 文件；依赖 tracker 的 "Wayfinding operations" 配置 |
| 产物 | `wayfinder:map` issue + decision tickets |
| 消费方 | `/to-spec`（collapse map） |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: wayfinder
description: Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on your issue tracker, and resolve them one at a time until the way to the destination is clear.
disable-model-invocation: true
---

A loose idea has arrived — too big for one agent session, and wrapped in fog: the way from here to the **destination** isn't visible yet. Wayfinding is about finding that way, not charging at the destination. This skill charts the way as a **shared map** on the repo's issue tracker, then works its **decision tickets** — questions whose resolution is a decision, not slices of a build to execute — one at a time until the route is clear.

The destination varies per effort, and naming it is the first act of charting — it shapes every ticket. It might be a spec to hand off and iterate on, a decision to lock before planning starts, or a change made in place like a data-structure migration. The map is domain-agnostic — engineering work, course content, whatever fits the shape.

## Plan, don't do

Wayfinder is **planning** by default: each ticket resolves a decision, and the map is done when the way is clear — nothing left to decide before someone goes and does the thing. The pull to just do the work is usually the signal you've reached the edge of the map and it's time to hand off. An effort can override this in its **Notes** — carrying execution into the map itself — but absent that, produce decisions, not deliverables.

## Refer by name

Every map and ticket is an issue, so it has a **name** — its title. In everything the human reads — narration, the map's Decisions-so-far — refer to it by that name, never by a bare id, number, or slug. A wall of `#42, #43, #44` is illegible; names read at a glance. The id and URL don't vanish — a name wraps its link — but they ride _inside_ the name, never stand in for it.

## The Map

The map is a single issue on this repo's issue tracker, labelled `wayfinder:map` — the canonical artifact. Its tickets are child issues of the map.

The map is an **index**, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place — its ticket — so the map never restates it, only gists it and links.

**Where the map, its child tickets, blocking, and frontier queries physically live is tracker-specific.** The issue tracker should have been provided to you — run `/setup-matt-pocock-skills` if not. Consult the tracker doc's "Wayfinding operations" section for how _this_ repo expresses them. If no tracker has been provided, default to the local-markdown tracker.

### The map body

The whole map at low resolution, loaded once per session. Open tickets are **not** listed — they are open child issues, found by query.

```markdown
## Destination

<what reaching the end of this map looks like — the spec, decision, or change this effort is finding its way to. One or two lines; every session orients to it before choosing a ticket.>

## Notes

<domain; skills every session should consult; standing preferences for this effort>

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [<closed ticket title>](link) — <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

### Tickets

Each ticket is a **child issue** of the map; the tracker's issue id is its identity. Its body is the question, sized to one 100K token agent session:

```markdown
## Question

<the decision or investigation this ticket resolves>
```

Each ticket carries a `wayfinder:<type>` label — one of `research`, `prototype`, `grilling`, `task` (see [Ticket Types](#ticket-types)).

A session **claims** a ticket by assigning it to the dev driving the map, **first**, before any work, so concurrent sessions skip it. That assignee _is_ the claim: an open, unassigned ticket is unclaimed.

Blocking uses the tracker's **native** dependency relationship — essential because it renders the frontier _visually_ in the tracker's own UI, so the human sees what's takeable without opening the map. Only a tracker that lacks native blocking falls back to a body convention. A ticket is **unblocked** when every ticket blocking it is closed; the **frontier** is the open, unblocked, unclaimed children — the edge of the known.

The answer isn't part of the body — it's recorded on resolution (see [Work through the map](#work-through-the-map)). Assets created while resolving a ticket are linked from the issue, not pasted in.

## Ticket Types

Every ticket is either **HITL** — human in the loop, worked _with_ a human who speaks for themselves — or **AFK**, driven by the agent alone. A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this).

- **Research** (AFK): Reading documentation, third-party APIs, or local resources like knowledge bases to surface a fact a decision waits on. Resolved by a `/research` **subagent**. Use when knowledge outside the current working directory is required.
- **Prototype** (HITL): Raise the fidelity of the discussion by making a cheap, rough, concrete artifact to react to — an outline, a rough take, a stub, or UI/logic code via the /prototype skill. Links the prototype as an asset. Use when "how should it look" or "how should it behave" is the key question.
- **Grilling** (HITL): Conversation. The default case. Always invoke the /grilling and /domain-modeling skills.
- **Task** (HITL or AFK): Manual work that must happen before a _decision_ can be made — nothing to decide, prototype, or research, but the discussion is blocked until it's done. Signing up for a service so its API can be judged, provisioning access, moving data so its shape can be seen. This is the one type that _does_ rather than decides — and it earns its place by unblocking a decision, not by delivering the destination. The agent drives it alone where it can (AFK); otherwise it hands the human a precise checklist (HITL). Resolved when the work is done; the answer records what was done and any resulting facts (credentials location, new URLs, row counts) later tickets depend on.

## Fog of war

The map is _deliberately_ incomplete: don't chart what you can't yet see. Beyond the live tickets lies the **fog of war** — the dim view of decisions and investigations you can tell are coming but can't yet pin down, because they hang on questions still open, because they hang on questions still open. Resolving a ticket clears the fog ahead of it, graduating whatever's now specifiable into fresh tickets — one at a time, until the way to the destination is clear and no tickets remain.

The map's **Not yet specified** section is where that dim view is written down: the suspected question, the area to revisit later. It's the undiscovered frontier _toward_ the destination — everything here is in scope, just not sharp enough to ticket. Write as loosely or as fully as the view allows; it doubles as a signpost for collaborators reading where the effort is headed.

**Fog or ticket?** The test is whether you can state the question precisely now — _not_ whether you can answer it now.

- **Ticket when** the question is already sharp — even if it's blocked and you can't act on it yet.
- **Not yet specified when** you can't yet phrase it that sharply. Don't pre-slice the fog into ticket-sized pieces: it's coarser than a ticket, and one patch may graduate into several tickets, or none, once the frontier reaches it.

**Not yet specified** excludes what's already decided (Decisions so far), what's already a live ticket, and what's out of scope (the next section).

## Out of scope

Fog only ever gathers _toward_ the destination. The destination fixes the scope, so work beyond it is **out of scope** — it isn't fog, and it doesn't belong in **Not yet specified**. It gets its own **Out of scope** section on the map: work you've consciously ruled out of _this_ effort. Scope, not sharpness, lands it here.

Out-of-scope work never graduates — the frontier stops at the destination — so it returns only if the destination is redrawn, and then as a fresh effort, not a resumption.

Ruling something out of scope is a scoping act, not a step on the route. When a ticket that already exists turns out to sit past the destination — mis-scoped in while charting, or exposed by a resolution — **close it** (a closed ticket is unambiguously off the frontier) and leave one line in the **Out of scope** section: the gist plus why it's out of scope, linking the closed ticket. It stays out of **Decisions so far**, which records the route actually walked — a scope boundary isn't a step on it.

## Invocation

Two modes. Either way, **never resolve more than one ticket per session** — with the exception of research tickets.

### Chart the map

User invokes with a loose idea.

1. **Name the destination.** Run a `/grilling` and `/domain-modeling` session to pin down what this map is finding its way to — the spec, decision, or change this effort is finding its way to. The destination fixes the scope, so it's settled first.
2. **Map the frontier.** Grill again, **breadth-first** this time: fan out across the whole space rather than deep on any one thread, surfacing the open decisions and the first steps takeable now. **If this surfaces no fog** — the way to the destination is already clear, the whole journey small enough for one session — you don't need a map. Stop and ask the user how they'd like to proceed.
3. **Create the map** (label `wayfinder:map`): Destination and Notes filled in, Decisions-so-far empty, the fog sketched into **Not yet specified**.
4. **Create the tickets you can specify now** as child issues of the map — then wire blocking edges in a **second pass** (issues need ids before they can reference each other). Wiring sorts them into the frontier and the blocked; everything you can't yet specify stays in the fog — the **Not yet specified** section.
5. **Fire the research subagents.** For each `research` ticket you just created, spin up a `/research` subagent to resolve it in parallel, capturing its findings on a throwaway `research/<name>` branch with a context pointer from the ticket.
6. Stop — charting is one session's work; it hand-resolves nothing.

### Work through the map

User invokes with a map (URL or number). A ticket is **optional** — without one, you pick the next decision, not the user.

1. Load the **map** — the low-res view, not every ticket body.
2. Choose the ticket. If the user named one, use it. Otherwise take the first frontier ticket in order. **Claim it**: assign it to yourself before any work, so concurrent sessions skip it. That assignee _is_ the claim: an open, unassigned ticket is unclaimed.
3. Resolve it — **zoom as needed**: fetch the full body of any related or closed ticket on demand; invoke the skills the `## Notes` block names. If in doubt, use `/grilling` and `/domain-modeling`.
4. Record the resolution: post the answer as a **resolution comment**, **close** the issue, and **append a context pointer** to the map's Decisions-so-far.
5. Add newly-surfaced tickets (create-then-wire); graduate any fog the answer has made specifiable, clearing each graduated patch from **Not yet specified** so it lives only as its new ticket. If the answer reveals a ticket — this one or another — sits beyond the destination, **rule it out of scope** rather than resolving it on the route. If the decision invalidates other parts of the map, update or delete those tickets.

The user may run unblocked tickets in parallel, so expect other sessions to be editing the tracker concurrently.
```

</details>
