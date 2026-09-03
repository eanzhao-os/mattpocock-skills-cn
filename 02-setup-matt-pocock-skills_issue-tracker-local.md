# 02-setup-matt-pocock-skills / issue-tracker-local.md 精读（工单系统适配规范：本地 Markdown 纯文件工单（Local Markdown Tracker））

本代码仓库的所有规范文档（specs）与具体工单（issues/tickets）均作为 Markdown 文件存放在本地 `.scratch/` 目录下。

---

## 1. 目录结构与命名约定（Conventions）

- **单特性单目录**：每一个独立特性分配一个专属文件夹：`.scratch/<feature-slug>/`；
- **技术规范文件**：统一定名为 `.scratch/<feature-slug>/spec.md`；
- **具体实施工单（单工单一文件）**：每一个具体工单必须独立成文，保存在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，编号从 `01` 开始依次递增 —— **坚决不要把多个工单揉成一个巨型合并文件**；
- **分流状态记录**：在每个工单文件的顶部附近，使用 `Status:` 行标注当前状态（标准角色状态字符串详见 `triage-labels.md`）；
- **评论与讨论历史追加**：后续产生的任何讨论沟通与见解，统一追加在文件底部的 `## Comments` 标题下方。

---

## 2. 当其他技能指示“发布到工单系统（publish to the issue tracker）”时

在 `.scratch/<feature-slug>/` 目录下创建对应的新文件（若目录不存在则自动创建）。

---

## 3. 当其他技能指示“抓取关联工单（fetch the relevant ticket）”时

直接读取指定路径下的 Markdown 文件。用户通常会直接传入相对文件路径或对应的工单编号。

---

## 4. 迷雾寻路导航规范（Wayfinding operations，供 `/wayfinder` 技能调用）

用于配合 `/wayfinder` 解决超大型探索任务。**导航地图（map）** 是一个根文件，每一个决策工单对应一个 **子文件（child file）**：

- **导航地图（Map）**：保存在 `.scratch/<effort>/map.md` —— 正文涵盖基础备忘（Notes）、截至目前决策（Decisions-so-far）以及未来的战争迷雾（Fog）；
- **决策子工单（Child ticket）**：保存在 `.scratch/<effort>/issues/NN-<slug>.md`，编号从 `01` 开始递增，正文记录具体待解答的疑难问题。在正文顶部用 `Type:` 行记录工单类型（`research`、`prototype`、`grilling`、`task`）；用 `Status:` 行标记当前状态（`claimed` 已认领 / `resolved` 已解决）；
- **依赖阻塞关系（Blocking）**：在文件顶部附近标注 `Blocked by: NN, NN`。当且仅当其所列出的所有前置工单的 `Status:` 均变为 `resolved` 时，该工单自动宣告**阻塞解除（unblocked）**；
- **开拓前沿扫描（Frontier）**：扫描 `.scratch/<effort>/issues/` 目录，找出所有处于开启状态、依赖已全部解决、且尚未被任何人认领的工单；按照文件编号升序排列，排在最前的一张工单胜出；
- **认领任务（Claim）**：在动工执行任何实质工作之前，在文件顶部将状态设置为 `Status: claimed` 并保存落盘 —— 作为当前会话的**第一次写操作**；
- **顺利解决（Resolve）**：在工单底部 `## Answer` 标题下追加详细解答，将状态置为 `Status: resolved`，随后在根地图 `map.md` 的“截至目前决策（Decisions-so-far）”章节追加一行带链接的上下文指针（极简结论要点 + 相对文件路径链接）。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `02-setup-matt-pocock-skills` |
| bucket | engineering |
| 上游路径 | `skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md` |
| 角色定位 | 基于本地 Markdown 文件的纯文件工单系统规范（Local Markdown Issue Tracker） |
| 关联模块 | `07-to-spec`、`08-to-tickets`、`18-triage`、`19-wayfinder` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
```

</details>
