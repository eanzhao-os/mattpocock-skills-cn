# 16-codebase-design / DESIGN-IT-TWICE.md 精读（双重方案并行对比设计模式（Design It Twice））

当用户希望为选定的加深改造候选模块探索多种备选接口设计时，调用此多子代理并行（parallel sub-agents）架构模式。源自 John Ousterhout 教授在《软件设计的哲学》中提出的核心原则 —— **“做两次设计（Design It Twice）”：你脑海中冒出的第一个设计构想，极大概率不是最好的**。

全流程统一使用 [SKILL.md](./16-codebase-design.md) 中定义的词汇体系 —— **模块（module）**、**接口（interface）**、**接缝（seam）**、**适配器（adapter）**、**杠杆率（leverage）**。

---

## 标准执行三步法（Process）

### 第 1 步：框定并具象化问题空间（Frame the problem space）
在分发子代理之前，先面向人类用户撰写一段对当前候选模块问题空间的精炼说明：
- 任何全新接口都必须严格满足的硬性业务约束；
- 它所依赖的外部项，以及这些依赖归属于哪一个具体类别（详见 [DEEPENING.md](./16-codebase-design_DEEPENING.md)）；
- 一段粗糙的代码骨架草图，用于把上述约束在纸面上具象化 —— 这不是正式提案，纯粹是让约束条件变得看得见摸得着。

将这段说明呈现给用户后，**立即毫不犹豫地推进到第 2 步**。在人类用户阅读和思考这些约束的同时，后台的多个子代理已经开始并行开工。

### 第 2 步：并发派发多路子代理（Spawn sub-agents）
同时并行派发 **3 个及以上** 的独立子代理。每一个子代理都必须为加深后的模块产出一套**结构上截然不同（radically different）**的接口设计。

为每一个子代理注入一份专属的技术任务简报（包含相关文件路径、代码耦合细节、依赖分类以及接缝背后的隐藏内容）。这份简报与第 1 步面向人类的说明相互独立。为每一个子代理赋予截然不同的设计约束偏好：
- **Agent 1（极简极致杠杆派）**：“将对外接口压缩到极致 —— 最多只暴露 1 到 3 个入口点。让每一个入口点的杠杆率（leverage）达到顶峰”；
- **Agent 2（极致灵活性派）**：“将拓展灵活性做到极致 —— 优先支持丰富多样的业务场景与未来扩展”；
- **Agent 3（高频调用者优先派）**：“为最常见的核心调用方进行极致优化 —— 让 80% 的默认业务场景调用变得无脑且开箱即用”；
- **Agent 4（六边形端口派，按需开启）**：“针对跨接缝依赖，围绕标准端口与适配器（Ports & Adapters）展开正规设计”。

在简报中同时融入 [SKILL.md](./16-codebase-design.md) 的架构词汇与项目的 `CONTEXT.md` 领域词汇，确保每个子代理在命名时与整体架构和业务语言保持绝对一致。

每一个子代理必须标准化输出以下 5 项物料：
1. **接口定义**（完整类型声明、函数签名、参数列表 —— 以及不变式规则、调用时序要求与报错模式）；
2. **实战调用示例**（展示业务调用方如何具体使用它）；
3. **接缝背后隐藏的具体实现细节**；
4. **外部依赖应对策略与适配器选型**（参考 [DEEPENING.md](./16-codebase-design_DEEPENING.md)）；
5. **架构权衡得失分析**（清晰指出该设计在何处杠杆率极高、在何处收益微薄）。

### 第 3 步：有序呈现、横向对比与专家主见裁决（Present and compare）
依次向用户呈现各个设计方案，让用户能够从容消化；随后用一段严密的行文进行横向综合对比。严格从三个硬维度展开对决：
- **接口深度（Depth）**：接口越小而内部承载行为越多，深度越深、杠杆率越高；
- **局部内聚性（Locality）**：未来代码发生变更时，修改点是高度集中在单点，还是散落各处；
- **接缝安置位置（Seam placement）**：接缝划定是否科学自然。

对比完成后，**旗帜鲜明地给出你自己的专家推荐**：明确指出你认为哪一套方案综合实力最强以及深层原因。如果不同方案中的亮点能够有机融合，主动提出一套强强联合的混合方案（Hybrid）。**立场必须鲜明坚定 —— 用户要的是充满洞见的专业架构裁决，而不是冷冰冰丢给他一份毫无主见的菜单让他自己猜**。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `16-codebase-design` |
| bucket | engineering |
| 上游路径 | `skills/engineering/codebase-design/DESIGN-IT-TWICE.md` |
| 角色定位 | 多子代理并行探索与双重对比设计哲学（Design It Twice Pattern） |
| 关联模块 | `16-codebase-design`、`12-prototype` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Design It Twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, use this parallel sub-agent pattern. Based on "Design It Twice" (Ousterhout) — your first idea is unlikely to be the best.

Uses the vocabulary in [SKILL.md](./16-codebase-design.md) — **module**, **interface**, **seam**, **adapter**, **leverage**.

## Process

### 1. Frame the problem space

Before spawning sub-agents, write a user-facing explanation of the problem space for the chosen candidate:

- The constraints any new interface would need to satisfy
- The dependencies it would rely on, and which category they fall into (see [DEEPENING.md](./16-codebase-design_DEEPENING.md))
- A rough illustrative code sketch to ground the constraints — not a proposal, just a way to make the constraints concrete

Show this to the user, then immediately proceed to Step 2. The user reads and thinks while the sub-agents work in parallel.

### 2. Spawn sub-agents

Spawn 3+ sub-agents in parallel. Each must produce a **radically different** interface for the deepened module.

Prompt each sub-agent with a separate technical brief (file paths, coupling details, dependency category from [DEEPENING.md](./16-codebase-design_DEEPENING.md), what sits behind the seam). The brief is independent of the user-facing problem-space explanation in Step 1. Give each agent a different design constraint:

- Agent 1: "Minimize the interface — aim for 1–3 entry points max. Maximise leverage per entry point."
- Agent 2: "Maximise flexibility — support many use cases and extension."
- Agent 3: "Optimise for the most common caller — make the default case trivial."
- Agent 4 (if applicable): "Design around ports & adapters for cross-seam dependencies."

Include both [SKILL.md](./16-codebase-design.md) vocabulary and CONTEXT.md vocabulary in the brief so each sub-agent names things consistently with the architecture language and the project's domain language.

Each sub-agent outputs:

1. Interface (types, methods, params — plus invariants, ordering, error modes)
2. Usage example showing how callers use it
3. What the implementation hides behind the seam
4. Dependency strategy and adapters (see [DEEPENING.md](./16-codebase-design_DEEPENING.md))
5. Trade-offs — where leverage is high, where it's thin

### 3. Present and compare

Present designs sequentially so the user can absorb each one, then compare them in prose. Contrast by **depth** (leverage at the interface), **locality** (where change concentrates), and **seam placement**.

After comparing, give your own recommendation: which design you think is strongest and why. If elements from different designs would combine well, propose a hybrid. Be opinionated — the user wants a strong read, not a menu.
```

</details>
