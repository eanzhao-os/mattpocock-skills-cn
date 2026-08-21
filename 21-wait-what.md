# 21. wait-what

## Meta（bucket/path/url/触发方式/companions）

| 字段 | 值 |
|---|---|
| bucket | `productivity/` |
| path | `skills/productivity/wait-what/` |
| url | https://github.com/mattpocock/skills/tree/main/skills/productivity/wait-what |
| name | `wait-what` |
| 触发方式 | description：Stop. That last message did not land — re-pitch it.（user-invoked） |
| companions | 无独立 companion 文件 |
| 产物 | re-pitch the last message with ASD-STE100 Simplified Technical English + CONTEXT.md vocabulary |

## 原文 (SKILL.md)

```markdown
---
name: wait-what
description: Stop. That last message did not land — re-pitch it.
disable-model-invocation: true
---

Wait — I don't understand where you've got to here. Re-pitch that: give me a little bit of context, talk in ASD-STE100 Simplified Technical English, and use the ubiquitous language from `CONTEXT.md`.
```

## 中文翻译

```yaml
name: wait-what
description: 等一下。刚才那句话我完全没听懂 —— 请换种更清晰的方式重新讲一遍。
disable-model-invocation: true
```

# Wait What（等等，请重新表述）

等等 —— 我完全没跟上你的思路，不知道你刚才说的那段到底想表达什么。请重新表述一遍：先给我交代一点必要的背景上下文，使用 **ASD-STE100 国际标准简化技术英语（Simplified Technical English）** 的表达风格（短小明晰的陈述句、杜绝长难句与黑话），并且严格使用 `CONTEXT.md` 中已经确立的通用领域统一语言（ubiquitous language）。
