# 02-setup-matt-pocock-skills / issue-tracker-github.md 精读（工单系统适配规范：GitHub Issues）

本代码仓库的所有规范文档（specs）与具体工单（issues/tickets）均通过 `gh` 命令行工具发布并沉淀在 GitHub Issues 中。

---

## 1. 当其他技能指示“发布到工单系统（publish to the issue tracker）”时

使用 `gh issue create` 命令创建新工单：
- **工单标题**：必须与 spec 规范或 ticket 工单的原生标题完全保持一致；
- **工单正文**：完整填入 spec 或 ticket 的 Markdown 全文内容。

---

## 2. 当其他技能指示“抓取关联工单（fetch the relevant ticket）”时

使用 `gh issue view <编号>` 命令调阅并解析目标 Issue。

---

## 3. 分流执行链路规范（Triage operations，供 `/triage` 技能调用）

- **待分流查询（Needs-triage query）**：运行 `gh issue list --label needs-triage`（仅检索开启状态的工单，按由早到晚的创建时间正序排列）；
- **更新分流状态（Update triage state）**：通过 `gh issue edit <n> --add-label "<新标签>" --remove-label "<旧标签>"` 变更状态，并通过评论回贴分流简报：`gh issue comment <n> --body "<执行简报>"`；
- **映射标准角色（Apply triage roles）**：依据 `triage-labels.md`，将标准抽象角色（`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`）精准转换为当前仓库的实际 Label 字符串。

---

## 4. 迷雾寻路导航规范（Wayfinding operations，供 `/wayfinder` 技能调用）

在超大型探索任务中，**导航地图（map）** 是打上 `epic` 标签的根 Issue，一张地图下挂若干代表决策工单的 **子任务 Issue（child tickets）**：

- **导航地图（Map）**：标记为 `epic` 的 Issue —— 其正文涵盖基础备忘（Notes）、截至目前的决策沉淀（Decisions-so-far）以及未来的战争迷雾（Fog）；
- **创建子工单（Child ticket）**：执行 `gh issue create --title "<简述>" --body "<具体决策难题>" --label "task"`。在正文顶部用 `Type:` 行标注工单类型（`research`、`prototype`、`grilling`、`task`）；
- **依赖阻塞关系（Blocking）**：优先使用 GitHub **原生的 Sub-issues / Tracked-by 关联链接**（通过 GraphQL 变更接口挂载，在网页 UI 上直观可视）。由于原生链接在 GitHub 免费版上受限，降级容错方案是在正文顶部第一行注明 `Blocked by: #<n>, #<n>`。当一个工单所依赖的所有前置工单均已关闭时，该工单自动宣告**阻塞解除（unblocked）**；
- **开拓前沿查询（Frontier query）**：运行 `gh issue list --label task --json number,title,labels,assignees` 检索地图下的所有子工单。过滤剔除那些存在未关闭前置依赖、或已经被分配认领的工单；按照地图既定顺序挑选排在最前的第一张未阻塞工单作为当前突破口；
- **认领任务（Claim）**：在动工执行任何实质工作之前，首先执行 `gh issue edit <n> --add-assignee "@me"` 抢占工单所有权 —— 作为当前会话的**第一次写操作**；
- **顺利解决（Resolve）**：将最终结论评论回贴：`gh issue comment <n> --body "<结论答案>"`，随后执行 `gh issue close <n>` 关闭工单，并在根地图 Issue 的“截至目前决策（Decisions-so-far）”章节追加一行带链接的上下文指针（极简核心要点 + 对应 Issue URL）。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `02-setup-matt-pocock-skills` |
| bucket | engineering |
| 上游路径 | `skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md` |
| 角色定位 | 基于 GitHub Issues 的工单与分流操作规范（GitHub Issue Tracker Adapter） |
| 关联模块 | `08-to-tickets`、`18-triage`、`19-wayfinder` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Issue tracker: GitHub Issues

Issues and specs for this repo are published to GitHub Issues via the `gh` CLI.

## When a skill says "publish to the issue tracker"

Create an issue using `gh issue create`.

- Title should match the spec or ticket title
- Body should be the full markdown content of the spec or ticket

## When a skill says "fetch the relevant ticket"

Read the issue using `gh issue view <number>`.

## Triage operations

Used by `/triage`.

- **Needs-triage query**: `gh issue list --label needs-triage` (open issues only, oldest first).
- **Update triage state**: `gh issue edit <n> --add-label "<label>" --remove-label "<old-label>"` and post findings as a comment with `gh issue comment <n> --body "<brief>"`.
- **Apply triage roles**: map canonical roles (`needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) to repository labels using `triage-labels.md`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is an issue labelled `epic`, with one **child** issue per ticket.

- **Map**: the issue labelled `epic` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `gh issue create --title "<slug>" --body "<question>" --label "task"`. A `Type:` line in the body records the ticket type (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: GitHub's **native tracked-by link** — the canonical, UI-visible representation. Add it via the GraphQL mutation (`tracked-issues` / `trackBySubIssues`). Native links are a GitHub paid feature; on the free tier (or where unavailable) fall back to a `Blocked by: #<n>, #<n>` line at the top of the body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: `gh issue list --label task --json number,title,labels,assignees`, drop any with an open blocker — a native tracked-by parent in an open state, or an open issue in the `Blocked by` line — or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee "@me"` — the session's first write.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
```

</details>
