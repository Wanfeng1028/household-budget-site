// Seed data for the Hart family budget site.
// Fictional household: Daniel & Maya Hart, Leo (8) and Nora (5), Willow Lane.
// All figures are sample data written for this demo site.

const SEED = {
  household: {
    name: "Hart Family",
    tagline: "Every dollar has a job.",
    members: ["Daniel", "Maya", "Leo", "Nora"],
    home: "Willow Lane"
  },
  currentMonth: "2026-11",
  months: ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"],
  monthLabels: {
    "2026-06": "June 2026",
    "2026-07": "July 2026",
    "2026-08": "August 2026",
    "2026-09": "September 2026",
    "2026-10": "October 2026",
    "2026-11": "November 2026"
  },
  categories: [
    { id: "housing", name: "Housing", color: "#205c40" },
    { id: "groceries", name: "Groceries", color: "#6a994e" },
    { id: "dining", name: "Dining Out", color: "#c96f4a" },
    { id: "transport", name: "Transport", color: "#3e7cb1" },
    { id: "utilities", name: "Utilities", color: "#e9b44c" },
    { id: "health", name: "Health", color: "#bc5a7a" },
    { id: "entertainment", name: "Entertainment", color: "#7c6aae" },
    { id: "shopping", name: "Shopping", color: "#2a9d8f" },
    { id: "kids", name: "Kids", color: "#e07a5f" },
    { id: "subscriptions", name: "Subscriptions", color: "#6c757d" }
  ],
  budgets: {
    housing: 1850,
    groceries: 800,
    dining: 200,
    transport: 240,
    utilities: 360,
    health: 200,
    entertainment: 100,
    shopping: 220,
    kids: 180,
    subscriptions: 30
  },
  goals: [
    { id: "g1", name: "Emergency fund", note: "Six months of essentials, for peace of mind.", saved: 8400, target: 12000 },
    { id: "g2", name: "Family vacation", note: "A week at the coast next summer.", saved: 1950, target: 3500 },
    { id: "g3", name: "New car", note: "Replace the 2013 sedan before winter.", saved: 2300, target: 8000 }
  ],
  transactions: [
    { id: "t01", date: "2026-11-01", desc: "Mortgage — Willow Lane Home Loan", category: "housing", amount: 1850, type: "expense" },
    { id: "t02", date: "2026-11-01", desc: "Salary — Hart Design Studio (Daniel)", category: "income", amount: 4850, type: "income" },
    { id: "t03", date: "2026-11-02", desc: "Whole Foods Market", category: "groceries", amount: 132.40, type: "expense" },
    { id: "t04", date: "2026-11-03", desc: "Shell — Gas", category: "transport", amount: 48.20, type: "expense" },
    { id: "t05", date: "2026-11-04", desc: "City Power & Light — Electric", category: "utilities", amount: 96.75, type: "expense" },
    { id: "t06", date: "2026-11-05", desc: "Netflix", category: "subscriptions", amount: 15.49, type: "expense" },
    { id: "t07", date: "2026-11-06", desc: "Trader Joe's", category: "groceries", amount: 87.60, type: "expense" },
    { id: "t08", date: "2026-11-07", desc: "Olive Garden — Family dinner", category: "dining", amount: 68.40, type: "expense" },
    { id: "t09", date: "2026-11-08", desc: "CVS Pharmacy", category: "health", amount: 42.30, type: "expense" },
    { id: "t10", date: "2026-11-09", desc: "Bus passes (2)", category: "transport", amount: 64.00, type: "expense" },
    { id: "t11", date: "2026-11-10", desc: "Water bill — City Water", category: "utilities", amount: 58.20, type: "expense" },
    { id: "t12", date: "2026-11-11", desc: "Target — Kids' clothes", category: "kids", amount: 74.85, type: "expense" },
    { id: "t13", date: "2026-11-12", desc: "Costco", category: "groceries", amount: 156.30, type: "expense" },
    { id: "t14", date: "2026-11-13", desc: "Freelance — Brightpath Consulting (Maya)", category: "income", amount: 2100, type: "income" },
    { id: "t15", date: "2026-11-13", desc: "Internet — Fiber 100", category: "utilities", amount: 79.99, type: "expense" },
    { id: "t16", date: "2026-11-14", desc: "Chipotle — Lunch", category: "dining", amount: 24.60, type: "expense" },
    { id: "t17", date: "2026-11-15", desc: "AMC — Movie night", category: "entertainment", amount: 38.00, type: "expense" },
    { id: "t18", date: "2026-11-15", desc: "Amazon — School supplies", category: "shopping", amount: 56.40, type: "expense" },
    { id: "t19", date: "2026-11-16", desc: "Shell — Gas", category: "transport", amount: 44.10, type: "expense" },
    { id: "t20", date: "2026-11-17", desc: "Dentist copay", category: "health", amount: 60.00, type: "expense" },
    { id: "t21", date: "2026-11-18", desc: "Whole Foods Market", category: "groceries", amount: 118.75, type: "expense" },
    { id: "t22", date: "2026-11-19", desc: "Spotify", category: "subscriptions", amount: 11.99, type: "expense" },
    { id: "t23", date: "2026-11-20", desc: "Pizza night", category: "dining", amount: 32.50, type: "expense" },
    { id: "t24", date: "2026-11-21", desc: "Target — Household", category: "shopping", amount: 89.20, type: "expense" },
    { id: "t25", date: "2026-11-22", desc: "Gym membership", category: "health", amount: 35.00, type: "expense" },
    { id: "t26", date: "2026-11-23", desc: "Costco — Gas", category: "transport", amount: 52.30, type: "expense" },
    { id: "t27", date: "2026-11-24", desc: "Trader Joe's", category: "groceries", amount: 94.80, type: "expense" },
    { id: "t28", date: "2026-11-24", desc: "Natural gas bill", category: "utilities", amount: 42.50, type: "expense" },
    { id: "t29", date: "2026-11-25", desc: "Thanksgiving groceries", category: "groceries", amount: 148.90, type: "expense" },
    { id: "t30", date: "2026-11-25", desc: "Movie rental", category: "entertainment", amount: 5.99, type: "expense" },
    { id: "t31", date: "2026-11-26", desc: "Coffee shop", category: "dining", amount: 18.75, type: "expense" },
    { id: "t32", date: "2026-11-26", desc: "Amazon — Winter coats", category: "kids", amount: 68.40, type: "expense" },
    { id: "t33", date: "2026-11-26", desc: "Home Depot — Light bulbs", category: "shopping", amount: 27.60, type: "expense" },
    { id: "t34", date: "2026-11-26", desc: "Farmers market", category: "groceries", amount: 36.20, type: "expense" },
    { id: "t35", date: "2026-11-26", desc: "Phone bill", category: "utilities", amount: 65.00, type: "expense" }
  ]
};

