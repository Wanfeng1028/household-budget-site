// Store: loads the seed data, keeps the household's edits, and computes totals.
// Edits are saved to localStorage when available; if storage is blocked the
// site keeps working in memory for the session.

const STORE_KEY = "hart-budget-v1";

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && parsed.budgets && Array.isArray(parsed.goals)) {
        return parsed;
      }
    }
  } catch (e) {
    // Storage unavailable (private mode, blocked cookies, etc.) — fall through
    // to the in-memory seed. The site still works for the session.
  }
  return deepCopy({
    transactions: SEED.transactions,
    budgets: SEED.budgets,
    goals: SEED.goals
  });
}

let state = loadState();
let storageOK = true;

function saveState() {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
    storageOK = true;
  } catch (e) {
    storageOK = false;
  }
}

function resetState() {
  state = deepCopy({
    transactions: SEED.transactions,
    budgets: SEED.budgets,
    goals: SEED.goals
  });
  saveState();
}

function categoryById(id) {
  return SEED.categories.find(function (c) { return c.id === id; }) || null;
}

function monthOf(dateStr) {
  return dateStr.slice(0, 7);
}

function transactionsForMonth(month) {
  return state.transactions
    .filter(function (t) { return monthOf(t.date) === month; })
    .sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.id < b.id ? 1 : -1;
    });
}

function monthTotals(month) {
  let income = 0;
  let spent = 0;
  state.transactions.forEach(function (t) {
    if (monthOf(t.date) !== month) return;
    if (t.type === "income") income += t.amount;
    else spent += t.amount;
  });
  return { income: income, spent: spent, saved: income - spent };
}

function monthlySeries() {
  return SEED.months.map(function (m) {
    const t = monthTotals(m);
    return { month: m, income: t.income, spent: t.spent };
  });
}

function categoryTotals(month) {
  const totals = {};
  SEED.categories.forEach(function (c) { totals[c.id] = 0; });
  state.transactions.forEach(function (t) {
    if (t.type !== "expense") return;
    if (monthOf(t.date) !== month) return;
    if (totals[t.category] === undefined) totals[t.category] = 0;
    totals[t.category] += t.amount;
  });
  return totals;
}

function budgetTotal() {
  let total = 0;
  Object.keys(state.budgets).forEach(function (k) { total += state.budgets[k]; });
  return total;
}

function nextId(prefix) {
  let n = 1;
  const ids = {};
  state.transactions.forEach(function (t) { ids[t.id] = true; });
  while (ids[prefix + String(n).padStart(2, "0")]) n++;
  return prefix + String(n).padStart(2, "0");
}

function addTransaction(tx) {
  const item = {
    id: nextId("t"),
    date: tx.date,
    desc: tx.desc,
    category: tx.category,
    amount: Math.round(tx.amount * 100) / 100,
    type: tx.type
  };
  state.transactions.push(item);
  saveState();
  return item;
}

function updateTransaction(id, patch) {
  const item = state.transactions.find(function (t) { return t.id === id; });
  if (!item) return null;
  if (patch.date !== undefined) item.date = patch.date;
  if (patch.desc !== undefined) item.desc = patch.desc;
  if (patch.category !== undefined) item.category = patch.category;
  if (patch.amount !== undefined) item.amount = Math.round(patch.amount * 100) / 100;
  if (patch.type !== undefined) item.type = patch.type;
  saveState();
  return item;
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(function (t) { return t.id !== id; });
  saveState();
}

function setBudget(categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, Math.round(amount * 100) / 100);
  saveState();
}

function contributeToGoal(goalId, amount) {
  const goal = state.goals.find(function (g) { return g.id === goalId; });
  if (!goal) return null;
  goal.saved = Math.min(goal.target, Math.round((goal.saved + amount) * 100) / 100);
  saveState();
  return goal;
}

function addGoal(name, target, note) {
  const goal = {
    id: "g" + Date.now().toString(36),
    name: name,
    note: note || "",
    saved: 0,
    target: Math.max(1, Math.round(target * 100) / 100)
  };
  state.goals.push(goal);
  saveState();
  return goal;
}

function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function money0(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function shortMonth(month) {
  const labels = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };
  return labels[month.slice(5, 7)] + " " + month.slice(0, 4);
}
