# 04. grilling（未配置 disable-model-invocation → 允许由模型自主触发（model-invoked））

```yaml
name: grilling
description: 就方案、决策或构思对用户进行刨根问底式的深度访谈。当用户希望对自己的思路进行压力测试，或使用任何含 'grill' 的指令时触发。
```

# grilling（深度追问访谈原语）

持续对用户进行严谨深入的追问访谈，直到双方达成**统一认知（shared understanding）**。将整个议题建模为一棵**设计决策树（design tree）**：每个核心决策都会衍生出从属其下的子决策分支。

按**轮次（rounds）**逐步推进这棵决策树。**前沿问题集合（frontier）**是指所有前置条件已经敲定的决策 —— 也就是你**现在**就可以直接提问、而无需凭空揣测尚未听到的答案的问题。在单轮中一次性抛出整个前沿集合里的所有问题：为每个问题编号，并给出你所推荐的选项与答案。然后等待用户全部回答完毕，再进入下一轮。

每个问题的格式如下：

```
❓ **Q1** - **<问题标题>**: <问题正文，可分为多段，可包含多个选项供选择>

➡️ <你所推荐的答案/选项>
```

用户每一轮的回答都会重塑整棵决策树 —— 已经敲定的决策会将前沿边界向外推进，并解锁那些之前被阻塞的下游问题。重新计算新的前沿问题集合，并发起下一轮提问。如果某个问题的答案还依赖于本轮中另一个尚未敲定的问题，那么它必须归入**后续轮次**，绝不能放在本轮提问。

**探查客观事实（facts）是你的本职工作，绝不是用户的责任**。当一个前沿问题需要环境中的客观事实时（例如查阅文件系统、调用工具等），指派一个子代理（sub-agent）去自主查询 —— **绝不要向用户索取任何你自己动动手就能查到的信息**。同时不要因此阻塞整体流程：后台正在运行的调研只属于未就绪的前置条件，因此只有其直接下游的问题需要等待子代理汇报结果 —— 前沿集合里的其他独立问题现在就直接向用户提问。而**主观决策（decisions）**的裁量权完全属于用户 —— 将每个决策明确抛给用户并等待其定夺。

当**前沿问题集合为空**时，本会话方告结束：即设计决策树上的每一个分支都已被充分探索，没有任何未经证实的隐性假设。**在用户明确确认双方已经达成统一认知之前，严禁采取任何实质性的开发或修改行动**。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `productivity`
- path: `skills/productivity/grilling/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling
- 触发方式：**model-invoked 可触发**（frontmatter **没有** `disable-model-invocation`；description 含 "or uses any 'grill' trigger phrases"，鼓励模型在用户说 grill 类话时拉起）
- companion 文件：
  - `agents/openai.yaml`

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Each question should be formatted like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report — ask the rest of the frontier now. The _decisions_ are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
````

</details>
