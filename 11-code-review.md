# 11. code-review（Code Review（双轴代码审查））

```yaml
name: code-review
description: 沿着两条独立轴线对自某个固定基准点（commit / branch / tag / merge-base）以来的代码变更进行全面审查 —— 编码规范轴 Standards（代码是否遵循本仓库已文档化的编码规范？）与 需求规范轴 Spec（代码是否忠实实现了原始 issue/spec 所要求的内容？）。在平行的两个子代理（sub-agents）中同时运行这两份审查，并将结果并排汇报。当用户希望审查某个分支、PR、正在进行中的改动、或要求 "review since X" 时使用。
```

对 `HEAD` 与用户给定的固定基准点（fixed point）之间的代码差异（diff）进行双轴审查：

- **编码规范轴（Standards）** — 代码是否符合本仓库已记录的编码规范？
- **需求契合轴（Spec）** — 代码是否忠实且准确地实现了原始工单/需求规范？

这两条轴线以**平行的两个子代理（parallel sub-agents）**分别独立运行，确保各自的上下文互不干扰污染，最后由本 skill 统一汇总它们的审查发现。

工单系统应该已经预先配置完毕 —— 如果缺失 `docs/agents/issue-tracker.md`，请先运行 `/setup-matt-pocock-skills`。

## 流程

### 1. 锁定固定基准点（Fixed Point）
采用用户所指定的基准点 —— 可以是 commit SHA、分支名、标签名、`main`、`HEAD~5` 等。如果用户未指定，主动向用户询问。

记录一次比对差异的命令：`git diff <fixed-point>...HEAD`（使用三点语法，以便与合并基准 merge-base 进行比对）。并通过 `git log <fixed-point>..HEAD --oneline` 记录 commit 提交列表。

在深入进行前，先确认该基准点能被成功解析（`git rev-parse <fixed-point>`）且 diff 不为空。如果出现无效引用或空变更，应该在此处直接报错退出 —— 而不是把无效操作拖入两个平行的子代理中。

### 2. 确定需求规范的来源（Spec Source）
按以下顺序寻找原始的需求规范：
1. commit 提交信息中的工单引用（如 `#123`、`Closes #45`、GitLab `!67` 等）—— 按照 `docs/agents/issue-tracker.md` 中的工作流拉取。
2. 用户作为参数直接传入的文件路径。
3. `docs/`、`specs/` 或 `.scratch/` 目录下与分支名或功能名称匹配的 spec 文件。
4. 如果以上均未找到，直接询问用户 spec 位于何处。如果用户表示没有编写需求规范，**Spec** 子代理将直接跳过并汇报“无需求规范可用（no spec available）”。

### 3. 确定编码规范的来源（Standards Sources）
查阅仓库中记录了代码编写准则的任何文档，例如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

除了仓库已有的文档之外，Standards 审查轴**始终内置下方的一组基准代码坏味道（smell baseline）** —— 这是来自 Martin Fowler《重构》第 3 章的一套经典代码坏味道集合，即使仓库中没有任何规范文档，这套基准也始终生效。两条核心规则约束着它：
- **仓库规范拥有最高解释权**：仓库已记录的规范永远胜出；如果仓库规范明确允许某种写法，即便坏味道基准会对其报警，也必须压制报警。
- **坏味道始终属于主观裁量（Judgement Call）**：每个代码坏味道都是一项带有启发性的参考（例如“疑似存在依恋情结 Feature Envy”），绝非不可逾越的硬性违规 —— 同时，跳过任何已有静态工具自动强制检查的内容。

每个代码坏味道的模式为：*是什么* → *如何修复*；将其与变更的 diff 进行对照匹配：
- **神秘命名（Mysterious Name）**：函数、变量或类型的名称未能清晰揭示其职责或存储内容。→ 重命名它；如果实在想不出一个坦诚的名字，说明设计本身存在模糊。
- **重复代码（Duplicated Code）**：相同的逻辑结构出现在 diff 的多处修改块或多个文件中。→ 提炼共用逻辑，在两处共同调用。
- **依恋情结（Feature Envy）**：某个方法访问另一个对象的数据远超过访问自身的数据。→ 将该方法迁移到它所依恋的数据对象上。
- **数据泥团（Data Clumps）**：几个字段或参数总是结伴同行（暗示着一个新的数据类型亟待诞生）。→ 将它们打包成一个独立类型并传递该类型。
- **基本类型偏执（Primitive Obsession）**：用通用基本类型或字符串来替代本应拥有独立类型的领域概念。→ 为该概念赋予其专属的小型数据类型。
- **重复的 switch/if 判定（Repeated Switches）**：对同一类型的相同 `switch`/`if` 级联判定在变更中反复出现。→ 用多态替代，或共用同一映射表。
- **散弹式修改（Shotgun Surgery）**：一次逻辑变更迫使你在 diff 中的大量不同文件里零散修改。→ 将一同变更的内容内聚到一个模块中。
- **发散式变化（Divergent Change）**：单个文件或模块因多种完全不相关的理由而被频繁修改。→ 进行拆分，让每个模块仅因单一原因发生改变。
- **夸夸其谈的未来性（Speculative Generality）**：为了需求规范中根本不存在的未来需求而提前添加抽象、参数或钩子。→ 删除它；退回内联代码，直到真正的需求出现。
- **过长的消息链（Message Chains）**：调用方出现形如 `a.b().c().d()` 的长链式导航。→ 将深层调用隐藏在第一个对象的方法之后。
- **中间人（Middle Man）**：某个类或函数绝大部分时间仅仅是在做无意义的向后委托转发。→ 砍掉它，直接调用真正的主体。
- **被拒绝的遗赠（Refused Bequest）**：子类或实现类忽略或覆盖了其继承而来的大部分内容。→ 放弃继承关系，改用组合（composition）。

