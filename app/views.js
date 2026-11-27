// Views: renders each page of the budget site and wires up its controls.
// Every control on every page works: adding, editing and deleting
// transactions, filtering, month switching, budget edits, goal contributions.

let currentMonth = SEED.currentMonth;
let txFilter = { category: "all", type: "all", query: "" };
let editingId = null;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function monthIndex(month) {
  return SEED.months.indexOf(month);
}

function setMonth(month) {
  if (SEED.months.indexOf(month) !== -1) {
    currentMonth = month;
    renderMonthLabel();
    renderRoute();
  }
}

function renderMonthLabel() {
  const label = document.getElementById("month-label");
  if (label) label.textContent = SEED.monthLabels[currentMonth];
  const prev = document.getElementById("month-prev");
  const next = document.getElementById("month-next");
  if (prev) prev.disabled = monthIndex(currentMonth) <= 0;
  if (next) next.disabled = monthIndex(currentMonth) >= SEED.months.length - 1;
}

function progressClass(ratio) {
  if (ratio > 1) return "bar-over";
  if (ratio >= 0.8) return "bar-warn";
  return "bar-ok";
}

function categoryChip(catId) {
  const cat = categoryById(catId);
  if (!cat) return '<span class="chip">Income</span>';
  return '<span class="chip"><span class="dot" style="background:' + cat.color + '"></span>' + esc(cat.name) + "</span>";
}

function txRow(t) {
  const sign = t.type === "income" ? "+" : "−";
  const cls = t.type === "income" ? "amt-in" : "amt-out";
  return '<li class="tx-row">' +
    '<span class="tx-date">' + esc(t.date.slice(5)) + "</span>" +
    '<span class="tx-desc">' + esc(t.desc) + "</span>" +
    categoryChip(t.type === "income" ? "income" : t.category) +
    '<span class="tx-amt ' + cls + '">' + sign + money(t.amount) + "</span>" +
    '<span class="tx-actions">' +
    '<button type="button" data-action="edit-tx" data-id="' + t.id + '">Edit</button>' +
    '<button type="button" data-action="delete-tx" data-id="' + t.id + '">Delete</button>' +
    "</span></li>";
}

function renderDashboard() {
  const totals = monthTotals(currentMonth);
  const cats = categoryTotals(currentMonth);
  const rate = pct(totals.saved, totals.income);
  const entries = SEED.categories
    .map(function (c) { return { label: c.name, value: cats[c.id] || 0, color: c.color }; })
    .filter(function (e) { return e.value > 0; })
    .sort(function (a, b) { return b.value - a.value; });
  const recent = transactionsForMonth(currentMonth).slice(0, 6);
  const budgetRows = SEED.categories
    .map(function (c) { return { cat: c, spent: cats[c.id] || 0, limit: state.budgets[c.id] || 0 }; })
    .filter(function (r) { return r.limit > 0; })
    .sort(function (a, b) { return (b.spent / b.limit) - (a.spent / a.limit); })
    .slice(0, 4);
  const goals = state.goals.slice(0, 2);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  let html = '<section class="hero"><h1>' + greeting + ', Hart family.</h1>' +
    '<p>November is on track: you have spent ' + money(totals.spent) + ' of ' + money(totals.income) +
    ' earned, and ' + money(totals.saved) + ' is set aside. ' + rate + '% of income saved so far.</p>' +
    '<a class="btn-primary" href="#/transactions">Add a transaction</a></section>';

  html += '<section class="stats">' +
    statCard("Income", money(totals.income), "Paychecks and freelance") +
    statCard("Spent", money(totals.spent), "All categories combined") +
    statCard("Saved", money(totals.saved), rate + "% of income") +
    statCard("Budget left", money(Math.max(0, budgetTotal() - totals.spent)), "Of " + money(budgetTotal()) + " planned") +
    "</section>";

  html += '<section class="grid-2">' +
    '<div class="card"><h2>Where November&rsquo;s money went</h2>' +
    '<div class="donut-wrap"><canvas id="donut" width="220" height="220" role="img" aria-label="Donut chart of spending by category"></canvas>' +
    '<ul class="legend">' + entries.map(function (e) {
      return '<li><span class="dot" style="background:' + e.color + '"></span>' + esc(e.label) +
        '<span class="legend-amt">' + money(e.value) + ' · ' + pct(e.value, totals.spent) + "%</span></li>";
    }).join("") + "</ul></div></div>" +

    '<div class="card"><h2>Budgets to watch</h2>' + budgetRows.map(function (r) {
      const ratio = r.limit ? r.spent / r.limit : 0;
      return '<div class="budget-line"><div class="budget-head"><span>' + esc(r.cat.name) + "</span><span>" +
        money(r.spent) + " of " + money(r.limit) + "</span></div>" +
        '<div class="bar"><span class="' + progressClass(ratio) + '" style="width:' + Math.min(100, Math.round(ratio * 100)) + '%"></span></div></div>';
    }).join("") + '<p class="card-link"><a href="#/budgets">See all budgets &rarr;</a></p></div></section>';

  html += '<section class="grid-2">' +
    '<div class="card"><h2>Recent transactions</h2><ul class="tx-list">' +
    recent.map(txRow).join("") +
    '</ul><p class="card-link"><a href="#/transactions">See all transactions &rarr;</a></p></div>' +

    '<div class="card"><h2>Savings goals</h2>' + goals.map(function (g) {
      const ratio = g.saved / g.target;
      return '<div class="goal-mini"><div class="budget-head"><span>' + esc(g.name) + "</span><span>" +
        money(g.saved) + " of " + money(g.target) + "</span></div>" +
        '<div class="bar"><span class="bar-ok" style="width:' + Math.round(ratio * 100) + '%"></span></div>' +
        '<p class="muted">' + Math.round(ratio * 100) + "% there — " + money(g.target - g.saved) + " to go.</p></div>";
    }).join("") + '<p class="card-link"><a href="#/goals">See all goals &rarr;</a></p></div></section>';

  return html;
}

