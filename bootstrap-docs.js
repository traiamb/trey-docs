const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const WIKI_DIR = path.join(ROOT_DIR, 'wiki');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

// Helper to ensure directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Recursive scanner for markdown files
function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Clean & build folders
console.log('Cleaning old docs/ folder...');
if (fs.existsSync(DOCS_DIR)) fs.rmSync(DOCS_DIR, { recursive: true, force: true });
fs.mkdirSync(DOCS_DIR);

const categories = {};
const markdownFiles = scanDir(WIKI_DIR);

console.log(`Found ${markdownFiles.length} markdown files in wiki/. Processing...`);

markdownFiles.forEach(filePath => {
  const relativePath = path.relative(WIKI_DIR, filePath);
  const destPath = path.join(DOCS_DIR, relativePath);
  ensureDirectoryExistence(destPath);
  
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  
  // Parse title
  const titleMatch = rawContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');
  
  // Parse Status and Category blockquote: > **Status**: `Planned` | **Category**: Agents
  const metaMatch = rawContent.match(/>\s*\*\*Status\*\*:\s*`?([^`|\n]+)`?\s*\|\s*\*\*Category\*\*:\s*([^\n]+)/i);
  
  let status = 'MVP';
  let category = 'Documentation';
  if (metaMatch) {
    status = metaMatch[1].trim().replace(/`/g, '');
    category = metaMatch[2].trim().replace(/\*\*/g, '').replace(/`/g, '');
  }
  
  // Parse description and body content
  const parts = rawContent.split(/\n---\s*\n/);
  let description = '';
  let bodyContent = rawContent;
  
  if (parts.length > 1) {
    bodyContent = parts.slice(1).join('\n---\n');
    
    // Extract description from the first part (excluding title and metadata line)
    const headerLines = parts[0].split('\n').filter(line => line.trim() !== '');
    const nonMetaLines = headerLines.filter(line => {
      const trimLine = line.trim();
      return !trimLine.startsWith('#') && !trimLine.startsWith('>');
    });
    if (nonMetaLines.length > 0) {
      description = nonMetaLines.join(' ').trim();
    }
  } else {
    // Fallback if no '---' divider exists
    bodyContent = rawContent.replace(/^#\s+.+$/m, '').replace(/>\s*\*\*Status\*\*.+$/m, '');
  }
  
  bodyContent = bodyContent.trim();
  
  // Store dynamic categories for homepage card building
  const categoryKey = category;
  if (!categories[categoryKey]) {
    categories[categoryKey] = [];
  }
  
  const urlPath = relativePath.replace(/\.md$/, '/');
  categories[categoryKey].push({
    title,
    path: urlPath,
    description: description || 'Documentation and guides for ' + title + '.'
  });
  
  // Wrap pages in premium wrappers
  const wrappedContent = `
<div class="trey-page-header">
  <div class="trey-header-meta">
    <span class="trey-status-badge status-${status.toLowerCase()}">${status}</span>
    <span class="trey-category-badge">${category}</span>
  </div>
  <h1 class="trey-page-title">${title}</h1>
  <p class="trey-page-description">${description || 'Documentation page for ' + title + '.'}</p>
</div>

<div class="trey-content-card" markdown="1">

${bodyContent}

</div>`;
  
  fs.writeFileSync(destPath, wrappedContent, 'utf-8');
});

// Build Landing Page dynamically from Category Map
console.log('Generating dynamic landing page...');
let categoryCardsHtml = '';
const sortedCategories = Object.keys(categories).sort();

sortedCategories.forEach(catName => {
  const list = categories[catName];
  const count = list.length;
  list.sort((a, b) => a.title.localeCompare(b.title));
  const mainLink = list[0].path;
  
  categoryCardsHtml += `
    <div class="trey-card">
      <div>
        <span class="trey-section-badge">${catName.toUpperCase()}</span>
        <h3>${catName}</h3>
        <p>${list[0].description || 'Overview and concept definitions.'}</p>
      </div>
      <a href="${mainLink}">Explore ${count} ${count === 1 ? 'topic' : 'topics'} →</a>
    </div>`;
});

const landingHtml = `<div class="home-page-container">
  <div class="trey-hero">
    <div class="trey-hero-grid"></div>
    <div class="trey-hero-container">
      <div class="trey-hero-content">
        <div class="trey-hero-badge">
          <svg class="trey-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
          Trey Documentation
        </div>
        <h1 class="trey-hero-title">Local-first AI engineering operations, documented end to end.</h1>
        <p class="trey-hero-description">Learn how Trey coordinates agents, runners, runtimes, git worktrees, live telemetry, daemon-verified safety gates, and human approval before code reaches shared systems.</p>
        <div class="trey-hero-actions">
          <a href="getting-started/introduction/" class="trey-btn trey-btn-primary">
            Get Started
            <svg class="trey-icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="core-concepts/workspaces/" class="trey-btn trey-btn-secondary">Learn Concepts</a>
        </div>
      </div>
      
      <div class="trey-hero-card">
        <div class="trey-hero-card-header">
          <span>RUN MONITOR</span>
          <svg class="trey-icon-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <pre class="trey-hero-card-body"><code>$ trey run verify-security
[+] Claimed task-482 (high priority)
[+] Checked out worktree in 140ms
[+] Running static verification...
[+] Verification successful.
[+] Committing patch and creating PR.
[+] Session completed successfully.</code></pre>
      </div>
    </div>
  </div>

  <div class="trey-section-title">
    <div>
      <span class="trey-section-badge">DOCUMENTATION INDEX</span>
      <h2 class="trey-section-heading">Platform Modules</h2>
    </div>
    <span class="trey-section-count">${markdownFiles.length} Articles Compiled</span>
  </div>

  <div class="trey-grid">
    ${categoryCardsHtml}
  </div>
</div>`;

fs.writeFileSync(path.join(DOCS_DIR, 'index.md'), landingHtml, 'utf-8');

// Write extra.css
console.log('Writing extra.css stylesheet...');
const extraCssContent = `/* Color Palette and Custom Tokens matching trey-console */
:root {
  --md-primary-fg-color: #0f172a !important; /* slate-950 */
  --md-primary-fg-color--dark: #090d16 !important;
  --md-accent-fg-color: #06b6d4 !important; /* cyan-500 */
  --md-default-bg-color: #f6f8fd !important; /* page background */
  --md-default-fg-color: #0f172a !important; /* primary text */
  --md-default-fg-color--light: #475569 !important; /* secondary text */
  --md-default-fg-color--lighter: #94a3b8 !important;
  
  --md-code-bg-color: #f8fafc !important;
  --md-code-fg-color: #0f172a !important;
}

/* Viewport and Page backgrounds */
body, .md-container, .md-main {
  background-color: #f6f8fd !important;
}
[data-md-color-scheme="slate"] body, 
[data-md-color-scheme="slate"] .md-container, 
[data-md-color-scheme="slate"] .md-main {
  background-color: #090d16 !important;
}

/* Custom fonts */
body, input {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
}
code, kbd, pre {
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Courier, monospace !important;
}

/* Header customization: clean, semi-transparent white with blur */
.md-header {
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  color: #0f172a !important;
  border-bottom: 1px solid #e2e8f0 !important;
  box-shadow: none !important;
}
[data-md-color-scheme="slate"] .md-header {
  background-color: rgba(15, 23, 42, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}
.md-header__title {
  color: #0f172a !important;
  font-weight: 600 !important;
}
[data-md-color-scheme="slate"] .md-header__title {
  color: #ffffff !important;
}
.md-header__button {
  color: #0f172a !important;
}
[data-md-color-scheme="slate"] .md-header__button {
  color: #ffffff !important;
}
.md-header__button.md-icon[for="__search"] {
  color: #0f172a !important;
}
[data-md-color-scheme="slate"] .md-header__button.md-icon[for="__search"] {
  color: #ffffff !important;
}

/* Navigation tabs styling */
.md-tabs {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e8f0 !important;
}
[data-md-color-scheme="slate"] .md-tabs {
  background-color: #0b0f19 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.md-tabs__link {
  color: #475569 !important;
  font-weight: 500 !important;
}
[data-md-color-scheme="slate"] .md-tabs__link {
  color: #cbd5e1 !important;
}
.md-tabs__link--active {
  color: #0f172a !important;
}
[data-md-color-scheme="slate"] .md-tabs__link--active {
  color: #22d3ee !important;
}

/* Layout widths and margins */
.md-content__inner {
  max-width: 840px !important;
  padding: 0 !important;
  margin-top: 1.5rem !important;
}

/* Custom Page Header (above card) */
.trey-page-header {
  margin-bottom: 1.5rem !important;
}
.trey-header-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem !important;
}

/* Custom Badges */
.trey-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  color: #ffffff !important;
}
.status-mvp {
  background-color: #0ea5e9 !important; /* sky-500 */
}
.status-planned {
  background-color: #22d3ee !important; /* cyan-400 */
  color: #0f172a !important;
}
.status-reference, .status-future {
  background-color: #64748b !important;
}