### 4. 并行派发两个子代理（Spawn Parallel Sub-agents）

**Standards 子代理提示词** — 必须包含：
- 完整的 diff 比较命令与 commit 提交列表。
- 步骤 3 中发现的规范文档列表，**加上步骤 3 全文复制粘贴的坏味道基准**（子代理无其他途径获取）。
- 核心指令：“按文件/修改块汇报：(a) diff 中违反已记录规范的每一处（指明文件与具体规则）；(b) 发现的任何基准代码坏味道（命名并引用具体修改块）。区分硬性违规与主观建议；跳过静态工具已强制检查的项。字数严格控制在 400 词以内。”

**Spec 子代理提示词** — 必须包含：
- diff 比较命令与 commit 提交列表。
- spec 需求规范的路径或已抓取的内容。
- 核心指令：“汇报：(a) spec 中要求但缺失或仅部分完成的需求；(b) diff 中出现但 spec 从未要求的行为（范围蔓延 Scope Creep）；(c) 表面看似已实现但实际逻辑有误的需求。每一条必须引用 spec 中的对应原文行。字数严格控制在 400 词以内。”

如果缺少需求规范，跳过 Spec 子代理，并在最终报告中注明这一点。

### 5. 统一汇总报告（Aggregate）
分别在 `## Standards` 与 `## Spec` 两个标题下展示两份报告内容，保持原汁原味或做轻度润色排版。**严禁将两份报告的条目混合或跨轴重新排序** —— 两条轴线是刻意保持独立的。

以一行总结收尾：每条轴线各自发现的问题总数，以及**各自轴线内部**最严重的问题（若有）。切勿跨轴挑选一个综合“头号问题” —— 刻意保持分离正是为了防止这种主次混淆。

## 为什么必须坚持双轴（Why two axes）

一次代码变更完全可能在其中一条轴线上完美通过，而在另一条轴线上严重不及格：
- 代码完全符合每一项规范，但实现的内容完全不是需求想要的 → **Standards 通行，Spec 阵亡**。
- 代码完全契合工单的要求，但严重破坏了项目的架构规范与命名约定 → **Spec 通行，Standards 阵亡**。

将两份报告独立呈现，能够彻底防止某一条轴线的表现掩盖另一条轴线的致命缺陷。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/code-review/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review |
| name | `code-review` |
| 触发 | description：自固定点（commit / branch / tag / merge-base）审查变更；用户要 review branch、PR、WIP 或 “review since X” |
| 调用策略 | 默认可触发（无 disable-model-invocation）；`implement` 完成后强制调用 |
| companions | 无独立 companion 文件；依赖 `docs/agents/issue-tracker.md`（setup 产出）与仓库内 coding standards 文档 |
| 双轴 | **Standards**（编码规范 + Fowler smell baseline）与 **Spec**（是否忠实实现 originating issue/spec） |
| 执行形态 | 两轴 **parallel sub-agents**，主 skill 只聚合、不合并重排 |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: code-review
description: Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".
---

Two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards** — does the code conform to this repo's documented coding standards?
- **Spec** — does the code faithfully implement the originating issue / spec?

Both axes run as **parallel sub-agents** so they don't pollute each other's context, then this skill aggregates their findings.

The issue tracker should have been provided to you — run `/setup-matt-pocock-skills` if `docs/agents/issue-tracker.md` is missing.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point — a commit SHA, branch name, tag, `main`, `HEAD~5`, etc. If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the list of commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff should fail here — not inside two parallel sub-agents.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, etc.) — fetch via the workflow in `docs/agents/issue-tracker.md`.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If nothing is found, ask the user where the spec is. If they say there isn't one, the **Spec** sub-agent will skip and report "no spec available".

### 3. Identify the standards sources

Anything in the repo that documents how code should be written, such as `CODING_STANDARDS.md` or `CONTRIBUTING.md`.

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below — a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation — and, like any standard here, skip anything tooling already enforces.

Each smell reads *what it is* → *how to fix*; match it against the diff:

- **Mysterious Name** — a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code** — the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy** — a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps** — the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession** — a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches** — the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery** — one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change** — one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality** — abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains** — long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man** — a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest** — a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Spawn both sub-agents in parallel

**Standards sub-agent prompt** — include:

- The full diff command and commit list.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3** pasted in full — the sub-agent has no other access to it.
- The brief: "Report — per file/hunk where relevant — (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls — documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** — include:

- The diff command and commit list.
- The path or fetched contents of the spec.
- The brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec` headings, verbatim or lightly cleaned. Do **not** merge or rerank findings — the two axes are deliberately separate (see _Why two axes_).

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes — that's the reranking the separation exists to prevent.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.
```

</details>
