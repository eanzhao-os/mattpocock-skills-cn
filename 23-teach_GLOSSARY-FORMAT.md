# 23-teach / GLOSSARY-FORMAT.md 精读（统一术语表构建规范（GLOSSARY.md Format））

`GLOSSARY.md` 是当前教学工作区的**权威通用语言法典（Canonical language）**。所有的原理解析、实操习题与学习记录档案，均必须严格遵守其术语定义。

**构建这份术语表本身就是学习过程的最高体现**：能够将一个复杂的领域概念高密度压缩为一句紧凑的精准定义，就是学员真正精通掌握该知识的铁证。

---

## 1. 文档标准骨架

```markdown
# {学习主题} 权威术语表

{用一到两句话简要概括本术语表所覆盖的领域范围。}

## Terms（核心术语定义）

**Hypertrophy（肌肥大）**:
在反复的训练刺激中，由机械张力与代谢压力共同驱动的肌肉体积增长。
_Avoid（禁用叫法）_: 增肌变壮, 膨胀

**Progressive overload（渐进式超负荷）**:
随着时间的推移，系统性、有计划地逐步增加施加在肌肉上的负荷刺激 —— 涵盖重量负荷、训练总容量或刺激强度。
_Avoid_: 硬顶, 猛怼重量, 升级

**RPE（Rate of Perceived Exertion 主观疲劳感知量表）**:
1 至 10 分的单组动作主观难度自评量表：10 代表力竭极限，8 代表当前组结束时油箱里还剩 2 次动作余力。
_Avoid_: 努力程度评分, 强度等级
```

---

## 2. 编写铁律（Rules）

- **唯有学员彻底理解后才配收录（Add a term only when understood）**：术语表是**高密度压缩后的知识结晶记录**，而绝不是丢给新手去死记硬背的入门字典。如果学员刚刚接触某个新名词，必须耐心等待他们能够熟练自如地正确使用该词汇后，才将其正式晋升录入术语表；
- **立场鲜明，去芜存菁（Be opinionated）**：当同一个概念在市面上有五花八门的混淆叫法时，坚定挑选出最权威的一个，并将其余叫法全部列入 `_Avoid_` 禁用清单 —— 这正是通用语言得以提纯的精髓所在；
- **定义必须极其紧凑（Keep definitions tight）**：最多不超过一至两句话。**清晰定义它“是什么（what it IS）”，而不是它做什么、怎么做（what it does or how to do it）**；
- **在后续定义中积极复用既有术语（Use glossary terms inside definitions）**：一旦某个术语被收录进表，在未来的所有教学场景及其他高阶定义中强制统一使用它。正是这种术语复用，让复杂的复合概念在后续理解中变得顺理成章；
- **按需划分二级主题分组（Group under subheadings）**：当术语自然聚集成组时分块罗列（如 `## 解剖学`、`## 周期规划`）；如果全局浑然一体，扁平列表即可；
- **显式化解行业歧义（Flag ambiguities explicitly）**：如果某个词在行业泛指中含义模糊，显式写明本工作区的裁决准则（例如：“在本工作区中，‘一组’永远指代正式有效组 —— 热身组单独统计”）；
- **伴随认知深化就地重构（Revise as understanding deepens）**：学员在第一周写下的幼稚定义到了第六周很可能是错的。就地更新替换，绝不任由陈旧的僵死定义误导全局。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `23-teach` |
| bucket | productivity |
| 上游路径 | `skills/productivity/teach/GLOSSARY-FORMAT.md` |
| 角色定位 | 教学工作区权威通用术语表构建规范（GLOSSARY.md Specification） |
| 关联模块 | `23-teach`、`15-domain-modeling` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# GLOSSARY.md Format

`GLOSSARY.md` is the canonical language for this teaching workspace. All explainers, exercises, and learning records should adhere to its terminology. Building it is itself part of learning: compressing a concept into a tight definition is evidence the user understands it.

## Structure

```md
# {Topic} Glossary

{One or two sentence description of the topic this glossary covers.}

## Terms

**Hypertrophy**:
Muscle growth driven by mechanical tension and metabolic stress over repeated training sessions.
_Avoid_: Bulking, getting big

**Progressive overload**:
Systematically increasing the demand on a muscle over time — via load, volume, or intensity.
_Avoid_: Pushing harder, levelling up

**RPE (Rate of Perceived Exertion)**:
A 1–10 self-rating of how hard a set felt, where 10 is failure and 8 means two reps left in the tank.
_Avoid_: Effort score, intensity rating
```

## Rules

- **Add a term only when the user understands it.** The glossary is a record of compressed knowledge, not a dictionary the user reads to learn. If the user has just been introduced to a concept, wait until they can use it correctly before promoting it here.
- **Be opinionated.** When several words exist for the same concept, pick the best one and list the rest as aliases to avoid. This is how language compresses.
- **Keep definitions tight.** One or two sentences. Define what the term IS, not what it does or how to do it.
- **Use the glossary's own terms inside definitions.** Once a term is in the glossary, prefer it everywhere — including inside other definitions. This is what makes complex terms easier to grasp later.
- **Group under subheadings** when natural clusters emerge (e.g. `## Anatomy`, `## Programming`). A flat list is fine when terms cohere.
- **Flag ambiguities explicitly.** If a term is used loosely in the wider field, note the resolution: "In this workspace, 'set' always means a working set — warm-ups are tracked separately."
- **Revise as understanding deepens.** A definition the user wrote in week one may be wrong by week six. Update in place; do not leave stale entries.
````

</details>
