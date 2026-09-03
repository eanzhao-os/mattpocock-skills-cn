# 02-setup-matt-pocock-skills / issue-tracker-github.md 精读（工单系统适配规范：GitHub Issues）

本代码仓库的所有规范文档（specs）与具体工单（issues/tickets）均以 GitHub Issues 的形式沉淀，所有操作统一通过 `gh` CLI 完成。

---

## 1. 常规操作约定（Conventions）

- **创建工单**：`gh issue create --title "..." --body "..."`，多行正文使用 heredoc；
- **阅读工单**：`gh issue view <编号> --comments`，用 `jq` 过滤评论，并一并获取标签；
- **列出工单**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，按需叠加 `--label` 与 `--state` 过滤器；
- **评论**：`gh issue comment <编号> --body "..."`；
- **增删标签**：`gh issue edit <编号> --add-label "..."` / `--remove-label "..."`；
- **关闭**：`gh issue close <编号> --comment "..."`。

仓库归属从 `git remote -v` 推断 —— 在 clone 内运行时 `gh` 会自动识别。

---

## 2. PR 作为分流请求入口（Pull requests as a triage surface）

**外部 PR 是否视为需求提交入口（PRs as a request surface）：no。** _（若本仓库把外部 PR 当作功能请求来处理，则改为 `yes`；`/triage` 会读取此开关。）_

置为 `yes` 时，PR 与 Issue 走同一套标签与状态，改用对应的 `gh pr` 命令：

- **阅读 PR**：`gh pr view <编号> --comments`，并用 `gh pr diff <编号>` 查看差异；
- **列出待分流的外部 PR**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，只保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的 PR（丢弃 `OWNER`/`MEMBER`/`COLLABORATOR`）；
- **评论 / 打标 / 关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 的 Issue 与 PR 共享同一个编号空间，因此裸编号 `#42` 两者皆有可能 —— 先用 `gh pr view 42` 判定，再回退到 `gh issue view 42`。

---

## 3. 当其他技能指示“发布到工单系统（publish to the issue tracker）”时

创建一条 GitHub Issue。

---

## 4. 当其他技能指示“抓取关联工单（fetch the relevant ticket）”时

运行 `gh issue view <编号> --comments`。

---

## 5. 迷雾寻路导航规范（Wayfinding operations，供 `/wayfinder` 技能调用）

用于配合 `/wayfinder`。**导航地图（map）** 是一条单独的 Issue，每个决策工单对应一张**子 Issue（child issue）**：

- **导航地图（Map）**：一条打上 `wayfinder:map` 标签的 Issue，正文承载基础备忘（Notes）、截至目前决策（Decisions-so-far）与战争迷雾（Fog）。通过 `gh issue create --label wayfinder:map` 创建；
- **决策子工单（Child ticket）**：以 GitHub sub-issue 的形式挂接到地图（对 sub-issues 接口调用 `gh api`）。若 sub-issues 未启用，则把子工单加进地图正文的任务清单（task list），并在子工单正文顶部标注 `Part of #<map>`。标签为 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。一旦被认领，工单即分配给主理的开发者；
- **依赖阻塞关系（Blocking）**：优先使用 GitHub **原生的工单依赖（issue dependencies）** —— 权威且在 UI 上直观可见。通过 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加依赖边，其中 `<blocker-db-id>` 是阻塞方的数字**数据库 id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，而不是 `#number` 或 `node_id`）。GitHub 通过 `issue_dependencies_summary.blocked_by` 报告阻塞情况（仅统计开启中的阻塞方，即实时闸门）。若依赖功能不可用，降级为在子工单正文顶部标注 `Blocked by: #<n>, #<n>`。当所有阻塞方均已关闭时，该工单自动宣告**阻塞解除（unblocked）**；
- **开拓前沿查询（Frontier query）**：列出地图下处于开启状态的子工单（`gh issue list --state open`，限定在地图的 sub-issues / 任务清单范围内），剔除任何存在未关闭阻塞方（`issue_dependencies_summary.blocked_by > 0`，或 `Blocked by` 行中存在开启中的工单）或已有 assignee 的工单；按地图既定顺序排在最前的一张胜出；
- **认领任务（Claim）**：`gh issue edit <n> --add-assignee @me` —— 当前会话的**第一次写操作**；
- **顺利解决（Resolve）**：`gh issue comment <n> --body "<结论答案>"`，随后 `gh issue close <n>` 关闭工单，再向地图的“截至目前决策（Decisions-so-far）”章节追加一行带链接的上下文指针（极简核心要点 + 对应链接）。

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
# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v`; `gh` does this automatically when run inside a clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either: resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `gh issue create --label wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue (`gh api` on the sub-issues endpoint). Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: GitHub's **native issue dependencies**, the canonical, UI-visible representation. Add an edge with `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric **database id** (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _not_ the `#number` or `node_id`). GitHub reports `issue_dependencies_summary.blocked_by` (open blockers only, the live gate). Where dependencies aren't available, fall back to a `Blocked by: #<n>, #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children (`gh issue list --state open`, scoped to the map's sub-issues / task list), drop any with an open blocker (`issue_dependencies_summary.blocked_by > 0`, or an open issue in the `Blocked by` line) or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee @me`, the session's first write.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
```

</details>