.trey-category-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.trey-page-title {
  font-size: 2.25rem !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin: 0.5rem 0 !important;
  letter-spacing: -0.025em !important;
}
[data-md-color-scheme="slate"] .trey-page-title {
  color: #ffffff !important;
}

.trey-page-description {
  font-size: 1rem !important;
  color: #475569 !important;
  margin: 0.5rem 0 1.5rem 0 !important;
  line-height: 1.6 !important;
}
[data-md-color-scheme="slate"] .trey-page-description {
  color: #cbd5e1 !important;
}

/* Content Container Card styling */
.trey-content-card {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.75rem !important; /* rounded-xl */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03) !important;
  padding: 2.5rem !important;
  margin-bottom: 2rem !important;
}
[data-md-color-scheme="slate"] .trey-content-card {
  background-color: #0f172a !important; /* slate-900 */
  border-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

/* Section Headings inside card */
.trey-content-card h2 {
  font-size: 1.25rem !important; /* text-xl */
  font-weight: 600 !important;
  color: #0f172a !important;
  margin-top: 1.75rem !important;
  margin-bottom: 0.75rem !important;
  border-bottom: none !important;
  padding-bottom: 0 !important;
}
[data-md-color-scheme="slate"] .trey-content-card h2 {
  color: #ffffff !important;
}
.trey-content-card h2:first-of-type {
  margin-top: 0 !important;
}

/* Custom Callouts styled dynamically via JS */
.custom-callout {
  border-left: 4px solid #cbd5e1 !important;
  background-color: #f8fafc !important;
  padding: 1rem 1.25rem !important;
  border-radius: 0.5rem !important;
  margin: 1.5rem 0 !important;
}
.custom-callout p {
  margin: 0 !important;
  font-size: 0.875rem !important;
  color: #334155 !important;
  line-height: 1.6 !important;
}
[data-md-color-scheme="slate"] .custom-callout p {
  color: #cbd5e1 !important;
}
.custom-callout .callout-title {
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  margin-bottom: 0.35rem !important;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Specific Callout Types */
.callout-note, .callout-info {
  border-left-color: #06b6d4 !important; /* cyan-500 */
  background-color: #ecfeff !important; /* cyan-50 */
}
[data-md-color-scheme="slate"] .callout-note, 
[data-md-color-scheme="slate"] .callout-info {
  background-color: rgba(6, 182, 212, 0.08) !important;
}
.callout-note .callout-title, .callout-info .callout-title {
  color: #0e7490 !important;
}
[data-md-color-scheme="slate"] .callout-note .callout-title, 
[data-md-color-scheme="slate"] .callout-info .callout-title {
  color: #22d3ee !important;
}

.callout-important {
  border-left-color: #0ea5e9 !important; /* sky-500 */
  background-color: #f0f9ff !important; /* sky-50 */
}
[data-md-color-scheme="slate"] .callout-important {
  background-color: rgba(14, 165, 233, 0.08) !important;
}
.callout-important .callout-title {
  color: #0369a1 !important;
}
[data-md-color-scheme="slate"] .callout-important .callout-title {
  color: #38bdf8 !important;
}

.callout-planned {
  border-left-color: #8b5cf6 !important; /* purple-500 */
  background-color: #f5f3ff !important; /* purple-50 */
}
[data-md-color-scheme="slate"] .callout-planned {
  background-color: rgba(139, 92, 246, 0.08) !important;
}
.callout-planned .callout-title {
  color: #6d28d9 !important;
}
[data-md-color-scheme="slate"] .callout-planned .callout-title {
  color: #a78bfa !important;
}

.callout-warning {
  border-left-color: #f59e0b !important; /* amber-500 */
  background-color: #fef3c7 !important; /* amber-50 */
}
[data-md-color-scheme="slate"] .callout-warning {
  background-color: rgba(245, 158, 11, 0.08) !important;
}
.callout-warning .callout-title {
  color: #b45309 !important;
}
[data-md-color-scheme="slate"] .callout-warning .callout-title {
  color: #f59e0b !important;
}

.callout-caution, .callout-danger {
  border-left-color: #f43f5e !important; /* rose-500 */
  background-color: #fff1f2 !important; /* rose-50 */
}
[data-md-color-scheme="slate"] .callout-caution, 
[data-md-color-scheme="slate"] .callout-danger {
  background-color: rgba(244, 63, 94, 0.08) !important;
}
.callout-caution .callout-title, .callout-danger .callout-title {
  color: #be123c !important;
}
[data-md-color-scheme="slate"] .callout-caution .callout-title, 
[data-md-color-scheme="slate"] .callout-danger .callout-title {
  color: #f43f5e !important;
}

.callout-safety {
  border-left-color: #f43f5e !important;
  background-color: #fff1f2 !important;
}
[data-md-color-scheme="slate"] .callout-safety {
  background-color: rgba(244, 63, 94, 0.08) !important;
}
.callout-safety .callout-title {
  color: #be123c !important;
}
[data-md-color-scheme="slate"] .callout-safety .callout-title {
  color: #f43f5e !important;
}

.callout-tip, .callout-example {
  border-left-color: #10b981 !important; /* emerald-500 */
  background-color: #ecfdf5 !important; /* emerald-50 */
}
[data-md-color-scheme="slate"] .callout-tip, 
[data-md-color-scheme="slate"] .callout-example {
  background-color: rgba(16, 185, 129, 0.08) !important;
}
.callout-tip .callout-title, .callout-example .callout-title {
  color: #047857 !important;
}
[data-md-color-scheme="slate"] .callout-tip .callout-title, 
[data-md-color-scheme="slate"] .callout-example .callout-title {
  color: #10b981 !important;
}

/* Sidebar navigation styling */
.md-sidebar--primary {
  background-color: #ffffff !important;
  border-right: 1px solid #e2e8f0 !important;
}
[data-md-color-scheme="slate"] .md-sidebar--primary {
  background-color: #0b0f19 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.md-sidebar--secondary {
  background-color: transparent !important;
}
.md-nav__link {
  color: #475569 !important;
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  transition: all 0.2s !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
[data-md-color-scheme="slate"] .md-nav__link {
  color: #94a3b8 !important;
}
.md-nav__link:hover {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}
[data-md-color-scheme="slate"] .md-nav__link:hover {
  background-color: #1e293b !important;
  color: #ffffff !important;
}
.md-nav__link--active {
  background-color: #0f172a !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}
[data-md-color-scheme="slate"] .md-nav__link--active {
  background-color: #22d3ee !important; /* cyan-400 */
  color: #0b0f19 !important;
}
.md-nav__link--active:hover {
  background-color: #0f172a !important;
  color: #ffffff !important;
}
[data-md-color-scheme="slate"] .md-nav__link--active:hover {
  background-color: #22d3ee !important;
  color: #0b0f19 !important;
}

/* Sidebar navigation status badges (cyan, blue, purple) */
.sidebar-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.35rem;
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  border: 1px solid currentColor;
}
.status-sidebar-planned {
  color: #0ea5e9 !important; /* sky-500 */
  background-color: rgba(14, 165, 233, 0.05);
}
.status-sidebar-reference {
  color: #64748b !important; /* slate-500 */
  background-color: rgba(100, 116, 139, 0.05);
}
.status-sidebar-future {
  color: #a855f7 !important; /* purple-500 */
  background-color: rgba(168, 85, 247, 0.05);
}
.md-nav__link--active .sidebar-status-badge {
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}
[data-md-color-scheme="slate"] .md-nav__link--active .sidebar-status-badge {
  color: #0f172a !important;
  border-color: rgba(15, 23, 42, 0.2) !important;
  background-color: rgba(15, 23, 42, 0.05) !important;
}

/* Secondary table of contents navigation active highlight pill */
.md-sidebar--secondary .md-nav__link--active {
  background-color: #ecfeff !important;
  border: 1px solid #cffafe !important;
  color: #0e7490 !important;
  font-weight: 500 !important;
  border-radius: 0.375rem !important;
}
[data-md-color-scheme="slate"] .md-sidebar--secondary .md-nav__link--active {
  background-color: rgba(6, 182, 212, 0.1) !important;
  border-color: rgba(6, 182, 212, 0.2) !important;
  color: #22d3ee !important;
}

/* Code block container */
.highlight {
  border-radius: 0.5rem !important;
  border: 1px solid #e2e8f0 !important;
}
[data-md-color-scheme="slate"] .highlight {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* --- HERO BANNER & GRID LAYOUT FOR THE LANDING PAGE --- */
.trey-hero {
  position: relative;
  overflow: hidden;
  background-color: #0b0f19;
  color: #ffffff;
  padding: 3rem 2rem;
  border-radius: 0.75rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.trey-hero-grid {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}
.trey-hero-container {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 992px) {
  .trey-hero-container {
    grid-template-cols: 1fr 340px;
    align-items: center;
  }
}
.trey-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(34, 211, 238, 0.25);
  background-color: rgba(34, 211, 238, 0.1);
  padding: 0.25rem 0.75rem;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #22d3ee;
  margin-bottom: 1.25rem;
}
.trey-icon {
  width: 14px;
  height: 14px;
}
.trey-hero-title {
  color: #ffffff !important;
  font-size: 2.25rem !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.03em !important;
  margin-top: 0 !important;
  margin-bottom: 1.25rem !important;
}
@media (min-width: 768px) {
  .trey-hero-title {
    font-size: 3.25rem !important;
  }
}
.trey-hero-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #cbd5e1;
  max-width: 600px;
  margin-bottom: 1.75rem;
}
.trey-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.trey-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none !important;
  transition: all 0.2s;
}
.trey-btn-primary {
  background-color: #22d3ee;
  color: #0f172a !important;
}
.trey-btn-primary:hover {
  background-color: #67e8f9;
}
.trey-btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff !important;
}
.trey-btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.trey-icon-btn {
  width: 16px;
  height: 16px;
}

/* Hero Run Card */
.trey-hero-card {
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
.trey-hero-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}
.trey-hero-card-header span {
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #94a3b8;
}
.trey-icon-card {
  width: 16px;
  height: 16px;
  color: #22d3ee;
}
.trey-hero-card-body {
  margin: 0 !important;
  background-color: transparent !important;
  border: none !important;
  color: #34d399 !important; /* emerald-400 */
  font-size: 0.75rem !important;
  line-height: 1.7 !important;
}

/* Homepage grid map */
.trey-section-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}
@media (min-width: 768px) {
  .trey-section-title {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}
.trey-section-badge {
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #0e7490; /* cyan-700 */
  margin: 0 !important;
}
.trey-section-heading {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  margin: 0.25rem 0 0 0 !important;
}
.trey-section-count {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 !important;
}

/* Category cards grid */
.trey-grid {
  display: grid;
  gap: 1rem;
  grid-template-cols: 1fr;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .trey-grid {
    grid-template-cols: repeat(2, 1fr);
  }
}
@media (min-width: 1200px) {
  .trey-grid {
    grid-template-cols: repeat(3, 1fr);
  }
}
.trey-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
[data-md-color-scheme="slate"] .trey-card {
  background-color: #0f172a;
  border-color: rgba(255, 255, 255, 0.1);
}
.trey-card:hover {
  border-color: #22d3ee;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
.trey-card h3 {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  margin: 0 0 0.5rem 0 !important;
}
[data-md-color-scheme="slate"] .trey-card h3 {
  color: #ffffff !important;
}
.trey-card p {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 1rem 0 !important;
  flex-grow: 1;
}
[data-md-color-scheme="slate"] .trey-card p {
  color: #cbd5e1;
}
.trey-card a {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0e7490 !important;
  text-decoration: none !important;
}
[data-md-color-scheme="slate"] .trey-card a {
  color: #22d3ee !important;
}
.trey-card a:hover {
  color: #0891b2 !important;
}
[data-md-color-scheme="slate"] .trey-card a:hover {
  color: #67e8f9 !important;
}

/* Home page content card strip */
.md-content__inner:has(.home-page-container) {
  border: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  max-width: 100% !important;
}
.home-page-container h1,
.home-page-container .md-content__meta {
  display: none !important;
}
`;
const extraCssPath = path.join(DOCS_DIR, 'stylesheets/extra.css');
ensureDirectoryExistence(extraCssPath);
fs.writeFileSync(extraCssPath, extraCssContent, 'utf-8');

// Write client-side JS to parse blockquotes into beautiful alert banners matching trey-console
console.log('Writing extra.js script...');
const extraJsContent = `document.addEventListener("DOMContentLoaded", function() {
  // Parse blockquotes into custom callouts
  const blockquotes = document.querySelectorAll("blockquote");
  blockquotes.forEach(bq => {
    const firstP = bq.querySelector("p");
    if (!firstP) return;
    const text = firstP.innerHTML;
    const match = text.match(/^\\[!(NOTE|IMPORTANT|WARNING|CAUTION|TIP|SAFETY)\\]\\s*(<br>|\\n)?/i);
    if (match) {
      const type = match[1].toLowerCase();
      
      // Remove prefix
      firstP.innerHTML = text.replace(/^\\[!(NOTE|IMPORTANT|WARNING|CAUTION|TIP|SAFETY)\\]\\s*(<br>|\\n)?/i, "");
      
      // Add styling classes
      bq.classList.add("custom-callout", \`callout-\${type}\`);
      
      // Extract bold text as title header if available
      const strong = firstP.querySelector("strong");
      if (strong && firstP.innerHTML.trim().startsWith(strong.outerHTML)) {
        const titleDiv = document.createElement("div");
        titleDiv.className = "callout-title";
        titleDiv.innerHTML = strong.innerHTML;
        bq.insertBefore(titleDiv, firstP);
        
        // Remove old title container
        strong.remove();
        
        // Remove trailing dash or colons if left behind
        firstP.innerHTML = firstP.innerHTML.trim().replace(/^\\s*[-:]\\s*/, "");
      } else {
        // Fallback title
        const titleDiv = document.createElement("div");
        titleDiv.className = "callout-title";
        titleDiv.innerHTML = type === 'safety' ? 'Caution' : type;
        bq.insertBefore(titleDiv, firstP);
      }
    }
  });

  // Append status badges to sidebar links dynamically
  const statusOverrides = {
    'mobile-agent': 'Planned',
    'integration-agent': 'Planned',
    'runtime-adapters': 'Planned',
    'remote-runners': 'Planned',
    'home-machine-runner': 'Planned',
    'office-runner': 'Planned',
    'cloud-vm-runner': 'Planned',
    'integrations': 'Planned',
    'github-projects-sync': 'Planned',
    'jira-import': 'Planned',
    'jira-status-sync': 'Planned',
    'agency-workflow': 'Planned',
    'remote-home-runner-workflow': 'Planned',
    'mobile-workflow': 'Planned',
    'pull-request-view': 'Planned',
    'integrations-screen': 'Planned',
    'gpu-server-runner': 'Future',
    'raw-ollama-api-runtime': 'Future',
    'creating-custom-runtime-adapter': 'Future',
    'deployments-screen': 'Future',
    'production-deployment-safety': 'Future',
    'devops-deployment-workflow': 'Future',
    'phase-5-deployment-assistant': 'Future',
    'glossary': 'Reference',
    'troubleshooting': 'Reference',
    'security-best-practices': 'Reference'
  };

  const navLinks = document.querySelectorAll(".md-nav__link");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    
    // Extract slug from href
    const parts = href.split("/").filter(Boolean);
    const slug = parts[parts.length - 1];
    
    if (slug && statusOverrides[slug]) {
      const status = statusOverrides[slug];
      // Check if badge already exists
      if (!link.querySelector(".sidebar-status-badge")) {
        const badge = document.createElement("span");
        badge.className = \`sidebar-status-badge status-sidebar-\${status.toLowerCase()}\`;
        badge.innerHTML = status;
        link.appendChild(badge);
      }
    }
  });
});`;
const extraJsPath = path.join(DOCS_DIR, 'javascripts/extra.js');
ensureDirectoryExistence(extraJsPath);
fs.writeFileSync(extraJsPath, extraJsContent, 'utf-8');

// Write logo asset matching tile-dark.svg
console.log('Writing logo asset...');
const logoPath = path.join(DOCS_DIR, 'assets/logo.svg');
ensureDirectoryExistence(logoPath);
fs.writeFileSync(logoPath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="21" fill="#0B0F14"></rect><g fill="none" stroke="#FFFFFF" stroke-linecap="round" transform="translate(20.16 20.16) scale(2.32)"><path d="M12 2.4 L12 21.6" stroke-width="2.4"></path><path d="M4.6 4.4 C4.6 10.2 12 9.4 12 15.2" stroke-width="2.2"></path><path d="M19.4 4.4 C19.4 10.2 12 9.4 12 15.2" stroke-width="2.2"></path></g></svg>`, 'utf-8');

// Write mkdocs.yml
console.log('Creating mkdocs.yml...');
const mkdocsConfig = `site_name: Trey Documentation
site_description: Local-first AI engineering operations cockpit.
theme:
  name: material
  logo: assets/logo.svg
  favicon: assets/logo.svg
  font:
    text: Inter
    code: JetBrains Mono
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: slate
      accent: cyan
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: slate
      accent: cyan
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.sections
    - navigation.expand
    - navigation.top
    - search.suggest
    - search.highlight
    - content.code.copy

extra_css:
  - stylesheets/extra.css

extra_javascript:
  - javascripts/extra.js

markdown_extensions:
  - admonition
  - md_in_html
  - pymdownx.details
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.inlinehilite
  - pymdownx.snippets
`;
fs.writeFileSync(path.join(ROOT_DIR, 'mkdocs.yml'), mkdocsConfig, 'utf-8');

// Write workflow action
console.log('Writing GitHub Action workflow...');
const workflowPath = path.join(ROOT_DIR, '.github/workflows/deploy.yml');
ensureDirectoryExistence(workflowPath);
fs.writeFileSync(workflowPath, `name: Deploy Docs
on:
  push:
    branches:
      - main
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: echo "cache_id=\$(date -u +'%Y-%m-%d %H:%M:%S')" >> \$GITHUB_ENV
      - uses: actions/cache@v4
        with:
          key: \${{ github.ref }}-mkdocs-\${{ env.cache_id }}
          path: .cache
          restore-keys: |
            \${{ github.ref }}-mkdocs-
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
`, 'utf-8');

// Write README
console.log('Writing README...');
fs.writeFileSync(path.join(ROOT_DIR, 'README.md'), `# Trey Documentation Website

Premium documentation website for Trey built with MkDocs Material and styled to match apple.github.io and the Trey Console.

## Setup & Local Development
1. Install dependencies:
   \`\`\`bash
   pip install mkdocs-material
   \`\`\`
2. Compile and bootstrap docs:
   \`\`\`bash
   node bootstrap-docs.js
   \`\`\`
3. Run the development server locally:
   \`\`\`bash
   mkdocs serve
   \`\`\`
`, 'utf-8');

console.log('Bootstrapping completed successfully!');
