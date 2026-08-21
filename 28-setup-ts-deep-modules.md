# 28 setup-ts-deep-modules 精读（Setup TS Deep Modules（TypeScript 深模块架构约束脚手架））

```yaml
name: setup-ts-deep-modules
description: 在 TypeScript 代码库中集成配置 dependency-cruiser，将每个 package 强制约束为深模块（deep module） —— 内部实现隐藏在子目录中，仅允许通过根入口文件进行外部调用。由用户显式触发。
disable-model-invocation: true
```

将本代码仓库中的每一个 package 塑造成一个标准的 **深模块（deep module）**：用极简的对外接口承载大量丰富的内部行为。每一个 package 的公共对外表面仅由其**根目录入口文件（entry points）**组成 —— 其子目录下的所有内容对外界完全隐形。本 skill 负责安装配置 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 及其严苛规则，使得根入口文件成为外界访问该模块的唯一通道，并亲手**验证这些规则确实具备报红拦截能力**。

关于深模块相关的专业术语（deep module、interface、seam、depth），请运行 `/codebase-design` skill —— 全流程严格使用该套标准词汇。

---

## 本规范所强制约束的目录结构

```
src/packages/
  <name>/
    index.ts        ← 公共入口文件（Public）。外界通过此文件进行 import。
    client.ts       ← 另一个公共入口文件。一个 package 可以暴露多个细粒度入口。
    lib/            ← 内部实现：对外界完全隐藏，内部文件之间可自由相互 import。
    tests/          ← 同地放置的测试与夹具（位于子目录，因此对外界私有）。
```

模块的公共对外表面是 package **根目录下的所有文件** —— 而不是仅局限于某一个指定的 `index.ts`。按照约定，内部实现存放在 `lib/`，测试用例存放在 `tests/`，赋予每个 package 完全相同的“双文件夹”规整形态。该规则本身是高度通用的：**任何子目录下的任何内容都一律视为内部私有**，因此在后续新增任何子文件夹时，完全无需修改底层规则配置。

四条全级别设为 `error` 报错的铁律：
1. **入口文件边界约束（Entry-point boundary）** —— 处于 package 外部的代码（应用层代码或其他 package），只允许 import 目标 package 的根入口文件，绝不允许 import 其任何子目录下的内部文件。
2. **包内相互自由引用（Intra-package freedom）** —— package 内部的各个私有文件之间可以自由相互引用。
3. **测试必须跨越入口接缝（Tests through the entry points）** —— `<pkg>/tests/` 目录下的测试文件，可以 import 任何 package 的公开入口文件以及其自身的 `tests/` 夹具，但绝不允许直接深层 import 任何 package 的子目录内部实现（哪怕是自己的 `lib/` 也不行）。跨 package 的集成测试是完全允许的；但绕过入口的深层 import（deep imports）坚决禁止。
4. **禁止循环依赖（No cycles）** —— 严禁引入任何循环依赖拓扑。

**多入口设计，拒绝大一统 Barrel 文件**。正因为 package 根目录下的*每一个*文件都是合法的公共入口，一个 package 完全可以按需暴露若干小巧的专属入口（如 `index.ts`、`client.ts`、`server.ts`），而不需要把整棵子树的所有内部实现全部粗暴塞进一个巨型的 `index.ts` 重新导出。极力反对大一统 Barrel 文件的做法 —— 保持入口文件小巧清晰，将实现细节深深隐藏在子目录之中。

分层架构约束（即哪些 package 允许依赖哪些 package）属于另一项独立的架构诉求，在配置文件中以注释桩的形式预留，供具体项目后续按需开启。

---

## 执行步骤

### 1. 探测项目环境（Detect the environment）
- **包管理器** —— 检查 `pnpm-lock.yaml` → pnpm、`yarn.lock` → yarn、`bun.lockb` → bun，否则使用 npm。后续的所有命令均使用对应包管理器执行；
- **Packages 根目录** —— 如果存在 `src/` 则采用 `src/packages`，否则采用 `packages`。如果仓库已有其他明显的目录约定，向用户请示确认；
- **既有配置排查** —— 检查是否存在 `.dependency-cruiser.*`。如果已存在，**切勿直接覆盖**：将本 skill 的四条规则和选项合并进去，并告知用户具体追加了什么。

**完成判据：** 包管理器类型、packages 根目录路径、以及既有配置状态全部清晰明确。

### 2. 安装 dependency-cruiser
使用探测到的包管理器将 `dependency-cruiser` 安装为开发依赖（`devDependencies`）。

