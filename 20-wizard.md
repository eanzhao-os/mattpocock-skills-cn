# 20. wizard

## Meta（bucket/path/url/触发方式/companions）

| 字段 | 值 |
|---|---|
| bucket | `engineering/` |
| path | `skills/engineering/wizard/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/engineering/wizard |
| name | `wizard` |
| 触发方式 | description：Generate an interactive bash wizard that walks a human through steps only they can perform（model-invoked） |
| companions | `template.sh`、`agents/openai.yaml`——本页只列角色，不全文翻译 |
| 产物 | interactive bash script |
| 消费方 | 基础设施配资、凭证、第三方 dashboard、一次性 cutover |

## 原文 (SKILL.md)

```markdown
---
name: wizard
description: Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself.
---

# Wizard

A **wizard** is a bash script that walks a human, step by step, through a manual procedure that's tedious to do by hand and tedious to re-explain to an AI every time. It opens each URL, says exactly what to click and copy, captures the values, writes them where they belong (`.env`, GitHub secrets), confirms at every stage, and shows how many stages are left. It might configure third-party services, run a one-off migration, or move the project from one state to another.

The delightful UX is already solved by [template.sh](template.sh) — stage-by-stage progress, confirmation gates, cross-platform URL opening (including WSL), hidden secret entry, idempotent `.env` upserts, `gh secret`/`gh variable` writes, and a closing summary. **Your job is only to scope the procedure and author its stages.** The library above the `STAGES` marker is identical in every wizard; that consistency is the point — never hand-edit it.

A wizard is ephemeral by default — built for one run, saved to a scratch or `scripts/` path, deleted when the job's done. Commit it only when the user wants a repeatable setup path that should live in the repo.

## Process

### 1. Scope the procedure

Work out every manual step the human must take and every value that gets captured along the way. Read the repo first — don't ask cold:

- For setup: `.env`, `.env.example`, `.env.*`, `README`, `docker-compose*`, framework config, and `.github/workflows/*` (every `secrets.*` / `vars.*` reference is a value the wizard must produce).
- For a migration or transition: the current state, the target state, and the irreversible actions between them.

Then show the user the ordered list of stages and the values each produces, and confirm — they may add, drop, or reorder.

**Done when:** every stage is named in order, and for each captured value you know (a) where the human gets it, (b) where it's written (`.env`, a GitHub secret, both, or nowhere — some stages are pure actions), and (c) whether it's secret (hidden entry) or public.

### 2. Map each stage's journey

For each stage, write the precise path a human follows: which URL to open, what to do there, where a value is shown, which variable it fills — e.g. "Dashboard → Developers → API keys → Reveal test key → copy". Where you don't actually know the current UI or the exact command, say so and ask the user or check the docs — never invent steps that may not exist.

**Done when:** every stage traces to concrete instructions a stranger could follow.

### 3. Author the wizard

Copy `template.sh` to the target path. Replace the example stage with one `stage` per step, in dependency order. Use the library helpers — `stage`, `say`/`step`, `open_url`, `ask`/`ask_secret`, `write_env`, `set_secret`/`set_var`, `pause`/`confirm` — and set `TOTAL_STAGES` to the number of stages you wrote.

Hold the bar the template sets: open the URL before asking for its value, use `ask_secret` for anything secret, `write_env` every persisted value, `set_secret` only the values CI actually needs, and `confirm` before any irreversible action. Each `stage` clears the screen so only the current step is visible — keep a stage to one focused task so nothing the human needs scrolls away. Don't touch the library above the marker.

### 4. Verify and hand off

- `bash -n <script>`; run `shellcheck` if available.
- `chmod +x <script>`.
- Don't run it end-to-end yourself — it opens browsers and blocks on human input. Trace it statically: every value from step 1 is captured and lands where step 1 said, and every `set_secret` name exactly matches a `secrets.*` reference in CI.
- Tell the user how to run it. If it's a repeatable setup path, commit it and link it from the README so the next person runs the script instead of asking an AI.
```

## 中文翻译

## 中文翻译

```yaml
name: wizard
description: 生成一个交互式的 Bash 向导脚本（interactive bash wizard），一步步引导人类完成只有他们自己才能执行的手工操作。当配置基础设施、设置鉴权凭据或 CI 密钥、操作不熟悉的第三方服务控制台、或运行一次性数据迁移与系统割接时使用。对于 Agent 自己完全能独立执行的步骤，不要调用此技能。
```

# Wizard（交互式人工操作引导向导）

**向导（wizard）** 是一个交互式的 Bash 脚本，用于一步一步引导人类完成某项手工操作流程 —— 这些流程如果完全靠人肉去操作会极其繁琐枯燥，而每次都要重新向 AI 解释一遍也同样费时费力。脚本会自动打开各个目标网页 URL，明确指导人类在页面上点击什么、复制什么，自动捕获用户输入的数值，并将其精准写入到该去的地方（本地 `.env` 环境文件、GitHub Secrets 密钥仓库），在每一个阶段都设置确认关卡，并实时显示还剩余多少个阶段。它可以用于配置第三方云服务、运行一次性数据迁移、或将项目从一个阶段平滑过渡到另一个阶段。

令人愉悦的用户交互体验已经在 [template.sh](template.sh) 中封装完毕 —— 包含阶段式进度指示、确认关卡门禁、跨平台自动打开浏览器 URL（包括 WSL 环境）、敏感密钥隐藏式输入、幂等的 `.env` 文件增补与更新、`gh secret` / `gh variable` 命令行自动写入、以及最终的完成汇总摘要。**你的核心工作仅仅是界定流程范围并编写具体的执行阶段。** 脚本中 `STAGES` 标记上方的所有底层函数库在每一个向导中都是完全相同且标准化的；保持这种体验的高度一致性是本 skill 的灵魂所在 —— 绝不要手动去修改底层的通用函数库。

向导脚本在默认情况下是**用后即弃的（ephemeral）** —— 为单次操作而编写，保存在临时目录或项目的 `scripts/` 路径下，工作完成后即可删除。只有当用户希望将其沉淀为一套可在代码库中长期保留、供团队反复执行的标准化初始化流程时，才将其正式提交到 Git 中。

---

## 流程

### 1. 界定操作流程范围（Scope the procedure）

梳理出人类必须亲自执行的每一个手工步骤，以及沿途需要捕获收集的每一个配置数值。首先主动通读代码库 —— 不要冷不丁直接向用户提问：
- **针对初始化配置类场景**：查阅 `.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、框架配置文件以及 `.github/workflows/*`（CI 流程中引用的每一个 `secrets.*` / `vars.*` 都是向导脚本必须负责产出的关键变量）。
- **针对数据迁移或系统割接类场景**：理清当前状态、目标状态、以及两者之间不可逆的危险操作。

