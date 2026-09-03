# 36. implement-spec（规范整体落地实现）

```yaml
name: implement-spec
description: 将一份规范（spec）连同其全部工单（tickets）在单一分支上完整实现，最终交付为单个 PR。
disable-model-invocation: true
```

已经向你提供了一份**规范（spec）**。这份规范应当关联着一组**工单（tickets）**，描述这份规范该如何落地实现。

目标是交付一个在单一分支上完整实现整份规范的 PR。

这些工单**并不是一份按部就班的步骤清单**，而是一张由相互阻塞依赖关系（blocking relationships）串联而成的**任务图（task graph）**。这意味着任何时刻都存在一个**前沿（frontier）** —— 一批已经就绪、随时可以抓取认领的工单。

与子代理（subagent）之间的往来通信应当保持稀疏。沟通主要依靠**上下文指针（context pointers）**进行 —— 指向规范、工单、调研笔记以及此前的提交记录；凡是经由指针已经能够获取的信息，绝不重复转述。

**实现者子代理（implementer subagent）**应尽可能以后台方式运行，以实现**最大化并发（maximum concurrency）**。

## 执行步骤（Steps）

1. 通读规范与工单 —— 读到足以理解整张任务图的程度即可。

2. （可选）派出一个**探索者子代理（exploration subagent）**，完成工单所需的全部探索工作 —— 相关代码库文件或外部文档。务必确保探索者子代理具备保存文件的能力 —— 它应将自己的 Markdown 笔记保存在仓库之外的一个目录中，供后续所有子代理随时取用。这样**实现者子代理**就能专注于实现本身，而不必分心于探索。

3. 创建分支，并开启一个草稿 PR（draft PR）。该 PR 应标记为 closing（关闭）对应的规范 issue 及其全部工单。

4. 使用**实现者子代理**逐个实现工单。每个实现者子代理都应在属于自己的一棵**工作树（worktree）**中、基于一条属于自己的分支开展工作。

5. 每当一个**实现者子代理**完工，就派出一个**合并者子代理（merger subagent）**，将它的成果合并到 PR 分支上。

6. 如果这让可用工单的**前沿**发生了变化，就再启动更多**实现者子代理**去攻克新解锁的工单 —— 以此始终保持最大并发。

7. 全部工单完成后，在 PR 分支上运行 [11. 严格代码审查](./11-code-review.md)（`/code-review`），并在一个单独的**实现者子代理**中一次性修复审查提出的全部问题。

8. 将 PR 标记为 ready for review（正式送审）。

9. 清理所有**实现者子代理**的工作树。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `in-progress/implement-spec` |
| bucket | in-progress |
| 上游 | https://github.com/mattpocock/skills |
| companion | 无独立 companion |
| 触发 | 把一份 spec 连同其 tickets 整体实现为单个 PR |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |
| 状态 | **未定型，吸收优先级低** |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: implement-spec
description: "Implement a specification in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The goal is a PR which implements the entire spec on a single branch.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for **maximum concurrency**.

## Steps

1. Read the spec and tickets. Read enough to understand the task graph.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create a branch, and a draft PR. The PR should be marked as 'closing' the spec issue and tickets.

4. Use **implementer subagents** to implement each ticket. Each implementer subagent should work in its own worktree, on its own branch.

5. Once an **implementer subagent** completes, merge its work to the PR branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, run /code-review on the PR branch. Fix all issues raised by the code review in a single **implementer subagent**.

8. Mark the PR as ready for review.

9. Clean up all **implementer subagent** worktrees.
```

</details>
