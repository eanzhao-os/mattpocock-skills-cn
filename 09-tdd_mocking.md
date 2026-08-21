# 09-tdd / mocking.md 精读

## Meta

| 字段 | 值 |
|---|---|
| 对应主 Skill | `09-tdd` |
| bucket | engineering |
| 上游路径 | `skills/engineering/tdd/mocking.md` |
| 角色定位 | Mock 边界划分与可测性架构设计指南（When and How to Mock） |
| 关联模块 | `09-tdd`、`16-codebase-design` |

---

## 原文 (Markdown)

```markdown
# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer test DB)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

## Designing for Mockability

At system boundaries, design interfaces that are easy to mock:

**1. Use dependency injection**

Pass external dependencies in rather than creating them internally:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Prefer SDK-style interfaces over generic fetchers**

Create specific functions for each external operation instead of one generic function with conditional logic:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

The SDK approach means:
- Each mock returns one specific shape
- No conditional logic in test setup
- Easier to see which endpoints a test exercises
- Type safety per endpoint
```

---

## 中文翻译

# 模拟与替身设计规范（When to Mock & Mockability）

## 1. 究竟何时才允许使用 Mock？

**仅在系统的最外层物理边界处（system boundaries）才允许使用 Mock：**

- **第三方外部 API**（支付网关、邮件发送、第三方短信等）；
- **外部数据库**（视情况而定 —— 在绝大多数场景下，优先使用真实的本地轻量测试数据库）；
- **时间与随机数**（`Date.now()`、定时器、UUID/随机种子生成器）；
- **底层文件系统**（视具体复杂程度而定）。

### 坚决禁止 Mock 的清单：
- **你自己编写的任何类或业务模块**；
- **系统内部的任何协作组件（Internal collaborators）**；
- **任何完全归你控制的代码资产**。

---

## 2. 为高可测试性而设计架构（Designing for Mockability）

在系统真正的物理边界处，通过精妙的接口设计使其天然易于 Mock：

### 原则一：采用依赖注入模式（Use Dependency Injection）
通过函数参数或构造函数显式传入外部依赖，而不是在函数内部写死硬编码实例化：

```typescript
// 推荐：极易在测试中进行轻量 Mock 注入
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// 错误反例：在函数体内私自硬编码实例化外部客户端，极难在外部拦截
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

### 原则二：优先采用 SDK 领域风格接口，拒绝大一统通用请求器
为每一个具体的外部业务操作封装清晰独立的具名函数，坚决不要搞一个包含大量复杂分支判断的大一统全局 `fetch` 函数：

```typescript
// 推荐做法：每一个操作函数均可独立且清晰地进行 Mock
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// 错误反例：通用粗暴的 fetcher 导致在 Mock 时必须在测试桩内部手写一堆复杂的 URL 分支判定
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

#### SDK 领域风格接口带来的巨大工程红利：
- 每一个 Mock 桩函数都拥有确定唯一的返回值结构，无需在测试中写 `if-else`；
- 测试的前置准备（Test setup）干干净净，零条件分支逻辑；
- 一目了然看清当前测试到底真正触达了哪些具体的远程接口；
- 每一个接口端点均享有严谨的端到端 TypeScript 类型安全保障。
