# 15-domain-modeling / CONTEXT-FORMAT.md 精读（业务上下文与通用语言规范（CONTEXT.md Format））

## 1. 文档标准骨架

```markdown
# {上下文领域名称}

{一至两句话简明扼要地概括该上下文的核心职责以及为何存在。}

## Language（通用领域语言）

**Order（订单）**:
{该术语的一至两句精准定义}
_Avoid（禁用别名）_: Purchase（购买）, transaction（交易）

**Invoice（发票凭证）**:
商品履约交付后向客户发送的正式付款请求凭证。
_Avoid_: Bill（账单）, payment request（请款）

**Customer（客户）**:
下发订单的真实个人或法人实体。
_Avoid_: Client（委托人）, buyer（买家）, account（账户）
```

---

## 2. 编写铁律（Rules）

- **立场鲜明，敢于拍板（Be opinionated）**：当同一个业务概念存在多种混淆叫法时，坚定挑选出最权威的一个，并将其余所有的模糊别名全部列入 `_Avoid_` 禁用清单；
- **定义必须极其紧凑（Keep definitions tight）**：最多不超过一至两句话。**清晰定义它“是什么（what it IS）”，而不是去长篇大论它“怎么做（what it does）”**；
- **仅收录本业务领域特有的专属概念**：通用的编程模式（如超时时间 timeouts、通用错误类型、工具函数模式等）坚决不要收录进来，哪怕代码中到处都在用。在添加新词前严苛拷问：*这是本业务领域特有的专属概念，还是放之四海皆准的通用技术概念？* 唯有前者才配录入；
- **按需划分二级标题聚合**：当术语自然形成业务子聚类时使用小标题分组；如果全局浑然一体，扁平列表即可。

---

## 3. 单上下文 vs. 多上下文架构拓扑

### 单一业务上下文（绝大多数仓库的标准形态）
在代码仓库根目录下维护单一的 `CONTEXT.md`。

### 多业务限界上下文（大型分布式或 Monorepo 仓库）
在仓库根目录下维护一份全局的 `CONTEXT-MAP.md`（上下文关系映射图谱），清晰记录各个子限界上下文的物理路径及其相互交互契约：

```markdown
# Context Map（全局上下文关系图谱）

## Contexts（各个限界上下文）

- [Ordering 订单中心](./src/ordering/CONTEXT.md) — 负责接收与追踪客户的订单全生命周期
- [Billing 计费结算中心](./src/billing/CONTEXT.md) — 负责出具发票并处理支付对账
- [Fulfillment 履约仓配中心](./src/fulfillment/CONTEXT.md) — 负责仓库拣货与物流配送

## Relationships（上下文间交互关系）

- **Ordering → Fulfillment**：订单中心下发 `OrderPlaced` 领域事件；履约中心监听该事件并启动仓库拣货；
- **Fulfillment → Billing**：履约中心下发 `ShipmentDispatched` 发货事件；计费中心监听该事件并出具正式发票；
- **Ordering ↔ Billing**：跨领域共享轻量的值对象类型（如 `CustomerId` 与 `Money`）。
```

---

## 4. 运行时自适应推断逻辑

- 如果根目录下存在 `CONTEXT-MAP.md`，优先读取该文件以掌握全盘上下文边界；
- 如果仅存在根目录下的 `CONTEXT.md`，按照单上下文模式处理；
- 如果两者均不存在，在首次敲定并澄清第一个领域术语时，采用**懒加载方式就地创建根 `CONTEXT.md`**；
- 在多上下文共存时，智能推断当前任务究竟从属于哪个具体上下文；若存在歧义，主动向用户请示确认。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `15-domain-modeling` |
| bucket | engineering |
| 上游路径 | `skills/engineering/domain-modeling/CONTEXT-FORMAT.md` |
| 角色定位 | 业务上下文与通用语言规范（CONTEXT.md Specification） |
| 关联模块 | `15-domain-modeling`、`02-setup-matt-pocock-skills` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max. Define what it IS, not what it does.
- **Only include terms specific to this project's context.** General programming concepts (timeouts, error types, utility patterns) don't belong even if the project uses them extensively. Before adding a term, ask: is this a concept unique to this context, or a general programming concept? Only the former belongs.
- **Group terms under subheadings** when natural clusters emerge. If all terms belong to a single cohesive area, a flat list is fine.

## Single vs multi-context repos

**Single context (most repos):** One `CONTEXT.md` at the repo root.

**Multiple contexts:** A `CONTEXT-MAP.md` at the repo root lists the contexts, where they live, and how they relate to each other:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md) — manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

The skill infers which structure applies:

- If `CONTEXT-MAP.md` exists, read it to find contexts
- If only a root `CONTEXT.md` exists, single context
- If neither exists, create a root `CONTEXT.md` lazily when the first term is resolved

When multiple contexts exist, infer which one the current topic relates to. If unclear, ask.
```

</details>