**完成判据：** `package.json` 的 `devDependencies` 中已成功包含 `dependency-cruiser`。

### 3. 写入规则配置文件（Write the config）
将配套的 [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) 复制到代码库根目录下，命名为 `.dependency-cruiser.cjs`。将 `PACKAGES_ROOT` 常量设置为步骤 1 中探测到的根路径。由于规则完全基于路径深度判断且扩展名无关，因此无需再做任何其他定制修改。

**完成判据：** `.dependency-cruiser.cjs` 文件存在、配置了正确的 `PACKAGES_ROOT`、且四条核心禁止规则全部就位。

### 4. 接入项目校验链路（Wire it into the checks）
- 在 `package.json` 中添加校验脚本 `"lint:boundaries": "depcruise <packages-root>"`（或 `depcruise src`）；
- 将其挂载到仓库既有的全量校验命令中 —— 即与类型检查（typecheck）一同运行的聚合命令（如 `check` / `ci` / `validate` 脚本）。**切勿**修改 `tsconfig` 或擅自添加路径别名（path aliases）；
- 如果项目没有现成的聚合脚本，添加 `lint:boundaries` 并提醒用户将其纳入 CI 流程。

**完成判据：** `lint:boundaries` 脚本存在，且能够与类型检查在同一条命令中联动执行。

### 5. 搭建示例 Package 脚手架（Scaffold the example package）
在 Git 中提交一个标准的 `<packages-root>/example/` 目录，作为供团队复制使用的脚手架模板：
- `index.ts` — 公共入口文件。导出一个将具体逻辑委派给内部文件的公共函数（使该模块在结构上直观呈现为**深模块**，而非直接透传）；
- `lib/impl.ts` — 存放在**子目录**中的内部实现文件，被 `index.ts` 引入，外界无法直接触达；
- `tests/example.test.ts` — **仅** import `../index`（公共入口），并针对公开函数编写断言。

告知用户这是一个开箱即用的模板，后续可以自由复制或删除。

**完成判据：** 示例 package 真实存在，通过根入口文件暴露能力，并将 `impl` 妥善隐藏在子目录中。

### 6. 实机验证规则确实能够报错拦截（Prove the rules bite）
**这是整个 skill 最核心的完成判据** —— 一套在发生违规时不会报错变红的配置是毫无价值的废纸：
1. 运行 `lint:boundaries`：在干净正常的示例代码上必须**绿灯通过（pass）**；
2. 临时向 `tests/example.test.ts` 中故意引入一次越权深层导入（例如 `import { thing } from "../lib/impl"`）。再次运行 `lint:boundaries` —— **必须报错失败（fail）**，且错误类型为 `tests-through-entrypoints`；
3. 恢复还原深层导入代码。最后重新运行一次 —— **必须恢复绿灯通过（pass）**。

**完成判据：** 你亲眼观察到了绿灯通过 → 故意越权时红灯报错 → 还原后重新绿灯通过的完整闭环。如果第 2 步没有成功报错，说明规则链条未正确接通 —— 必须修复直至其能够拦截，方可收工。

### 7. 编写代码规范文档并注入 Agent 指令（Document the convention）
在 packages 根目录下编写一份规范文档 `<packages-root>/README.md`（紧挨着它所管辖的各个 packages），涵盖：`src/packages/<name>/` 目录布局规范、明确强调“只能通过 package 的根入口文件进行 import”、以及如何运行 `lint:boundaries`。**在文档中明确反对大一统 Barrel 文件** —— 提倡按需暴露若干小巧的根入口，而不是用一个 index 文件重新导出整棵子树。文档篇幅保持精简：一段可复制的代码骨架加上对四条规则的一句话解释即可。

随后在仓库的 Agent 顶层指令文件中（优先 `CLAUDE.md`，否则 `AGENTS.md`；若都不存在则创建 `AGENTS.md`）**追加一行上下文指针**。一句精炼的话足矣，例如：`Packages are deep modules — see [src/packages/README.md](./src/packages/README.md) before adding or importing one.（所有包均为深模块 —— 在新增包或引入依赖前请先阅读该文档）`。正是这一行指针，让后续的每一个 Agent 能够主动发现这一边界规则，而不会盲目踩坑报错。

**完成判据：** `<packages-root>/README.md` 存在且明确反对 Barrel 文件，且仓库的 `CLAUDE.md` / `AGENTS.md` 中已经挂载了指向它的上下文指针。

---

## 补充要点（Notes）

