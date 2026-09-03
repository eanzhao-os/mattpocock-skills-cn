# 22-writing-for-agents / SKILL-MECHANICS.md 精读（Skill 底层机制与路由模式（Skill Mechanics））

本文档是 [writing-for-agents](./22-writing-for-agents.md) (SKILL.md) 针对 **Skill 技能编写场景** 的专用拓展分支：专门规范当编写的目标文档本身就是一个 Skill 时所发生的底层机制变化 —— 涵盖 Frontmatter 元数据、调用模式选型（Invocation choice）以及路由技能（Router skills）。其余所有关于正文编写的法则均严格遵循 `SKILL.md` 的通用规范。

---

## 1. 两种调用模式的权衡博弈（Invocation：上下文负载 vs. 人类认知负载）

### 模式 A：模型自主调用（Model-invoked Skills）
- **底层机制**：保留 `description` 描述字段，Agent 能够根据当前对话语境**完全自主识别并自动触发**，且其他 Skill 也能在内部直接调用它；
- **人类可达性**：人类用户依然可以随时手动输入斜杠命令触发 —— **模型调用永远是人类手动调用的超集**；赋予描述字段仅仅是为 Agent 增加了自动发现能力，绝不会削弱人类的调用权；
- **共享参考归宿**：内容全部为参考资料的模型自主调用技能，也可以充当共享参考资料的集中存放地 —— 其他 Skill 能够调用它，因此多个 Skill 都需要的参考资料可以集中在一处；
- **核心代价**：`description` 字段作为最顶层的上下文指针，**会被强制常驻加载在系统提示词中** —— 这相当于付出了永续常驻的 Token 上下文负载（Context load），换取了随时随地的被发现能力；
- **代码实现**：不设置 `disable-model-invocation`，并在 `description` 中写满面向模型的触发分支引导词（`SKILL.md` 的指针书写规则完全适用）。

### 模式 B：纯人类手动调用（User-invoked Skills）
- **底层机制**：彻底将 `description` 从 Agent 的系统提示词中剥离，**唯有人类在聊天窗口中显式敲出技能名称才能触发**，任何 Agent 和其他 Skill 都无法感知到它的存在；
- **核心代价**：**零上下文负载（Zero context load，不浪费系统提示词哪怕一个 Token）**，但代价是消耗**人类的心智认知负载（Cognitive load）** —— 人类的大脑必须充当索引表，时刻牢记这个技能的存在与名字；
- **代码实现**：配置 `disable-model-invocation: true`；此时的 `description` 退化为面向人类的一句话极简备忘，剔除所有冗余的引导词列表。

> [!TIP]
> **黄金选型法则**：唯有当 Agent 必须自主触发、或需要被其他 Skill 跨技能调用时，才配置为模型调用；如果一个技能永远只由人类手工点名触发，坚决将其设为纯人类调用，彻底省下常驻上下文。

---

## 2. 共享参考资料的安置法则

当两个纯人类调用的 Skill 都需要读取同一份权威参考规范时，由于二者均无常驻 description，彼此无法互相调用。此时**坚决不要将参考资料做成 Skill，而是将其下沉为 Skill 体系之外的普通 Markdown 文件**，供所有 Skill 通过文件路径自由查阅。

---

## 3. 按调用模式拆分技能（Splitting by invocation）

拆分技能时的**调用模式切分维度**（时序切分维度见 `SKILL.md`）：只有当你拥有一个应当能独立触发技能的专属开头词 —— 一个你在自己提示词里真正会用的触发词 —— 或者有其他 Skill 必须调用它时，才拆出一个模型自主调用的技能；你要为这条新增的常驻 `description` 付出上下文负载，因此这份独立可达性必须值得这个代价。

---

## 4. 路由技能模式（Router skills）

当纯人类调用的 Skill 越来越多、超过了人类大脑的记忆极限时，堆积的人类认知负载可以通过构建一个 **路由技能（Router skill）** 来彻底化解：
- 打造一个专门面向人类的入口技能，其内部完整罗列了所有其他相关子技能的名字以及各自在何时该选用；
- 人类只需要记住这一个顶层路由技能的名字即可；
- **路由技能只做提点推荐，绝不自动触发**：因为底层的子技能都是纯人类调用的（没有 description），唯有人类看完提示后亲自手动点名触发。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `22-writing-for-agents` |
| bucket | productivity |
| 上游路径 | `skills/productivity/writing-for-agents/SKILL-MECHANICS.md` |
| 角色定位 | Skill 底层调度机制、触发分流与路由设计（Skill Mechanics & Routing） |
| 关联模块 | `22-writing-for-agents`、`27-loop-me` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Skill mechanics

The skill-specific branch of [`writing-for-agents`](./22-writing-for-agents.md): what changes when the document is a skill — frontmatter, the invocation choice, and router skills. Everything else about writing it is the universal reference in `SKILL.md`.

## Invocation

Two choices, trading the two loads:

- A **model-invoked** skill keeps a `description`, so the agent can fire it autonomously — and other skills can reach it. You can still type its name: model-invocation always _includes_ user reach; a description only ever adds agent discovery, never removes the human's. The description is the skill's top-level context pointer, forced to stay loaded at all times — permanent context load in exchange for discoverability. A model-invoked skill whose content is all reference is also one home for shared reference: another skill can invoke it, so reference needed by several skills lives in one place. Mechanics: omit `disable-model-invocation`, and write a model-facing description carrying the trigger branches (the pointer-writing rules in `SKILL.md` apply in full).
- A **user-invoked** skill strips the description from the agent's reach: only the human typing its name can invoke it, and no other skill can. Zero context load, but it spends cognitive load — you are the index that must remember it exists. Mechanics: set `disable-model-invocation: true`; the `description` becomes human-facing — a one-line summary, trigger lists stripped.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and pay no context load.

Shared reference that two user-invoked skills both need can live in neither — with no descriptions, neither can fire the other. Push it to a plain file outside the skill system: external reference any skill can point at.

## Splitting by invocation

The invocation cut of splitting (the sequence cut lives in `SKILL.md`): split off a model-invoked skill when you have a distinct leading word that should trigger it on its own — a trigger word you actually use in your prompts — or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-invoked skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill**: one user-invoked skill that names the others and when to reach for each, so the human has one skill to remember instead of many. It can only hint, never fire them: user-invoked skills have no description, so nothing but the human can reach them.
```

</details>
