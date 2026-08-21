# 35. setup-pre-commit

## Meta

- bucket: `misc`
- path: `skills/misc/setup-pre-commit/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/misc/setup-pre-commit
- 触发方式：description 驱动——用户要加 pre-commit、装 Husky、配 lint-staged、或 commit 时格式化/typecheck/test
- companion 文件：
  - `agents/openai.yaml`
- **低频 / 中强环境绑定**：绑 Node 包管理器生态（npm/pnpm/yarn/bun）+ Husky v9 + lint-staged + Prettier；一次装成后少再跑。非 JS 仓或已有 pre-commit（Python `pre-commit` 框架等）则不适用或需改写。

## 原文 (SKILL.md)

````markdown
---
name: setup-pre-commit
description: Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
---

# Setup Pre-Commit Hooks

## What This Sets Up

- **Husky** pre-commit hook
- **lint-staged** running Prettier on all staged files
- **Prettier** config (if missing)
- **typecheck** and **test** scripts in the pre-commit hook

## Steps

### 1. Detect package manager

Check for `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), `bun.lockb` (bun). Use whichever is present. Default to npm if unclear.

### 2. Install dependencies

Install as devDependencies:

```
husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

This creates `.husky/` dir and adds `prepare: "husky"` to package.json.

### 4. Create `.husky/pre-commit`

Write this file (no shebang needed for Husky v9+):

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt**: Replace `npm` with detected package manager. If repo has no `typecheck` or `test` script in package.json, omit those lines and tell the user.

### 5. Create `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc` (if missing)

Only create if no Prettier config exists. Use these defaults:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Verify

- [ ] `.husky/pre-commit` exists and is executable
- [ ] `.lintstagedrc` exists
- [ ] `prepare` script in package.json is `"husky"`
- [ ] `prettier` config exists
- [ ] Run `npx lint-staged` to verify it works

### 8. Commit

Stage all changed/created files and commit with message: `Add pre-commit hooks (husky + lint-staged + prettier)`

This will run through the new pre-commit hooks — a good smoke test that everything works.

## Notes

- Husky v9+ doesn't need shebangs in hook files
- `prettier --ignore-unknown` skips files Prettier can't parse (images, etc.)
- The pre-commit runs lint-staged first (fast, staged-only), then full typecheck and tests
````

## 中文翻译

# Setup Pre-Commit Hooks（Git 提交前自动化代码质检脚手架）

## 本方案所安装与配置的基础设施

- **Husky** Git 提交前置钩子（pre-commit hook）；
- **lint-staged**：仅对处于 Git 暂存区（staged）的文件执行 Prettier 自动化格式化；
- **Prettier** 风格配置文件（若项目当前缺失则自动补全）；
- 在提交前自动串联运行 **类型检查（typecheck）** 与 **单元测试（test）** 验证脚本。

---

## 安装执行步骤

1. **自动探测包管理器**：检查锁文件特征 —— `package-lock.json`（npm）、`pnpm-lock.yaml`（pnpm）、`yarn.lock`（yarn）、`bun.lockb`（bun）。优先使用匹配的包管理器；若特征不明确则默认使用 npm；
2. **安装开发依赖**：将 `husky lint-staged prettier` 作为 `devDependencies` 安装到项目中；
3. **初始化 Husky**：执行 `npx husky init`（该命令会自动创建 `.husky/` 目录并在 `package.json` 中注入 `"prepare": "husky"` 脚本）；
4. **生成 `.husky/pre-commit` 钩子文件**（在 Husky v9+ 版本中无需再声明 Shebang 头）：
   ```bash
   npx lint-staged
   <包管理器> run typecheck
   <包管理器> run test
   ```
   *环境自适应*：将上述命令替换为步骤 1 探测到的具体包管理器。如果当前项目的 `package.json` 中并未配置 `typecheck` 或 `test` 脚本，果断省略对应的执行行并向用户友好说明；
5. **创建 `.lintstagedrc` 配置文件**：
   ```json
   {
     "*": "prettier --ignore-unknown --write"
   }
   ```
6. **创建 `.prettierrc` 默认配置文件（仅在缺失时）**：仅在项目尚未配置 Prettier 时生成一份基准配置：
   ```json
   {
     "useTabs": false,
     "tabWidth": 2,
     "printWidth": 80,
     "singleQuote": false,
     "trailingComma": "es5",
     "semi": true,
     "arrowParens": "always"
   }
   ```
7. **执行全套核验清单（Verify）**：
   - [ ] `.husky/pre-commit` 文件存在且具备可执行权限；
   - [ ] `.lintstagedrc` 配置文件存在；
   - [ ] `package.json` 中的 `prepare` 脚本已配置为 `"husky"`；
   - [ ] Prettier 配置文件就绪；
   - [ ] 试跑 `npx lint-staged` 确保格式化流程顺畅；
8. **执行自我冒烟提交（Commit）**：暂存所有修改与新增的文件，并执行 Git 提交，提交信息固定为：`Add pre-commit hooks (husky + lint-staged + prettier)`。该提交将直接触发刚才配置的 pre-commit 钩子，作为整套链路是否畅通的最佳实战冒烟测试。

---

## 核心设计要点（Notes）

- Husky v9+ 架构精简，钩子脚本中不再强制需要 `#!/bin/sh` 的 Shebang 声明；
- `prettier --ignore-unknown` 会智能跳过 Prettier 无法解析的文件（如二进制图片等）；
- 严格遵循**先快后慢**的执行时序：先执行轻量快速的增量暂存区格式化（lint-staged），随后再推进全量的类型检查与测试验证。
