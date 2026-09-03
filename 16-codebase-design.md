# 16. codebase-design（Codebase Design（代码库架构与深模块设计））

```yaml
name: codebase-design
description: 为设计深模块（deep modules）提供统一的词汇体系。当用户希望设计或优化模块接口、寻找加深模块内聚的机会、决策架构接缝（seam）的位置、让代码更具可测试性或更适合 AI 导航，或当其他 skill 需要使用深模块设计词汇时触发。
```

设计 **深模块（deep modules）**：在干净整洁的架构接缝处，用极简小巧的对外接口承载大量丰富的内部行为，并通过该接口进行完整测试。在任何设计或重构代码的场景中，始终遵循这套语言体系与设计原则。其核心目的是：**为调用方提供高杠杆率（leverage），为维护者提供高局部内聚性（locality），为所有人提供极佳的可测试性（testability）**。

## 统一词汇表（Glossary）

请精准使用以下专业术语 —— 切勿随意替换为 "component（组件）"、"service（服务）"、"API" 或 "boundary（边界）"。保持全体系语言高度一致是本 skill 的核心所在：

- **模块（Module）** — 任何拥有“接口”和“实现”的实体。故意跨越粒度尺度：可以是一个函数、一个类、一个 package 包、或者跨越整个技术分层的垂直切片。*避免使用*：unit、component、service。
- **接口（Interface）** — 调用方为了正确使用该模块所**必须知道的一切信息**：不仅包含类型签名（type signature），还包含业务不变式（invariants）、调用顺序约束（ordering constraints）、错误失效模式（error modes）、必填配置项（required configuration）以及性能特征（performance characteristics）。*避免使用*：API、signature（这些词过于狭窄 —— 它们仅仅指代了类型层面的表象）。
- **实现（Implementation）** — 模块内部的代码实体主体。需与 **适配器（Adapter）** 明确区分：一个事物可以是“小适配器 + 大实现”（例如一个 Postgres 仓库实现），也可以是“大适配器 + 小实现”（例如一个内存假桩 In-memory Fake）。当核心讨论接缝机制时使用 "adapter"；其他情况下使用 "implementation"。
- **深度（Depth）** — 接口处呈现的杠杆效益：即调用方（或测试用例）每学习掌握一个单位的接口，所能够调动并执行的内部行为体量。当极简小巧的接口背后承载着极其丰富的庞大行为时，该模块就是 **深（deep）** 的；当接口的复杂度几乎赶上内部实现的复杂度时，该模块就是 **浅（shallow）** 的。
- **接缝（Seam）** _(源自 Michael Feathers《修改代码的艺术》)_ — 让你能够改变系统行为而**无需在当前位置直接修改代码**的地方；即模块接口物理存在的**所在位置**。接缝应该放置在什么位置本身就是一项独立的设计决策，与接口背后放置什么实现截然不同。*避免使用*：boundary（容易与 DDD 领域驱动设计的 Bounded Context 限界上下文产生混淆）。
- **适配器（Adapter）** — 在接缝处满足接口契约的具体实现对象。它描述的是**角色职责**（填充了什么插槽），而不是实体内容（里面具体是什么代码）。
- **杠杆率（Leverage）** — 调用方从“模块深度”中获取的巨大红利：调用方每学习一处接口，就能获得倍增的系统能力。一份内部实现能够为 N 处调用点和 M 个测试用例提供极高回报。
- **局部性 / 内聚性（Locality）** — 维护者从“模块深度”中获取的巨大红利：代码变更、缺陷修复、领域知识与测试验证全部高度集中在同一个地方，而不是散落在各个调用方中。一处修复，处处受益。

---

## 深模块 vs 浅模块（Deep vs Shallow）

**深模块（Deep module）** = 小接口 + 大实现：

```
┌─────────────────────────────────┐
│   小接口（Small Interface）       │  ← 极少的方法，极简的入参
├─────────────────────────────────┤
│                                 │
│   深实现（Deep Implementation）   │  ← 隐藏复杂的业务逻辑
│                                 │
└─────────────────────────────────┘
```

**浅模块（Shallow module）** = 大接口 + 浅薄实现（必须极力避免）：

