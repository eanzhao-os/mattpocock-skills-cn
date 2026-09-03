# 33. migrate-to-shoehorn（Migrate to Shoehorn（将测试类型断言迁移至 Shoehorn））

## 为什么需要引入 Shoehorn？

`shoehorn` 库允许你在编写自动化测试时轻松传入局部数据（partial data），同时依然完全满足 TypeScript 的严格类型检查。它用更具类型安全保障的结构化 API 彻底替代脆弱的 `as` 强制类型断言。

**本方案仅限测试代码中使用。** 严禁在生产运行时代码中引入 shoehorn。

在测试代码中滥用 `as` 的典型痛点：
- 现代 TypeScript 规范反复告诫开发者不要滥用类型断言；
- 每次断言都必须手动指定目标类型名称，颇为繁琐；
- 在刻意构造非法测试数据时，不得不使用极其丑陋的双重断言（`as unknown as Type`）。

---

## 安装依赖

```bash
npm i -D @total-typescript/shoehorn
```

---

## 核心迁移模式（Before / After 对照）

### 1. 结构庞大但测试仅关注少数属性的对象

**改造前：**
```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...以及其他 20 个无须关心的属性
};

it("gets user by id", () => {
  // 实际上测试断言只关心 body.id，但不得不伪造整个 Request 的所有字段
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...不得不硬着头皮伪造其余全部 20 个属性
  });
});
```

**改造后：**
```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### 2. 将 `as Type` 替换为 `fromPartial()`

**改造前：**
```ts
getUser({ body: { id: "123" } } as Request);
```

**改造后：**
```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### 3. 将 `as unknown as Type`（故意传错类型）替换为 `fromAny()`

**改造前：**
```ts
getUser({ body: { id: 123 } } as unknown as Request); // 故意传入错误的类型以测试容错
```

**改造后：**
```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

---

## 各 API 的精准选用场景

| 核心函数 | 适用场景 |
| --- | --- |
| `fromPartial()` | 传入只包含部分字段、但依然受类型系统严格校验的局部数据 |
| `fromAny()` | 刻意传入非法或错误的数据结构（同时保留 IDE 的自动补全能力） |
| `fromExact()` | 强行要求完整对象（后续可无缝切换为 `fromPartial`） |

---

## 迁移标准工作流

1. **收集迁移需求** —— 向用户明确确认：
   - 哪些具体的测试文件存在因 `as` 断言引发的维护难题？
   - 是否存在大量仅需关注局部少数属性的庞大结构体？
   - 是否存在专门针对异常边界场景、故意传入错误类型的测试用例？
2. **安装与批量替换实施**：
   - 安装依赖：`npm i -D @total-typescript/shoehorn`；
   - 快速检索包含 `as` 断言的测试文件：`grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`；
   - 将常规的 `as Type` 重构为 `fromPartial()`；
   - 将故意传错类型的 `as unknown as Type` 重构为 `fromAny()`；
   - 补充引入 `@total-typescript/shoehorn` 的对应导出；
   - 运行 TypeScript 类型检查（typecheck）确保全量通过。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `misc`
- path: `skills/misc/migrate-to-shoehorn/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/misc/migrate-to-shoehorn
- 触发方式：description 驱动——用户提 shoehorn、要在测试里替换 `as`、或需要 partial test data
- companion 文件：
  - `agents/openai.yaml`
- **低频 / 中等环境绑定**：绑定 TypeScript 测试栈 + 作者生态包 `@total-typescript/shoehorn`；非 TS 仓库无意义；即使是 TS，也只在「测试里滥用 `as`」痛点出现时值得跑。

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
---
name: migrate-to-shoehorn
description: Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to replace `as` in tests, or needs partial test data.
---

# Migrate to Shoehorn

## Why shoehorn?

`shoehorn` lets you pass partial data in tests while keeping TypeScript happy. It replaces `as` assertions with type-safe alternatives.

**Test code only.** Never use shoehorn in production code.

Problems with `as` in tests:

- Trained not to use it
- Must manually specify target type
- Double-as (`as unknown as Type`) for intentionally wrong data

## Install

```bash
npm i @total-typescript/shoehorn
```

## Migration patterns

### Large objects with few needed properties

Before:

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...20 more properties
};

it("gets user by id", () => {
  // Only care about body.id but must fake entire Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...fake all 20 properties
  });
});
```

After:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

Before:

```ts
getUser({ body: { id: "123" } } as Request);
```

After:

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

Before:

```ts
getUser({ body: { id: 123 } } as unknown as Request); // wrong type on purpose
```

After:

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## When to use each

| Function        | Use case                                           |
| --------------- | -------------------------------------------------- |
| `fromPartial()` | Pass partial data that still type-checks           |
| `fromAny()`     | Pass intentionally wrong data (keeps autocomplete) |
| `fromExact()`   | Force full object (swap with fromPartial later)    |

## Workflow

1. **Gather requirements** - ask user:
   - What test files have `as` assertions causing problems?
   - Are they dealing with large objects where only some properties matter?
   - Do they need to pass intentionally wrong data for error testing?

2. **Install and migrate**:
   - [ ] Install: `npm i @total-typescript/shoehorn`
   - [ ] Find test files with `as` assertions: `grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] Replace `as Type` with `fromPartial()`
   - [ ] Replace `as unknown as Type` with `fromAny()`
   - [ ] Add imports from `@total-typescript/shoehorn`
   - [ ] Run type check to verify
````

</details>