- 配置文件中的 `$1` 反向引用（dependency-cruiser 的分组正则匹配）正是使得 package 内部能够自由互相调用、而外部调用方无法越权访问的关键所在 —— 绝不要把它们平铺拆解为针对每个 package 的独立繁琐规则；
- 公开与私有的界限完全由**文件目录深度（depth）**决定：package 根目录下的文件为入口；任何子目录下的内容一律私有。常见的约定子目录是 `lib/`（实现）和 `tests/`（测试），但规则并未将其死板硬编码 —— 任何新增的子文件夹均天然私有，因此新增文件夹永远无需改动规则配置。新增一个公开入口只需在 package 根目录下添加一个文件即可 —— 彻底告别 Barrel 文件的烦恼；
- Packages 的组织必须是**扁平单层（flat）**的：根目录下的一级子目录即为一个 package。一个 package 的内部实现可以根据需要任意深层嵌套，但一个 package 绝对不允许嵌套另一个 package；
- 统一使用 `.cjs` 扩展名（而非 `.js`），确保配置文件中的 `module.exports` 即使在开启了 `"type": "module"` 的 ESM 仓库中也能稳定生效。

## Companion 摘要：`dependency-cruiser.config.cjs`

角色：可复制的 **规则模板**，不是概念文档。skill 步骤 3 原样拷到 repo 根为 `.dependency-cruiser.cjs`，只改 `PACKAGES_ROOT`。

内容要点：

- `PACKAGES_ROOT` 默认 `src/packages`；`PACKAGE_INTERNALS = ^${R}/[^/]+/[^/]+/`（深度判定私有）。
- forbidden（error）：`entrypoint-boundary-from-app`、`entrypoint-boundary-across-packages`（`$1` 同包豁免）、`tests-through-entrypoints`、`tests-folder-is-private`、`no-circular`。
- Layering 规则注释 stub，默认关闭。
- 与 skill 正文「四规则」叙述对应；config 实际拆成 app/跨包/tests 等多条以实现 depth + group match。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 路径 | `in-progress/setup-ts-deep-modules` |
| bucket | in-progress |
| 上游 | https://github.com/mattpocock/skills |
| companion | `dependency-cruiser.config.cjs`（配置模板，仅摘要角色）；词汇指向 `/codebase-design` |
| 触发 | 在 TS repo 中用 dependency-cruiser 强制 deep module 边界 |
| 调用方式 | user-invoked（`disable-model-invocation: true`） |
| 状态 | **未定型，吸收优先级低**（偏 TS 作者栈） |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````md
---
name: setup-ts-deep-modules
description: Wire dependency-cruiser into a TypeScript repo so each package is a deep module — implementation hidden in subfolders, reachable only through its entry-point files. User-invoked.
disable-model-invocation: true
---

# Setup TS Deep Modules

Make every package in this repo a **deep module**: a lot of behaviour behind a small interface. A package's public surface is its **entry points** — the files at the package root — and everything in its subfolders is hidden. This skill installs [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) and the rules that make the entry points the only way in, then proves the rules bite.

For the vocabulary (deep module, interface, seam, depth), run the `/codebase-design` skill — use its language throughout.

## The shape this enforces

```
src/packages/
  <name>/
    index.ts        ← an entry point (public). Import this from outside.
    client.ts       ← another entry point. Packages may expose SEVERAL.
    lib/            ← implementation: hidden from outside, free to import each other.
    tests/          ← co-located tests + fixtures (a subfolder, so private).
```

The public surface is the package's **root files** — not one designated `index.ts`. By convention implementation lives in `lib/` and tests in `tests/`, giving every package the same two-folder shape. The rule itself is general, though: *anything* in *any* subfolder is private, so you never extend the config to add a folder.

Four rules, all `error`:

1. **Entry-point boundary** — code outside a package (app code or another package) may import only that package's entry points (its root files), never anything in its subfolders.
2. **Intra-package freedom** — a package's own files import each other freely.
3. **Tests through the entry points** — files under `<pkg>/tests/` may import any package's entry points and their own `tests/` fixtures, but never any package's subfolder internals (not even their own). Integration tests across packages are fine; deep imports are not.
4. **No cycles** — no dependency cycles.

**Entry points, not a barrel.** Because the public surface is *every* root file, a package can expose several small entry points (`index.ts`, `client.ts`, `server.ts`) instead of funnelling everything through one giant `index.ts`. Barrel files that re-export a whole subtree are discouraged — keep entry points small and hide implementation in subfolders.

