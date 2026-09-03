# 02-setup-matt-pocock-skills / issue-tracker-gitlab.md 精读（工单系统适配规范：GitLab Issues）

本代码仓库的所有规范文档（specs）与具体工单（issues/tickets）均以 GitLab Issues 的形式沉淀，所有操作统一通过 [`glab`](https://gitlab.com/gitlab-org/cli) CLI 完成。

---

## 1. 常规操作约定（Conventions）

- **创建工单**：`glab issue create --title "..." --description "..."`，多行描述使用 heredoc；传入 `--description -` 可打开编辑器；
- **阅读工单**：`glab issue view <编号> --comments`，机器可读输出使用 `-F json`；
- **列出工单**：`glab issue list -F json`，按需叠加 `--label` 过滤器；
- **评论工单**：`glab issue note <编号> --message "..."`。GitLab 把评论称为 “notes”；
- **增删标签**：`glab issue update <编号> --label "..."` / `--unlabel "..."`，多个标签可用逗号分隔或重复传参；
- **关闭**：`glab issue close <编号>`。`glab issue close` 不支持附带关闭评论，因此先用 `glab issue note <编号> --message "..."` 说明原因，再执行关闭；
- **合并请求（Merge requests）**：GitLab 把 PR 称为 “merge requests”。使用 `glab mr create`、`glab mr view`、`glab mr note` 等 —— 与 `gh pr ...` 同构，只是把 `pr` 换成 `mr`、`comment`/`--body` 换成 `note`/`--message`。

仓库归属从 `git remote -v` 推断 —— 在 clone 内运行时 `glab` 会自动识别。

---

## 2. MR 作为分流请求入口（Merge requests as a triage surface）

**外部 MR 是否视为需求提交入口（MRs as a request surface）：no。** _（若本仓库把外部 merge request 当作功能请求来处理，则改为 `yes`；`/triage` 会读取此开关。）_

置为 `yes` 时，MR 与 Issue 走同一套标签与状态，改用对应的 `glab mr` 命令：

- **阅读 MR**：`glab mr view <编号> --comments`，并用 `glab mr diff <编号>` 查看差异；
- **列出待分流的外部 MR**：`glab mr list -F json`，只保留作者不是项目成员/所有者的 MR（即贡献者的 MR，而非维护者进行中的工作）；
- **评论 / 打标 / 关闭**：`glab mr note`、`glab mr update --label`/`--unlabel`、`glab mr close`。

与 GitHub 不同，GitLab 的 Issue 与 MR 各自独立编号，因此只要明确维护者指的是哪个入口，`#42` 就不存在歧义。

---

## 3. 当其他技能指示“发布到工单系统（publish to the issue tracker）”时

创建一条 GitLab Issue。

---

## 4. 当其他技能指示“抓取关联工单（fetch the relevant ticket）”时

运行 `glab issue view <编号> --comments`。

---

## 5. 迷雾寻路导航规范（Wayfinding operations，供 `/wayfinder` 技能调用）

用于配合 `/wayfinder`。**导航地图（map）** 是一条单独的 Issue，每个决策工单对应一张**子 Issue（child issue）**：

- **导航地图（Map）**：一条打上 `wayfinder:map` 标签的 Issue，正文承载基础备忘（Notes）、截至目前决策（Decisions-so-far）与战争迷雾（Fog）。通过 `glab issue create --label wayfinder:map` 创建。（在支持原生 epic 的 GitLab 版本上，也可以用 epic 承载地图；打标签的 Issue 则处处可用。）
- **决策子工单（Child ticket）**：在描述正文顶部标注 `Part of #<map>`，并打上 `wayfinder:<type>` 标签（`research`/`prototype`/`grilling`/`task`）。一旦被认领，工单即分配给主理的开发者；
- **依赖阻塞关系（Blocking）**：优先使用 GitLab **原生的阻塞链接（native blocking link）** —— 权威且在 UI 上直观可见。通过快捷指令 `/blocked_by #<n>` 添加，以 note 形式发送（`glab issue note <子工单> --message "/blocked_by #<阻塞方>"`）。原生阻塞链接是 Premium/Ultimate 版功能；在免费版（或不可用环境）下降级为在描述正文顶部标注 `Blocked by: #<n>, #<n>`。当所有阻塞方均已关闭时，该工单自动宣告**阻塞解除（unblocked）**；
- **开拓前沿查询（Frontier query）**：`glab issue list -F json` 限定在地图的子工单范围内，剔除任何存在未关闭阻塞方 —— 指向开启中工单的原生 `blocked_by` 链接（`glab api projects/:id/issues/:iid/links`），或 `Blocked by` 行中开启中的工单 —— 或已有 assignee 的工单；按地图既定顺序排在最前的一张胜出；
- **认领任务（Claim）**：`glab issue update <n> --assignee @me` —— 当前会话的**第一次写操作**；
- **顺利解决（Resolve）**：`glab issue note <n> --message "<结论答案>"`，随后 `glab issue close <n>` 关闭工单，再向地图的“截至目前决策（Decisions-so-far）”章节追加一行带链接的上下文指针（极简核心要点 + 对应链接）。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `02-setup-matt-pocock-skills` |
| bucket | engineering |
| 上游路径 | `skills/engineering/setup-matt-pocock-skills/issue-tracker-gitlab.md` |
| 角色定位 | 基于 GitLab Issues 的工单与分流操作规范（GitLab Issue Tracker Adapter） |
| 关联模块 | `08-to-tickets`、`18-triage`、`19-wayfinder` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Issue tracker: GitLab

Issues and specs for this repo live as GitLab issues. Use the [`glab`](https://gitlab.com/gitlab-org/cli) CLI for all operations.

## Conventions

- **Create an issue**: `glab issue create --title "..." --description "..."`. Use a heredoc for multi-line descriptions. Pass `--description -` to open an editor.
- **Read an issue**: `glab issue view <number> --comments`. Use `-F json` for machine-readable output.
- **List issues**: `glab issue list -F json` with appropriate `--label` filters.
- **Comment on an issue**: `glab issue note <number> --message "..."`. GitLab calls comments "notes".
- **Apply / remove labels**: `glab issue update <number> --label "..."` / `--unlabel "..."`. Multiple labels can be comma-separated or by repeating the flag.
- **Close**: `glab issue close <number>`. `glab issue close` does not accept a closing comment, so post the explanation first with `glab issue note <number> --message "..."`, then close.
- **Merge requests**: GitLab calls PRs "merge requests". Use `glab mr create`, `glab mr view`, `glab mr note`, etc., the same shape as `gh pr ...` with `mr` in place of `pr` and `note`/`--message` in place of `comment`/`--body`.

Infer the repo from `git remote -v`; `glab` does this automatically when run inside a clone.

## Merge requests as a triage surface

**MRs as a request surface: no.** _(Set to `yes` if this repo treats external merge requests as feature requests; `/triage` reads this flag.)_

When set to `yes`, MRs run through the same labels and states as issues, using the `glab mr` equivalents:

- **Read an MR**: `glab mr view <number> --comments` and `glab mr diff <number>` for the diff.
- **List external MRs for triage**: `glab mr list -F json`, then keep only MRs whose author is not a project member/owner (a contributor's MR, not a maintainer's in-flight work).
- **Comment / label / close**: `glab mr note`, `glab mr update --label`/`--unlabel`, `glab mr close`.

Unlike GitHub, GitLab numbers issues and MRs separately, so `#42` is unambiguous once you know which surface the maintainer means.

## When a skill says "publish to the issue tracker"

Create a GitLab issue.

## When a skill says "fetch the relevant ticket"

Run `glab issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `glab issue create --label wayfinder:map`. (On GitLab tiers with native epics, an epic may hold the map instead; a labelled issue works everywhere.)
- **Child ticket**: an issue carrying `Part of #<map>` at the top of its description and labels `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: GitLab's **native blocking link**, the canonical, UI-visible representation. Add it with the `/blocked_by #<n>` quick action, posted as a note (`glab issue note <child> --message "/blocked_by #<blocker>"`). Native blocking links are a Premium/Ultimate feature; on the free tier (or where unavailable) fall back to a `Blocked by: #<n>, #<n>` line at the top of the description. A ticket is unblocked when every blocker is closed.
- **Frontier query**: `glab issue list -F json` scoped to the map's children, drop any with an open blocker: a native `blocked_by` link to an open issue (`glab api projects/:id/issues/:iid/links`), or an open issue in the `Blocked by` line, or an assignee; first in map order wins.
- **Claim**: `glab issue update <n> --assignee @me`, the session's first write.
- **Resolve**: `glab issue note <n> --message "<answer>"`, then `glab issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
```

</details>