function statCard(label, value, note) {
  return '<div class="stat"><span class="stat-label">' + label + '</span><span class="stat-value">' + value +
    '</span><span class="stat-note">' + note + "</span></div>";
}

function renderTransactions() {
  const monthTx = transactionsForMonth(currentMonth);
  const filtered = monthTx.filter(function (t) {
    if (txFilter.category !== "all" && t.category !== txFilter.category && !(txFilter.category === "income" && t.type === "income")) return false;
    if (txFilter.type !== "all" && t.type !== txFilter.type) return false;
    if (txFilter.query && t.desc.toLowerCase().indexOf(txFilter.query.toLowerCase()) === -1) return false;
    return true;
  });
  const editing = editingId ? state.transactions.find(function (t) { return t.id === editingId; }) : null;

  let html = '<section class="card"><h1>Transactions</h1>' +
    '<p class="muted">' + filtered.length + " of " + monthTx.length + " transactions in " + esc(SEED.monthLabels[currentMonth]) + ".</p>";

  html += '<form id="tx-form" class="tx-form"><h2>' + (editing ? "Edit transaction" : "Add a transaction") + "</h2>" +
    '<label>Date<input type="date" id="f-date" value="' + (editing ? editing.date : currentMonth + "-27") + '" required></label>' +
    '<label>Description<input type="text" id="f-desc" maxlength="80" placeholder="e.g. Whole Foods Market" value="' + (editing ? esc(editing.desc) : "") + '" required></label>' +
    '<label>Category<select id="f-category">' +
    '<option value="income"' + (editing && editing.type === "income" ? " selected" : "") + '>Income</option>' +
    SEED.categories.map(function (c) {
      return '<option value="' + c.id + '"' + (editing && editing.category === c.id ? " selected" : "") + ">" + esc(c.name) + "</option>";
    }).join("") + "</select></label>" +
    '<label>Type<select id="f-type">' +
    '<option value="expense"' + (!editing || editing.type === "expense" ? " selected" : "") + '>Expense</option>' +
    '<option value="income"' + (editing && editing.type === "income" ? " selected" : "") + '>Income</option>' +
    "</select></label>" +
    '<label>Amount<input type="number" id="f-amount" min="0.01" step="0.01" placeholder="0.00" value="' + (editing ? editing.amount : "") + '" required></label>' +
    '<div class="form-actions"><button type="submit" class="btn-primary">' + (editing ? "Save changes" : "Add transaction") + "</button>" +
    (editing ? '<button type="button" class="btn-ghost" data-action="cancel-edit">Cancel</button>' : "") +
    '</div><p class="form-msg" id="form-msg" role="status"></p></form>';

  html += '<div class="filters">' +
    '<label>Category <select id="filter-category"><option value="all">All categories</option>' +
    '<option value="income">Income</option>' +
    SEED.categories.map(function (c) {
      return '<option value="' + c.id + '"' + (txFilter.category === c.id ? " selected" : "") + ">" + esc(c.name) + "</option>";
    }).join("") + "</select></label>" +
    '<label>Type <select id="filter-type">' +
    '<option value="all"' + (txFilter.type === "all" ? " selected" : "") + '>All</option>' +
    '<option value="income"' + (txFilter.type === "income" ? " selected" : "") + '>Income</option>' +
    '<option value="expense"' + (txFilter.type === "expense" ? " selected" : "") + '>Expense</option>' +
    "</select></label>" +
    '<label>Search <input type="search" id="filter-query" placeholder="Search descriptions" value="' + esc(txFilter.query) + '"></label>' +
    "</div>";

  html += '<ul class="tx-list">' + (filtered.length ? filtered.map(txRow).join("") : '<li class="empty">No transactions match these filters.</li>') + "</ul>";
  html += '<p class="muted reset-line"><button type="button" class="btn-ghost" data-action="reset-data">Reset to sample data</button> <span>Restores the original November sample.</span></p></section>';
  return html;
}

