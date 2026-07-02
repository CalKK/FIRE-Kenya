<p align="center">
  <img src="https://img.shields.io/badge/FIRE-Kenya-gold?style=for-the-badge&logo=firebase&logoColor=white" alt="FIRE Kenya" />
</p>

<h1 align="center">FIRE Kenya - Financial Independence Dashboard</h1>

<p align="center">
  A personalized Financial Independence, Retire Early (FIRE) planning tool built for Kenyan investors.
  <br />
  Track goals, model decisions, simulate market conditions, and chart your path to retirement by age 50.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Status" />
  <img src="https://img.shields.io/badge/PRs-welcome-orange?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-blueviolet?style=flat-square" alt="Tech Stack" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Launching the Dashboard](#launching-the-dashboard)
  - [Section Guide](#section-guide)
- [Architecture](#architecture)
  - [File Structure](#file-structure)
  - [Data Flow](#data-flow)
- [Configuration](#configuration)
  - [Personal Profile](#personal-profile)
  - [Chart Defaults](#chart-defaults)
- [API Reference](#api-reference)
  - [Core Functions](#core-functions)
  - [Simulation Engine](#simulation-engine)
  - [Decision Lab](#decision-lab)
- [Contributing](#contributing)
  - [Development Workflow](#development-workflow)
  - [Code Style](#code-style)
  - [Pull Request Process](#pull-request-process)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

**FIRE Kenya** is a comprehensive, browser-based financial planning dashboard designed specifically for Kenyan investors pursuing Financial Independence and Early Retirement. It models real Kenyan financial instruments (Treasury Bonds, SACCOs, NSE stocks, Money Market Funds, I-REITs) and accounts for local factors like KES currency, Kenyan inflation rates, NHIF/SHA insurance, and education costs.

The tool is tailored for a 23-year-old professional aiming to retire at age 50 with a family of five, but all parameters are fully configurable.

### Why FIRE Kenya?

- **Localized**: Models Kenyan investment vehicles, tax structures, and cost of living
- **Interactive**: Real-time sliders, charts, and scenario modeling
- **Comprehensive**: Covers budgeting, investing, insurance, tuition, housing, and retirement
- **Zero Dependencies**: Pure HTML, CSS, and vanilla JavaScript - no build step required
- **Private**: All data stays in your browser. No server, no tracking, no accounts

---

## Features

| Feature | Description |
|---|---|
| **Dashboard Overview** | Net worth tracking, budget allocation (50/30/20), portfolio progress gauges |
| **Account Tracking** | Income flow visualization with bucket allocation (Essentials, Investments, Entertainment) |
| **Financial Timeline** | Chronological milestone tracker from current position through FIRE at age 50 |
| **Investment Vehicles** | Detailed cards for T-Bills, T-Bonds, MMFs, NSE stocks, SACCOs, and I-REITs |
| **FIRE Calculator** | Interactive calculator with multiple FIRE types (Lean, Regular, Fat, Barista, Coast) |
| **Scenario Simulator** | Adjustable sliders for salary, savings rate, returns, rent, and family size |
| **Decision Impact Lab** | Model any purchase or income change and visualize its effect on your wealth trajectory |
| **Reverse FIRE Engineering** | Work backward from age 50 to determine required savings, returns, and spending limits |
| **Buy vs Rent Analysis** | Mortgage amortization comparison with property appreciation and opportunity cost |
| **Market Trend Analysis** | Input custom returns for NSE, T-Bonds, MMFs, REITs, SACCOs with allocation sliders |
| **Insurance Planning** | Model health (NHIF/SHA + private), motor vehicle, and life insurance costs |
| **Tuition Forecasting** | Education cost projections for 3 children across primary, secondary, and university |
| **Investment Advice** | Curated wealth-building avenues with risk ratings specific to Kenya |

---

## Demo

Once running locally, the dashboard loads with a cinematic loading animation and presents the Overview section by default. Navigate between sections using the left sidebar.

> **Tip**: Click the preset buttons in the Simulator (e.g., "Aggressive", "High Earner") to instantly model different life scenarios.

---

## Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Modern web browser | Chrome 90+, Firefox 88+, Edge 90+, Safari 15+ | Rendering the dashboard |
| Python (optional) | 3.x | Running the local dev server |
| Node.js (optional) | 14+ | Alternative dev server via `npx` |
| Git | 2.x | Version control |

> **Note**: The dashboard is a static site. Any HTTP server will work. Python and Node are just convenient options.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CalKK/FIRE-Kenya.git
   cd FIRE-Kenya
   ```

2. **Start a local server** (choose one)

   Using Python:
   ```bash
   python -m http.server 8080
   ```

   Using Node.js:
   ```bash
   npx serve -l 8080
   ```

   Using PHP:
   ```bash
   php -S localhost:8080
   ```

3. **Open in browser**

   ```
   http://localhost:8080/index.html
   ```

> **Important**: Do not open `index.html` directly via `file://` protocol. Chart.js requires an HTTP server to load correctly.

---

## Usage

### Launching the Dashboard

After starting the server, the dashboard auto-initializes all charts and calculations on page load. No manual setup is required.

### Section Guide

#### 1. Overview (Default View)

The landing page shows four key metrics:

```
Net Worth  |  Monthly Savings  |  Portfolio Value  |  FIRE Progress
```

Below that, a net worth projection chart and a budget doughnut chart visualize your financial trajectory and spending allocation.

#### 2. Decision Impact Lab

Model any financial decision and see its ripple effect:

```
Input:  "Buy a phone for KES 90,000" at age 24
Output: Opportunity cost of KES 2.4M by age 50 (at 12% returns)
        FIRE delay: +0 years
        Advice: "Manageable impact - ensure it comes from the entertainment bucket"
```

Use the **Quick Scenarios** buttons for common decisions:
- Phone KES 90K
- Laptop KES 150K
- Side Hustle +KES 20K/mo
- Car Upgrade KES 2M
- Wedding KES 500K
- Vacation KES 200K

#### 3. Reverse FIRE Engineering

Set your retirement vision and the tool calculates backward:

```
Input:  Retire at 50, KES 150,000/month expenses, 3.5% withdrawal rate
Output: FIRE Number: KES 138.7M
        Required Monthly Savings: KES 42,300
        Max Monthly Expenditure: KES 16,700
        Required Annual Return: 18.2% p.a.
```

#### 4. Market Trend Analysis

Input custom market returns and adjust your portfolio allocation:

```javascript
// Allocation example
NSE Stocks:     25%    @ 15% return
Treasury Bonds: 25%    @ 12.5% return
MMF:            20%    @ 10% return
I-REITs:        10%    @ 8% return
SACCOs:         15%    @ 14% return
Cash/T-Bills:    5%    @ 8.5% return
// Blended Return: 12.1%
```

#### 5. Protection & Education

Model insurance costs and education expenses:

```
Insurance: NHIF KES 1,700/mo + Private Health KES 5,000/mo (from age 28)
           Car Insurance: 5% of KES 1.25M/year
           Life Insurance: KES 3,000/mo (from age 30)

Tuition:   Child 1 (born 2032): Primary KES 150K → Secondary KES 250K → Uni KES 400K
           Child 2 (born 2034): Same structure
           Child 3 (born 2036): Same structure
           Education inflation: 8% p.a.
```

---

## Architecture

### File Structure

```
FIRE-Kenya/
├── index.html      # UI structure - all sections and navigation (1,620 lines)
├── styles.css      # Design system - dark theme, components, responsive (1,718 lines)
├── app.js          # Application logic - calculations, charts, engine (1,638 lines)
├── README.md       # This documentation
└── .gitignore      # Git ignore rules
```

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Sidebar │  │ Sections │  │ Canvas Elements    │ │
│  │   Nav   │→ │  (12)    │→ │ (Chart.js targets) │ │
│  └─────────┘  └──────────┘  └────────────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │ DOM Events
                        ▼
┌─────────────────────────────────────────────────────┐
│                     app.js                           │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │ PERSONAL │→ │ Simulation │→ │ Chart.js        │ │
│  │  Config  │  │   Engine   │  │ Renderers       │ │
│  └──────────┘  └────────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │ Decision │  │  Reverse   │  │ Market/Tuition  │ │
│  │   Lab    │  │   FIRE     │  │ Forecasting     │ │
│  └──────────┘  └────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   styles.css                         │
│  CSS Custom Properties (Design Tokens)               │
│  Component Styles | Responsive Breakpoints           │
└─────────────────────────────────────────────────────┘
```

### External Dependencies

| Library | Version | CDN | Purpose |
|---|---|---|---|
| Chart.js | 4.4.4 | jsDelivr | All chart visualizations |
| chartjs-plugin-datalabels | 2.2.0 | jsDelivr | Data label overlays on charts |
| Inter (Google Fonts) | Variable | Google Fonts | Primary typeface |
| JetBrains Mono (Google Fonts) | Variable | Google Fonts | Monospace typeface for financial figures |

---

## Configuration

### Personal Profile

All personal financial data is centralized in the `PERSONAL` object at the top of `app.js`:

```javascript
const PERSONAL = {
    currentAge: 23,
    retireAge: 50,
    birthMonth: 'September',
    birthYear: 2002,
    currentSavings: 173000,
    currentPortfolio: 0,
    currentStipend: 15480,
    jobSalary: 59000,
    jobStart: 'Sep 2026',
    jobEnd: 'Jun 2028',
    suitCost: 6995,
    phoneCost: 80000,
    phoneTopUp: 21000,
    weeklyContribution: 350,
    moveOutYear: 2030,
    rentTarget: 40000,
    portfolioTarget1M: 'Jan 2030',
    carBudgetMin: 1000000,
    carBudgetMax: 1500000,
    children: 3,
};
```

To customize for your own situation, modify these values and refresh the page. All calculations update automatically.

### Chart Defaults

Chart styling is controlled via the `chartDefaults` object:

```javascript
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: { color: 'rgba(255,255,255,0.03)' },
            ticks: { color: '#8b92a8', font: { family: 'Inter', size: 11 } }
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.03)' },
            ticks: {
                color: '#8b92a8',
                font: { family: 'Inter', size: 11 },
                callback: value => formatKES(value, true)
            }
        }
    },
    plugins: { ... }
};
```

### CSS Design Tokens

The visual theme is fully configurable via CSS custom properties in `styles.css`:

```css
:root {
    --bg-primary: #0a0e1a;        /* Main background */
    --bg-card: #1a1f35;           /* Card surfaces */
    --accent-primary: #6366f1;    /* Indigo - primary actions */
    --accent-secondary: #fbbf24;  /* Kenyan gold - highlights */
    --accent-success: #10b981;    /* Emerald - positive values */
    --accent-danger: #ef4444;     /* Red - negative values */
    --accent-warning: #f59e0b;    /* Amber - warnings */
    --text-primary: #e2e8f0;      /* Main text */
    --text-secondary: #8b92a8;    /* Subdued text */
}
```

---

## API Reference

### Core Functions

| Function | Description | Parameters |
|---|---|---|
| `formatKES(amount, compact)` | Formats a number as KES currency | `amount`: number, `compact`: boolean (use K/M suffixes) |
| `initNavigation()` | Sets up sidebar section switching | None |
| `recalculateFIRE()` | Runs the main FIRE calculator | None (reads from DOM inputs) |
| `runSimulation()` | Executes the scenario simulator | None (reads from slider values) |

### Simulation Engine

```javascript
// Run a simulation with current slider values
runSimulation();

// Load a preset scenario
loadPreset('aggressive');  // Options: 'current', 'aggressive', 'moderate', 'highEarner'
```

### Decision Lab

```javascript
// Analyze a custom decision
analyzeDecision();  // Reads from decision form inputs

// Load a preset decision
loadDecision('phone');     // Options: 'phone', 'laptop', 'sideHustle',
                           //          'carUpgrade', 'wedding', 'vacation'

// Remove a logged decision
removeDecision(index);     // index: position in decisionLog array
```

### Reverse FIRE

```javascript
// Calculate required figures from retirement target
reverseEngineerFIRE();  // Reads: retire age, monthly expenses,
                        //        withdrawal rate, inflation, returns

// Compare buying vs renting
analyzeBuyVsRent();     // Reads: rent, property price, mortgage terms
```

### Market Analysis

```javascript
// Update allocation percentage display
updateAllocDisplay();

// Run market scenario with custom returns and allocations
simulateMarketScenario();
```

### Protection & Education

```javascript
// Calculate insurance impact on FIRE timeline
calculateInsuranceImpact();

// Forecast tuition costs for 3 children
forecastTuition();
```

---

## Contributing

Contributions are welcome! FIRE Kenya is designed to be extended with new financial models, Kenyan investment vehicles, and improved calculations.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch

   ```bash
   git checkout -b feature/sacco-loan-calculator
   ```

3. **Make** your changes
4. **Test** by running the local server and verifying all sections load without console errors

   ```bash
   python -m http.server 8080
   # Open http://localhost:8080/index.html
   # Check browser DevTools console for errors
   ```

5. **Commit** with a descriptive message

   ```bash
   git commit -m "feat: add SACCO loan amortization calculator"
   ```

6. **Push** and open a Pull Request

   ```bash
   git push origin feature/sacco-loan-calculator
   ```

### Code Style

- **HTML**: 4-space indentation, semantic elements, descriptive `id` attributes
- **CSS**: Use existing CSS custom properties (design tokens) from `:root`. New components should follow the `.component-name` pattern
- **JavaScript**: ES6+ syntax, `const`/`let` (no `var`), template literals for HTML generation, consistent use of `formatKES()` for currency display
- **Comments**: Section headers use `// ==================== SECTION NAME ====================`
- **Naming**: camelCase for functions and variables, kebab-case for CSS classes and HTML IDs

### Commit Message Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    CSS/formatting changes (no logic change)
refactor: Code restructuring
perf:     Performance improvement
```

### Pull Request Process

1. Ensure no console errors in the browser
2. Verify all charts render correctly
3. Test on at least one mobile viewport (responsive design)
4. Update this README if adding new sections or configuration options
5. One approval required for merge

---

## Troubleshooting

### Charts not rendering

**Symptom**: Blank canvas areas where charts should appear.

**Solution**: Ensure you're serving via HTTP, not opening the file directly.

```bash
# Wrong - will fail
file:///C:/Users/User/Downloads/FIRE/index.html

# Correct
http://localhost:8080/index.html
```

### "Chart is not defined" console error

**Symptom**: JavaScript error referencing `Chart`.

**Solution**: Check your internet connection. Chart.js loads from CDN (`cdn.jsdelivr.net`). If offline, download Chart.js locally:

```bash
# Download Chart.js for offline use
curl -o chart.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js
```

Then update the `<script>` tag in `index.html` to point to the local file.

### Sidebar navigation not working

**Symptom**: Clicking sidebar links does nothing.

**Solution**: Ensure `app.js` loads after the DOM. The script tag should be at the bottom of `<body>`, not in `<head>`:

```html
<!-- Correct placement -->
<script src="app.js"></script>
</body>
```

### Port 8080 already in use

**Symptom**: `OSError: [Errno 10048] Address already in use`

**Solution**: Use a different port or kill the existing process:

```bash
# Use a different port
python -m http.server 3000

# Or find and kill the process on 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

### Numbers showing as NaN

**Symptom**: Financial figures display as `NaN` or `KES NaN`.

**Solution**: Check that all input fields have valid numeric values. Reset to defaults by refreshing the page, or verify the `PERSONAL` object in `app.js` has no missing values.

### Allocation sliders don't sum to 100%

**Symptom**: The "Total" display in Market Trends shows a value other than 100%.

**Solution**: This is by design - the total indicator turns green at 100%, amber below, and red above. Adjust sliders until the total reads `Total: 100%` in green before running the simulation.

---

## Roadmap

- [ ] Local storage persistence for user inputs
- [ ] PDF export of financial plan
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

- [Chart.js](https://www.chartjs.org/) - Beautiful, flexible charting library
- [Google Fonts](https://fonts.google.com/) - Inter and JetBrains Mono typefaces
- [Central Bank of Kenya](https://www.centralbank.go.ke/) - Treasury Bills/Bonds data reference
- [Nairobi Securities Exchange](https://www.nse.co.ke/) - Stock market benchmarks
- [Capital Markets Authority Kenya](https://www.cma.or.ke/) - Regulatory framework reference

---

<p align="center">
  Built with 🔥 for the Kenyan investor pursuing Financial Independence
</p>