```
┌─────────────────────────────────┐
│   大接口（Large Interface）       │  ← 大量的方法，复杂的入参
├─────────────────────────────────┤
│   浅薄实现（Thin Implementation）  │  ← 仅仅是在做无意义的转发透传
└─────────────────────────────────┘
```

在设计接口时，始终自我追问：
- 我能否减少对外暴露的方法数量？
- 我能否进一步简化入参？
- 我能否将更多内部复杂度隐藏在模块内部？

---

## 核心设计准则（Principles）

- **深度是接口所呈现的属性，而不是实现的行数**。一个深模块在内部完全可以由许多细小、可 Mock、可替换的子部件组合而成 —— 只要这些子部件不暴露在对外接口上即可。模块可以拥有其**内部私有接缝（internal seams）**（专供其内部测试使用），同时在其接口处对外呈现统一的**外部接缝（external seam）**。
- **代码删除测试法（The Deletion Test）**。设想彻底删除该模块：如果系统整体的复杂度直接烟消云散，说明该模块此前仅仅是个毫无价值的透传传声筒（Pass-through）；如果该模块的复杂度瞬间反弹并散落重现在 N 个调用方代码中，说明该模块确实在恪尽职守地发挥深模块价值。
- **接口就是唯一的测试表面（The interface is the test surface）**。业务调用方和自动化测试跨越的是同一道接缝。如果你发现自己必须绕过接口去探测内部细节才能写测试，说明该模块的形态设计很可能已经出现了偏差。
- **一个适配器意味着假设的接缝；两个适配器才代表真实的接缝**。除非接缝两侧确实存在不同的行为变化，否则不要凭空引入接缝。

---

## 面向可测试性的接口设计（Designing for Testability）

优良的接口会让自动化测试变得极其自然与顺畅：

1. **接收入参依赖，而不是在内部自行创建依赖（Accept dependencies, don't create them）**：

   ```typescript
   // 极易测试（通过参数注入依赖）
   function processOrder(order, paymentGateway) {}

   // 难以测试（在内部强行 new 紧耦合实例）
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **返回计算结果，而不是到处产生内部副作用（Return results, don't produce side effects）**：

   ```typescript
   // 极易测试（纯函数，直接断言返回值）
   function calculateDiscount(cart): Discount {}

   // 难以测试（直接修改全局或外部对象，无返回值）
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **极小的表面积（Small surface area）**：更少的方法意味着需要编写的测试用例更少；更少的参数意味着测试的前置准备（Setup）极其轻量简单。

---

## 概念之间的内在关系（Relationships）

- 一个 **模块（Module）** 恰好拥有一个 **接口（Interface）**（即呈现给调用方与测试用例的交互表面）。
- **深度（Depth）** 是 **模块（Module）** 的固有属性，相对于其 **接口（Interface）** 的复杂度进行衡量。
- **接缝（Seam）** 是 **模块（Module）** 的 **接口（Interface）** 物理栖息的位置。
- **适配器（Adapter）** 驻扎在 **接缝（Seam）** 处并完全满足 **接口（Interface）** 的规范。
- **深度（Depth）** 为外部调用方创造了 **高杠杆率（Leverage）**，为内部维护者创造了 **高内聚性（Locality）**。

---

## 明确废弃与拒绝的错误理解（Rejected Framings）

- **将深度理解为“实现代码行数与接口行数的数学比率”**（源自 Ousterhout 早期表述）：这种机械理解会反向鼓励开发者在实现里注水写废话。我们提倡将深度理解为“接口所能撬动的能力杠杆（depth-as-leverage）”。
- **将“接口”狭义理解为 TypeScript 的 `interface` 关键字或类的 public 公共方法**：这种理解过于狭隘 —— 这里的接口包含调用方为了正确使用该模块所必须掌握的全部事实与认知。
- **使用模糊的 "Boundary（边界）"**：该词与 DDD 的限界上下文严重重载。请准确使用 **seam（接缝）** 或 **interface（接口）**。

---

## 进阶探索（Going Deeper）

