# 02. setup-matt-pocock-skills

## Meta

- bucket: `engineering`
- path: `skills/engineering/setup-matt-pocock-skills/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills
- 触发方式：`disable-model-invocation: true` → **user-invoked only**（模型不可自动调用；必须用户显式跑）
- companion 文件：
  - [issue-tracker-github.md](./02-setup-matt-pocock-skills_issue-tracker-github.md)
  - [issue-tracker-gitlab.md](./02-setup-matt-pocock-skills_issue-tracker-gitlab.md)
  - [issue-tracker-local.md](./02-setup-matt-pocock-skills_issue-tracker-local.md)
  - [triage-labels.md](./02-setup-matt-pocock-skills_triage-labels.md)
  - [domain.md](./02-setup-matt-pocock-skills_domain.md)
  - `agents/openai.yaml`

## 原文 (SKILL.md)

````markdown
---
name: setup-matt-pocock-skills
description: Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills.
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live (GitHub by default; local markdown is also supported out of the box)
- **Triage labels** — the strings used for the five canonical triage roles
- **Domain docs** — where `CONTEXT.md` and ADRs live, and the consumer rules for reading them

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `AGENTS.md` and `CLAUDE.md` at the repo root — does either exist? Is there already an `## Agent skills` section in either?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already in use
- Is the `triage` skill installed? (a `triage` skill folder alongside this one, or `triage` in your available skills.) This decides whether Section B runs at all.
- Monorepo signals — a `pnpm-workspace.yaml`, a `workspaces` field in `package.json`, or a populated `packages/*` with its own `src/`. Present only in a genuinely large multi-package repo; their absence means single-context, which is almost every repo.

### 2. Present findings and ask

Summarise what's present and what's missing. Then take the sections in order — one section, one answer, then the next.

Lead each section with the recommended answer so the user can accept it in a word. Give a one-line explainer only when the choice genuinely branches; skip the section entirely when exploration already settled it (Section B when `triage` isn't installed, Section C when there's no monorepo).

**Section A — Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-tickets`, `triage`, and `to-spec` read from and write to it — they need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you actually track work for this repo.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub** — issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab** — issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown** — issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.) — ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose

Record the choice in `docs/agents/issue-tracker.md`. The GitHub and GitLab templates carry a "PRs as a request surface" flag, defaulted **off** — leave it off and don't raise it; a user who wants external PRs in the triage queue can flip the flag in the file later.

**Section B — Triage label vocabulary.** Skip this section entirely if the `triage` skill isn't installed (exploration told you) — an uninstalled skill needs no labels.

If it is installed, ask exactly one question:

> Do you want to keep the default triage labels? (recommended: **yes**)

The defaults are the five canonical roles, each label string equal to its name: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. On **yes**, write them as-is. Only if the user says no — usually because their tracker already uses other names (e.g. `bug:triage` for `needs-triage`) — collect the overrides so `triage` applies existing labels instead of creating duplicates.

**Section C — Domain docs.** Default to **single-context** — one `CONTEXT.md` + `docs/adr/` at the repo root. This fits almost every repo; write it without asking.

Offer **multi-context** — a root `CONTEXT-MAP.md` pointing to per-context `CONTEXT.md` files — only when exploration found monorepo signals. Then confirm which layout they want.

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to whichever of `CLAUDE.md` / `AGENTS.md` is being edited (see step 4 for selection rules)
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md` (the last only when `triage` is installed)

Let them edit before writing.

### 4. Write

**Pick the file to edit:**

- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which one to create — don't pick for them.

Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa) — always edit the one that's already there.

If an `## Agent skills` block already exists in the chosen file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Include the `### Triage labels` sub-block, and write `docs/agents/triage-labels.md`, only when `triage` is installed and Section B ran. When it isn't, both are omitted.

Then write the docs files using the seed templates in this skill folder as a starting point:

- [issue-tracker-github.md](./02-setup-matt-pocock-skills_issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./02-setup-matt-pocock-skills_issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./02-setup-matt-pocock-skills_issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./02-setup-matt-pocock-skills_triage-labels.md) — label mapping (only if `triage` is installed)
- [domain.md](./02-setup-matt-pocock-skills_domain.md) — domain doc consumer rules + layout

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

### 5. Done

Tell the user the setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later — re-running this skill is only necessary if they want to switch issue trackers or restart from scratch.
````

## 中文翻译

```yaml
name: setup-matt-pocock-skills
description: 为本仓库配置 engineering skills 所需前提——设置 issue tracker、triage 标签词表、domain 文档布局。在首次使用其他 engineering skills 之前跑一次。
disable-model-invocation: true  # 禁止模型自动调用
```

# Setup Matt Pocock's Skills

