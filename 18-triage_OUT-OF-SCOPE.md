# 18-triage / OUT-OF-SCOPE.md 精读（拒批特性知识库与防重复研讨机制（Out-of-Scope Knowledge Base））

代码仓库中的 `.out-of-scope/` 目录用于持久化归档那些**被明确否决（rejected）的特性需求**。它拥有两大核心使命：

1. **组织制度性记忆（Institutional memory）**：郑重记录一项特性当初为何被否决，避免随着工单关闭导致深层决策原因随风消逝；
2. **智能去重与防无休止重复研讨（Deduplication）**：当未来涌入与历史否决项高度吻合的新工单时，分流技能能够瞬间调出历史裁决，而不是拉着团队每次重新争论一遍。

---

## 1. 目录组织架构（Directory structure）

```
.out-of-scope/
├── dark-mode.md       # 深色模式否决档案
├── plugin-system.md   # 插件系统否决档案
└── graphql-api.md     # GraphQL 接口否决档案
```

**严格按业务概念（Concept）单文件归档，绝非按单个 Issue 建文件**。多次重复提议同一个功能的所有历史工单，统一聚拢在同一个概念文件下。

---

## 2. 档案撰写标准格式（File format）

行文应当自然舒展、注重可读性 —— 读起来更像一篇短小精悍的技术设计驳回备忘录，而不是干瘪的数据库记录。包含清晰的论证、代码示例与实例，让初次接触的人也能看懂其中的推理：

```markdown
# Dark Mode（深色模式）

本项目不支持深色模式或任何面向终端用户的动态换肤功能。

## 为什么这属于超出范围（Why this is out of scope）

本渲染管道底层假定全系统统一使用在 `ThemeConfig` 中定义的单套静态调色板。若要支持多套主题将强制引发以下连锁改动：
- 需要在整个组件树外层包裹全局的主题 Context Provider；
- 每个组件都需要具备主题感知的动态样式解析开销；
- 必须引入用户主题偏好的本地持久化存储层。

这是一项巨大的架构底层颠覆，且与本项目聚焦于内容编排的核心使命完全背离。主题定制属于下游嵌入方或二次分发者的专属职责。

```typescript
// 当前 ThemeConfig 接口在设计上完全不支持运行时动态切换：
interface ThemeConfig {
  colors: ColorPalette; // 编译构建期锁定的单调色板
  fonts: FontStack;
}
```

## 历史提议清单（Prior requests）

- #42 — “增加深色模式支持”
- #87 — “出于无障碍考量增加夜间主题”
- #134 — “深色主题可选开关”
```

---

## 3. 核心机制：何时查阅与智能拦截（When to check）

在分流的第一步（收集上下文）阶段，主动读取 `.out-of-scope/` 下的所有文档。在评估新工单时：
- **基于概念语义相似度进行匹配，而非死板的关键词硬搜** —— 例如用户提议的“夜间主题”会精准命中 `dark-mode.md`；
- 一旦命中，主动呈报给维护者：“*该需求与 `.out-of-scope/dark-mode.md` 高度相似 —— 我们此前基于 [深层原因] 明确否决了该特性。您目前是否仍维持原判？*”

### 维护者的三种裁决：
1. **确认维持原判（Confirm）**：将当前新工单追加到该档案的“历史提议清单”中，并打上 `wontfix` 立即关闭；
2. **推翻重议（Reconsider）**：若项目发展阶段已变，直接删除或更新该 `.out-of-scope/` 文件，工单进入正常开发分流；
3. **判定为不同诉求（Disagree）**：二者形似而神不同，按正常工单继续流转。

---

## 4. 写入与归档纪律（When to write）