- **在已有依赖下加深模块簇（Deepening a cluster）** — 参阅 [DEEPENING.md](./16-codebase-design_DEEPENING.md)：掌握依赖分类法、接缝严明纪律、以及“直接替换而非套娃测试（replace-don't-layer）”。
- **探索替代接口形态（Exploring alternative interfaces）** — 参阅 [DESIGN-IT-TWICE.md](./16-codebase-design_DESIGN-IT-TWICE.md)：派发平行的子代理同时设计出几种结构截然不同的接口方案，然后在深度、局部内聚性以及接缝位置等维度上进行客观横向对比。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/codebase-design/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design |
| name | `codebase-design` |
| 触发方式 | description：Shared vocabulary for designin| companions | [DEEPENING.md](./16-codebase-design_DEEPENING.md)、[DESIGN-IT-TWICE.md](./16-codebase-design_DESIGN-IT-TWICE.md)——本页只列角色，不全文翻译 |
| 产物 | 模块接口（module/interface）、深度（depth）、seam、adapter、leverage、locality |
| 消费方 | `/tdd`、`improve-codebase-architecture`、`domain-modeling` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
---
name: codebase-design
description: Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary.
---

# Codebase Design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. Use this language and these principles wherever code is being designed or restructured. The aim is leverage for callers, locality for maintainers, and testability for everyone.

## Glossary

Use these terms exactly — don't substitute "component," "service," "API," or "boundary." Consistent language is the whole point.

**Module** — anything with an interface and an implementation. Deliberately scale-agnostic: a function, class, package, or tier-spanning slice. _Avoid_: unit, component, service.

**Interface** — everything a caller must know to use the module correctly: the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. _Avoid_: API, signature (too narrow — they refer only to the type-level surface).

**Implementation** — what's inside a module, its body of code. Distinct from **Adapter**: a thing can be a small adapter with a large implementation (a Postgres repo) or a large adapter with a small implementation (an in-memory fake). Reach for "adapter" when the seam is the topic; "implementation" otherwise.

**Depth** — leverage at the interface: the amount of behaviour a caller (or test) can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** _(Michael Feathers)_ — a place where you can alter behaviour without editing in that place; the *location* at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. _Avoid_: boundary (overloaded with DDD's bounded context).

**Adapter** — a concrete thing that satisfies an interface at a seam. Describes *role* (what slot it fills), not substance (what's inside).

**Leverage** — what callers get from depth: more capability per unit of interface they learn. One implementation pays back across N call sites and M tests.

**Locality** — what maintainers get from depth: change, bugs, knowledge, and verification concentrate in one place rather than spreading across callers. Fix once, fixed everywhere.

## Deep vs shallow

**Deep module** = small interface + lots of implementation:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation (avoid):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

When designing an interface, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, mockable, swappable parts — they just aren't part of the interface. A module can have **internal seams** (private to its implementation, used by its own tests) as well as the **external seam** at its interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.** Callers and tests cross the same seam. If you want to test *past* the interface, the module is probably the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a seam unless something actually varies across it.

## Designing for testability

Good interfaces make testing natural:

1. **Accept dependencies, don't create them.**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Return results, don't produce side effects.**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Small surface area.** Fewer methods = fewer tests needed. Fewer params = simpler test setup.

## Relationships

- A **Module** has exactly one **Interface** (the surface it presents to callers and tests).
- **Depth** is a property of a **Module**, measured against its **Interface**.
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** produces **Leverage** for callers and **Locality** for maintainers.

## Rejected framings

- **Depth as ratio of implementation-lines to interface-lines** (Ousterhout): rewards padding the implementation. We use depth-as-leverage instead.
- **"Interface" as the TypeScript `interface` keyword or a class's public methods**: too narrow — interface here includes every fact a caller must know.
- **"Boundary"**: overloaded with DDD's bounded context. Say **seam** or **interface**.

## Going deeper

- **Deepening a cluster given its dependencies** — see [DEEPENING.md](./16-codebase-design_DEEPENING.md): dependency categories, seam discipline, and replace-don't-layer testing.
- **Exploring alternative interfaces** — see [DESIGN-IT-TWICE.md](./16-codebase-design_DESIGN-IT-TWICE.md): spin up parallel sub-agents to design the interface several radically different ways, then compare on depth, locality, and seam placement.
````

</details>
