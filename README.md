<p align="center">
  <img src="https://img.shields.io/badge/FIRE-Kenya-gold?style=for-the-badge&logo=firebase&logoColor=white" alt="FIRE Kenya" />
</p>

<h1 align="center">FIRE Kenya — Financial Independence Dashboard</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-blueviolet?style=flat-square" alt="Tech Stack" />
</p>

Browser-based FIRE planning dashboard for Kenyan investors. Models local instruments (T-Bills, T-Bonds, SACCOs, NSE, MMFs, I-REITs), global ETFs, and generates 10-section PDF reports with explicit computational derivations.

---

## Quick Start

```bash
git clone https://github.com/CalKK/FIRE-Kenya.git
cd FIRE-Kenya
python -m http.server 8080        # or: npx serve -l 8080
# Open http://localhost:8080
```

> Requires HTTP server — `file://` protocol will fail (Chart.js CDN dependency).

---

## File Structure

```
├── index.html            # 12-section UI, sidebar nav, PDF export modal        (~2,000 lines)
├── styles.css            # Dark theme, CSS custom properties, responsive       (~2,720 lines)
├── app.js                # Calculations, charts, fee drag calc, PDF engine     (~2,590 lines)
├── fire_analysis.ipynb   # Python notebook — FIRE formulae & simulations
├── LICENSE               # MIT
└── .gitignore
```

---

## Dependencies (CDN)

| Library | Version | Purpose |
|---|---|---|
| Chart.js | 4.4.4 | 7 chart visualizations |
| chartjs-plugin-datalabels | 2.2.0 | Data label overlays |
| html2canvas | 1.4.1 | DOM-to-canvas rendering |
| jsPDF | 2.5.1 | PDF report generation |
| Inter + JetBrains Mono | — | Typography (Google Fonts) |

---

## Configuration

All parameters in `PERSONAL` object at top of `app.js`:

```javascript
const PERSONAL = {
    currentAge: 23,  retireAge: 50,  familySize: 5,  children: 3,
    currentSavings: 173000,  currentStipend: 15480,  jobSalary: 59000,
    inflation: 6.0,  tBillRate: 8.5,  tBondRate: 12.5,  mmfRate: 10,
    saccoReturn: 14,  nseReturn: 15,  privateEquityReturn: 20,
    // ... see app.js for full config
};
```

Transport constants (PDF export):

```javascript
const WEEKLY_TRANSPORT = 1000;                         // KES/week
const MONTHLY_TRANSPORT = Math.round(1000 * 52 / 12);  // 4,333
const ANNUAL_TRANSPORT = 1000 * 52;                     // 52,000
```

CSS tokens in `styles.css` `:root` — `--bg-primary`, `--accent-primary`, etc.

---

## Core Functions

| Function | Purpose |
|---|---|
| `formatKES(amount, compact)` | Currency formatting (`KES X,XXX` or `KES X.XM`) |
| `projectNetWorth()` | Year-by-year compound projection with phased salary |
| `recalculateFIRE()` | FIRE number, inflation adjustment, crossover detection |
| `runSimulation()` | Scenario simulator (4 presets) |
| `analyzeDecision()` | Opportunity cost of purchases/income changes |
| `reverseEngineerFIRE()` | Solve for PMT via FV annuity; Newton-Raphson for required return |
| `analyzeBuyVsRent()` | Mortgage amortization vs rent comparison |
| `simulateMarketScenario()` | Custom allocation sliders with blended return |
| `calculateInsuranceImpact()` | NHIF + private health + motor + life insurance |
| `forecastTuition()` | 3-child education projection with 8% inflation |
| `initFeeDragCalculator()` | Interactive ETF vs active fund fee compounding |
| `exportToPDF()` | 10-section jsPDF report with formula derivations |

---

## Formulae Reference

**FIRE Number**:
`FIRE = (Annual_Expenses × (1 + inflation)^years) / SWR`

**Portfolio FV** (monthly compounding):
`FV = PMT × [((1+r_m)^n − 1) / r_m] + PV × (1+r_m)^n`

**Reverse FIRE** (solve for PMT):
`PMT = (FV − PV × (1+r_m)^n) / [((1+r_m)^n − 1) / r_m]`

**Real Return** (Fisher equation):
`r_real = (1 + r_nominal) / (1 + inflation) − 1`

**Fee Drag**:
`Drag = P × (1 + R − fee_etf)^Y − P × (1 + R − fee_active)^Y`

**Currency Hedge** (KES equivalent):
`r_KES = (1 + r_USD) × (1 + depreciation) − 1`

**Required Return** (Newton-Raphson):
`r_{i+1} = r_i − f(r_i) / f'(r_i)` where `f(r) = PMT×annuity(r) + PV×(1+r)^n − FV`

Full derivations with worked examples: see [`fire_analysis.ipynb`](fire_analysis.ipynb).

---

## Dashboard Sections

1. **Overview** — KPIs, net worth chart, budget doughnut
2. **Accounts** — Income flow, 50/30/20 buckets, off-book income
3. **Timeline** — 17 milestones (Jul 2026 → Sep 2052)
4. **Investments** — 3 risk tiers (Kenyan) + global ETFs + fee drag calculator
5. **FIRE Calculator** — 5 FIRE types, year-by-year crossover projection
6. **Simulator** — Salary/savings/return/rent/family sliders, 4 presets
7. **Decision Lab** — Opportunity cost modelling, 6 quick scenarios
8. **Reverse FIRE** — Backward solve from retirement target
9. **Markets** — Custom allocation sliders (must sum to 100%)
10. **Protection** — Insurance + tuition forecasting
11. **Advice** — 5-phase strategy (Foundation → Glide Path)
12. **PDF Export** — 10-section analytical report via jsPDF

---

## Contributing

```bash
git checkout -b feature/your-feature
# Code style: ES6+, const/let, camelCase, formatKES() for currency
# CSS: use :root custom properties, .component-name pattern
# Test: python -m http.server 8080 → verify no console errors
git commit -m "feat: description"
git push origin feature/your-feature
```

---

## License

MIT — see [LICENSE](LICENSE).