为 engineering skills 所假设的「每仓配置」搭脚手架：

- **Issue tracker** — issues 落在哪里（默认 GitHub；也开箱支持本地 markdown）
- **Triage labels** — 五个规范 triage 角色所用的字符串
- **Domain docs** — `CONTEXT.md` 与 ADRs 的位置，以及读取它们的消费规则

这是 **prompt 驱动的 skill**，不是确定性脚本。流程是：探索 → 呈现发现 → 与用户确认 → 再写入。

## 流程

### 1. 探索

看当前 repo 的起始状态。有什么读什么，不要假设：

- `git remote -v` 与 `.git/config` — 是不是 GitHub？哪个？
- 根目录的 `AGENTS.md` / `CLAUDE.md` — 是否存在？是否已有 `## Agent skills` 段？
- 根目录的 `CONTEXT.md` / `CONTEXT-MAP.md`
- `docs/adr/` 以及任何 `src/*/docs/adr/`
- `docs/agents/` — 本 skill 是否已有先前输出？
- `.scratch/` — 是否已在用本地 markdown issue tracker 约定
- `triage` skill 是否已安装？（同目录有 `triage` 文件夹，或可用 skills 列表里有它）这决定 Section B 是否执行
- monorepo 信号 — `pnpm-workspace.yaml`、`package.json` 的 `workspaces`、或有独立 `src/` 的 `packages/*`。只在真正大型多包仓呈现；没有则按 single-context（几乎所有仓）

### 2. 呈现发现并提问

总结已有与缺失。然后按 section 顺序：一个 section、一个答案、再下一个。

每个 section 先给推荐答案，让用户一句话就能接受。只有真正分叉时才给一行 explainer；探索已定案时整段跳过（无 未装则跳 B；无 monorepo 则跳 C 提问）。

**Section A — Issue tracker。**

> Explainer：issue tracker 是本仓 issues 所在处。`to-tickets`、`triage`、`to-spec` 等会读写它——需要知道是调 `gh issue create`、写 `.scratch/` 下 markdown，还是按你描述的其他工作流。选你**实际**用来跟进本仓工作的地方。

默认姿态：这套 skill 为 GitHub 设计。remote 指向 GitHub 就提议 GitHub；指向 GitLab 就提议 GitLab。否则（或用户偏好）提供：

- **GitHub** — 用 `gh` CLI
- **GitLab** — 用 `glab` CLI
- **Local markdown** — `.scratch/<feature>/`（适合 solo 或无 remote）
- **Other**（Jira、Linear 等）— 让用户用一段话描述工作流，记为 freeform prose

选择写入 `docs/agents/issue-tracker.md`。GitHub/GitLab 模板带有「PRs as a request surface」开关，默认 **off**——保持 off 且不要主动提出；想把外部 PR 进 triage 队列的用户可事后改文件。

**Section B — Triage label vocabulary。** 若未装 `triage` 则整段跳过。

若已装，只问一题：是否保留默认 triage labels？（推荐 **yes**）

默认五个规范角色，标签字符串等于角色名：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。yes 则原样写入；no 时（通常因 tracker 已有别名）收集 override，避免 `triage` 创建重复标签。

**Section C — Domain docs。** 默认 **single-context**——根目录一个 `CONTEXT.md` + `docs/adr/`。几乎适用所有仓；**不问直接写**。

仅当探索发现 monorepo 信号时，才提供 **multi-context**（根 `CONTEXT-MAP.md` 指向各 context 的 `CONTEXT.md`）并确认布局。

### 3. 确认与编辑

给用户看草稿：

- 将写入 `CLAUDE.md` / `AGENTS.md` 的 `## Agent skills` 块
- `docs/agents/issue-tracker.md`、`[domain.md](./02-setup-matt-pocock-skills_domain.md)`、`[triage-labels.md](./02-setup-matt-pocock-skills_triage-labels.md)`（后者仅当装了 triage）

允许写入前修改。

### 4. 写入

**选编辑文件：**

- 有 `CLAUDE.md` → 编辑它
- 否则有 `AGENTS.md` → 编辑它
- 都没有 → **问用户**要创建哪一个，不要替用户选

绝不在已有一方时再创建另一方。已有 `## Agent skills` 则原地更新，不追加重复块；不覆盖周围用户编辑。

块结构含 Issue tracker / Triage labels（条件）/ Domain docs 三个子段，指向 `docs/agents/*.md`。

然后用本 skill 目录下 seed 模板写 docs 文件。Other tracker 则按用户描述从零写 `issue-tracker.md`。

### 5. 完成

告知 setup 完成、哪些 engineering skills 会读这些文件。说明之后可直接改 `docs/agents/*.md`；只有换 issue tracker 或想从零重来才需要重跑本 skill。
