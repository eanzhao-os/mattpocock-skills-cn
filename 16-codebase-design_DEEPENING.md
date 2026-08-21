# 16-codebase-design / DEEPENING.md 精读（模块加深与接缝设计纪律（Deepening & Seam Discipline））

本指南指导你在充分考量模块外部依赖的前提下，如何安全地将一组零碎的**浅模块（shallow modules）**聚拢加深为一个**深模块（deep module）**。全文严格使用 [SKILL.md](./16-codebase-design.md) 中定义的标准词汇 —— **模块（module）**、**接口（interface）**、**接缝（seam）**、**适配器（adapter）**。

---

## 1. 依赖关系的四大分类法（Dependency categories）

在评估一个候选的加深改造目标时，首先对其外部依赖进行严谨归类。依赖的类别将直接决定加深后的模块如何跨越其接缝进行自动化测试：

### 类别一：进程内纯逻辑（In-process）
纯算法计算、纯内存状态、零外部 I/O。**此类模块永远可以无脑加深** —— 将零碎的细小模块合并为一个深模块，并直接通过全新的公开接口编写测试，完全无需引入任何适配器。

### 类别二：本地可平替依赖（Local-substitutable）
拥有成熟轻量本地测试替代品的外部依赖（例如用于替代真实 Postgres 的 PGLite、内存文件系统等）。只要存在可靠的本地替代方案即可果断加深。加深后的模块直接伴随本地测试替身在测试套件中真实运行；**接缝属于内部私有接缝，对外公开接口上无需暴露任何端口（Port）**。

### 类别三：自研可控的远程依赖（Remote but owned —— 六边形端口与适配器架构）
跨越网络边界但归团队自身完全掌控的后端服务（如内部微服务、自研私有 API）。在接缝处定义一个标准的 **端口（Port/接口）**：深模块自身掌控核心业务逻辑；网络传输机制作为 **适配器（Adapter）** 依赖注入。测试环境使用纯内存适配器；生产环境使用 HTTP/gRPC/消息队列适配器。
> *经典落地表述*：“在架构接缝处定义一个标准端口，生产环境挂载 HTTP 适配器，测试环境挂载纯内存适配器 —— 从而将核心业务逻辑牢牢锁在单个深模块内，即便它在物理上是跨网络部署的。”

### 类别四：不可控的第三方外部依赖（True external —— 必须 Mock）
你无法掌控的第三方供应商服务（如 Stripe 支付、Twilio 短信等）。加深后的模块将第三方依赖作为注入端口；自动化测试为其提供 Mock 适配器。

---

## 2. 严谨的接缝设计纪律（Seam discipline）

- **只有一个适配器意味着那是凭空捏造的假接缝；唯有存在两个及以上适配器时，接缝才具备存在的正当性**。除非能明确证明至少需要两个不同的适配器（最典型的就是生产适配器 + 测试内存适配器），否则坚决不要凭空引入端口抽象。只有一个实现的所谓“接缝”，纯属毫无价值的脱裤子放屁与代码间接层（Indirection）；
- **内部私有接缝 vs 外部公开接缝**：一个深模块内部可以拥有供其私有实现或特定测试使用的内部接缝，同时在最外层拥有公开接缝。**坚决不要仅仅因为某些细粒度测试需要调用，就把内部私有接缝强行暴露到外部公共接口上**。

---

## 3. 测试重构战略：果断替代，坚决不层层堆叠（Replace, don't layer）

- **旧的单测直接删除**：一旦针对加深后模块公开接口的全新测试就绪，原先针对各个零碎浅模块的陈旧单元测试瞬间沦为负资产废纸 —— **直接果断将其全部删除**；
- **接口即测试表面（The interface is the test surface）**：只针对加深后的公共接口编写测试。测试断言只关注跨越接口的可观察输出与业务事实，严禁断言内部私有状态；
- **测试必须能够经受住内部重构的考验**：测试描述的是业务行为（WHAT），而不是代码实现（HOW）。如果内部代码一重构、外部行为明明没变但测试却挂了，说明该测试越权刺穿了接口。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `16-codebase-design` |
| bucket | engineering |
| 上游路径 | `skills/engineering/codebase-design/DEEPENING.md` |
| 角色定位 | 模块加深与跨接缝测试策略指南（Deepening and Seam Discipline） |
| 关联模块 | `16-codebase-design`、`17-improve-codebase-architecture`、`09-tdd` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [SKILL.md](./16-codebase-design.md) — **module**, **interface**, **seam**, **adapter**.

## Dependency categories

When assessing a candidate for deepening, classify its dependencies. The category determines how the deepened module is tested across its seam.

### 1. In-process

Pure computation, in-memory state, no I/O. Always deepenable — merge the modules and test through the new interface directly. No adapter needed.

### 2. Local-substitutable

Dependencies that have local test stand-ins (PGLite for Postgres, in-memory filesystem). Deepenable if the stand-in exists. The deepened module is tested with the stand-in running in the test suite. The seam is internal; no port at the module's external interface.

### 3. Remote but owned (Ports & Adapters)

Your own services across a network boundary (microservices, internal APIs). Define a **port** (interface) at the seam. The deep module owns the logic; the transport is injected as an **adapter**. Tests use an in-memory adapter. Production uses an HTTP/gRPC/queue adapter.

Recommendation shape: *"Define a port at the seam, implement an HTTP adapter for production and an in-memory adapter for testing, so the logic sits in one deep module even though it's deployed across a network."*

### 4. True external (Mock)

Third-party services (Stripe, Twilio, etc.) you don't control. The deepened module takes the external dependency as an injected port; tests provide a mock adapter.

## Seam discipline

- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a port unless at least two adapters are justified (typically production + test). A single-adapter seam is just indirection.
- **Internal seams vs external seams.** A deep module can have internal seams (private to its implementation, used by its own tests) as well as the external seam at its interface. Don't expose internal seams through the interface just because tests use them.

## Testing strategy: replace, don't layer

- Old unit tests on shallow modules become waste once tests at the deepened module's interface exist — delete them.
- Write new tests at the deepened module's interface. The **interface is the test surface**.
- Tests assert on observable outcomes through the interface, not internal state.
- Tests should survive internal refactors — they describe behaviour, not implementation. If a test has to change when the implementation changes, it's testing past the interface.
```

</details>
