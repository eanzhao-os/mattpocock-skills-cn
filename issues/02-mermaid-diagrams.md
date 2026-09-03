> 依赖：#1（站点侧的 mermaid 渲染支持在本 issue 一并落地，需站点存在后验证）
> 联动：#3（图表纳入渲染正确性检查范围）

## 背景与现状

多篇文档的核心内容是「流程 / 分支 / 循环 / 多方流转」，纯文字阅读成本高，典型例子：

- `01-ask-matt`：主流程（idea → ship）+ 2 条 on-ramps + 分支判断，天然是一张 flowchart；
- `09-tdd`：red → green 循环，天然是 cycle 图；
- `08-to-tickets`：工单间的 blocking edges，天然是 DAG；
- `06-handoff`：两个环境之间的导出/导入，天然是 sequenceDiagram。

现状：全仓库仅 `23-teach_LEARNING-RECORD-FORMAT.md` 有 1 个 mermaid 块，其余 56 篇无图。

## 目标

为关键 Skill 文档配上与正文严格一致的 Mermaid 图表，让读者 10 秒建立结构认知，再读文字补细节。

## 关键决策

### 1. 图的形式：源文件内嵌 ` ```mermaid ` 代码块

- **GitHub 原生渲染 mermaid**，源文件侧阅读体验直接受益，不依赖站点；
- 站点侧同步支持（见任务 2），两侧渲染结果一致；
- 图是**辅助而非替代**：插图后保留原有文字描述，不删减——图给结构，文字给细节；纯文本环境（编辑器、grep、Agent 读取）依然完整可用。

### 2. 图表规范（先在 1 篇上定稿，再批量推广）

- 图类型选择：流程/分支用 `flowchart TD`；跨环境/跨角色交互用 `sequenceDiagram`；循环用带回头边的 flowchart；依赖关系用 `graph`（DAG）；
- 标签一律**中文**，与正文术语逐字一致（如「深度访谈」「阻塞前置依赖」），英文原名用括号备注，如 `深度访谈 (grill-with-docs)`；
- 单节点文字 ≤ 20 字，超出则拆节点或加注释行；
- 不使用自定义配色与复杂 classDef，保证 GitHub 浅色/深色主题、Starlight 浅色/深色下均可读；
- 每张图前加一行引导句（「下图是……的总览」），图位置放在对应章节开头之后、细节展开之前；
- 校对清单（每张图逐一过）：节点 = 正文步骤、分支条件与正文一致、无正文不存在的环节、术语与正文一致。

### 3. 站点侧 mermaid 渲染

Starlight 默认不渲染 mermaid 代码块。方案：引入 [`rehype-mermaid`](https://github.com/remcohaszing/rehype-mermaid)（构建期渲染为 SVG，无客户端 JS 负担，明暗主题用 CSS 变量适配）。在 `site/astro.config.mjs` 的 `markdown.rehypePlugins` 中配置；若实测与 `<details>` 等现有语法冲突，降级方案为客户端 `mermaid.js` + 自定义 `<Mermaid>` 组件（sync 脚本负责包装转换）。

### 4. 分批清单

**P0（结构收益最大，先行 3 篇定调）**

- [ ] `01-ask-matt.md` — 主流程 + on-ramps 总览 flowchart（含两处分支判断）
- [ ] `09-tdd.md` — red → green → （一个切片） 循环图
- [ ] `08-to-tickets.md` — 工单 blocking edges DAG 示例

**P1（流程密集型）**

- [ ] `04-grilling.md` — 访谈算法主循环
- [ ] `06-handoff.md` — 跨环境导出/导入 sequenceDiagram
- [ ] `18-triage.md` — 五角色流转 flowchart
- [ ] `19-wayfinder.md` — 决策地图收敛过程示意

**P2（按需，每篇至少评估一次是否有图化价值）**

- [ ] 评估 `05` `07` `10` `11` `12` `14` `15` `16` `17` `20` `23` `25` `33` 等，有价值则补图，无则在清单中标注「无需图」及理由

## 任务拆解

- [ ] 1. 以 `01-ask-matt.md` 为试点完成首图 + 校对清单过一遍，定下风格基准
- [ ] 2. 站点接入 `rehype-mermaid` 并验证（依赖 #1 的 `site/` 工程；完成前本项阻塞）
- [ ] 3. 完成 P0 其余 2 篇
- [ ] 4. 完成 P1 四篇
- [ ] 5. P2 逐篇评估并执行结论
- [ ] 6. 每张图在 GitHub 预览 + 站点预览两侧确认渲染正常（纳入 #3 的检查项）

## 验收标准

- P0 / P1 清单全部完成，P2 每篇有明确结论（已补图 / 标注无需图）；
- 每张图通过校对清单（节点、分支、术语与正文一致）；
- GitHub 网页与 Astro 站点两侧 mermaid 均正常渲染，浅色/深色主题可读；
- 图不挤压正文：移动端宽度无横向滚动；
- 正文文字零删改（只允许新增引导句与图块）。
