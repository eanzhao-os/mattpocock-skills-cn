# 34. scaffold-exercises

## Meta

- bucket: `misc`
- path: `skills/misc/scaffold-exercises/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/misc/scaffold-exercises
- 触发方式：description 驱动——用户要 scaffold exercises、建 exercise stubs、或新 course section
- companion 文件：
  - `agents/openai.yaml`
- **低频 / 强课程仓绑定**：目录约定、`pnpm ai-hero-cli internal lint`、禁止 `.gitkeep` / `speaker-notes.md` 等规则都绑在 AI Hero（或同构课程）仓库，不是通用工程脚手架。

## 原文 (SKILL.md)

````markdown
---
name: scaffold-exercises
description: Create exercise directory structures with sections, problems, solutions, and explainers that pass linting. Use when user wants to scaffold exercises, create exercise stubs, or set up a new course section.
---

# Scaffold Exercises

Create exercise directory structures that pass `pnpm ai-hero-cli internal lint`, then commit with `git commit`.

## Directory naming

- **Sections**: `XX-section-name/` inside `exercises/` (e.g., `01-retrieval-skill-building`)
- **Exercises**: `XX.YY-exercise-name/` inside a section (e.g., `01.03-retrieval-with-bm25`)
- Section number = `XX`, exercise number = `XX.YY`
- Names are dash-case (lowercase, hyphens)

## Exercise variants

Each exercise needs at least one of these subfolders:

- `problem/` - student workspace with TODOs
- `solution/` - reference implementation
- `explainer/` - conceptual material, no TODOs

When stubbing, default to `explainer/` unless the plan specifies otherwise.

## Required files

Each subfolder (`problem/`, `solution/`, `explainer/`) needs a `readme.md` that:

- Is **not empty** (must have real content, even a single title line works)
- Has no broken links

When stubbing, create a minimal readme with a title and a description:

```md
# Exercise Title

Description here
```

If the subfolder has code, it also needs a `main.ts` (>1 line). But for stubs, a readme-only exercise is fine.

## Workflow

1. **Parse the plan** - extract section names, exercise names, and variant types
2. **Create directories** - `mkdir -p` for each path
3. **Create stub readmes** - one `readme.md` per variant folder with a title
4. **Run lint** - `pnpm ai-hero-cli internal lint` to validate
5. **Fix any errors** - iterate until lint passes

## Lint rules summary

The linter (`pnpm ai-hero-cli internal lint`) checks:

- Each exercise has subfolders (`problem/`, `solution/`, `explainer/`)
- At least one of `problem/`, `explainer/`, or `explainer.1/` exists
- `readme.md` exists and is non-empty in the primary subfolder
- No `.gitkeep` files
- No `speaker-notes.md` files
- No broken links in readmes
- No `pnpm run exercise` commands in readmes
- `main.ts` required per subfolder unless it's readme-only

## Moving/renaming exercises

When renumbering or moving exercises:

1. Use `git mv` (not `mv`) to rename directories - preserves git history
2. Update the numeric prefix to maintain order
3. Re-run lint after moves

Example:

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## Example: stubbing from a plan

Given a plan like:

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

Create:

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

Then create readme stubs:

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
````

## 中文翻译

## 中文翻译

# Scaffold Exercises（课程练习脚手架构建规范）

快速搭建标准化的课程练习目录结构，确保能够顺利通过 `pnpm ai-hero-cli internal lint` 代码校验，并执行 `git commit` 进行版本提交。

---

## 目录命名规范（Directory naming）

- **课程章节目录（Sections）**：存放在 `exercises/` 目录下，命名为 `XX-section-name/`（例如 `01-retrieval-skill-building`）；
- **具体练习目录（Exercises）**：存放在章节目录内部，命名为 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）；
- 章节序号格式为 `XX`，具体练习序号格式为 `XX.YY`；
- 所有目录名称统一采用中划线小写风格（dash-case / kebab-case）。

---

## 练习模式变体（Exercise variants）

每一个练习目录内部必须至少包含以下子文件夹中的一种：
- `problem/` — 学员实操工作区，包含待填空的 TODO 任务；
- `solution/` — 官方标准参考实现；
- `explainer/` — 纯概念讲解与原理解析物料，不包含实操 TODO。

在生成桩代码脚手架（Stubbing）时，除非教学规划中另有明确要求，否则默认创建 `explainer/` 模式。

---

## 必需文件清单（Required files）

每一个变体子文件夹（`problem/`、`solution/`、`explainer/`）内部都必须配备一份 `readme.md`：
- **严禁为空文件**（必须包含切实的文本内容，哪怕仅有一行标题）；
- 严禁包含任何失效断裂的超链接。

在生成脚手架时，生成包含标题与简短描述的最小化自说明 README：
```markdown
# 练习标题

此处为简明扼要的练习介绍与背景说明。
```

如果某个子文件夹中包含可运行代码，它还必须配备一份大于 1 行的 `main.ts` 入口文件。但在最初生成纯脚手架阶段，仅包含 README 的练习也是完全合规的。

---

## 标准执行工作流（Workflow）

1. **解析课程规划** —— 提取所有章节名称、练习名称以及各自对应的变体类型；
2. **批量创建目录树** —— 为每一个练习路径执行 `mkdir -p`；
3. **批量生成 README 骨架** —— 在每个变体子文件夹中生成带有标题的 `readme.md`；
4. **运行代码规则校验** —— 执行 `pnpm ai-hero-cli internal lint` 进行结构与内容验证；
5. **针对报错迭代修复** —— 持续调整直至 Linter 校验绿灯全量通过。

---

## Lint 校验规则总览

底层校验器（`pnpm ai-hero-cli internal lint`）负责严苛审查以下事项：
- 每一个练习都必须划分合规的子文件夹（`problem/`、`solution/`、`explainer/`）；
- 必须至少存在 `problem/`、`explainer/`、或 `explainer.1/` 之一；
- 主变体子文件夹中的 `readme.md` 真实存在且非空；
- **严禁残留 `.gitkeep` 占位文件**；
- **严禁残留 `speaker-notes.md` 讲师草稿文件**；
- README 中严禁存在死链；
- README 中严禁写入硬编码的 `pnpm run exercise` 命令；
- 除非是纯文档练习，否则子文件夹中必须包含 `main.ts`。

---

## 移动或重命名练习的规范操作（Moving/renaming exercises）

当调整课程大纲顺序、需要对练习重新编号或迁移位置时：
1. **统一使用 `git mv`（严禁使用普通 `mv`）** 进行目录重命名 —— 从而完美保留 Git 提交历史；
2. 相应更新数字前缀以维持全局顺序递增；
3. 移动完成后重新运行 Lint 校验确保无误。