随后向用户展示排序后的执行阶段列表以及每个阶段负责产出的具体变量，并向用户确认 —— 用户可能会在此基础上追加、剔除或重新排列阶段顺序。

**阶段完成判据：** 每一个阶段都按执行顺序清晰定名，且针对捕获的每一个数值，你都明确知晓：(a) 人类从哪里获取它，(b) 它最终被写入何处（`.env`、GitHub Secrets、两者兼有、或不写入任何地方 —— 某些阶段纯粹只是触发操作动作），以及 (c) 它属于敏感机密（需要隐藏输入）还是普通公开配置。

### 2. 绘制每个阶段的操作路径（Map each stage's journey）

针对每一个执行阶段，写出人类需要遵循的精准操作路径：打开哪个 URL、在页面上具体执行什么操作、目标数值展示在什么位置、该数值将填充给哪一个环境变量 —— 例如：“进入 Dashboard 控制台 → 点击 Developers 开发者设置 → 找到 API keys → 点击 Reveal 显示测试密钥 → 复制该密钥”。如果某些第三方的最新 UI 界面或具体命令你并不确切了解，老实承认并向用户请教或查阅官方文档 —— 绝不要凭空臆测可能根本不存在的操作步骤。

**阶段完成判据：** 每一个阶段都能够顺藤摸瓜对应到极其具体的实操指令，哪怕是一位完全不熟悉该系统的陌生人也能顺利照着操作执行。

### 3. 编写向导脚本（Author the wizard）

将 `template.sh` 模板复制到目标脚本路径中。按照前置依赖顺序，将模板中的示例阶段替换为你的一个个具体 `stage`。充分调用底层的通用辅助函数 —— `stage`（声明阶段）、`say`/`step`（打印提示）、`open_url`（打开网页）、`ask`/`ask_secret`（读取普通输入/隐密密钥）、`write_env`（写入 env 文件）、`set_secret`/`set_var`（写入 GitHub 密钥与变量）、`pause`/`confirm`（暂停确认） —— 并将 `TOTAL_STAGES` 常量准确设置为你编写的总阶段数。

严格遵循模板所树立的高标准交互规范：
- 在向用户索取数值之前，**先自动打开对应的网页 URL**；
- 对任何敏感凭据，一律使用 `ask_secret` 隐藏式输入；
- 对需要本地保存的配置，使用 `write_env` 进行持久化；
- 仅将 CI 流程确实需要的变量通过 `set_secret` 同步到 GitHub；
- 在执行任何不可逆的破坏性操作之前，**必须使用 `confirm` 强制用户确认**；
- 每一个 `stage` 都会自动清屏，确保屏幕上只展示当前步骤的核心内容 —— 将单个 stage 的职责严格限制在单个聚焦的任务内，避免重要的提示信息被滚出屏幕。
- 绝不要修改标记行上方的底层函数库代码。

### 4. 验证与最终交付（Verify and hand off）

- 执行 `bash -n <script>` 进行语法静态校验；如果环境中安装了 `shellcheck` 则一并运行检查；
- 赋予执行权限：`chmod +x <script>`；
- **不要自己去端到端运行该脚本** —— 该脚本会调用浏览器并阻塞等待真实人类的键盘输入。改为进行严格的静态代码审查：第一步中列出的每一个配置值都被成功捕获并准确落盘到了指定位置，且每一个 `set_secret` 的变量名都与 CI 中的 `secrets.*` 引用一字不差；
- 告知用户如何运行该向导脚本。如果这是一套可复用的环境初始化流程，将其提交到 Git 并记录在 `README.md` 中，让下一位新加入的开发者直接运行该脚本即可，而无需反复询问 AI。