function renderBudgets() {
  const totals = monthTotals(currentMonth);
  const cats = categoryTotals(currentMonth);
  const rows = SEED.categories.map(function (c) {
    return { cat: c, spent: cats[c.id] || 0, limit: state.budgets[c.id] || 0 };
  });
  let html = '<section class="card"><h1>Budgets — ' + esc(SEED.monthLabels[currentMonth]) + "</h1>" +
    '<p class="muted">Planned ' + money(budgetTotal()) + " · spent " + money(totals.spent) + " · " +
    money(Math.max(0, budgetTotal() - totals.spent)) + " left across all categories.</p>" +
    '<div class="budget-grid">';
  rows.forEach(function (r) {
    const ratio = r.limit ? r.spent / r.limit : 0;
    const left = r.limit - r.spent;
    const status = left < 0 ? '<span class="over">Over by ' + money(-left) + "</span>"
      : '<span class="left">' + money(left) + " left</span>";
    html += '<div class="budget-card" data-cat="' + r.cat.id + '">' +
      '<div class="budget-head"><span><span class="dot" style="background:' + r.cat.color + '"></span>' + esc(r.cat.name) + "</span>" + status + "</div>" +
      '<div class="bar"><span class="' + progressClass(ratio) + '" style="width:' + Math.min(100, Math.round(ratio * 100)) + '%"></span></div>' +
      '<p class="muted">' + money(r.spent) + " of " + money(r.limit) + " · " + Math.round(ratio * 100) + "% used</p>" +
      '<p class="budget-edit"><label>Monthly limit $<input type="number" min="0" step="1" value="' + r.limit + '" data-budget-input="' + r.cat.id + '"></label>' +
      '<button type="button" class="btn-ghost" data-action="save-budget" data-id="' + r.cat.id + '">Save</button></p>' +
      "</div>";
  });
  html += "</div></section>";
  return html;
}

function renderGoals() {
  let html = '<section class="card"><h1>Savings goals</h1>' +
    '<p class="muted">Small, steady contributions add up. Tap a button to add money to a goal — it comes out of this month&rsquo;s saved amount.</p><div class="goal-grid">';
  state.goals.forEach(function (g) {
    const ratio = g.saved / g.target;
    const done = g.saved >= g.target;
    html += '<div class="goal-card"><h2>' + esc(g.name) + "</h2>" +
      '<p class="muted">' + esc(g.note) + "</p>" +
      '<div class="bar"><span class="bar-ok" style="width:' + Math.round(ratio * 100) + '%"></span></div>' +
      '<p><strong>' + money(g.saved) + "</strong> of " + money(g.target) + " · " + Math.round(ratio * 100) + "%</p>" +
      (done ? '<p class="done">Goal reached — well done.</p>'
        : '<div class="contribute"><span>Contribute:</span>' +
        '<button type="button" data-action="contribute" data-id="' + g.id + '" data-amount="25">$25</button>' +
        '<button type="button" data-action="contribute" data-id="' + g.id + '" data-amount="50">$50</button>' +
        '<button type="button" data-action="contribute" data-id="' + g.id + '" data-amount="100">$100</button>' +
        '<label>$<input type="number" min="1" step="1" placeholder="Other" data-custom-goal="' + g.id + '"></label>' +
        '<button type="button" class="btn-ghost" data-action="contribute-custom" data-id="' + g.id + '">Add</button></div>') +
      "</div>";
  });
  html += "</div>";
  html += '<form id="goal-form" class="tx-form"><h2>Start a new goal</h2>' +
    '<label>Name<input type="text" id="g-name" maxlength="60" placeholder="e.g. Holiday gifts" required></label>' +
    '<label>Target amount $<input type="number" id="g-target" min="1" step="1" placeholder="1000" required></label>' +
    '<label>Note<input type="text" id="g-note" maxlength="120" placeholder="What is it for? (optional)"></label>' +
    '<div class="form-actions"><button type="submit" class="btn-primary">Add goal</button></div>' +
    '<p class="form-msg" id="goal-msg" role="status"></p></form></section>';
  return html;
}