// History for June–October 2026, built deterministically so every month the
// switcher reaches has real transactions behind it. Same merchants and
// habits as November, amounts jittered a little by month; the reports page
// derives its six-month figures from these transactions, so the numbers
// always agree with the dashboard.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HISTORY_TEMPLATES = [
  ["Mortgage — Willow Lane Home Loan", "housing", 1850, 1],
  ["Whole Foods Market", "groceries", 130, 2],
  ["Trader Joe's", "groceries", 90, 5],
  ["Costco", "groceries", 155, 9],
  ["Whole Foods Market", "groceries", 115, 14],
  ["Trader Joe's", "groceries", 95, 19],
  ["Farmers market", "groceries", 35, 24],
  ["Olive Garden — Family dinner", "dining", 68, 6],
  ["Chipotle — Lunch", "dining", 25, 11],
  ["Pizza night", "dining", 33, 17],
  ["Coffee shop", "dining", 19, 22],
  ["Shell — Gas", "transport", 48, 3],
  ["Bus passes (2)", "transport", 64, 8],
  ["Shell — Gas", "transport", 45, 18],
  ["City Power & Light — Electric", "utilities", 97, 4],
  ["Water bill — City Water", "utilities", 58, 10],
  ["Internet — Fiber 100", "utilities", 80, 13],
  ["Natural gas bill", "utilities", 43, 20],
  ["Phone bill", "utilities", 65, 26],
  ["CVS Pharmacy", "health", 42, 7],
  ["Gym membership", "health", 35, 15],
  ["Dentist copay", "health", 60, 21],
  ["AMC — Movie night", "entertainment", 38, 12],
  ["Movie rental", "entertainment", 6, 25],
  ["Amazon — School supplies", "shopping", 56, 10],
  ["Target — Household", "shopping", 89, 16],
  ["Home Depot — Light bulbs", "shopping", 28, 23],
  ["Target — Kids' clothes", "kids", 75, 11],
  ["Amazon — Winter coats", "kids", 68, 27],
  ["Netflix", "subscriptions", 15.49, 5],
  ["Spotify", "subscriptions", 11.99, 19]
];

(function buildHistory() {
  const months = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
  months.forEach(function (month, mi) {
    const rand = mulberry32(1000 + mi * 77);
    const day = function (d) { return String(Math.min(28, d)).padStart(2, "0"); };
    SEED.transactions.push(
      { id: "h" + month.slice(5) + "01", date: month + "-01", desc: "Salary — Hart Design Studio (Daniel)", category: "income", amount: 4850, type: "income" },
      { id: "h" + month.slice(5) + "02", date: month + "-14", desc: "Freelance — Brightpath Consulting (Maya)", category: "income", amount: 2050 + mi * 30, type: "income" }
    );
    HISTORY_TEMPLATES.forEach(function (tpl, i) {
      // The dentist visit happens every other month.
      if (tpl[0] === "Dentist copay" && mi % 2 === 1) return;
      const amount = Math.round(tpl[2] * (0.92 + rand() * 0.16) * 100) / 100;
      SEED.transactions.push({
        id: "h" + month.slice(5) + String(i + 3).padStart(2, "0"),
        date: month + "-" + day(tpl[3]),
        desc: tpl[0],
        category: tpl[1],
        amount: amount,
        type: "expense"
      });
    });
  });
})();
