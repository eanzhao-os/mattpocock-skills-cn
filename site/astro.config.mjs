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
			logo: {
				src: './src/assets/seal-logo.svg',
				alt: '技 · 印章标识',
			},
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
function isDark() {
  return document.documentElement.dataset.theme === 'dark';
}

const MERMAID_LIGHT_VARS = {
  fontFamily: 'inherit',
  primaryColor: '#fbeee7',
  primaryBorderColor: '#b3402a',
  primaryTextColor: '#5b2318',
  secondaryColor: '#f4f0e8',
  tertiaryColor: '#fdfbf7',
  lineColor: '#a39a8d',
  textColor: '#37312a',
  clusterBkg: '#f6f2ea',
  edgeLabelBackground: '#fdfbf7',
  titleColor: '#463f36',
  noteBkgColor: '#f8e9e3',
  noteTextColor: '#5b2318',
  actorBkg: '#fbeee7',
  actorBorder: '#b3402a',
  actorTextColor: '#5b2318',
  signalColor: '#6e675c',
  signalTextColor: '#37312a'
};

const MERMAID_DARK_VARS = {
  fontFamily: 'inherit',
  primaryColor: '#3a231d',
  primaryBorderColor: '#e0684e',
  primaryTextColor: '#f3d9cf',
  secondaryColor: '#2b2721',
  tertiaryColor: '#1f1c18',
  lineColor: '#877e70',
  textColor: '#ded7c9',
  clusterBkg: '#24211c',
  edgeLabelBackground: '#1f1c18',
  titleColor: '#e3dccf',
  noteBkgColor: '#38221c',
  noteTextColor: '#f3d9cf',
  actorBkg: '#3a231d',
  actorBorder: '#e0684e',
  actorTextColor: '#f3d9cf',
  signalColor: '#b3aa99',
  signalTextColor: '#ded7c9'
};

let mermaidCounter = 0;

async function initAndRunMermaid() {
  if (typeof window.mermaid === 'undefined') {
    setTimeout(initAndRunMermaid, 50);
    return;
  }
  const nodes = document.querySelectorAll('.mermaid');
  if (nodes.length === 0) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: isDark() ? MERMAID_DARK_VARS : MERMAID_LIGHT_VARS,
    securityLevel: 'loose',
  });

  for (const node of nodes) {
    const rawCode = node.getAttribute('data-code') || node.textContent.trim();
    if (!rawCode) continue;
    try {
      const id = 'mermaid-svg-' + (++mermaidCounter);
      const { svg } = await mermaid.render(id, rawCode);
      node.innerHTML = svg;
    } catch (err) {
      console.warn('Mermaid render warning:', err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAndRunMermaid);
} else {
  initAndRunMermaid();
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
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
