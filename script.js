let timeChart, cycloChart;
let clicked = document.querySelector(".analyze-btn");
clicked.addEventListener('click', ()=>{
  analyze();
});

function analyze() {
  let code = document.getElementById("codeInput").value;
  if (!code.trim()) return;

  code = sanitize(code);

  const loopDepth = maxLoopDepth(code);
  const cyclo = cyclomatic(code);
  const timeText = estimateTime(loopDepth);
  const spaceText = estimateSpace(code);

  document.getElementById("timeText").innerText = timeText;
  document.getElementById("spaceText").innerText = spaceText;
  document.getElementById("cycloText").innerText = cyclo;

  drawTimeChart(loopDepth);
  drawCycloChart(cyclo);
}

function sanitize(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/(["']).*?\1/g, "");
}

/* ===== LOGIC (UNCHANGED) ===== */

function maxLoopDepth(code) {
  let depth = 0, max = 0;
  code.split("\n").forEach(line => {
    if (/\b(for|while)\b/.test(line)) {
      depth++;
      max = Math.max(max, depth);
    }
    if (line.includes("}")) depth = Math.max(0, depth - 1);
  });
  return max;
}

function cyclomatic(code) {
  const matches = code.match(/\b(if|for|while|case|catch)\b|&&|\|\|/g);
  return (matches ? matches.length : 0) + 1;
}

function estimateTime(depth) {
  if (depth === 0) return "O(1)";
  if (depth === 1) return "O(n)";
  if (depth === 2) return "O(n²)";
  return "O(n³)";
}

function estimateSpace(code) {
  return /\bnew\b|\[\]/.test(code) ? "O(n)" : "O(1)";
}

/* ===== GRAPHS ===== */

function drawTimeChart(depth) {
  const data = [0, 0, 0, 0];
  if (depth <= 3) data[depth] = 1;
  else data[3] = 1;

  if (timeChart) timeChart.destroy();

  timeChart = new Chart(document.getElementById("timeChart"), {
    type: "bar",
    data: {
      labels: ["O(1)", "O(n)", "O(n²)", "O(n³)"],
      datasets: [{
        data: data
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

function drawCycloChart(cyclo) {
  if (cycloChart) cycloChart.destroy();

  cycloChart = new Chart(document.getElementById("cycloChart"), {
    type: "bar",
    data: {
      labels: ["Cyclomatic Complexity"],
      datasets: [{
        data: [cyclo]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
