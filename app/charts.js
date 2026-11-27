// Charts: plain canvas drawings, no libraries, no network.
// drawDonut renders a spending-by-category ring; drawBars renders grouped
// monthly income-vs-spending bars. Both scale for high-DPI screens.

function setupCanvas(canvas, cssWidth, cssHeight) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function drawDonut(canvas, entries) {
  // entries: [{ label, value, color }] with value > 0, already sorted desc.
  const size = 220;
  const ctx = setupCanvas(canvas, size, size);
  ctx.clearRect(0, 0, size, size);
  const total = entries.reduce(function (s, e) { return s + e.value; }, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outer = 104;
  const inner = 68;
  if (!total) {
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.arc(cx, cy, inner, Math.PI * 2, 0, true);
    ctx.fillStyle = "#e8e2d6";
    ctx.fill();
    return;
  }
  let angle = -Math.PI / 2;
  entries.forEach(function (e) {
    const sweep = (e.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.arc(cx, cy, inner, angle + sweep, angle, true);
    ctx.closePath();
    ctx.fillStyle = e.color;
    ctx.fill();
    angle += sweep;
  });
  // Center label: total spent.
  ctx.fillStyle = "#22301f";
  ctx.font = "700 22px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(money0(total), cx, cy - 8);
  ctx.fillStyle = "#6b7280";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillText("spent this month", cx, cy + 14);
}

function drawBars(canvas, labels, income, spent) {
  // Grouped vertical bars: income (green) beside spending (terracotta).
  const width = 640;
  const height = 260;
  const ctx = setupCanvas(canvas, width, height);
  ctx.clearRect(0, 0, width, height);
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const plotW = width - padL - 16;
  const plotH = height - padT - padB;
  const maxV = Math.max.apply(null, income.concat(spent).concat([1000]));
  const top = Math.ceil(maxV / 2000) * 2000;
  // Gridlines + y labels.
  ctx.strokeStyle = "#e5e0d3";
  ctx.fillStyle = "#6b7280";
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let g = 0; g <= 4; g++) {
    const y = padT + (plotH * g) / 4;
    const v = top - (top * g) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - 16, y);
    ctx.stroke();
    ctx.fillText("$" + Math.round(v).toLocaleString("en-US"), padL - 8, y);
  }
  const groupW = plotW / labels.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  labels.forEach(function (label, i) {
    const gx = padL + i * groupW + groupW / 2;
    const ih = (income[i] / top) * plotH;
    const sh = (spent[i] / top) * plotH;
    ctx.fillStyle = "#205c40";
    ctx.fillRect(gx - barW - 2, padT + plotH - ih, barW, ih);
    ctx.fillStyle = "#c96f4a";
    ctx.fillRect(gx + 2, padT + plotH - sh, barW, sh);
    ctx.fillStyle = "#374151";
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, gx, padT + plotH + 8);
  });
}
