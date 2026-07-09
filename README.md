<p align="center">
  <img src="https://img.shields.io/badge/FIRE-Kenya-gold?style=for-the-badge&logo=firebase&logoColor=white" alt="FIRE Kenya" />
</p>

<h1 align="center">FIRE Kenya — Financial Independence Dashboard</h1>

<p align="center">
  A personalized Financial Independence, Retire Early (FIRE) planning tool built for Kenyan investors.
  <br />
  Track goals, model decisions, simulate market conditions, and chart your path to retirement by age 50.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Status" />
  <img src="https://img.shields.io/badge/PRs-welcome-orange?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-blueviolet?style=flat-square" alt="Tech Stack" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Architecture](#architecture)
  - [File Structure](#file-structure)
  - [Data Flow](#data-flow)
  - [External Dependencies](#external-dependencies)
- [Configuration](#configuration)
  - [Personal Profile](#personal-profile)
  - [CSS Design Tokens](#css-design-tokens)
- [Computational Formulae](#computational-formulae)
  - [FIRE Number](#fire-number)
  - [Portfolio Projection](#portfolio-projection)
  - [Future Value of Annuity (Reverse FIRE)](#future-value-of-annuity-reverse-fire)
  - [Real Rate of Return](#real-rate-of-return)
  - [Required Return (Newton's Method)](#required-return-newtons-method)
  - [Fee Drag Computation](#fee-drag-computation)
  - [Decision Opportunity Cost](#decision-opportunity-cost)
  - [Currency Hedge Return (KES Equivalent)](#currency-hedge-return-kes-equivalent)
  - [Insurance & Education Forecasting](#insurance--education-forecasting)
- [Dashboard Sections](#dashboard-sections)
  - [Overview](#1-overview)
  - [Accounts](#2-accounts)
  - [Timeline](#3-timeline)
  - [Investments — Kenyan Vehicles](#4-investments--kenyan-vehicles)
  - [Investments — ETFs & Index Funds](#5-investments--etfs--index-funds)
  - [FIRE Calculator](#6-fire-calculator)
  - [Scenario Simulator](#7-scenario-simulator)
  - [Decision Impact Lab](#8-decision-impact-lab)
  - [Reverse FIRE Engineering](#9-reverse-fire-engineering)
  - [Market Trend Analysis](#10-market-trend-analysis)
  - [Protection & Education](#11-protection--education)
  - [Investment Advice](#12-investment-advice)
- [PDF Export](#pdf-export)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

**FIRE Kenya** is a comprehensive, browser-based financial planning dashboard designed specifically for Kenyan investors pursuing Financial Independence and Early Retirement. It models real Kenyan financial instruments (Treasury Bills, Treasury Bonds, SACCOs, NSE Stocks, Money Market Funds, I-REITs) alongside global ETFs and Index Funds, and accounts for local factors like KES currency dynamics, Kenyan inflation rates, NHIF/SHA insurance, education costs, and transport expenditure.

The tool is tailored for a 23-year-old professional aiming to retire at age 50 with a family of five, but all parameters are fully configurable.

### Why FIRE Kenya?

| Principle | Detail |
|---|---|
| **Localized** | Models Kenyan investment vehicles, CBK rates, NSE equities, CMA-regulated funds, and KES currency depreciation |
| **Global** | Integrates ETF & Index Fund analysis with currency hedge math, fee drag computation, and offshore brokerage access |
| **Interactive** | Real-time sliders, 7 Chart.js visualizations, scenario modeling, and an interactive fee drag calculator |
| **Comprehensive** | Covers budgeting (50/30/20), investing, insurance, tuition, housing, transport, and a 10-section PDF export |
| **Zero Dependencies** | Pure HTML, CSS, and vanilla JavaScript — no build step, no framework, no server-side code |
| **Private** | All data stays in your browser. No server, no tracking, no accounts |

---

## Features

| Feature | Description |
|---|---|
| **Dashboard Overview** | Net worth tracking, budget allocation (50/30/20), portfolio progress gauges |
| **Account Tracking** | Income flow visualization with bucket allocation (Essentials, Investments, Entertainment) |
| **Financial Timeline** | 17 chronological milestones from age 23 (Jul 2026) through FIRE at age 50 (Sep 2052) |
| **Kenyan Investment Vehicles** | Tiered cards for T-Bills, T-Bonds, MMFs, NSE Stocks, SACCOs, Unit Trusts, I-REITs, Private Equity |
| **Global ETFs & Index Funds** | Historical returns, recommended allocation, fee drag calculator, and international brokerage access guide |
| **FIRE Calculator** | Interactive calculator with 5 FIRE types (Lean, Regular, Fat, Barista, Coast) and year-by-year crossover projection |
| **Scenario Simulator** | Adjustable sliders for salary, savings rate, returns, rent, and family size with 4 preset scenarios |
| **Decision Impact Lab** | Model any purchase or income change and visualize its effect on wealth trajectory with 6 quick scenarios |
| **Reverse FIRE Engineering** | Work backward from age 50 to determine required savings, returns, and maximum spending |
| **Buy vs Rent Analysis** | Mortgage amortization comparison with property appreciation and opportunity cost |
| **Market Trend Analysis** | Custom returns for NSE, T-Bonds, MMFs, REITs, SACCOs with allocation sliders summing to 100% |
| **Insurance Planning** | Model NHIF/SHA, private health, motor vehicle, and life insurance costs across career phases |
| **Tuition Forecasting** | Education cost projections for 3 children across primary, secondary, and university with 8% education inflation |
| **Investment Advice** | Phase-by-phase wealth-building strategies tailored to the Kenyan market and personal career trajectory |
| **PDF Export** | 10-section analytical PDF report with explicit computational derivations, transport cost integration, and ETF analysis |

---

## Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Modern web browser | Chrome 90+, Firefox 88+, Edge 90+, Safari 15+ | Rendering the dashboard |
| Python (optional) | 3.x | Running the local dev server |
| Node.js (optional) | 14+ | Alternative dev server via `npx` |
| Internet connection | — | Loading Chart.js, fonts from CDN |

> **Note**: The dashboard is a static site. Any HTTP server will work. Python and Node are just convenient options.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CalKK/FIRE-Kenya.git
   cd FIRE-Kenya
   ```

2. **Start a local server** (choose one)

   ```bash
   # Python
   python -m http.server 8080

   # Node.js
   npx serve -l 8080

   # PHP
   php -S localhost:8080
   ```

3. **Open in browser**

   ```
   http://localhost:8080
   ```

> **Important**: Do not open `index.html` directly via `file://` protocol. Chart.js and Google Fonts require an HTTP server to load correctly.

---

## Architecture

### File Structure

```
FIRE-Kenya/
├── index.html            # UI structure — 12 sections, sidebar nav, PDF export modal (~1,994 lines)
├── styles.css            # Design system — dark theme, CSS custom properties, responsive (~2,719 lines)
├── app.js                # Application logic — calculations, charts, engine, PDF export (~2,586 lines)
├── fire_analysis.ipynb   # Jupyter Notebook — Python-based FIRE simulations and formulae (~13 KB)
├── README.md             # This documentation
├── LICENSE               # MIT License
└── .gitignore            # OS files, editors, logs, local server artifacts
```

### Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                      index.html                           │
│  ┌─────────┐  ┌───────────┐  ┌─────────────────────────┐│
│  │ Sidebar │  │ 12 Section││  │ Canvas (Chart.js)       ││
│  │   Nav   │→ │  Panels   │→ │ + Interactive Inputs     ││
│  └─────────┘  └───────────┘  └─────────────────────────┘│
└────────────────────────┬─────────────────────────────────┘
                         │ DOM Events
                         ▼
┌──────────────────────────────────────────────────────────┐
│                       app.js                              │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ PERSONAL │→ │ Calculation  │→ │ Chart.js Renderers  │ │
│  │  Config  │  │   Engines    │  │ (7 charts)          │ │
│  └──────────┘  └──────────────┘  └────────────────────┘ │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Fee Drag │  │ Decision Lab │  │ PDF Export Engine   │ │
│  │  Calc    │  │ + Reverse    │  │ (jsPDF, 10 sections)│ │
│  └──────────┘  └──────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                     styles.css                            │
│  CSS Custom Properties (Design Tokens)                    │
│  Component Styles | Responsive Breakpoints | Dark Theme   │
└──────────────────────────────────────────────────────────┘
```

### External Dependencies

| Library | Version | CDN | Purpose |
|---|---|---|---|
| Chart.js | 4.4.4 | jsDelivr | All 7 chart visualizations |
| chartjs-plugin-datalabels | 2.2.0 | jsDelivr | Data label overlays on charts |
| html2canvas | 1.4.1 | jsDelivr | DOM-to-canvas rendering (for potential future screenshot features) |
| jsPDF | 2.5.1 | jsDelivr | Comprehensive PDF report generation |
| Inter | Variable | Google Fonts | Primary typeface |
| JetBrains Mono | Variable | Google Fonts | Monospace typeface for financial figures |

---

## Configuration

### Personal Profile

All personal financial data is centralized in the `PERSONAL` object at the top of `app.js`:

```javascript
const PERSONAL = {
    name: 'Investor',
    currentAge: 23,
    birthMonth: 9,           // September
    birthYear: 2002,
    retireAge: 50,
    retireYear: 2052,
    familySize: 5,           // self + wife + 3 children
    children: 3,

    // Current (as of Jul 2026)
    currentSavings: 173000,  // KES
    currentPortfolio: 0,
    currentStipend: 15480,   // KES/month

    // Employment
    jobStartDate: '2026-09',
    jobEndDate: '2028-06',
    jobSalary: 59000,        // KES/month net

    // Planned Purchases
    suitCost: 6995,          // from first paycheck
    phoneCost: 80000,        // by Oct 2026
    phoneTopUp: 21000,       // savings top-up for phone

    // Housing
    moveOutDate: '2030-12',
    monthlyRent: 40000,      // KES

    // Investment Goals
    portfolioGoal: 1000000,  // KES 1M by Jan 2030
    carGoal: { min: 1000000, max: 1500000 },

    // Weekly Savings
    weeklySavings: 350,      // KES to MMF from Oct 2026
    monthlyAirtime: 1000,    // KES deducted monthly

    // Kenya Economic Context
    inflation: 6.0,          // % p.a.
    tBillRate: 8.5,          // % p.a. (91-364 day)
    tBondRate: 12.5,         // % p.a. (1-30 year)
    mmfRate: 10,             // % p.a.
    saccoReturn: 14,         // % p.a. dividends
    nseReturn: 15,           // % p.a. (NASI long-term)
    privateEquityReturn: 20, // % p.a. target
};
```

**Transport Cost Constants** (used in PDF export and budget analysis):

```javascript
const WEEKLY_TRANSPORT = 1000;                           // KES 1,000/week fixed
const MONTHLY_TRANSPORT = Math.round(1000 * 52 / 12);   // KES 4,333/month
const ANNUAL_TRANSPORT = 1000 * 52;                      // KES 52,000/year
```

To customize for your own situation, modify these values and refresh the page. All calculations update automatically.

### CSS Design Tokens

The visual theme is fully configurable via CSS custom properties in `styles.css`:

```css
:root {
    --bg-primary: #0a0e1a;        /* Main background */
    --bg-card: #1a1f35;           /* Card surfaces */
    --accent-primary: #6366f1;    /* Indigo — primary actions */
    --accent-secondary: #fbbf24;  /* Kenyan gold — highlights */
    --accent-success: #10b981;    /* Emerald — positive values */
    --accent-danger: #ef4444;     /* Red — negative values */
    --accent-warning: #f59e0b;    /* Amber — warnings */
    --text-primary: #e2e8f0;      /* Main text */
    --text-secondary: #8b92a8;    /* Subdued text */
}
```

---

## Computational Formulae

All figures in the dashboard and PDF report are derived from the following computational formulae. Every variable traces back to user inputs or the `PERSONAL` configuration.

### FIRE Number

The core metric — the portfolio value required to sustain retirement indefinitely.

```
Inflated Annual Expenses = Current Annual Expenses × (1 + inflation)^years

FIRE Number = Inflated Annual Expenses / Safe Withdrawal Rate (SWR)
```

**Example** (default parameters):

```
Current Expenses   = KES 100,000/month × 12 = KES 1,200,000/year
Inflation          = 6% p.a.
Years to Retire    = 27 (age 23 → 50)
SWR                = 3.5%

Inflated Expenses  = 1,200,000 × (1.06)^27 = KES 5,786,417/year
FIRE Number        = 5,786,417 / 0.035      = KES 165,326,205
```

### Portfolio Projection

Year-by-year net worth compound growth:

```
Net Worth(y+1) = Net Worth(y) × (1 + annual_return) + Annual Contributions − Annual Deductions

Annual Contributions = (Monthly Salary + Off-Book Income − Rent) × Savings Rate × 12
Annual Deductions    = Monthly Airtime × 12 + One-off Purchases(y)
```

The projection uses phased salary growth:

| Phase | Period | Monthly Salary | Monthly Rent |
|---|---|---|---|
| Stipend | 2026 | KES 15,480 | 0 |
| First Job | 2027–2028 | KES 59,000 | 0 |
| Career Growth | 2028–2030 | KES 100,000 | 0 |
| Independence | 2030–2035 | KES 150,000 | KES 40,000 |
| Mid-Career | 2035–2040 | KES 250,000 | KES 60,000 |
| Senior | 2040–2045 | KES 350,000 | 0 (property) |
| Pre-Retirement | 2045–2052 | KES 450,000 | 0 |

### Future Value of Annuity (Reverse FIRE)

Given a FIRE Number target, solve for the required monthly savings:

```
FV = PMT × [((1 + r_m)^n − 1) / r_m] + PV × (1 + r_m)^n

where:
  FV   = FIRE Number (target portfolio)
  PMT  = Required monthly payment (solve for this)
  r_m  = Monthly return rate = Annual Return / 12
  n    = Months to retirement = Years × 12
  PV   = Current savings (KES 173,000)

Solving for PMT:
  PMT = (FV − PV × (1 + r_m)^n) / [((1 + r_m)^n − 1) / r_m]
```

### Real Rate of Return

Inflation-adjusted return for accurate purchasing-power projections:

```
Real Return = (1 + Nominal Return) / (1 + Inflation Rate) − 1
```

**Example**: At 12% nominal return and 6% inflation:

```
Real Return = (1.12 / 1.06) − 1 = 5.66%
```

### Required Return (Newton's Method)

When solving for the return rate needed to hit a FIRE target at a given savings rate, the tool uses Newton-Raphson iteration:

```
f(r)  = PMT × [((1 + r)^n − 1) / r] + PV × (1 + r)^n − FV

f'(r) = PMT × [n(1+r)^(n−1) × r − ((1+r)^n − 1)] / r² + PV × n × (1+r)^(n−1)

r_(i+1) = r_i − f(r_i) / f'(r_i)
```

Converges within ~50 iterations to within KES 1,000 accuracy. The monthly rate is annualized as:

```
Annual Return = ((1 + r_monthly)^12 − 1) × 100
```

### Fee Drag Computation

Quantifies the wealth erosion caused by fund management fees over time:

```
ETF Net Return    = Gross Return − ETF Expense Ratio
Active Net Return = Gross Return − Active Fund Fee

ETF Yield    = Principal × (1 + ETF Net Return)^years
Active Yield = Principal × (1 + Active Net Return)^years

Fee Drag (KES)  = ETF Yield − Active Yield
Fee Drag (%)    = (Fee Drag / ETF Yield) × 100
```

**Example** (defaults):

```
Principal = KES 100,000    Gross Return = 12%    Years = 27
ETF Fee   = 0.03%          Active Fee   = 2.00%

ETF Yield    = 100,000 × (1 + 0.1197)^27 = KES 2,125,502
Active Yield = 100,000 × (1 + 0.1000)^27 = KES 1,310,999

Fee Drag = KES 814,503 (38.3% of potential wealth destroyed)
```

### Decision Opportunity Cost

Every purchase is modelled as a present-value investment that compounds for the remaining horizon:

```
Opportunity Cost = Decision Amount × (1 + annual_return)^(retire_age − decision_age)

FIRE Delay = ΔYears where Portfolio(baseline) = Portfolio(with decision)
```

### Currency Hedge Return (KES Equivalent)

For USD-denominated ETFs, the effective return in KES accounts for currency depreciation:

```
KES Return = (1 + USD Return) × (1 + KES Depreciation Rate) − 1
```

**Example**: S&P 500 at 10.5% USD + 4% KES/USD depreciation:

```
KES Return = (1.105) × (1.04) − 1 = 14.92%
```

### Insurance & Education Forecasting

**Insurance annual cost**:

```
NHIF          = KES 1,700/month (mandatory from employment)
Private Health = KES 5,000/month (from age 28)
Car Insurance  = 5% × Vehicle Value / year (from age 28)
Life Insurance = KES 3,000/month (from age 30)
Total Annual   = Σ(applicable premiums × 12)
```

**Tuition per child** (with education inflation):

```
Annual Tuition(year) = Base Tuition × (1 + education_inflation)^(year − birth_year − entry_age)

where education_inflation = 8% p.a.

Base Tuition:
  Primary    = KES 150,000/year
  Secondary  = KES 250,000/year
  University = KES 400,000/year

Total for 3 children = Σ over all children and all school years
```

---

## Dashboard Sections

### 1. Overview

The landing page displays four KPI cards:

```
Net Worth  |  Monthly Savings  |  Portfolio Value  |  FIRE Progress %
```

Below: a net worth projection chart (2026–2052) and a budget doughnut chart showing the 50/30/20 split.

### 2. Accounts

Income flow visualization showing how the current income (stipend or salary) is allocated across three buckets:

| Bucket | Allocation | Purpose |
|---|---|---|
| Essentials | 50% | Rent, food, transport, utilities |
| Investments | 30% | MMF, SACCO, stocks, bonds |
| Entertainment | 20% | Lifestyle, subscriptions, airtime |

Includes an **Off-the-Book Income** input for modelling side-hustle income (monthly recurring or one-time) that re-triggers all calculations.

### 3. Timeline

A visual chronological roadmap with **17 measurable milestones** from current position to FIRE:

| Date | Milestone | Measurable Target |
|---|---|---|
| **Jul 2026** | 📍 Current Position | Savings: KES 173,000. Stipend: KES 15,480/mo. Portfolio: KES 0. |
| **Sep 2026** | 💼 Start Job | Net salary: KES 59,000/mo. Purchase KES 6,995 suit from first paycheck. |
| **Oct 2026** | 📱 Buy Phone | KES 80,000 phone (first paycheck KES 59,000 + KES 21,000 savings top-up). |
| **Oct 2026** | 💰 Weekly Savings Begin | KES 350/week → KES 1,400/mo into MMF. Annual: KES 18,200. |
| **Jan 2027** | 🏦 Open DhowCSD & SACCO | Register CBK CDS for T-Bills/Bonds. Join SACCO at KES 2,000/mo shares. Build credit for car loan by 2030. |
| **Mar 2027** | 📊 First T-Bill Purchase | MMF reaches KES 50,000. Roll into 91-day T-Bills at 8.5% yield. Continue quarterly rolling. |
| **Jun 2027** | 📈 Start Stock Investing | KES 5,000/mo into NSE blue-chips (Safaricom, Equity Group, KCB) via Ziidi. |
| **Sep 2027** | 🎂 Turn 25 | Portfolio checkpoint. On-track assessment for KES 1M by 2030. Review allocation. |
| **Jun 2028** | 🔄 Job Contract Ends | End of KES 59,000/mo contract. Estimated accumulated savings: ~KES 350K+. Career transition. |
| **Jul 2028** | 📈 Career Growth | Target next role at KES 80K–120K/mo. Increase investment allocation to 30%+ of net income. |
| **Jan 2030** | 🎯 KES 1M Portfolio | Investment portfolio hits KES 1,000,000. Diversified: T-Bonds + NSE Stocks + MMF + SACCO. |
| **Dec 2030** | 🏠 Move Out + 🚗 Buy Car | Rent: KES 40,000/mo. Car: KES 1M–1.5M. Major budget restructure. Monthly transport: KES 4,333. |
| **2032–2035** | 💍 Marriage & Family | Start family (wife + 3 children). Open education funds. Scale investments with KES 150K–250K salary. |
| **2035–2040** | 🏗️ Property Investment | Consider SACCO mortgage for property. D-REITs for diversification. Eliminate rent → build equity. |
| **2040–2045** | 📚 Children's Education Peak | School fees for 3 children. Unit trust education funds cover majority. Maintain investment discipline. |
| **2045–2050** | 🛡️ FIRE Glide Path | Shift to 70% bonds/fixed income. Build 2-year cash buffer (24 months expenses in MMF/T-Bills). |
| **Sep 2052** | 🔥 FIRE at 50 | Passive income from T-Bond coupons, stock dividends, rental income, and SACCO interest covers all family expenses. |

### 4. Investments — Kenyan Vehicles

Three risk-tiered cards with instrument-level detail:

#### Tier 1: Low Risk — Government Securities & Money Markets

| Instrument | Yield | Min. Investment | Platform | Maturity |
|---|---|---|---|---|
| Treasury Bills | 8.5–8.8% | KES 50,000 | DhowCSD | 91–364 days |
| Treasury Bonds | 11–14% | KES 50,000 | DhowCSD | 1–30 years |
| Money Market Funds | 9–12% | KES 100 | Cytonn, Britam | 1–7 days (liquid) |

#### Tier 2: Medium Risk — Stocks, SACCOs & Unit Trusts

| Instrument | Returns | Platform | Key Advantage |
|---|---|---|---|
| NSE Stocks | +51.1% (NASI 2025) | Ziidi / NSE | Capital appreciation + dividends |
| SACCOs | 10–18% dividends | SASRA-regulated | 3x share capital borrowing |
| Unit Trusts (Equity) | 12–20% | Old Mutual, Sanlam | Automatic diversification |

#### Tier 3: High Risk / High Reward — Private Equity & Alternatives

| Instrument | Target Returns | Min. Investment | Lock-up |
|---|---|---|---|
| Private Equity / Real Estate | 18–25%+ | KES 100,000+ | 3–7 years |
| Growth / Small-Cap Stocks | +200% to +500% (speculative) | Variable | High volatility |

### 5. Investments — ETFs & Index Funds

A comprehensive global investment analysis providing Kenyan FIRE investors with access to international markets.

#### Why ETFs Matter for Kenyan FIRE

| Factor | Detail |
|---|---|
| **Global Diversification** | S&P 500 and MSCI World spread risk across 500–1,500+ companies vs NSE's ~65 listed equities |
| **Currency Hedge** | USD-denominated assets protect against KES depreciation (~3–5% p.a. historically), boosting effective KES returns by 3–5 percentage points |
| **Long-Term Track Record** | Passive indices have outperformed most actively managed funds over 10+ year horizons, surviving world wars, recessions, and inflation spikes |
| **Ultra-Low Fees** | ETF expense ratios (0.03%–0.20%) vs Kenyan unit trust fees (1.5%–2.5%), compounding to massive wealth differences over decades |

#### Historical Performance of Major Global Indices

| Index / ETF | Ticker | Benchmark | Annualized Return (USD) | Period | Expense Ratio | Risk Classification |
|---|---|---|---|---|---|---|
| S&P 500 | VOO / SPY | S&P 500 Index | **10.5%** | 1957–2025 | 0.03% | Medium (Large-Cap Equity) |
| MSCI World | IWDA | MSCI World Index | **8.8%** | 1987–2025 | 0.20% | Medium (Global Developed) |
| MSCI Emerging Markets | EEM / VWO | MSCI EM Index | **9.2%** | 2000–2025 | 0.08% | High (Emerging Markets) |
| Nasdaq-100 | QQQ | Nasdaq-100 Index | **14.2%** | 2000–2025 | 0.20% | High (Tech-Concentrated) |
| FTSE All-World | VWRA | FTSE All-World Index | **8.5%** | 2005–2025 | 0.22% | Medium (Global All-Cap) |
| Vanguard Total Bond | BND / AGGU | Bloomberg US Agg Bond | **4.1%** | 2007–2025 | 0.03% | Low (Investment-Grade Bonds) |

> **Note**: All returns are annualized total returns in USD, inclusive of dividends. Past performance does not guarantee future results. KES-equivalent returns add ~3–5% due to currency depreciation.

#### Recommended ETF Portfolio Allocation (Growth Phase, Age 23–40)

| Asset Category | Recommended ETF | Ticker | Allocation | Expense Ratio | Benchmark Index | Rationale |
|---|---|---|---|---|---|---|
| **Core Equities** | Vanguard S&P 500 | VOO | **50%** | 0.03% | S&P 500 | US large-cap exposure, ultra-low cost, deepest liquidity |
| **Global Developed** | iShares MSCI World | IWDA | **25%** | 0.20% | MSCI World | Diversifies outside the US across 23 developed markets |
| **Emerging Markets** | Vanguard FTSE EM | VWO | **15%** | 0.08% | FTSE Emerging Markets | Growth exposure in China, India, Brazil, and Africa |
| **Fixed Income** | iShares Global Agg Bond | AGGU | **10%** | 0.10% | Bloomberg Global Agg | Stability buffer, reduces portfolio volatility |

#### Rebalancing Frequency

- **Recommended**: Annually (every January) or when any allocation drifts ±5% from target
- **Method**: Redirect new contributions to underweight assets before selling overweight positions (tax-efficient)
- **Glide Path (Age 40+)**: Gradually increase AGGU from 10% to 30% over 10 years as retirement approaches

#### Tax Considerations for Kenyan ETF Investors

| Tax Type | Rate | Notes |
|---|---|---|
| **US Dividend Withholding** | 30% | Automatically withheld at source. Kenya has no US tax treaty, so no reduction is available. Consider accumulating (non-distributing) ETFs like IWDA to defer tax. |
| **Kenyan Capital Gains Tax** | 15% | Applicable on disposal of foreign securities (Finance Act 2023). Declared in annual KRA returns. |
| **KRA Foreign Income Reporting** | 30% marginal | Foreign investment income is taxable. Keep records of all buy/sell transactions, dividends, and FX rates. |
| **Optimization Strategy** | — | Use Ireland-domiciled accumulating ETFs (e.g., IWDA, VWRA) to avoid US withholding tax on dividends and defer Kenyan CGT until sale. |

#### International Brokerage Access from Kenya

| Platform | Min. Deposit | ETFs Available | Commission | Best For |
|---|---|---|---|---|
| **Interactive Brokers** | USD 0 | 13,000+ | ~USD 1/trade | Serious investors, lowest fees, widest access |
| **Saxo Bank** | USD 2,000 | 7,000+ | ~USD 3/trade | Security-conscious investors, robust platform |
| **Charles Schwab Intl** | USD 25,000 | 4,000+ US | USD 0 | High-net-worth, zero-commission US ETFs |
| **eToro** | USD 50 | 250+ | 0% | Beginners, smallest minimum, social trading |

#### Fee Drag Calculator Formula

An interactive calculator is embedded in the dashboard allowing real-time simulation:

```
ETF Net Rate    = Gross Return − ETF Expense Ratio
Active Net Rate = Gross Return − Active Fund Fee

ETF Yield    = Principal × (1 + ETF Net Rate)^Years
Active Yield = Principal × (1 + Active Net Rate)^Years

Fee Drag     = ETF Yield − Active Yield
Drag %       = (Fee Drag / ETF Yield) × 100
```

Use the sliders in the Investments tab to explore different scenarios interactively.

### 6. FIRE Calculator

Interactive inputs:

| Parameter | Default | Range |
|---|---|---|
| Annual Expenses | KES 720,000 | Any |
| Withdrawal Rate | 4.0% | 2.0–6.0% |
| Expected Return | 12% | 4–20% |
| Inflation | 6% | 2–10% |
| Monthly Investment | KES 17,700 | Any |
| Retire Age | 50 | 30–70 |

Computes 5 FIRE types:

| Type | Multiplier | Lifestyle Level |
|---|---|---|
| **Lean FIRE** | 0.6× expenses | Minimal, bare-bones budget |
| **Regular FIRE** | 1.0× expenses | Current lifestyle maintained |
| **Fat FIRE** | 1.5× expenses | Comfortable, upgraded lifestyle |
| **Barista FIRE** | 0.5× FIRE Number | Part-time work covers half expenses |
| **Coast FIRE** | PV of FIRE Number | No more contributions needed, let compounding work |

### 7. Scenario Simulator

Four preset scenarios accessible via buttons:

| Preset | Salary | Savings Rate | Return | Rent | Family |
|---|---|---|---|---|---|
| **Current** | KES 15,480 | 30% | 12% | KES 0 | 1 |
| **Aggressive** | KES 150,000 | 50% | 15% | KES 40,000 | 2 |
| **Moderate** | KES 80,000 | 25% | 10% | KES 30,000 | 3 |
| **High Earner** | KES 300,000 | 35% | 12% | KES 80,000 | 5 |

### 8. Decision Impact Lab

Model any financial decision with:

```
Input:  Description, Amount, Type (expense/income), Age, Duration
Output: Opportunity cost, FIRE delay, impact chart, qualitative advice
```

Six quick scenarios: Phone KES 90K, Laptop KES 150K, Side Hustle +KES 20K/mo, Car Upgrade KES 2M, Wedding KES 500K, Vacation KES 200K.

### 9. Reverse FIRE Engineering

Set your retirement vision and the tool calculates backward:

```
Input:  Retire at 50, KES 150,000/month expenses, 3.5% SWR, 6% inflation, 12% returns
Output: FIRE Number: KES 138.7M
        Required Monthly Savings: KES 42,300
        Max Monthly Expenditure: KES 16,700
        Required Annual Return: 18.2% p.a. (at current savings rate)
```

Uses Newton-Raphson iteration for the required return calculation.

### 10. Market Trend Analysis

Custom allocation sliders (must sum to 100%):

```
NSE Stocks:     25% @ 15% return
Treasury Bonds: 25% @ 12.5% return
MMF:            20% @ 10% return
I-REITs:        10% @ 8% return
SACCOs:         15% @ 14% return
Cash/T-Bills:    5% @ 8.5% return
─────────────────────────────────
Blended Return: 12.1%
```

### 11. Protection & Education

**Insurance modelling** across career phases:

```
NHIF/SHA:        KES 1,700/month   (from employment start)
Private Health:  KES 5,000/month   (from age 28)
Car Insurance:   5% of KES 1.25M   (from age 28, KES 5,208/month)
Life Insurance:  KES 3,000/month   (from age 30)
```

**Tuition forecasting** for 3 children with 8% education inflation:

```
Child 1 (born 2032): Primary KES 150K → Secondary KES 250K → University KES 400K
Child 2 (born 2034): Same fee structure, 8% inflation-adjusted
Child 3 (born 2036): Same fee structure, 8% inflation-adjusted
```

### 12. Investment Advice

The Advice section presents a **5-phase, actionable strategy** grounded in the financial data from `app.js`:

#### Tailored Financial Report Card

- **Utopian FIRE Target at Age 50**: KES 165.3 Million
  - Derivation: KES 100,000/month today × (1.06)^27 = KES 482,200/month inflated → × 12 / 0.035 SWR = KES 165.3M
- **Investment Option 1**: 100% MMF (KES 4,644/mo) — 10–12% p.a., high liquidity, low growth
- **Investment Option 2 (Recommended)**: Diversified — 30% MMF (KES 1,393) + 40% SACCO (KES 1,858) + 30% NSE Equities (KES 1,393) — blended ~13% p.a.
- **Immediate Action**: Maintain KES 50,000 emergency fund in MMF. Split KES 4,644 monthly: KES 2,000 → SACCO, KES 2,644 → MMF. Open CDS & DhowCSD accounts.

#### Phase 1: Foundation (Jul 2026 – Sep 2026)

*Stipend period — KES 15,480/month*

- ✅ Open MMF (Cytonn or Britam) — start with KES 5,000, earning ~10% p.a. with daily compounding
- ✅ Build emergency fund — target 3 months expenses (KES 45,000); current KES 173,000 covers this
- ✅ Register on DhowCSD — free CBK Central Depository account, prepares for T-Bills/Bonds at KES 50K+
- ✅ Open CDS on NSE — register via Ziidi (M-Pesa) for stock trading readiness
- ✅ Begin financial literacy — understand compound interest, inflation erosion, and the power of early investing

#### Phase 2: Acceleration (Sep 2026 – Jun 2028)

*Job income — KES 59,000/month net*

- 🎯 Handle immediate purchases — suit (KES 6,995), phone (KES 80,000 via paycheck + savings top-up)
- 🎯 Start weekly KES 350 savings — KES 1,400/month into MMF from October 2026
- 🎯 Invest in Treasury Bills — roll KES 50,000 into 91-day T-Bills (8.5% yield) once MMF accumulates enough
- 🎯 Start NSE purchases — KES 5,000/month into Safaricom, Equity Group, KCB via Ziidi
- 🎯 Join a SACCO — KES 2,000/month shares; by 2030, balance qualifies for car loan at preferential rates
- 🎯 Open international brokerage account — register on Interactive Brokers (USD 0 minimum) to begin small ETF purchases when ready

#### Phase 3: Growth (Jun 2028 – Dec 2030)

*Career progression — target KES 80K–120K/month*

- 📈 Scale investments to 30%+ of income — KES 24K–36K/month diversified across T-Bonds, stocks, SACCO, and ETFs
- 📈 Buy Treasury Bonds (5–10 year) — lock in 11–14% yields with semi-annual coupons
- 📈 Begin ETF accumulation — monthly USD 50–100 into VOO (S&P 500) via Interactive Brokers
- 📈 Hit KES 1M portfolio by Jan 2030 — combined domestic + international investments
- 📈 Purchase first car (KES 1M–1.5M) — consider SACCO loan at preferential rates
- 📈 Move out — rent at KES 40,000/month. Adjust 50/30/20 allocation to maintain savings momentum.

#### Phase 4: Wealth Building (2031 – 2045)

*Family years — wife + 3 children*

- 🏠 Consider property purchase — use SACCO savings for mortgage deposit; eliminate rent, build equity
- 🏠 Diversify into REITs — D-REITs (Acorn) or Cytonn structured products for real estate exposure
- 🏠 Max out long-term bonds — 20-year infrastructure bonds at 12–14% with tax exemption, maturing around retirement
- 🏠 Children's education funds — KES 3,000/child/month into unit trusts from birth; benefits from 8% education inflation compounding
- 🏠 Scale ETF allocation — target 20–30% of portfolio in global ETFs (VOO, IWDA, VWO) during peak earning years
- 🏠 Annual rebalancing — realign domestic vs international allocation every January; redirect contributions to underweight assets

#### Phase 5: FIRE Glide Path (2045 – 2052)

*De-risk and prepare for retirement*

- 🔥 Shift to conservative allocation — move from 60% equities to 70% bonds/fixed income over 7 years
- 🔥 Increase AGGU bond ETF allocation from 10% to 30% — reduce sequence-of-returns risk
- 🔥 Build 2-year cash buffer — keep 24 months of expenses in MMF/T-Bills to weather market downturns
- 🔥 Establish passive income streams — rental income, T-Bond coupons, stock dividends, SACCO interest, and ETF distributions should cover 100% of family expenses by age 50
- 🔥 Consolidate accounts — simplify portfolio into fewer holdings for easier management in retirement
- 🔥 Tax optimization — harvest capital gains strategically across tax years to minimize KRA liability

---

## PDF Export

The dashboard includes a comprehensive PDF report generator (via jsPDF) that produces a 10-section analytical document:

| Section | Content |
|---|---|
| **Cover Page** | FIRE target, horizon, key assumptions, transport costs |
| **Table of Contents** | All 10 sections listed with page references |
| **1. Executive Summary** | 15-row key metrics table with derivation column |
| **2. Personal Profile** | Income timeline, transport derivation (KES 1,000/week), planned expenditures |
| **3. Budget Analysis** | 50/30/20 breakdown for stipend & employment phases with transport deducted |
| **4. FIRE Number Derivation** | Inflation-adjusted expenses → SWR application → sensitivity table |
| **5. Portfolio Growth** | FV annuity formula, PV growth, PMT accumulation, year-by-year milestones |
| **6. Kenyan Investment Vehicles** | 8-vehicle comparison matrix, phase-based allocation, compound growth |
| **7. ETFs & Index Funds** | Historical returns, currency hedge math, fee drag computation, platform access |
| **8. Scenario Analysis** | Return rate, savings rate, transport impact, inflation sensitivity tables |
| **9. Risk Assessment** | 8-factor risk matrix, real return derivation, sequence-of-returns mitigation |
| **10. Action Plan** | 7 immediate actions, quarterly checklist, final summary table |

Access via the **Export PDF** button in the sidebar footer.

---

## API Reference

### Core Functions

| Function | Description | Trigger |
|---|---|---|
| `formatKES(amount, compact)` | Formats a number as `KES X,XXX` or `KES X.XM` | Called by all display functions |
| `formatPct(val)` | Formats a number as `X.X%` | Called by percentage displays |
| `initNavigation()` | Sets up sidebar section switching with ARIA support | DOMContentLoaded |
| `initFeeDragCalculator()` | Wires ETF fee drag calculator inputs and live-updates results | DOMContentLoaded |
| `recalculateFIRE()` | Runs the main FIRE calculator and updates projection chart | DOMContentLoaded + input changes |
| `runSimulation()` | Executes the scenario simulator with current slider values | DOMContentLoaded + slider changes |
| `analyzeDecision()` | Models a financial decision's impact on wealth trajectory | Button click |
| `reverseEngineerFIRE()` | Solves backward from FIRE target to required monthly savings | DOMContentLoaded + input changes |
| `analyzeBuyVsRent()` | Compares mortgage vs rent with opportunity cost | Button click |
| `simulateMarketScenario()` | Runs market simulation with custom returns and allocations | DOMContentLoaded + slider changes |
| `calculateInsuranceImpact()` | Models insurance costs across career phases | DOMContentLoaded |
| `forecastTuition()` | Projects education costs for 3 children | DOMContentLoaded |
| `exportToPDF()` | Generates comprehensive 10-section PDF report | Button click in export modal |

### Simulation Presets

```javascript
loadPreset('current');      // KES 15,480 salary, 30% savings, 12% returns
loadPreset('aggressive');   // KES 150,000, 50% savings, 15% returns
loadPreset('moderate');     // KES 80,000, 25% savings, 10% returns
loadPreset('highEarner');   // KES 300,000, 35% savings, 12% returns
```

### Decision Lab Presets

```javascript
loadDecision('phone');      // KES 90,000 expense
loadDecision('laptop');     // KES 150,000 expense
loadDecision('sideHustle'); // KES 20,000/month income
loadDecision('carUpgrade'); // KES 2,000,000 expense
loadDecision('wedding');    // KES 500,000 expense
loadDecision('vacation');   // KES 200,000 expense
```

---

## Contributing

Contributions are welcome. FIRE Kenya is designed to be extended with new financial models, Kenyan investment vehicles, and improved calculations.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/nssf-tier-calculator`
3. **Make** changes — follow the code style below
4. **Test** locally: `python -m http.server 8080` → verify no console errors
5. **Commit**: `git commit -m "feat: add NSSF Tier I & II contributions model"`
6. **Push** and open a Pull Request

### Code Style

- **HTML**: 4-space indentation, semantic elements, descriptive `id` attributes
- **CSS**: Use existing CSS custom properties from `:root`. New components follow `.component-name` pattern
- **JavaScript**: ES6+ syntax, `const`/`let` (no `var`), template literals, `formatKES()` for all currency display
- **Comments**: Section headers use `// ==================== SECTION NAME ====================`
- **Naming**: `camelCase` for functions/variables, `kebab-case` for CSS classes and HTML IDs

### Commit Convention

```
feat:     New feature           refactor: Code restructuring
fix:      Bug fix               perf:     Performance improvement
docs:     Documentation         style:    CSS/formatting (no logic)
```

### Pull Request Checklist

- [ ] No console errors in the browser
- [ ] All 7 charts render correctly
- [ ] Tested on mobile viewport (responsive)
- [ ] README updated if adding new sections or configuration
- [ ] One approval required for merge

---

## Troubleshooting

### Charts not rendering

**Cause**: Opening via `file://` protocol.

```bash
# ❌ Wrong — will fail
file:///C:/Users/User/Downloads/FIRE/index.html

# ✅ Correct
http://localhost:8080
```

### "Chart is not defined" console error

**Cause**: No internet connection. Chart.js loads from CDN.

```bash
# Download for offline use
curl -o chart.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js
# Update <script> tag in index.html to point to local file
```

### Port 8080 already in use

```bash
# Use different port
python -m http.server 3000

# Or kill existing process (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Numbers showing as NaN

**Cause**: Empty or invalid input fields. Reset by refreshing the page, or verify the `PERSONAL` object in `app.js` has no missing values.

### Allocation sliders don't sum to 100%

**Expected behavior**: The total indicator turns green at 100%, amber below, red above. Adjust sliders before running the simulation.

---

## Roadmap

- [x] PDF export of financial plan (10-section analytical report)
- [x] Global ETF & Index Fund analysis with fee drag calculator
- [x] Interactive fee drag calculator with real-time sliders
- [x] Transport cost integration (KES 1,000/week)
- [ ] Local storage persistence for user inputs
- [ ] Dark/light theme toggle
- [ ] SACCO loan amortization calculator
- [ ] NSSF Tier I & II contributions modeling
- [ ] Inflation-adjusted salary projections with career milestones
- [ ] Mobile-first responsive redesign
- [ ] PWA support for offline access
- [ ] Tax optimization calculator (PAYE, capital gains)
- [ ] Multi-currency support (KES/USD/EUR)

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 FIRE Kenya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) — Beautiful, flexible charting library
- [jsPDF](https://github.com/parallax/jsPDF) — Client-side PDF generation
- [Google Fonts](https://fonts.google.com/) — Inter and JetBrains Mono typefaces
- [Central Bank of Kenya](https://www.centralbank.go.ke/) — Treasury Bills/Bonds data reference
- [Nairobi Securities Exchange](https://www.nse.co.ke/) — Stock market benchmarks and NASI data
- [Capital Markets Authority Kenya](https://www.cma.or.ke/) — Regulatory framework reference
- [Kenya Revenue Authority](https://www.kra.go.ke/) — Tax rates and reporting obligations
- [Vanguard](https://investor.vanguard.com/) — ETF expense ratios and historical performance data
- [MSCI](https://www.msci.com/) — Index methodology and benchmark data

---
