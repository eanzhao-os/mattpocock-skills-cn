// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sidebarPath = path.resolve(__dirname, 'src/sidebar.json');
const sidebar = fs.existsSync(sidebarPath)
	? JSON.parse(fs.readFileSync(sidebarPath, 'utf8'))
	: [];

// https://astro.build/config
export default defineConfig({
	site: 'https://eanzhao-os.github.io',
	base: '/mattpocock-skills-cn',
	integrations: [
		starlight({
			title: 'Matt Pocock Agent Skills 中文版',
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/eanzhao-os/mattpocock-skills-cn',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/eanzhao-os/mattpocock-skills-cn/edit/main/',
			},
			lastUpdated: true,
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'script',
					attrs: {
						src: '/mattpocock-skills-cn/mermaid.min.js',
						defer: true,
					},
				},
				{
					tag: 'script',
					content: `
function getTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default';
}

function initAndRunMermaid() {
  if (typeof window.mermaid === 'undefined') {
    setTimeout(initAndRunMermaid, 50);
    return;
  }
  const nodes = document.querySelectorAll('.mermaid');
  if (nodes.length === 0) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: getTheme(),
    securityLevel: 'loose',
  });
  mermaid.run({ nodes });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAndRunMermaid);
} else {
  initAndRunMermaid();
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      const nodes = document.querySelectorAll('.mermaid');
      nodes.forEach((node) => {
        if (node.getAttribute('data-original-code')) {
          node.innerHTML = node.getAttribute('data-original-code') || '';
          node.removeAttribute('data-processed');
        }
      });
      initAndRunMermaid();
    }
  }
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
`,
				},
			],
			sidebar,
		}),
	],
});