- **仅当功能性增强需求（Enhancement，而非 Bug）被判定为 `wontfix` 否决时才允许写入**（同样适用于被否决的功能增强类 PR，防止被否决的代码换个马甲卷土重来）；
- **对于“由于功能早已实现而关闭”的工单，坚决禁止写入本目录** —— 已经做好的功能写进否决库会导致去重逻辑中毒、产生假阳性误杀；此时应在关闭评论中指明该功能已有的实现位置。
- 维护者改变主意时，直接删除对应文件，无需重新打开陈旧的历史工单。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `18-triage` |
| bucket | engineering |
| 上游路径 | `skills/engineering/triage/OUT-OF-SCOPE.md` |
| 角色定位 | 拒批特性知识库与防重复研讨机制（Out-of-Scope Knowledge Base） |
| 关联模块 | `18-triage`、`02-setup-matt-pocock-skills` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# Out-of-Scope Knowledge Base

The `.out-of-scope/` directory in a repo stores persistent records of rejected feature requests. It serves two purposes:

1. **Institutional memory**: why a feature was rejected, so the reasoning isn't lost when the issue is closed
2. **Deduplication**: when a new issue comes in that matches a prior rejection, the skill can surface the previous decision instead of re-litigating it

## Directory structure

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

One file per **concept**, not per issue. Multiple issues requesting the same thing are grouped under one file.

## File format

The file should be written in a relaxed, readable style, more like a short design document than a database entry. Use paragraphs, code samples, and examples to make the reasoning clear and useful to someone encountering it for the first time.

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42: "Add dark mode support"
- #87: "Night theme for accessibility"
- #134: "Dark theme option"
```

### Naming the file

Use a short, descriptive kebab-case name for the concept: `dark-mode.md`, `plugin-system.md`, `graphql-api.md`. The name should be recognizable enough that someone browsing the directory understands what was rejected without opening the file.

### Writing the reason

The reason should be substantive: not "we don't want this" but why. Good reasons reference:

- Project scope or philosophy ("This project focuses on X; theming is a downstream concern")
- Technical constraints ("Supporting this would require Y, which conflicts with our Z architecture")
- Strategic decisions ("We chose to use A instead of B because...")

The reason should be durable. Avoid referencing temporary circumstances ("we're too busy right now"); those aren't real rejections, they're deferrals.

## When to check `.out-of-scope/`

During triage (Step 1: Gather context), read all files in `.out-of-scope/`. When evaluating a new issue:

- Check if the request matches an existing out-of-scope concept
- Matching is by concept similarity, not keyword: "night theme" matches `dark-mode.md`
- If there's a match, surface it to the maintainer: "This is similar to `.out-of-scope/dark-mode.md`. We rejected this before because [reason]. Do you still feel the same way?"

The maintainer may:

- **Confirm**: the new issue gets added to the existing file's "Prior requests" list, then closed
- **Reconsider**: the out-of-scope file gets deleted or updated, and the issue proceeds through normal triage
- **Disagree**: the issues are related but distinct, proceed with normal triage

## When to write to `.out-of-scope/`

Only when an **enhancement** (not a bug) is *rejected* as `wontfix`. This applies to enhancement PRs exactly as it does to issues: a rejected PR is recorded here so the same request doesn't return as fresh code.

Do **not** write here when something is closed as `wontfix` because it's **already implemented**. That's a built feature, not a rejected one; recording it would poison the dedup checks with false rejections. Instead, the closing comment points to where the feature already lives.

The flow:

1. Maintainer decides a feature request is out of scope
2. Check if a matching `.out-of-scope/` file already exists
3. If yes: append the new issue to the "Prior requests" list
4. If no: create a new file with the concept name, decision, reason, and first prior request
5. Post a comment on the issue explaining the decision and mentioning the `.out-of-scope/` file
6. Close the issue with the `wontfix` label

## Updating or removing out-of-scope files

If the maintainer changes their mind about a previously rejected concept:

- Delete the `.out-of-scope/` file
- The skill does not need to reopen old issues; they're historical records
- The new issue that triggered the reconsideration proceeds through normal triage
````

</details>