function renderReports() {
  const series = monthlySeries();
  const labels = series.map(function (t) { return shortMonth(t.month).slice(0, 3); });
  const income = series.map(function (t) { return t.income; });
  const spent = series.map(function (t) { return t.spent; });
  const rates = series.map(function (t) { return (t.income - t.spent) / t.income; });
  const avgRate = rates.reduce(function (s, r) { return s + r; }, 0) / rates.length;
  const totals = monthTotals(currentMonth);
  const cats = categoryTotals(currentMonth);
  const top = SEED.categories
    .map(function (c) { return { cat: c, spent: cats[c.id] || 0 }; })
    .sort(function (a, b) { return b.spent - a.spent; })[0];
  const biggest = transactionsForMonth(currentMonth)
    .filter(function (t) { return t.type === "expense"; })
    .sort(function (a, b) { return b.amount - a.amount; })[0];
  const novRate = totals.income ? (totals.saved / totals.income) : 0;

  let html = '<section class="card"><h1>Reports — six months</h1>' +
    '<p class="muted">Income against spending, June to November 2026.</p>' +
    '<canvas id="bars" width="640" height="260" role="img" aria-label="Bar chart of income versus spending by month"></canvas>' +
    '<p class="legend-inline"><span class="dot" style="background:#205c40"></span> Income &nbsp; <span class="dot" style="background:#c96f4a"></span> Spending</p>' +
    '<table class="report-table"><thead><tr><th>Month</th><th>Income</th><th>Spent</th><th>Saved</th><th>Savings rate</th></tr></thead><tbody>' +
    series.map(function (t) {
      const saved = t.income - t.spent;
      return "<tr><td>" + esc(SEED.monthLabels[t.month]) + "</td><td>" + money(t.income) + "</td><td>" + money(t.spent) + "</td><td>" + money(saved) + "</td><td>" + Math.round((saved / t.income) * 100) + "%</td></tr>";
    }).join("") + "</tbody></table></section>";

  html += '<section class="card"><h2>What November shows</h2><ul class="insights">' +
    "<li><strong>" + esc(top.cat.name) + "</strong> is the largest cost at " + money(top.spent) + " — " + pct(top.spent, totals.spent) + "% of November spending.</li>" +
    "<li>Biggest single expense: <strong>" + esc(biggest.desc) + "</strong> at " + money(biggest.amount) + ".</li>" +
    "<li>November&rsquo;s savings rate is <strong>" + Math.round(novRate * 100) + "%</strong>, against a six-month average of " + Math.round(avgRate * 100) + "%.</li>" +
    "<li>Groceries ran " + money(cats.groceries) + " of an " + money(state.budgets.groceries) + " budget — " + money(Math.max(0, state.budgets.groceries - cats.groceries)) + " left.</li>" +
    "</ul></section>";
  return html;
}

function renderRoute() {
  const hash = window.location.hash || "#/dashboard";
  const view = document.getElementById("view");
  document.querySelectorAll(".nav-link").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === hash);
    if (hash === "" || hash === "#") a.classList.toggle("active", a.getAttribute("href") === "#/dashboard");
  });
  let html = "";
  if (hash === "#/transactions") html = renderTransactions();
  else if (hash === "#/budgets") html = renderBudgets();
  else if (hash === "#/goals") html = renderGoals();
  else if (hash === "#/reports") html = renderReports();
  else html = renderDashboard();
  view.innerHTML = html;
  afterRender(hash);
  window.scrollTo(0, 0);
}

