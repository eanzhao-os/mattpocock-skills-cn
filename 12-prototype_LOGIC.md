# 12-prototype / LOGIC.md 精读（业务逻辑与状态机可交互原型规范（Logic Prototype））

生成一个完全自包含的单 HTML 文件 —— 一份**开箱即用、可直接分享的交互式 Demo** —— 让任何非技术人员只需点击按钮就能亲自推演一套状态模型。当你的核心疑问聚焦在**业务逻辑合理性、状态机流转边界、或核心数据结构形态**时使用 —— 专门用来验证那些“在纸面上看起来完全合理、但唯有拿真实业务案例推演一遍才会暴露出别扭感觉”的底层难题。

正因为它是单文件且零安装依赖，你可以把它直接发给非开发人员（产品经理、UI 设计师、业务领域专家），让他们用直觉亲自感受这套模型是否顺畅。因此，界面的文案必须讲**业务通用语言**，而不是冷冰冰的技术代码。

---

## 1. 判定何时该采用本形态

- “我拿不准这套状态机能否妥善处理‘先发生 X 紧接着发生 Y’的极端边界情况”；
- “这套数据模型真的能够表达业务中出现的某种场景吗？”；
- “在正式编码之前，我想先摸索一下这个核心业务 API 应该长什么样”；
- 任何希望**通过狂按按钮亲眼观察系统状态变化**的探索场景。

> [!NOTE]
> 如果核心疑问是“这个界面具体应该排版成什么长相”，那就是走错了分支 —— 请查阅 [UI.md](./12-prototype_UI.md)。

---

## 2. 标准落地五步法（Process）

### 第 1 步：在最顶部明确核心提问（State the question）
在动笔编写任何代码之前，在页面的最顶部用一段肉眼可见的文字（绝不仅仅是一行代码注释）写清**本原型究竟在验证哪个状态模型、以及正在解答什么核心疑问**。一个回答了错误问题的原型纯属浪费时间；只有把核心疑问显式公示在头部，无论用户是实时在场还是事后回看，都能随时核对验证基准。

### 第 2 步：将纯核心逻辑封装为可移植模块（Isolate the logic）
将真正负责解答疑问的纯核心逻辑，集中写在单个 `<script>` 标签内，封装为一个**极其干净、纯粹、未来可以直接剪切并粘贴进生产代码库的独立模块**。外层的 HTML 页面是用后即弃的外壳；但这个核心逻辑模块不是。

根据业务问题的特征选择最匹配的纯逻辑形态：
- **纯 Reducer 函数** — `(state, action) => state`：适用于离散事件驱动且状态为单一值的场景；
- **状态机（State Machine）** — 拥有显式的状态节点与合法转换表：适用于需要严格判定“当前时刻究竟允许触发哪些动作”的场景；
- **针对纯数据结构的一组纯变换函数**：适用于没有隐式全局状态、纯靠数据管道转换的场景；
- **具备清晰方法接口（method surface）的 Class 或纯对象模块**：适用于业务逻辑确实需要持有长期内部状态的场景。

挑选形态的标准是“哪一种最契合当前问题”，而不是“哪一种最容易接到页面上”。**核心约束**：纯逻辑模块内部**严禁包含任何 DOM、`document` 或按钮事件监听器**。外部 HTML 页面单向调用纯逻辑模块，严禁反向依赖。正是这种单向隔离，让原型验证通过后，该纯模块能够原封不动地直接迁移至真实生产项目中。

### 第 3 步：组装开箱即用的优雅单 HTML 文件（Build the shareable HTML file）
纯原生 HTML/CSS/JS，所有资源全部内联，零框架、零打包工具、零本地服务 —— 双击即可在任何浏览器瞬间打开，甚至直接通过邮件附件流转。

