document.addEventListener("DOMContentLoaded", function() {
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
});