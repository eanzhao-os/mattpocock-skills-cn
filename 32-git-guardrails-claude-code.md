# 32. git-guardrails-claude-code（Setup Git Guardrails（Claude Code 安全护栏安装脚手架））

配置一个工具调用前置钩子（PreToolUse hook），在 Claude 尝试执行高危破坏性 Git 命令的**毫秒之前**直接将其硬拦截。

---

## 拦截规则黑名单（What Gets Blocked）

- `git push`（涵盖所有的变体，包括 `--force` 强制推送）；
- `git reset --hard`；
- `git clean -f` / `git clean -fd`；
- `git branch -D`（强制删除分支）；
- `git checkout .` / `git restore .`（丢弃工作区所有修改）。

当命令被拦截时，Claude 会收到一条明确的系统提示，告知其没有权限执行这些高危操作。

---

## 安装执行步骤

1. **询问安装生效范围（Ask scope）**：向用户请示确认 —— 仅为**当前项目安装**（配置写入 `.claude/settings.json`），还是进行**全局安装**（配置写入 `~/.claude/settings.json`）？
2. **复制拦截脚本（Copy the hook script）**：附带的脚本文件位于 `scripts/block-dangerous-git.sh`。根据用户选择的生效范围将其复制到目标路径：
   - **当前项目生效**：`.claude/hooks/block-dangerous-git.sh`；
   - **全局生效**：`~/.claude/hooks/block-dangerous-git.sh`。

   随后执行 `chmod +x` 为其赋予可执行权限；
3. **将 Hook 注入配置文件（Add hook to settings）**：在对应的配置文件中挂载钩子：

   **当前项目**（`.claude/settings.json`）：
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             {
               "type": "command",
               "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
             }
           ]
         }
       ]
     }
   }
   ```

   **全局**（`~/.claude/settings.json`）：
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             {
               "type": "command",
               "command": "~/.claude/hooks/block-dangerous-git.sh"
             }
           ]
         }
       ]
     }
   }
   ```

   若配置文件已存在，将其**平滑合并**进既有的 `hooks.PreToolUse` 数组中 —— 绝不要覆盖用户的其他配置；
4. **询问个性化定制需求（Ask about customization）**：向用户询问是否需要从拦截黑名单中追加或移除某些特定命令模式。根据用户的反馈就地编辑刚才复制过去的拦截脚本；
5. **执行冒烟测试验证（Verify）**：通过管道模拟一次 JSON 输入来快速自测脚本拦截能力：`echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>`。脚本应当以退出码 2（exit code 2）终止退出，并在标准错误输出（stderr）中清晰打印 `BLOCKED` 报错信息。

---

## 📑 附录：技能元信息与英文原文

### 📌 元数据（Meta）

- bucket: `misc`
- path: `skills/misc/git-guardrails-claude-code/`
- upstream: https://github.com/mattpocock/skills/tree/main/skills/misc/git-guardrails-claude-code
- 触发方式：description 驱动（无 `disable-model-invocation`）——用户要防破坏性 git、加 git safety hooks、在 Claude Code 拦 push/reset 时使用
- companion 文件：
  - `scripts/block-dangerous-git.sh`（PreToolUse 实际拦截脚本）
  - `agents/openai.yaml`
- **低频 / 强环境绑定**：仅 Claude Code 的 `PreToolUse` + `settings.json` hooks 模型；不直接移植到 Codex/Cursor/其他 harness，除非存在对等的 hook 接口。

<br>

<details>
<summary><b>📄 点击展开查看英文原文 (原版可直接复制)</b></summary>

````markdown
---
name: git-guardrails-claude-code
description: Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when user wants to prevent destructive git operations, add git safety hooks, or block git push/reset in Claude Code.
---

# Setup Git Guardrails

Sets up a PreToolUse hook that intercepts and blocks dangerous git commands before Claude executes them.

## What Gets Blocked

- `git push` (all variants including `--force`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

When blocked, Claude sees a message telling it that it does not have authority to access these commands.

## Steps

### 1. Ask scope

Ask the user: install for **this project only** (`.claude/settings.json`) or **all projects** (`~/.claude/settings.json`)?

### 2. Copy the hook script

The bundled script is at: [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

Copy it to the target location based on scope:

- **Project**: `.claude/hooks/block-dangerous-git.sh`
- **Global**: `~/.claude/hooks/block-dangerous-git.sh`

Make it executable with `chmod +x`.

### 3. Add hook to settings

Add to the appropriate settings file:

**Project** (`.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**Global** (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

If the settings file already exists, merge the hook into existing `hooks.PreToolUse` array — don't overwrite other settings.

### 4. Ask about customization

Ask if user wants to add or remove any patterns from the blocked list. Edit the copied script accordingly.

### 5. Verify

Run a quick test:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

Should exit with code 2 and print a BLOCKED message to stderr.
````

## scripts/ 说明

`scripts/block-dangerous-git.sh`：从 stdin 读 PreToolUse JSON，用 `jq` 取 `.tool_input.command`，对危险 pattern 列表做 `grep -qE` 匹配；命中则 stderr 打印 `BLOCKED: ...` 并以 **exit 2** 拒绝，否则 exit 0 放行。

### scripts/block-dangerous-git.sh 原文

```bash
#!/bin/bash

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

DANGEROUS_PATTERNS=(
  "git push"
  "git reset --hard"
  "git clean -fd"
  "git clean -f"
  "git branch -D"
  "git checkout \."
  "git restore \."
  "push --force"
  "reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

exit 0
```

</details>
