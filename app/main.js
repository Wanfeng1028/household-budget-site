// Main: wires the header month switcher and the hash router, then renders.

function init() {
  const prev = document.getElementById("month-prev");
  const next = document.getElementById("month-next");
  if (prev) prev.addEventListener("click", function () {
    setMonth(SEED.months[monthIndex(currentMonth) - 1]);
  });
  if (next) next.addEventListener("click", function () {
    setMonth(SEED.months[monthIndex(currentMonth) + 1]);
  });
  window.addEventListener("hashchange", renderRoute);
  renderMonthLabel();
  renderRoute();
}

document.addEventListener("DOMContentLoaded", init);
