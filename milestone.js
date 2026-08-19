(() => {
  "use strict";

  const MILESTONE_SIZE = 7;
  const TARGET = 28;
  const MILESTONES = [7, 14, 21, 28];

  function getCount() {
    const count = document.getElementById("count");
    return count ? Number.parseInt(count.textContent, 10) || 0 : 0;
  }

  function ensurePanel() {
    let panel = document.getElementById("milestonePanel");
    if (panel) return panel;

    const progressBar = document.querySelector(".progressbar");
    if (!progressBar) return null;

    panel = document.createElement("div");
    panel.id = "milestonePanel";
    panel.style.display = "grid";
    panel.style.gridTemplateColumns = "repeat(4, 1fr)";
    panel.style.gap = "6px";
    panel.style.marginTop = "10px";

    MILESTONES.forEach((milestone) => {
      const item = document.createElement("div");
      item.dataset.milestone = String(milestone);
      item.style.padding = "7px 4px";
      item.style.border = "1px solid #d1d9e6";
      item.style.borderRadius = "6px";
      item.style.textAlign = "center";
      item.style.fontSize = ".75rem";
      item.style.fontWeight = "800";
      item.style.color = "#64748b";
      item.style.background = "#f8fafc";
      item.textContent = milestone;
      panel.appendChild(item);
    });

    progressBar.insertAdjacentElement("afterend", panel);
    return panel;
  }

  function update() {
    const panel = ensurePanel();
    if (!panel) return;

    const count = getCount();
    const currentMilestone = Math.min(
      Math.floor(count / MILESTONE_SIZE),
      MILESTONES.length
    );

    panel.querySelectorAll("[data-milestone]").forEach((item, index) => {
      const milestone = Number(item.dataset.milestone);
      const complete = count >= milestone;
      const active = !complete && index === currentMilestone;

      item.style.background = complete ? "#ffc107" : active ? "#e2e8f0" : "#f8fafc";
      item.style.color = complete ? "#000" : active ? "#001f54" : "#64748b";
      item.style.borderColor = complete ? "#ffc107" : active ? "#002b6d" : "#d1d9e6";
      item.textContent = complete ? "✓ " + milestone : String(milestone);
    });

    panel.setAttribute(
      "aria-label",
      count >= TARGET
        ? "All milestones complete"
        : "Milestone " + (Math.floor(count / MILESTONE_SIZE) + 1) + " in progress"
    );
  }

  function start() {
    const count = document.getElementById("count");
    if (!count) {
      requestAnimationFrame(start);
      return;
    }

    update();

    new MutationObserver(update).observe(count, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
