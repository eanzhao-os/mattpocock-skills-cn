# 09-tdd / tests.md 精读

## Meta

| 字段 | 值 |
|---|---|
| 对应主 Skill | `09-tdd` |
| bucket | engineering |
| 上游路径 | `skills/engineering/tdd/tests.md` |
| 角色定位 | 优良与劣质测试的反差模式规范（Good and Bad Tests Standards） |
| 关联模块 | `09-tdd`、`11-code-review` |

---

## 原文 (Markdown)

```markdown
# Good and Bad Tests

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Tautological tests**: Expected value restates the implementation, so the test passes by construction.

```typescript
// BAD: Expected value is recomputed the way the code computes it
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: Expected value is an independent, known literal
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
```

---

## 中文翻译

# 优良与劣质测试用例规范（Good and Bad Tests）

## 1. 什么是优良的测试（Good Tests）

**集成黑盒风格（Integration-style）**：始终通过真实的公开接口来测试系统，绝不 Mock 任何内部实现细节。

```typescript
// 推荐做法：测试可观察的外部业务行为
test("用户拥有有效购物车时能够顺利结算", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

### 优良测试的核心特征：
- 严格聚焦在真实用户或调用方真正关心的**业务行为**；
- 仅且只通过**公开 API 接口**进行交互；
- **具备抗重构韧性**：内部实现大幅重构但业务行为未变时，测试永远不会脆弱崩溃；
- 测试标题描述的是**“做了什么（WHAT）”**，而不是“如何实现的（HOW）”；
- 每一个测试用例只包含一个纯粹的**逻辑断言**。

---

## 2. 什么是劣质的测试（Bad Tests）

### 缺陷模式一：强耦合内部实现细节的测试（Implementation-detail tests）

```typescript
// 错误反例：深度绑定内部实现细节
test("checkout 内部调用了 paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

#### 典型坏味道（Red Flags）：
- 滥用 Mock 来拦截内部协作类或模块；
- 强行测试私有方法（Private methods）；
- 断言内部调用的具体次数或执行顺序（如 `toHaveBeenCalledTimes`）；
- 内部代码仅仅做了无害重构、外部行为完全正常，测试却瞬间报错飘红；
- 测试名称描述的是内部实现细节（HOW），而非业务意图（WHAT）；
- 绕过公共接口，通过后门或外部手段偷偷验证内部状态。

```typescript
// 错误反例：绕过公共接口、直接去底层数据库查表验证
test("createUser 成功保存到数据库", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// 推荐做法：完全通过公共接口形成闭环验证
test("创建用户后能够通过公共接口正常检索出来", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

### 缺陷模式二：同义反复的废话测试（Tautological tests）

测试中断言的预期值（Expected value）完全把业务逻辑的内部实现算法重新抄写了一遍，导致测试由于结构自身的同义反复而必然假绿，根本起不到任何质量防护作用。

```typescript
// 错误反例：在测试断言中重新把 reduce 累加逻辑算了一遍（同义反复）
test("calculateTotal 正确累加明细项金额", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0); // 废话：用与源码完全相同的逻辑计算期望值
  expect(calculateTotal(items)).toBe(expected);
});

// 推荐做法：预期值使用独立的、已知且固定的字面量常量
test("calculateTotal 正确累加明细项金额", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
