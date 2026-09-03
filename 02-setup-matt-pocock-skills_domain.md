# 02-setup-matt-pocock-skills / domain.md 精读（领域文档规范（Domain Docs））

engineering skills 在探索代码库时，应当如何消费本仓库的领域文档。

---

## 1. 动手探索之前，先读这些（Before exploring, read these）

- 仓库根目录的 **`CONTEXT.md`**；或者
- 仓库根目录的 **`CONTEXT-MAP.md`**（若存在）—— 它为每个 context 指向一份各自的 `CONTEXT.md`，把与当前主题相关的每一份都读一遍；
- **`docs/adr/`** —— 阅读与你要动手的区域相关的 ADR。在多 context 仓库中，还要检查 `src/<context>/docs/adr/` 里的 context 级决策。

如果上述任何文件不存在，**保持沉默继续推进**。不要提示它们缺失；也不要一上来就建议创建它们。`/domain-modeling` skill（经由 `/grill-with-docs` 与 `/improve-codebase-architecture` 触达）会在术语或决策真正被敲定时才惰性创建它们。

---

## 2. 文件结构（File structure）

单 context 仓库（绝大多数仓库）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多 context 仓库（标志是根目录存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 系统级决策
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context 级决策
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

---

## 3. 使用词汇表的既定术语（Use the glossary's vocabulary）

当你的产出提到某个领域概念时（工单标题、重构提案、假设、测试名），一律使用 `CONTEXT.md` 中定义的术语。不要漂移到词汇表明确规避的同义词。

如果你需要的概念还没被词汇表收录，这本身就是一个信号 —— 要么你在发明这个项目并不使用的语言（请重新考量），要么存在真实的缺口（记下来交给 `/domain-modeling`）。

---

## 4. 主动标出 ADR 冲突（Flag ADR conflicts）

如果你的产出与某条既有 ADR 相矛盾，显式挑明，而不是悄悄覆盖：

> _与 ADR-0007（事件溯源订单）相矛盾，但值得重新审议，因为……_

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `02-setup-matt-pocock-skills` |
| bucket | engineering |
| 上游路径 | `skills/engineering/setup-matt-pocock-skills/domain.md` |
| 角色定位 | 领域文档消费规范 —— engineering skills 探索代码库时如何消费 CONTEXT/ADR 文档（Domain Docs） |
| 关联模块 | `15-domain-modeling`、`05-grill-with-docs`、`17-improve-codebase-architecture` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists: it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repo (presence of `CONTEXT-MAP.md` at the root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
````

</details>
