# 05. grill-with-docs（grill-with-docs（结合文档沉淀的深度访谈））

```yaml
name: grill-with-docs
description: 深度严谨的追问访谈，用于打磨方案或设计，并在访谈过程中实时沉淀项目文档（架构决策记录 ADR 与领域词汇表 glossary）。
disable-model-invocation: true
```

启动一场 `/grilling` 深度访谈会话，并协同调用 `/domain-modeling`（领域建模）skill 实时将术语和决策落盘。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `engineering`
- path: `skills/engineering/grill-with-docs/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs
- 触发方式：`disable-model-invocation: true` → **user-invoked only**
- companion 文件：
  - `agents/openai.yaml`

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

```markdown
---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

Run a `/grilling` session, using the `/domain-modeling` skill.
```

</details>