面向非技术人员编写：所有的按钮与状态说明全部采用**领域语言（domain language）**，杜绝技术黑话，并用通俗易懂的文字说明当前正在发生什么。从上至下采用清晰规整的排版层级：
1. **标题与一句话问题陈述**；
2. **当前状态展示面板**：将当前完整的业务状态渲染为清晰易读的结构化看板（采用带标签的规整字段，**严禁直接丢一坨未经格式化的原始 JSON**），并在每次点击后实时高亮显示刚才究竟变化了什么；
3. **自由推演按钮区（Free-play buttons）**：每一个合法业务动作对应一个始终可用的独立按钮，用户可以按照任意天马行空的顺序随意乱点，每次点击立即触发状态流转并重新渲染状态面板；
4. **引导式剧情推演区（Guided walkthroughs）**：按 Tab 页签组织一系列经典业务**剧情场景（Scenarios）**。每个页签包含一段通俗的剧情说明（交代前情背景以及需要重点观察的异常点），并在下方陈列**按既定顺序需要依次按下的步骤按钮**，点击某个步骤按钮即执行对应动作并推进至下一步。每次切换剧情会自动重置到标准初始状态，确保推演具备绝对可重现性。

挑选剧情场景时，优先挑那些能暴露别扭之处的：主流程（happy path）、棘手的边界案例、一次理应被判定为非法的尝试 —— 也就是那些在纸面上很难推演清楚的场景。

排版风格：优雅克制 —— 干净的字体、充裕的留白、单一强调色。不做动画、不搞花哨噱头 —— 任何元素都不应与状态展示和按钮抢夺注意力。

### 第 4 步：交付给业务方体验并收集认知 Bug（Hand it over）
将文件发给用户或业务专家，或者直接帮对方打开。对方会在方便时自行点击剧情推演与自由按钮试玩；最关键的黄金反馈往往是对方惊呼：“等等，这个状态下怎么可能允许执行审核通过？” 或者 “咦，我原本以为点这个之后 X 应该自动变成已完成呀” —— **这些正是最初业务构想中的逻辑 Bug，而提前揪出它们正是原型的最大价值**。如果对方想要新增动作或新剧情，直接加上 —— 原型本来就会持续演化。

### 第 5 步：沉淀决策并归档原型（Capture the answer and prototype）
一旦原型成功解答了疑问，先沉淀答案，再按照 [SKILL.md](./12-prototype.md) 描述的方式归档原型本体。落到逻辑原型上的具体映射：
- 将通过了验证的纯逻辑模块剪切提升到生产模块中（完成架构决策吸收）；
- 将外层的单 HTML 演示文件移入用后即弃分支，作为一手原始资料（primary source）归档，随时可被后人重新双击打开复现验证。

---

## 3. 常见反模式与避坑清单（Anti-patterns）

- **严禁为原型编写自动化测试**：一个需要写测试来保驾护航的原型就已经不再是用后即弃的原型了；
- **严禁直连真实数据库**：除非疑问本身就是关于持久化机制的，否则一律使用纯内存状态；
- **严禁过度通用化设计**：不要考虑“万一日后我们要支持拓展 X 怎么办”，原型只回答当下这一个具体疑问；
- **严禁将业务逻辑与 DOM 渲染搅和在一起**：一旦纯模块碰了 DOM，就彻底失去了后续直接移植进生产代码的能力，页面必须始终只是包裹纯模块的一层薄壳；
- **严禁引入 React/Vue 等框架或开发服务器**：必须是一点即开的纯单文件 —— React 应用或开发服务器都会毁掉“可分享”这一初衷；
- **严禁把 HTML 外壳送进生产环境**：页面是专为人工点击推演而优化的，真正值得保留的是它背后的逻辑模块。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `12-prototype` |
| bucket | engineering |
| 上游路径 | `skills/engineering/prototype/LOGIC.md` |
| 角色定位 | 业务逻辑与状态机可交互演示原型规范（Logic Prototype Specification） |
| 关联模块 | `12-prototype`、`15-domain-modeling` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Logic Prototype

A single, self-contained HTML file (a **shareable demo**) that lets anyone drive a state model by clicking buttons. Use this when the question is about **business logic, state transitions, or data shape**: the kind of thing that looks reasonable on paper but only feels wrong once you push it through real cases.

Because it's one file with nothing to install, you can hand it to a non-developer (a designer, a PM, a domain expert) and let them feel the model for themselves. So it speaks their language, not the code's.

## When this is the right shape

- "I'm not sure if this state machine handles the edge case where X then Y."
- "Does this data model actually let me represent the case where..."
- "I want to feel out what the API should look like before writing it."
- Anything where someone wants to **press buttons and watch state change**.

