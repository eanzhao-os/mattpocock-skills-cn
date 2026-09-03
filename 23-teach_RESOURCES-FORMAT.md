# 23-teach / RESOURCES-FORMAT.md 精读（权威资料库与社区清单规范（RESOURCES.md Format））

`RESOURCES.md` 是为当前学习主题精心严选的**高信任度事实源清单**。所有原理解析材料必须且只能从此处汲取真理，**绝不允许 Agent 依赖其大模型参数进行无端猜测**。高维度的实战心法（Wisdom）则来自于此处收录的高信噪比专业社区。

---

## 1. 文档标准骨架

```markdown
# {学习主题} 权威资料库

## Knowledge（体系化硬核知识）

- [经典专著：《力量训练的科学与实践》（Zatsiorsky & Kraemer 著）](https://example.com)
  训练周期与身体机能适应的基石典籍。查阅场景：任何涉及周期规划、疲劳恢复、强度区间的内容。
- [深度长文：“我到底应该训练多少量？”（Greg Nuckols 著，Stronger By Science）](https://example.com)
  基于循证的训练量里程碑综述。查阅场景：各肌群每周训练组数目标的设定。

## Wisdom（高信噪比实战社区）

- [r/weightroom](https://reddit.com/r/weightroom)
  高信噪比的专业子板块，严厉抵制道听途说的伪科学。查阅场景：训练计划同行评审、瓶颈期突破排错。
- 线下实战：每周二在 {健身房名} 举办的力量实操课
  查阅场景：训练动作的即时面对面教练纠错反馈。
```

---

## 2. 编写铁律（Rules）

- **唯有极高信任度者配入选（High-trust only）**：优先收录一手资料、公认的泰斗级专家、同行评审的科研论文以及治理极度严格的高水平社区。**凡是披着教育外皮搞营销带货的材料，坚决剔除出清单**；
- **每一条记录都必须附带精准注解（Annotate every entry）**：三个月后一个干瘪的裸链接毫无用处。必须附上一行说明：它具体涵盖了什么、以及在什么场景下该查阅它；
- **严格按“知识（Knowledge）/ 心法（Wisdom）”二分法归组**：这与 [teach](./23-teach.md) 技能的设计哲学深度共鸣，某份资料只归入其中一组也完全没问题；
- **显式曝光知识断层与盲区（Surface gaps explicitly）**：如果某个对于目标使命至关重要的领域当前找不到靠谱资料，在文档中开辟 `## Gaps` 章节明确记录缺失项，作为未来专项检索的靶心；
- **铁腕修剪，绝不手软（Prune ruthlessly）**：凡是被后续证实为存在错误、内容浅薄或偏离使命的资源，直接果断删除，绝不任由其沉淀在文档底部。**5 份锋利精准的硬核资料，远远胜过 30 份泛泛而谈的平庸资料**；
- **郑重记录学员的社群偏好（Record community preferences）**：如果学员明确拒绝加入任何外部社群，在此处醒目标注，确保未来的教学会话绝不再做徒劳的社群推荐。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `23-teach` |
| bucket | productivity |
| 上游路径 | `skills/productivity/teach/RESOURCES-FORMAT.md` |
| 角色定位 | 权威资料库与高信噪比社区清单规范（RESOURCES.md Specification） |
| 关联模块 | `23-teach`、`22-writing-for-agents` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
# RESOURCES.md Format

`RESOURCES.md` is the curated set of trusted sources for this topic. Knowledge for explainers should be drawn from here, not from parametric guesses. Wisdom comes from the communities listed here.

## Structure

```md
# {Topic} Resources

## Knowledge

- [Book: _The Science and Practice of Strength Training_ by Zatsiorsky & Kraemer](https://example.com)
  Foundational text on programming and adaptation. Use for: anything to do with periodisation, recovery, intensity zones.
- [Article: "How Much Should I Train?" by Greg Nuckols (Stronger By Science)](https://example.com)
  Evidence-based review of volume landmarks. Use for: weekly set targets per muscle group.

## Wisdom (Communities)

- [r/weightroom](https://reddit.com/r/weightroom)
  High-signal subreddit, moderated against bro-science. Use for: programme critique, plateau troubleshooting.
- Local: Tuesday strength class at {gym name}
  Use for: real-time coaching feedback on lifts.
```

## Rules

- **High-trust only.** Prefer primary sources, recognised experts, peer-reviewed work, and communities with strong moderation. If a resource is marketing dressed as education, leave it out.
- **Annotate every entry.** A bare link is useless in three months. Add one line: what it covers and when to reach for it.
- **Group by Knowledge / Wisdom.** Mirrors the philosophy in [SKILL.md](./23-teach.md). It is fine for a resource to appear in only one group.
- **Surface gaps explicitly.** If no good resource exists for an area the mission needs, write a `## Gaps` section listing what is missing. This drives future search.
- **Prune ruthlessly.** A resource that turned out to be wrong, shallow, or off-mission should be removed, not buried. Better five sharp sources than thirty mediocre ones.
- **Record community preferences.** If the user has opted out of joining communities, note it here so future sessions don't keep proposing them.
````

</details>
