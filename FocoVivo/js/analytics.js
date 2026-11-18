// Cálculos locales e ilustrativos de impacto.
window.FocoAnalytics = {
  impact(hours) {
    const annualDays = hours * 365 / 24;
    const words = hours * 60 * 250;
    const pages = words / 300;
    // Referencia ilustrativa de oportunidad de descanso, no sueño perdido real.
    const sleepOpportunity = Math.max(0, Math.min(8, hours - 2));
    return { annualDays, pages, sleepOpportunity };
  },
  heatmap() {
    const root = document.getElementById("heatmap");
    if (!root) return;
    const rows = ["08h","11h","14h","17h","20h","23h"];
    const values = [[1,1,2,1,1,1],[1,2,1,2,1,1],[1,1,2,2,1,1],[1,2,2,3,2,1],[2,2,3,4,3,2],[1,2,3,4,4,3]];
    root.innerHTML = "";
    root.appendChild(document.createElement("span"));
    ["L","M","X","J","V","S"].forEach(d => { const s=document.createElement("span");s.className="heat-time";s.textContent=d;root.appendChild(s); });
    rows.forEach((r,i) => {
      const t=document.createElement("span");t.className="heat-time";t.textContent=r;root.appendChild(t);
      values[i].forEach(v => { const c=document.createElement("span");c.className="heat-cell";c.dataset.v=v;c.title=`Intensidad ${v}/4`;root.appendChild(c); });
    });
  }
};
