# 02-setup-matt-pocock-skills / domain.md 精读（领域模型文档规范（Domain Documentation Specification））

本代码仓库的核心领域模型（Domain model）与架构决策均持久化记录在 `docs/agents/domain.md` 文件中。

---

## 当其他技能指示“更新领域模型（update the domain model）”时的执行准则

直接编辑 `docs/agents/domain.md`：

- **补充领域词汇**：将新提炼的领域专有名词和通用语言（Ubiquitous Language）追加到 **Domain Model（领域模型）** 章节中；
- **记录架构决策**：将新敲定的架构与设计选型，严格按照架构决策记录（ADR）的标准格式追加到 **Architecture（架构设计）** 章节中；
- **文件初创兜底**：若该文件当前尚不存在，直接使用 `domain-modeling` 技能中提供的标准模板就地创建；
- **精简与去废话原则**：描述文字保持高度精炼聚焦，**只记录那些光看代码本身无法直接看出的深层设计思想与非显性概念**。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

| 字段 | 值 |
|---|---|
| 对应主 Skill | `02-setup-matt-pocock-skills` |
| bucket | engineering |
| 上游路径 | `skills/engineering/setup-matt-pocock-skills/domain.md` |
| 角色定位 | 领域模型与项目架构权威文档规范（Domain Documentation Specification） |
| 关联模块 | `15-domain-modeling` |

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
# Domain

The domain model and architectural decisions for this repo live in `docs/agents/domain.md`.

## When a skill says "update the domain model"

Edit `docs/agents/domain.md`.

- Add new vocabulary to the **Domain Model** section
- Add architecture decisions to the **Architecture** section using the ADR format
- If the file doesn't exist yet, create it using the template in the `domain-modeling` skill
- Keep descriptions concise and focused on concepts that are non-obvious from the code alone
```

</details>
