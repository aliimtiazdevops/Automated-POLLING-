
const KEY = "officePolls_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

function toRow(item, idx){
  const d = new Date(item.ts);
  return `<tr>
    <td>${idx+1}</td>
    <td>${escapeHtml(item.problem)}</td>
    <td>${escapeHtml(item.severity)}</td>
    <td>${escapeHtml(item.location || "")}</td>
    <td>${escapeHtml(item.details || "")}</td>
    <td>${d.toLocaleString()}</td>
  </tr>`;
}

function escapeHtml(str){
  return (str ?? "").toString().replace(/[&<>"']/g, s => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[s]));
}

function render(){
  const data = load();
  // Stats
  const total = data.length;
  const byProblem = {};
  const bySeverity = {Low:0,Medium:0,High:0,Critical:0};
  for(const r of data){
    byProblem[r.problem] = (byProblem[r.problem]||0)+1;
    bySeverity[r.severity] = (bySeverity[r.severity]||0)+1;
  }
  const stats = document.getElementById("stats");
  if(total === 0){
    stats.innerHTML = `<p class="empty">No votes yet. Be the first to submit!</p>`;
  } else {
    const top = Object.entries(byProblem).sort((a,b)=>b[1]-a[1]).slice(0,4);
    stats.innerHTML = `
      <div class="stat"><div class="k">${total}</div><div>Total Votes</div></div>
      ${top.map(([k,v])=>`<div class="stat"><div class="k">${v}</div><div>${escapeHtml(k)}</div></div>`).join("")}
      <div class="stat"><div class="k">${bySeverity.Critical}</div><div>Critical</div></div>
    `;
  }

  // Table
  const wrap = document.getElementById("tableWrap");
  if(total === 0){
    wrap.innerHTML = `<div class="empty">Your submissions will appear here.</div>`;
    return;
  }
  const head = `<thead><tr>
    <th>#</th><th>Problem</th><th>Severity</th><th>Location/Team</th><th>Note</th><th>Time</th>
  </tr></thead>`;
  const body = `<tbody>${data.map(toRow).join("")}</tbody>`;
  wrap.innerHTML = `<table>${head}${body}</table>`;
}

function exportCsv(){
  const data = load();
  if(data.length === 0){ alert("No data to export."); return; }
  const headers = ["Problem","Severity","Location","Note","Timestamp"];
  const rows = data.map(r=>[r.problem,r.severity,r.location||"",r.details||"",new Date(r.ts).toISOString()]);
  const csv = [headers, ...rows].map(r=>r.map(cell=>{
    const s = (cell ?? "").toString();
    return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  }).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "office-polls.csv";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("pollForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const problem = document.getElementById("problem").value;
  const sevEl = document.querySelector('input[name="sev"]:checked');
  const severity = sevEl ? sevEl.value : "";
  const location = document.getElementById("location").value.trim();
  const details = document.getElementById("details").value.trim();
  if(!problem || !severity){ alert("Please choose a problem and severity."); return; }
  const data = load();
  data.push({ problem, severity, location, details, ts: Date.now() });
  save(data);
  e.target.reset();
  render();
});

document.getElementById("exportCsv").addEventListener("click", exportCsv);
document.getElementById("clearAll").addEventListener("click", ()=>{
  if(confirm("Clear all saved votes from this browser?")){
    localStorage.removeItem(KEY);
    render();
  }
});

render();
