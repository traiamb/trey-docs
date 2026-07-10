document.addEventListener("DOMContentLoaded", function() {
  // Parse blockquotes into custom callouts
  const blockquotes = document.querySelectorAll("blockquote");
  blockquotes.forEach(bq => {
    const firstP = bq.querySelector("p");
    if (!firstP) return;
    const text = firstP.innerHTML;
    const match = text.match(/^\[!(NOTE|IMPORTANT|WARNING|CAUTION|TIP|SAFETY)\]\s*(<br>|\n)?/i);
    if (match) {
      const type = match[1].toLowerCase();
      
      // Remove prefix
      firstP.innerHTML = text.replace(/^\[!(NOTE|IMPORTANT|WARNING|CAUTION|TIP|SAFETY)\]\s*(<br>|\n)?/i, "");
      
      // Add styling classes
      bq.classList.add("custom-callout", `callout-${type}`);
      
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
        firstP.innerHTML = firstP.innerHTML.trim().replace(/^\s*[-:]\s*/, "");
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
        badge.className = `sidebar-status-badge status-sidebar-${status.toLowerCase()}`;
        badge.innerHTML = status;
        link.appendChild(badge);
      }
    }
  });
});