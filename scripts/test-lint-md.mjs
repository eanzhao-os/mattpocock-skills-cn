#!/usr/bin/env node

/**
 * test-lint-md.mjs
 * 单元测试：验证 lint-md.mjs 对 6 类人为注入错误的准确拦截
 */

import assert from 'assert';
import { lintMarkdown } from './lint-md.mjs';

console.log('🧪 开始运行 lint-md 规则拦截能力测试...\n');

// 1. 测试 details-blank-lines 规则拦截
{
  const badDetails1 = `
# Title

<details>
<summary>Summary</summary>
Content
</details>
`;
  const errors1 = lintMarkdown(badDetails1, 'test.md');
  const hasRule = errors1.some(e => e.rule === 'details-blank-lines');
  assert(hasRule, 'Rule 1 (details-blank-lines: missing blank after summary) should trigger');
  console.log('  ✓ 成功拦截规则 1: details/summary 前后缺少空行');
}

// 2. 测试 code-fence-closed 规则拦截
{
  const badFence = `
# Title

\`\`\`ts
const x = 1;
`;
  const errors = lintMarkdown(badFence, 'test.md');
  const hasRule = errors.some(e => e.rule === 'code-fence-closed');
  assert(hasRule, 'Rule 2 (code-fence-closed: unclosed fence) should trigger');
  console.log('  ✓ 成功拦截规则 2: 代码围栏未闭合');
}

// 3. 测试 relative-links-exist 规则拦截
{
  const badLink = `
# Title

请跳转到 [不存在的文件](./this-file-does-not-exist-xyz.md)。
`;
  const errors = lintMarkdown(badLink, 'test.md');
  const hasRule = errors.some(e => e.rule === 'relative-links-exist');
  assert(hasRule, 'Rule 3 (relative-links-exist) should trigger');
  console.log('  ✓ 成功拦截规则 3: 目标相对文件不存在');
}

// 4. 测试 anchor-links-valid 规则拦截
{
  const badAnchor = `
# 真实标题（Real Title）

跳转到 [虚假锚点](#invalid-anchor)。
`;
  const errors = lintMarkdown(badAnchor, 'test.md');
  const hasRule = errors.some(e => e.rule === 'anchor-links-valid');
  assert(hasRule, 'Rule 4 (anchor-links-valid) should trigger');
  console.log('  ✓ 成功拦截规则 4: 页内锚点在当前文档中无对应标题');
}

// 5. 测试 no-mdx-syntax 规则拦截
{
  const badMdx1 = `
import { Something } from './lib.js';

# Title
`;
  const errors1 = lintMarkdown(badMdx1, 'test.md');
  assert(errors1.some(e => e.rule === 'no-mdx-syntax'), 'Rule 5 (import statement) should trigger');

  const badMdx2 = `
# Title

<CustomReactComponent prop="value" />
`;
  const errors2 = lintMarkdown(badMdx2, 'test.md');
  assert(errors2.some(e => e.rule === 'no-mdx-syntax'), 'Rule 5 (capitalized JSX component) should trigger');
  console.log('  ✓ 成功拦截规则 5: MDX import 语句及大写 JSX 组件');
}

// 6. 测试 mermaid-syntax 规则拦截
{
  const badMermaid1 = `
# Title

\`\`\`mermaid
unknownType
  A --> B
\`\`\`
`;
  const errors1 = lintMarkdown(badMermaid1, 'test.md');
  assert(errors1.some(e => e.rule === 'mermaid-syntax'), 'Rule 6 (unknown diagram type) should trigger');

  const badMermaid2 = `
# Title

\`\`\`mermaid
flowchart TD
  A["未闭合方括号 --> B
\`\`\`
`;
  const errors2 = lintMarkdown(badMermaid2, 'test.md');
  assert(errors2.some(e => e.rule === 'mermaid-syntax'), 'Rule 6 (unbalanced brackets) should trigger');
  console.log('  ✓ 成功拦截规则 6: Mermaid 类型错误与括号不匹配语法');
}

console.log('\n🎉 所有 6 类拦截测试全部通过！');
