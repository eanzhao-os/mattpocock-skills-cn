# 15-domain-modeling / ADR-FORMAT.md 精读

## Meta

| 字段 | 值 |
|---|---|
| 对应主 Skill | `15-domain-modeling` |
| bucket | engineering |
| 上游路径 | `skills/engineering/domain-modeling/ADR-FORMAT.md` |
| 角色定位 | 架构决策记录（ADR）极简标准与准入门槛规范（ADR Format Specification） |
| 关联模块 | `15-domain-modeling`、`01-setup-matt-pocock-skills` |

---

## 原文 (Markdown)

```markdown
# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc.

Create the `docs/adr/` directory lazily — only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

That's it. An ADR can be a single paragraph. The value is in recording *that* a decision was made and *why* — not in filling out sections.

## Optional sections

Only include these when they add genuine value. Most ADRs won't need them.

- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`) — useful when decisions are revisited
- **Considered Options** — only when the rejected alternatives are worth remembering
- **Consequences** — only when non-obvious downstream effects need to be called out

## Numbering

Scan `docs/adr/` for the highest existing number and increment by one.

## When to offer an ADR

All three of these must be true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will look at the code and wonder "why on earth did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If a decision is easy to reverse, skip it — you'll just reverse it. If it's not surprising, nobody will wonder why. If there was no real alternative, there's nothing to record beyond "we did the obvious thing."

### What qualifies

- **Architectural shape.** "We're using a monorepo." "The write model is event-sourced, the read model is projected into Postgres."
- **Integration patterns between contexts.** "Ordering and Billing communicate via domain events, not synchronous HTTP."
- **Technology choices that carry lock-in.** Database, message bus, auth provider, deployment target. Not every library — just the ones that would take a quarter to swap out.
- **Boundary and scope decisions.** "Customer data is owned by the Customer context; other contexts reference it by ID only." The explicit no-s are as valuable as the yes-s.
- **Deliberate deviations from the obvious path.** "We're using manual SQL instead of an ORM because X." Anything where a reasonable reader would assume the opposite. These stop the next engineer from "fixing" something that was deliberate.
- **Constraints not visible in the code.** "We can't use AWS because of compliance requirements." "Response times must be under 200ms because of the partner API contract."
- **Rejected alternatives when the rejection is non-obvious.** If you considered GraphQL and picked REST for subtle reasons, record it — otherwise someone will suggest GraphQL again in six months.
```

---

## 中文翻译

# 架构决策记录格式与准入门槛规范（ADR Format）

所有的架构决策记录（ADR）均保存在 `docs/adr/` 目录下，并使用四位自增数字编号命名：`0001-slug.md`、`0002-slug.md` 等。

采用**懒加载**方式创建 `docs/adr/` 目录 —— 仅在真正需要落盘第一篇 ADR 时才创建该目录。

---

## 1. 标准极简模板（Template）

```markdown
# {决策的简短标题}

{用 1 到 3 句话交代：背景是什么、我们最终做出了什么决策、以及为什么这么做。}
```

**仅此而已。一篇标准的 ADR 完全可以只有短短一个自然段**。其核心价值在于郑重记录下“*我们做出了一项决策* 以及 *背后的原因*” —— 而绝不是去僵化地把各个大部头模板章节强行填满。

---

## 2. 可选扩展章节（仅在带来实质价值时才追加）

绝大多数 ADR 根本不需要这些章节，只有在特定场景下才按需选用：
- **状态属性（Status frontmatter）**：`proposed`（提议中） / `accepted`（已采纳） / `deprecated`（已废弃） / `superseded by ADR-NNNN`（已被某号 ADR 替代） —— 在决策被推翻重议时极其有用；
- **曾考量过的备选方案（Considered Options）**：仅在被否决的备选方案非常值得后人引以为戒时才记录；
- **决策后果与衍生影响（Consequences）**：仅在存在非显而易见的下游连带副作用时才专门指出。

---

## 3. 严格的三重准入铁律（When to offer an ADR）

唯有**同时满足以下全部三条硬性标准**，才配被称为一项真正的架构决策并记录为 ADR：

1. **不可逆性（Hard to reverse）** —— 日后如果后悔改变主意，所需付出的代价极其高昂沉重；
2. **反直觉性（Surprising without context）** —— 未来的代码维护者在看到这段实现时，会忍不住惊讶纳闷：“他们当初到底为什么非要这么干？”；
3. **真实权衡的产物（The result of a real trade-off）** —— 当初确实存在切实可行的多种备选路径，而我们基于特定的深层原因坚定选择了其中一种。

> [!TIP]
> 如果一个决定能够随时轻松撤销，**果断跳过不要记** —— 日后直接改掉即可；如果它是显而易见的常规操作，没人会感到奇怪；如果根本没有其他可选方案，那除了“我们顺理成章地做了该做的事”之外没有任何需要沉淀的价值。

---

## 4. 真正符合 ADR 记录资格的典型范例清单

- **整体宏观架构形态**：“我们采用 Monorepo 统一代码仓”、“写入模型采用事件溯源（Event-sourced），读取模型通过投影写入 Postgres”；
- **限界上下文间的集成模式**：“订单中心与计费中心之间通过领域事件异步解耦，绝不采用同步 HTTP 阻塞调用”；
- **具备高昂迁移锁定的底层技术选型**：核心数据库、消息总线、身份鉴权供应商、部署目标基础设施。并不是每一个轻量 npm 库都配记录 —— 必须是那种一旦想换掉至少得折腾一个季度的核心组件；
- **清晰的边界划定与职责切割**：“客户核心数据严格归客户上下文独占所有，其他上下文只允许通过 ID 间接弱引用”。明确拒绝做什么与声明做什么具备同等的千金价值；
- **刻意偏离常规道路的反直觉抉择**：“出于 X 的极致性能原因，我们手写原生 SQL 而非使用 ORM”。任何一个明理的工程师第一反应都会选择相反方案的地方，必须立 ADR 存照 —— **正是这篇文档，能够阻止下一个自以为聪明的工程师把这处深思熟虑的精妙设计当成‘缺陷’给盲目‘修复’掉**；
- **代码本身完全不可见的外部硬性约束**：“出于严格的合规审计要求，本项目严禁接入 AWS”、“出于与外部银行伙伴签署的合同 SLA，API 响应时间必须强控在 200ms 以内”；
- **非显而易见的被否决方案**：如果你经过深思熟虑否决了 GraphQL 并选择了 REST，务必将原因记录在案 —— 否则不出半年，团队里必然又会有新人兴冲冲地跑来重新提议一遍 GraphQL。
