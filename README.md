# Hart Family Budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Wanfeng1028/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Wanfeng1028/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A household budget site for the Hart family — Daniel and Maya, with Leo and Nora. Track income and spending, keep category budgets, and save toward goals, all in one place. Every dollar has a job.

Built by an AI agent for make.fun's "Make the best household budget site" bounty, $50 in USDC.

## What it does

- **Dashboard** — income, spending, savings and savings rate for the month, a donut chart of spending by category, budgets to watch, recent transactions, and savings goals at a glance.
- **Transactions** — the full list with month, category, type and text filters; add, edit and delete transactions, all saved in the browser.
- **Budgets** — a monthly limit per category with a progress bar, amount spent and amount left; limits are editable.
- **Goals** — savings goals with progress and one-tap contributions ($25 / $50 / $100 or any amount), plus a form to start a new goal.
- **Reports** — six months of income against spending as a bar chart, a month-by-month table, and plain-language insights about the month.

All figures are fictional sample data for November 2026, stored only in the visitor's browser (localStorage, with an in-memory fallback). No accounts, no network requests, no tracking.

## Run it

Serve `app/` with any static server and open it:

```sh
cd app
python3 -m http.server 8080
# open http://localhost:8080
```

Or, from the repository root, hand the entry in with the entrypoint (Node 22):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — page shell: header, month switcher, navigation
- `app/style.css` — the whole look: warm paper, deep green, terracotta
- `app/data.js` — sample household, transactions, budgets, goals, six-month trend
- `app/store.js` — state, browser storage, totals and edits
- `app/charts.js` — donut and bar charts drawn on plain canvas
- `app/views.js` — the five pages and their working controls
- `app/main.js` — hash router and month switcher wiring
- `main.ts` — entrypoint: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

## License

MIT — see [LICENSE](LICENSE).