function afterRender(hash) {
  const donut = document.getElementById("donut");
  if (donut) {
    const totals = monthTotals(currentMonth);
    const cats = categoryTotals(currentMonth);
    const entries = SEED.categories
      .map(function (c) { return { label: c.name, value: cats[c.id] || 0, color: c.color }; })
      .filter(function (e) { return e.value > 0; })
      .sort(function (a, b) { return b.value - a.value; });
    drawDonut(donut, entries);
  }
  const bars = document.getElementById("bars");
  if (bars) {
    const series = monthlySeries();
    drawBars(
      bars,
      series.map(function (t) { return shortMonth(t.month).slice(0, 3); }),
      series.map(function (t) { return t.income; }),
      series.map(function (t) { return t.spent; })
    );
  }
  bindView();
}

function bindView() {
  const form = document.getElementById("tx-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const msg = document.getElementById("form-msg");
      const date = document.getElementById("f-date").value;
      const desc = document.getElementById("f-desc").value.trim();
      const category = document.getElementById("f-category").value;
      const type = document.getElementById("f-type").value;
      const amount = parseFloat(document.getElementById("f-amount").value);
      if (!date || !desc || !amount || amount <= 0) {
        msg.textContent = "Please fill in every field with a valid amount.";
        return;
      }
      if (editingId) {
        updateTransaction(editingId, { date: date, desc: desc, category: type === "income" ? "income" : category, amount: amount, type: type });
        msg.textContent = "Transaction updated.";
        editingId = null;
      } else {
        addTransaction({ date: date, desc: desc, category: type === "income" ? "income" : category, amount: amount, type: type });
        msg.textContent = "Transaction added.";
      }
      renderRoute();
    });
  }
  const goalForm = document.getElementById("goal-form");
  if (goalForm) {
    goalForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const msg = document.getElementById("goal-msg");
      const name = document.getElementById("g-name").value.trim();
      const target = parseFloat(document.getElementById("g-target").value);
      const note = document.getElementById("g-note").value.trim();
      if (!name || !target || target <= 0) {
        msg.textContent = "Please give the goal a name and a target over $0.";
        return;
      }
      addGoal(name, target, note);
      msg.textContent = "Goal added.";
      renderRoute();
    });
  }
  const fc = document.getElementById("filter-category");
  if (fc) fc.addEventListener("change", function () { txFilter.category = fc.value; renderRoute(); });
  const ft = document.getElementById("filter-type");
  if (ft) ft.addEventListener("change", function () { txFilter.type = ft.value; renderRoute(); });
  const fq = document.getElementById("filter-query");
  if (fq) fq.addEventListener("input", function () { txFilter.query = fq.value; renderRoute(); });
}

document.addEventListener("click", function (ev) {
  const el = ev.target.closest("[data-action]");
  if (!el) return;
  const action = el.getAttribute("data-action");
  const id = el.getAttribute("data-id");
  if (action === "edit-tx") {
    editingId = id;
    renderRoute();
    const desc = document.getElementById("f-desc");
    if (desc) desc.focus();
  } else if (action === "delete-tx") {
    const item = state.transactions.find(function (t) { return t.id === id; });
    if (item && window.confirm("Delete \"" + item.desc + "\" (" + money(item.amount) + ")?")) {
      deleteTransaction(id);
      if (editingId === id) editingId = null;
      renderRoute();
    }
  } else if (action === "cancel-edit") {
    editingId = null;
    renderRoute();
  } else if (action === "reset-data") {
    if (window.confirm("Reset all transactions, budgets and goals to the sample data?")) {
      resetState();
      renderRoute();
    }
  } else if (action === "save-budget") {
    const input = document.querySelector('[data-budget-input="' + id + '"]');
    const value = parseFloat(input.value);
    if (!isNaN(value) && value >= 0) {
      setBudget(id, value);
      renderRoute();
    }
  } else if (action === "contribute") {
    contributeToGoal(id, parseFloat(el.getAttribute("data-amount")));
    renderRoute();
  } else if (action === "contribute-custom") {
    const input = document.querySelector('[data-custom-goal="' + id + '"]');
    const value = parseFloat(input.value);
    if (!isNaN(value) && value > 0) {
      contributeToGoal(id, value);
      renderRoute();
    }
  }
});
