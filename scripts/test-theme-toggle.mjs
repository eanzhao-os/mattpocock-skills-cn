#!/usr/bin/env node

/**
 * Verifies the generated site contains the icon-only theme toggle contract.
 * Run after `npm run build`.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../site/dist/index.html');

assert.ok(fs.existsSync(htmlPath), 'site/dist/index.html should exist; run npm run build first');

const html = fs.readFileSync(htmlPath, 'utf8');

assert.match(
	html,
	/<button[^>]*class="[^"]*theme-toggle[^"]*"[^>]*aria-label="切换主题"/,
	'The header should contain an accessible icon-only theme toggle button',
);
assert.match(html, /theme-toggle-icon--sun/, 'The toggle should include a sun icon');
assert.match(html, /theme-toggle-icon--moon/, 'The toggle should include a moon icon');
assert.doesNotMatch(html, /<option value="auto"/, 'The text-based automatic theme option should not be rendered');
assert.match(html, /localStorage\.setItem/, 'Manual theme selections should persist');
assert.match(html, /matchMedia\(['"]\(prefers-color-scheme: light\)['"]\)/, 'The initial theme should follow the system preference');

console.log('✓ Icon-only theme toggle contract is present');