If the question is "what should this look like," this is the wrong branch. Use [UI.md](./12-prototype_UI.md).

## Process

### 1. State the question

Before writing code, write down what state model and what question you're prototyping. One paragraph, at the top of the demo (in a visible intro, not just a comment). A logic prototype that answers the wrong question is pure waste, so make the question explicit so it can be checked later, whether the user is watching now or returning to it AFK.

### 2. Isolate the logic in a portable module

Put the actual logic (the bit that's answering the question) in a single `<script>` block written as a small, pure module that could be lifted out and dropped into the real codebase later. The page around it is throwaway; this module isn't.

The right shape depends on the question:

- **A pure reducer**: `(state, action) => state`. Good when actions are discrete events and state is a single value.
- **A state machine**: explicit states and transitions. Good when "which actions are even legal right now" is part of the question.
- **A small set of pure functions** over a plain data type. Good when there's no implicit current state, just transformations.
- **A class or module with a clear method surface** when the logic genuinely owns ongoing internal state.

Pick whichever shape best fits the question being asked, *not* whichever is easiest to wire to a page. Keep it pure: no DOM, no `document`, no button handlers reaching inside it. The page calls into it; nothing flows the other direction. This is what makes the prototype useful past its own lifetime: once the question's answered, the validated reducer / machine / function set lifts into the real module on its own.

### 3. Build the shareable HTML file

One file, plain HTML/CSS/JS: no framework, no bundler, no server, everything inline so it opens by double-click and survives being emailed around. Anyone should be able to run it by opening it.

Write it for a non-developer. Every label is in **domain language**, not code: buttons and state read like the business, not the reducer. Explain in plain words what's happening.

Lay it out with a clean hierarchy, top to bottom:

1. **Title and one-line explanation** of what this demo lets you explore (the question from step 1).
2. **Current state**: the full relevant state, rendered as a readable panel (labelled fields, not a raw JSON dump), re-rendered after every click so the change is visible. Where it helps a non-developer follow, call out what just changed.
3. **Free-play buttons**: one button per action, always available, so anyone can poke at the model in any order. Each click dispatches its action and re-renders the state.
4. **Guided walkthroughs**: a set of **scenarios**, one per tab. Each tab holds a short plain-language description of the scenario (the situation it sets up and what to watch for) and underneath it, the ordered **buttons to press** for that scenario. Each step is a real button: clicking it performs that action and moves to the next step. Starting a walkthrough resets to a known initial state so the scenario runs the same way every time.

Choose scenarios that demonstrate the awkward cases, the ones hard to reason about on paper: the happy path, a tricky edge case, an attempt at something that should be illegal.

Keep it beautiful but restrained: clean typography, generous spacing, one accent colour. No animations, no gimmicks: nothing that competes with the state and the buttons.

### 4. Hand it over

Send them the file, or open it for them. They'll click through the walkthroughs and free-play whenever they get to it; the interesting moments are when they say "wait, that shouldn't be possible" or "huh, I assumed X would be different"; those are the bugs in the _idea_, which is the whole point. If they want new actions or a new scenario, add them. Prototypes evolve.

### 5. Capture the answer and the prototype

Once the prototype has answered its question, capture the answer, then capture the prototype the way the [SKILL](./12-prototype.md) describes. The logic-specific mapping: the validated reducer / machine / function set lifts into the real module (the decision, absorbed); the HTML shell rides along to the throwaway branch that keeps the prototype as a primary source, and being one self-contained file, it stays trivially re-runnable there.

## Anti-patterns

- **Don't add tests.** A prototype that needs tests is no longer a prototype.
- **Don't wire it to the real database.** Use in-memory state unless the question is specifically about persistence.
- **Don't generalise.** No "what if we wanted to support X later." The prototype answers one question.
- **Don't blur the logic and the page together.** If the pure module references the DOM, `document`, or button handlers, it's no longer liftable. Keep the page as a thin shell over a pure module.
- **Don't reach for a framework, bundler, or server.** One file the recipient double-clicks; a React app or a dev server defeats "shareable".
- **Don't ship the HTML shell into production.** The page is optimised for being clicked through by hand. The logic module behind it is the bit worth keeping.
```

</details>