Layering (which packages may depend on which) is a *different* concern and is left as a commented stub in the config for this repo to fill in.

## Steps

### 1. Detect the environment

- **Package manager** — `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm. Use it for every command below (`pnpm`/`yarn`/`npm run`/`bunx`).
- **Packages root** — if `src/` exists use `src/packages`, else `packages`. Confirm the choice with the user if the repo already has a different obvious convention.
- **Existing config** — check for a `.dependency-cruiser.*` file. If one exists, do **not** overwrite it: merge the four rules and the options in, and tell the user what you added.

**Done when:** package manager, packages root, and existing-config status are all known.

### 2. Install dependency-cruiser

Install `dependency-cruiser` as a devDependency with the detected package manager.

**Done when:** `dependency-cruiser` is in `devDependencies`.

### 3. Write the config

Copy [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) to the repo root as `.dependency-cruiser.cjs`. Set `PACKAGES_ROOT` to the root detected in step 1. The rules are path-depth based and extension-agnostic, so nothing else needs adapting.

**Done when:** `.dependency-cruiser.cjs` exists with the correct `PACKAGES_ROOT`, and the four forbidden rules are present.

### 4. Wire it into the checks

- Add a `lint:boundaries` script: `depcruise <packages-root>` (or `depcruise src`).
- Fold it into the repo's umbrella check command — the one that already runs typecheck (e.g. a `check` / `ci` / `validate` script). Do **not** touch `tsconfig` or add path aliases.
- If there is no umbrella script, add `lint:boundaries` and tell the user to include it in CI.

**Done when:** `lint:boundaries` exists and runs as part of the same command as typecheck.

### 5. Scaffold the example package

Create a committed `<packages-root>/example/` as a copy-me template:

- `index.ts` — an entry point. Export one function that delegates to an internal file (so the package is visibly *deep*, not a pass-through).
- `lib/impl.ts` — an internal file in a **subfolder**, imported by `index.ts`, not reachable from outside.
- `tests/example.test.ts` — imports **only** `../index` (an entry point), and asserts against the public function.

Tell the user this is a starter template to copy or delete.

**Done when:** the example package exists, exposes its behaviour through a root entry point, and hides `impl` in a subfolder.

### 6. Prove the rules bite

This is the completion criterion for the whole skill — a config that doesn't fail on a violation is worthless.

1. Run `lint:boundaries`. It must **pass** on the clean example.
2. Temporarily add a deep import to `tests/example.test.ts` (e.g. `import { thing } from "../lib/impl"`). Run `lint:boundaries` again — it must **fail** with `tests-through-entrypoints`.
3. Revert the deep import. Run once more — it must **pass**.

**Done when:** you have observed a pass, then a fail on the deep import, then a pass again. If step 2 does not fail, the rules are not wired correctly — fix before finishing.

### 7. Document the convention

Write a `README.md` **in the packages folder** (`<packages-root>/README.md`) — next to the packages it governs — covering: the `src/packages/<name>/` layout (entry points at the root, `lib/` for implementation, `tests/` for tests), "import only through a package's entry points (its root files)", and how to run `lint:boundaries`. **Discourage barrel files** explicitly — expose several small entry points instead of re-exporting a whole subtree through one index. Keep it to the copy-me snippet plus the four rules in one paragraph each.

Then add a **context pointer** to it from the repo's agent-instructions file — `CLAUDE.md` if present, else `AGENTS.md` (create `AGENTS.md` if neither exists). One line is enough, e.g. `Packages are deep modules — see [src/packages/README.md](./src/packages/README.md) before adding or importing one.` This is what makes an agent discover the boundary rule instead of tripping over it.

**Done when:** `<packages-root>/README.md` exists and discourages barrels, and the repo's `CLAUDE.md`/`AGENTS.md` links to it.

## Notes

- The config's `$1` back-references (dependency-cruiser's group matching) are what let a package reach its own internals while outsiders can't — don't flatten them into separate per-package rules.
- Public vs private is decided by **depth**: a package's root files are entry points; anything in a subfolder is private. The conventional subfolders are `lib/` (implementation) and `tests/`, but the rule doesn't hardcode them — any subfolder is private, so a new folder never needs a config change. Adding an entry point is just adding a root file — no barrel.
- Packages are **flat**: one tier of immediate children under the root. A package's internals may nest as deep as you like; a package may not contain another package.
- Use `.cjs` (not `.js`) so the config's `module.exports` works even in `"type": "module"` repos.
````

## 中文完整翻译

</details>
