/* ============================================================
   FIRE Kenya - Financial Independence Dashboard
   Application Logic & Engine
   ============================================================ */

// ==================== PERSONAL FINANCIAL DATA ====================
const PERSONAL = {
    name: 'Investor',
    currentAge: 23,
    birthMonth: 9,  // September
    birthYear: 2002,
    retireAge: 50,
    retireYear: 2052,
    familySize: 5, // self + wife + 3 children
    children: 3,

    // Current (as of Jul 2026)
    currentSavings: 173000,
    currentPortfolio: 0,
    currentStipend: 15480,

    // Upcoming
    jobStartDate: '2026-09',
    jobEndDate: '2028-06',
    jobSalary: 59000,

    // Purchases
    suitCost: 6995,        // with next (first job) salary
    phoneCost: 80000,      // by Oct 2026 (first paycheck + 21K top-up)
    phoneTopUp: 21000,

    // Housing
    moveOutDate: '2030-12',
    monthlyRent: 40000,

    // Investment Goals
    portfolioGoal: 1000000,    // KES 1M by start of 2030
    portfolioGoalDate: '2030-01',
    carGoal: { min: 1000000, max: 1500000 },
    carGoalDate: '2030-12',

    // Savings strategy
    weeklySavingsStart: '2026-10',
    weeklySavings: 350,
    monthlyAirtime: 1000,

    // Kenya Economic Context
    inflation: 6.0,
    tBillRate: 8.5,
    tBondRate: 12.5,
    mmfRate: 10,
    saccoReturn: 14,
    nseReturn: 15,
    privateEquityReturn: 20,
};

// ==================== KENYA 2026 PAYROLL TAX ENGINE ====================
// Source: KRA Finance Act 2023, NSSF Act 2013 (Year 4, Feb 2026+), SHA Act 2023

function computeNetSalary(grossMonthly) {
    // 1. NSSF (6% employee, Tier I + Tier II)
    const nssf_tier1 = Math.min(grossMonthly, 9000) * 0.06;                          // max 540
    const nssf_tier2 = Math.max(0, Math.min(grossMonthly, 108000) - 9000) * 0.06;    // max 5,940
    const nssf = Math.round(nssf_tier1 + nssf_tier2);                                 // max 6,480

    // 2. SHIF (2.75% of gross, min KES 300, no cap)
    const shif = Math.max(300, Math.round(grossMonthly * 0.0275));

    // 3. Housing Levy (1.5% of gross, NOT tax-deductible since Dec 2024)
    const housingLevy = Math.round(grossMonthly * 0.015);

    // 4. Taxable Income = Gross - NSSF (NSSF is tax-deductible; SHIF & Housing Levy are NOT)
    const taxableIncome = grossMonthly - nssf;

    // 5. PAYE (progressive bands on monthly taxable income)
    let paye = 0;
    let remaining = taxableIncome;

    const bands = [
        { limit: 24000,  rate: 0.10 },
        { limit: 8333,   rate: 0.25 },
        { limit: 467667, rate: 0.30 },
        { limit: 300000, rate: 0.325 },
        { limit: Infinity, rate: 0.35 },
    ];

    for (const band of bands) {
        const taxable = Math.min(remaining, band.limit);
        paye += taxable * band.rate;
        remaining -= taxable;
        if (remaining <= 0) break;
    }
    paye = Math.round(paye);

    // 6. Personal Relief (KES 2,400/month)
    const personalRelief = 2400;
    const payeAfterRelief = Math.max(0, paye - personalRelief);

    // 7. Net Pay
    const totalDeductions = payeAfterRelief + nssf + shif + housingLevy;
    const netPay = grossMonthly - totalDeductions;

    return {
        gross: grossMonthly,
        nssf,
        shif,
        housingLevy,
        taxableIncome,
        payeGross: paye,
        personalRelief,
        paye: payeAfterRelief,
        totalDeductions,
        netPay,
        effectiveTaxRate: ((totalDeductions / grossMonthly) * 100).toFixed(1),
    };
}

// Career stages with gross salary benchmarks
const CAREER_STAGES = [
    { stage: 1, role: 'Intern / Attachment',     gross: 15480,  ageRange: '23',    phase: 'Stipend',    note: 'Below PAYE threshold — minimal deductions' },
    { stage: 2, role: 'Entry-Level Professional', gross: 59000,  ageRange: '24–25', phase: 'Foundation',  note: 'First formal employment — full statutory deductions apply' },
    { stage: 3, role: 'Specialist / Team Lead',   gross: 120000, ageRange: '26–29', phase: 'Acceleration', note: 'NSSF Tier II maxes out — career growth accelerates savings' },
    { stage: 4, role: 'Manager / Senior Engineer', gross: 250000, ageRange: '30–35', phase: 'Wealth Building', note: 'Peak earning growth — 30% PAYE band captures most income' },
    { stage: 5, role: 'Director / Dept. Head',    gross: 450000, ageRange: '36–44', phase: 'Scaling',     note: 'NSSF capped — marginal tax rate 30%. Business income diversifies' },
    { stage: 6, role: 'C-Suite / Founder',        gross: 800000, ageRange: '45–50', phase: 'FIRE Glide',  note: '32.5% band begins — tax optimization becomes critical' },
];

function populateCareerTrajectory() {
    const container = document.getElementById('careerTrajectoryTable');
    if (!container) return;

    const rows = CAREER_STAGES.map(s => {
        const p = computeNetSalary(s.gross);
        return `
        <tr>
            <td><span class="career-stage-badge">S${s.stage}</span></td>
            <td>
                <strong>${s.role}</strong>
                <div class="career-age">${s.ageRange}</div>
            </td>
            <td class="mono-num">${formatKES(p.gross)}</td>
            <td class="mono-num deduction">${formatKES(p.nssf)}</td>
            <td class="mono-num deduction">${formatKES(p.shif)}</td>
            <td class="mono-num deduction">${formatKES(p.housingLevy)}</td>
            <td class="mono-num deduction">${formatKES(p.paye)}</td>
            <td class="mono-num highlight-green"><strong>${formatKES(p.netPay)}</strong></td>
            <td class="mono-num">${p.effectiveTaxRate}%</td>
        </tr>`;
    }).join('');

    container.innerHTML = `
        <table class="career-payslip-table">
            <thead>
                <tr>
                    <th>Stage</th>
                    <th>Role</th>
                    <th>Gross/mo</th>
                    <th>NSSF</th>
                    <th>SHIF</th>
                    <th>Housing</th>
                    <th>PAYE</th>
                    <th>Net Pay</th>
                    <th>Eff. Tax</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="payslip-footnotes">
            <p>PAYE: Finance Act 2023 progressive bands (10% / 25% / 30% / 32.5% / 35%) — Personal Relief KES 2,400/mo applied</p>
            <p>NSSF: Year 4 (Feb 2026+) Tier I (6% up to KES 9K) + Tier II (6% of KES 9K–108K) — Employee portion only</p>
            <p>SHIF: 2.75% of gross (min KES 300, no cap) · Housing Levy: 1.5% of gross (not tax-deductible)</p>
        </div>
    `;
}

// Business Investment Constants
const BUSINESS_INVESTMENTS = [
    {
        name: 'Pest Control Services',
        icon: '🐛',
        capital: { min: 200000, max: 500000 },
        monthlyRevenue: { min: 150000, max: 400000 },
        netMargin: 0.25,
        breakEvenMonths: 9,
        riskLevel: 'Low',
        entryPhase: 'Phase 2 (Age 26+)',
        keySuccess: 'Route density in residential estates + commercial contracts (quarterly recurring)',
    },
    {
        name: 'Commercial Cleaning',
        icon: '🧹',
        capital: { min: 100000, max: 500000 },
        monthlyRevenue: { min: 200000, max: 600000 },
        netMargin: 0.20,
        breakEvenMonths: 6,
        riskLevel: 'Low',
        entryPhase: 'Phase 2 (Age 26+)',
        keySuccess: 'Contract-based janitorial for offices, medical facilities — recurring billing',
    },
    {
        name: 'Accounting & Tax Advisory',
        icon: '📋',
        capital: { min: 300000, max: 2000000 },
        monthlyRevenue: { min: 200000, max: 800000 },
        netMargin: 0.32,
        breakEvenMonths: 12,
        riskLevel: 'Low',
        entryPhase: 'Phase 3 (Age 28+)',
        keySuccess: 'Counter-cyclical demand — acquire practice with recurring client base',
    },
    {
        name: 'HVAC & Plumbing Services',
        icon: '🔧',
        capital: { min: 1000000, max: 5000000 },
        monthlyRevenue: { min: 400000, max: 1500000 },
        netMargin: 0.18,
        breakEvenMonths: 18,
        riskLevel: 'Low-Medium',
        entryPhase: 'Phase 4 (Age 32+)',
        keySuccess: 'Emergency-driven demand + recurring maintenance contracts',
    },
    {
        name: 'Veterinary Services',
        icon: '🐾',
        capital: { min: 3000000, max: 10000000 },
        monthlyRevenue: { min: 500000, max: 2000000 },
        netMargin: 0.20,
        breakEvenMonths: 27,
        riskLevel: 'Medium',
        entryPhase: 'Phase 5 (Age 38+)',
        keySuccess: 'Emotionally inelastic demand — acquire practice with licensed vets + wellness plans',
    },
];

// ==================== OFF-BOOK INCOME ====================
let offBookIncome = 0;
let offBookType = 'monthly';

function announceToScreenReader(msg) {
    const el = document.getElementById('announcement-region');
    if (el) {
        el.textContent = msg;
    }
}

function applyOffBookIncome() {
    const amount = parseFloat(document.getElementById('offBookAmount').value) || 0;
    offBookType = document.getElementById('offBookType').value;
    offBookIncome = amount;

    if (offBookType === 'onetime') {
        document.getElementById('offBookDisplay').textContent = formatKES(offBookIncome) + ' (One-time)';
    } else {
        document.getElementById('offBookDisplay').textContent = formatKES(offBookIncome) + '/mo';
    }

    // Announce for screen readers
    announceToScreenReader(`Off the book income applied: ${formatKES(offBookIncome)} (${offBookType === 'onetime' ? 'one-time' : 'monthly recurring'})`);

    // Re-trigger all calculations and charts
    updateFlowAmounts(PERSONAL.currentStipend);
    initBudgetDoughnut();
    initNetWorthChart();
    recalculateFIRE();
    runSimulation();
    reverseEngineerFIRE();
    simulateMarketScenario();
}

// ==================== FORMATTING HELPERS ====================
function formatKES(amount, compact = false) {
    if (compact && Math.abs(amount) >= 1e6) {
        return 'KES ' + (amount / 1e6).toFixed(1) + 'M';
    }
    if (compact && Math.abs(amount) >= 1e3) {
        return 'KES ' + (amount / 1e3).toFixed(0) + 'K';
    }
    return 'KES ' + amount.toLocaleString('en-KE', { maximumFractionDigits: 0 });
}

function formatPct(val) {
    return val.toFixed(1) + '%';
}

// ==================== NAVIGATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLoadingScreen();
    initMobileNav();
    setCurrentDate();
    populateGoals();
    populateTimeline();
    populateFireTypes();
    initSimulatorSliders();
    populateWealthAvenues();
    initFeeDragCalculator();
    populateCareerTrajectory();

    // Initialize all charts after a small delay to ensure DOM is ready
    setTimeout(() => {
        initNetWorthChart();
        initBudgetDoughnut();
        initPortfolioAllocationChart();
        initInvestmentGrowthChart();
        recalculateFIRE();
        runSimulation();
        reverseEngineerFIRE();
        simulateMarketScenario();
        calculateInsuranceImpact();
        forecastTuition();
    }, 100);
});

function initLoadingScreen() {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2200);
}

function initFeeDragCalculator() {
    const principalInput = document.getElementById('feeCalcPrincipal');
    const yearsSlider = document.getElementById('feeCalcYears');
    const returnSlider = document.getElementById('feeCalcReturn');
    const etfFeeInput = document.getElementById('feeCalcEtfFee');
    const activeFeeInput = document.getElementById('feeCalcActiveFee');

    const yearsVal = document.getElementById('feeCalcYearsVal');
    const returnVal = document.getElementById('feeCalcReturnVal');
    
    const resultEtf = document.getElementById('feeResultEtf');
    const resultActive = document.getElementById('feeResultActive');
    const resultDrag = document.getElementById('feeResultDrag');

    if (!principalInput || !yearsSlider || !returnSlider || !etfFeeInput || !activeFeeInput) return;

    function update() {
        const principal = parseFloat(principalInput.value) || 0;
        const years = parseInt(yearsSlider.value) || 0;
        const grossReturn = (parseFloat(returnSlider.value) || 0) / 100;
        const etfFee = (parseFloat(etfFeeInput.value) || 0) / 100;
        const activeFee = (parseFloat(activeFeeInput.value) || 0) / 100;

        if (yearsVal) yearsVal.textContent = `${years} Years`;
        if (returnVal) returnVal.textContent = `${(grossReturn * 100).toFixed(0)}%`;

        const etfNetRate = grossReturn - etfFee;
        const activeNetRate = grossReturn - activeFee;

        const etfYield = principal * Math.pow(1 + etfNetRate, years);
        const activeYield = principal * Math.pow(1 + activeNetRate, years);
        const drag = etfYield - activeYield;
        const dragPct = etfYield > 0 ? (drag / etfYield) * 100 : 0;

        if (resultEtf) resultEtf.textContent = formatKES(etfYield);
        if (resultActive) resultActive.textContent = formatKES(activeYield);
        if (resultDrag) resultDrag.textContent = `${formatKES(drag)} (${dragPct.toFixed(1)}%)`;
    }

    principalInput.addEventListener('input', update);
    yearsSlider.addEventListener('input', update);
    returnSlider.addEventListener('input', update);
    etfFeeInput.addEventListener('input', update);
    activeFeeInput.addEventListener('input', update);

    update();
}


function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link, idx) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;

            // Update active link
            links.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            // Show section
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(sectionId);
            if (target) {
                target.classList.add('active');
                // Re-trigger animations
                target.style.animation = 'none';
                target.offsetHeight;
                target.style.animation = '';

                // Move focus to section for screen readers
                target.setAttribute('tabindex', '-1');
                target.focus();
            }

            // Close mobile nav
            document.getElementById('sidebar').classList.remove('open');
        });

        // Keyboard navigation (arrow keys to move focus)
        link.addEventListener('keydown', (e) => {
            let targetIdx = -1;
            if (e.key === 'ArrowDown') {
                targetIdx = (idx + 1) % links.length;
            } else if (e.key === 'ArrowUp') {
                targetIdx = (idx - 1 + links.length) % links.length;
            } else if (e.key === 'Home') {
                targetIdx = 0;
            } else if (e.key === 'End') {
                targetIdx = links.length - 1;
            }

            if (targetIdx !== -1) {
                e.preventDefault();
                links[targetIdx].focus();
            }
        });
    });
}

function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            !toggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-KE', options);
}

// ==================== GOAL TRACKER ====================
function populateGoals() {
    const goals = [
        {
            icon: '👔',
            title: 'Buy Suit',
            target: 6995,
            saved: 0,
            date: 'Sep 2026',
            note: 'First paycheck purchase'
        },
        {
            icon: '📱',
            title: 'Buy Phone (KES 80K)',
            target: 80000,
            saved: 0,
            date: 'Oct 2026',
            note: 'First paycheck + KES 21K top-up'
        },
        {
            icon: '💼',
            title: 'KES 1M Portfolio',
            target: 1000000,
            saved: 0,
            date: 'Jan 2030',
            note: 'Investment portfolio milestone'
        },
        {
            icon: '🏠',
            title: 'Move Out (Rent KES 40K)',
            target: 480000,
            saved: 0,
            date: 'Dec 2030',
            note: '12 months rent + deposit'
        },
        {
            icon: '🚗',
            title: 'First Car (KES 1M–1.5M)',
            target: 1250000,
            saved: 0,
            date: 'Dec 2030',
            note: 'Target midrange: KES 1.25M'
        },
        {
            icon: '🔥',
            title: 'FIRE at Age 50',
            target: 18000000,
            saved: 173000,
            date: 'Sep 2052',
            note: 'Full financial independence'
        },
    ];

    const grid = document.getElementById('goalsGrid');
    grid.innerHTML = goals.map(g => {
        const pct = Math.min(100, (g.saved / g.target) * 100);
        const isComplete = pct >= 100;
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <span class="goal-title">${g.icon} ${g.title}</span>
                    <span class="goal-date">${g.date}</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill ${isComplete ? 'complete' : ''}" style="width: ${pct}%"></div>
                </div>
                <div class="goal-detail">
                    <span>${formatKES(g.saved)} / ${formatKES(g.target, true)}</span>
                    <span>${pct.toFixed(1)}%</span>
                </div>
                <div class="goal-detail" style="margin-top:0.25rem;">
                    <span style="color:var(--text-muted);font-size:0.72rem;">${g.note}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== TIMELINE ====================
function populateTimeline() {
    const events = [
        { date: 'Jul 2026', title: '📍 Now - Current Position', desc: `Stipend income of ${formatKES(PERSONAL.currentStipend)}/month (net ${formatKES(computeNetSalary(PERSONAL.currentStipend).netPay)}). Total savings: ${formatKES(PERSONAL.currentSavings)}. Investment portfolio: KES 0.`, amount: 'Savings: KES 173,000', type: 'current' },
        { date: 'Sep 2026', title: '💼 Start Job (Stage 2)', desc: `Gross ${formatKES(PERSONAL.jobSalary)}/month → Net ${formatKES(computeNetSalary(PERSONAL.jobSalary).netPay)} after PAYE, NSSF, SHIF & Housing Levy. Buy ${formatKES(PERSONAL.suitCost)} suit.`, amount: `Net: ${formatKES(computeNetSalary(PERSONAL.jobSalary).netPay)}/mo`, type: 'milestone' },
        { date: 'Oct 2026', title: '📱 Buy Phone', desc: 'KES 80,000 phone. First paycheck + KES 21,000 top-up from savings. Start weekly KES 350 savings to MMF.', amount: 'Phone: KES 80,000', type: 'milestone' },
        { date: 'Oct 2026', title: '💰 Weekly Savings Begin', desc: 'KES 350/week = KES 1,400/month deposited into Money Market Fund.', amount: 'KES 350/week', type: '' },
        { date: 'Jan 2027', title: '🏦 Open DhowCSD & SACCO', desc: 'Register on DhowCSD for T-Bills/Bonds. Join a SACCO (KES 2,000/month shares). Start building credit history.', amount: '', type: '' },
        { date: 'Mar 2027', title: '📊 First T-Bill Purchase', desc: 'MMF balance reaches KES 50,000. Roll into 91-day Treasury Bills at ~8.5% yield.', amount: 'T-Bill: KES 50,000', type: '' },
        { date: 'Jun 2027', title: '📈 Start Stock Investing', desc: 'Begin monthly KES 5,000 NSE purchases. Focus on Safaricom, Equity Group, KCB via Ziidi app.', amount: 'Stocks: KES 5,000/mo', type: '' },
        { date: 'Sep 2027', title: '🎂 Turn 25', desc: 'Age 25 - review investment allocation. Portfolio target check: on track for KES 1M by 2030.', amount: '', type: '' },
        { date: 'Jan 2028', title: '⚖️ Onboard Special Fund Advisory', desc: 'Onboard into CMA-regulated Special Funds (e.g., SIB Mansa-X or Faida OAK) with KES 100,000 from accumulated savings. Set up KES 5,000/month contributions under advisor-guided tactical asset allocation.', amount: 'Entry: KES 100,000', type: '' },
        { date: 'Jun 2028', title: '🔄 Job Contract Ends', desc: 'End of initial KES 59,000/month contract. Estimated savings: ~KES 350K+. Career transition or upgrade.', amount: '', type: 'milestone' },
        { date: 'Jul 2028', title: '📈 Stage 3: Specialist', desc: `Target next role at KES 120K gross → Net ${formatKES(computeNetSalary(120000).netPay)}/month. Increase investment allocation to 30%+.`, amount: `Net: ${formatKES(computeNetSalary(120000).netPay)}/mo`, type: 'milestone' },
        { date: 'Oct 2028', title: '🐛 Launch Pest Control Business', desc: 'First recession-resistant business: KES 200K–500K capital from savings + SACCO loan. Build route density in residential estates and commercial clients (hotels, warehouses). 85%+ recurring revenue from quarterly contracts. Projected KES 150K–400K/month revenue at 25% net margin. Break-even: 6–12 months.', amount: 'Capital: KES 200-500K', type: 'milestone' },
        { date: 'Jan 2030', title: '🎯 KES 1M Portfolio!', desc: 'Investment portfolio hits KES 1 million milestone. Diversified across T-Bonds, stocks, MMF, SACCO, and pest control cash flows.', amount: '🎉 KES 1,000,000', type: 'milestone' },
        { date: 'Dec 2030', title: '🏠 Move Out + 🚗 Buy Car', desc: 'Rent at KES 40,000/month. Purchase first car (KES 1M-1.5M). Major lifestyle upgrade - budget restructure required.', amount: 'Car: KES 1-1.5M', type: 'milestone' },
        { date: 'Jun 2031', title: '🧹 Launch Commercial Cleaning Co.', desc: 'Second recession-resistant business: KES 100K–500K capital. Contract-based janitorial services for offices, medical facilities, and commercial properties. Recurring monthly billing. Post-pandemic hygiene standards drive demand. Pest control cash flows fund expansion. Projected KES 200K–600K/month revenue at 20% margin.', amount: 'Capital: KES 100-500K', type: 'milestone' },
        { date: '2032', title: '💍 Marriage & Family', desc: `Stage 4: Manager role at KES 250K gross → Net ${formatKES(computeNetSalary(250000).netPay)}/month. Start family. Budget for wife and children. Two recession-proof businesses generating passive cash flow.`, amount: `Net: ${formatKES(computeNetSalary(250000).netPay)}/mo`, type: '' },
        { date: '2033', title: '📋 Acquire Accounting/Tax Practice', desc: 'Acquire an existing accounting and tax advisory practice with recurring client base (KES 300K–2M). Counter-cyclical demand — economic stress increases need for KRA compliance and financial advisory. Cloud tools (QuickBooks, Xero) enable remote delivery. 25–40% net margins. Pest control + cleaning cash flows fund acquisition.', amount: 'Capital: KES 300K-2M', type: 'milestone' },
        { date: '2034', title: '💵 USD Special Fund Diversification', desc: 'Diversify into USD-denominated Special Funds (e.g., Mansa-X USD) under macro wealth advisory to hedge against local currency (KES) depreciation. Allocate 10% of portfolio to capture global alpha.', amount: 'USD Hedging', type: '' },
        { date: '2035–2037', title: '🔧 Acquire HVAC & Plumbing Company', desc: 'Acquire an established HVAC and plumbing services company with licensed technicians and maintenance contracts (KES 1M–5M). Emergency-driven, non-deferrable demand. Nairobi\'s commercial real estate boom drives sustained need. Recurring service agreements provide predictable cash flow. KES 400K–1.5M/month revenue at 18% margin.', amount: 'Capital: KES 1-5M', type: 'milestone' },
        { date: '2035–2040', title: '🏗️ Property Investment', desc: 'Consider buying property via SACCO mortgage. Build equity and eliminate rent. Explore D-REITs for diversification.', amount: '', type: '' },
        { date: '2037', title: '📈 Stage 5: Director', desc: `Promotion to Director/Dept Head at KES 450K gross → Net ${formatKES(computeNetSalary(450000).netPay)}/month. Four recession-resistant businesses (pest control, cleaning, accounting, HVAC/plumbing) generating combined KES 500K+ passive monthly income.`, amount: `Net: ${formatKES(computeNetSalary(450000).netPay)}/mo`, type: 'milestone' },
        { date: '2040–2045', title: '📚 Children\'s Education Peak', desc: 'School fees for 3 children. Unit trust education funds + business income cover majority. Maintain investment discipline.', amount: '', type: '' },
        { date: '2042', title: '🐾 Acquire Veterinary Practice', desc: 'Crown jewel recession-resistant business: Acquire an established multi-vet practice (KES 3M–10M). Emotionally inelastic demand — pet owners treat vet care as essential. Kenya\'s rising middle class drives pet ownership. Wellness plans create recurring revenue. Also serves agricultural/livestock sector. KES 500K–2M/month revenue at 20% margin.', amount: 'Capital: KES 3-10M', type: 'milestone' },
        { date: '2045', title: '🛡️ Stage 6: C-Suite / Founder', desc: `KES 800K gross → Net ${formatKES(computeNetSalary(800000).netPay)}/month. Five recession-resistant businesses (pest control, cleaning, accounting, HVAC/plumbing, veterinary) + paper portfolio generating combined KES 1.5M+/month passive income. Begin conservative shift.`, amount: `Net: ${formatKES(computeNetSalary(800000).netPay)}/mo`, type: 'milestone' },
        { date: '2046', title: '🛡️ Retirement Asset Restructuring', desc: 'Systems-wide de-risking under advisory guidance. Transition aggressive Special Fund equity/derivative assets into low-volatility, capital-preservation focused sub-funds.', amount: 'De-risking', type: '' },
        { date: '2045–2050', title: '🛡️ FIRE Glide Path', desc: 'Shift to conservative allocation (70% bonds). Build 2-year cash buffer. Business portfolio self-sustaining with hired managers. Establish passive income streams.', amount: '', type: '' },
        { date: 'Sep 2052', title: '🔥 FIRE - Retire at 50!', desc: 'Financial Independence achieved. Passive income from bonds, dividends, rental income, SACCO interest, and 5 recession-resistant businesses (pest control, commercial cleaning, accounting, HVAC/plumbing, veterinary) covers all family expenses — in any economic climate.', amount: '🔥 FIRE!', type: 'milestone' },
    ];

    const container = document.getElementById('timelineContainer');
    container.innerHTML = events.map((ev, i) => `
        <div class="timeline-item ${ev.type}" style="animation-delay: ${i * 0.08}s">
            <div class="timeline-date">${ev.date}</div>
            <div class="timeline-title">${ev.title}</div>
            <div class="timeline-desc">${ev.desc}</div>
            ${ev.amount ? `<span class="timeline-amount">${ev.amount}</span>` : ''}
        </div>
    `).join('');
}

// ==================== CHARTS ====================
// Shared chart config
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(26, 31, 53, 0.95)',
            titleColor: '#f0f2f8',
            bodyColor: '#8b92a8',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#5a6178', font: { family: 'Inter', size: 11 } }
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: {
                color: '#5a6178',
                font: { family: 'JetBrains Mono', size: 11 },
                callback: val => {
                    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
                    if (val >= 1e3) return (val / 1e3).toFixed(0) + 'K';
                    return val;
                }
            }
        }
    }
};

let netWorthChart, budgetDoughnutChart, portfolioAllocChart, investGrowthChart, fireProjectionChart, simChart;

// ---- Net Worth Projection ----
function initNetWorthChart() {
    const canvas = document.getElementById('netWorthChart');
    if (!canvas) return;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');
    const { labels, projected, fireTarget } = projectNetWorth();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

    netWorthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Projected Net Worth',
                    data: projected,
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#6366f1',
                },
                {
                    label: 'FIRE Target',
                    data: fireTarget,
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: false,
                    tension: 0,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true)
                    }
                }
            }
        }
    });
}

function projectNetWorth() {
    const labels = [];
    const projected = [];
    const fireTarget = [];

    let netWorth = PERSONAL.currentSavings;
    if (offBookType === 'onetime') netWorth += offBookIncome;

    let monthlySalary = PERSONAL.currentStipend;
    let savingsRate = 0.30;
    let investReturn = 0.12;
    let rent = 0;
    const fireNum = 18000000;

    for (let year = 2026; year <= 2052; year++) {
        labels.push(year.toString());

        // Adjust salary/phases
        if (year >= 2026 && year < 2028) {
            if (year >= 2027) monthlySalary = PERSONAL.jobSalary;
        } else if (year >= 2028 && year < 2030) {
            monthlySalary = 100000; // career growth
        } else if (year >= 2030 && year < 2035) {
            monthlySalary = 150000;
            rent = 40000;
        } else if (year >= 2035 && year < 2040) {
            monthlySalary = 250000;
            rent = 60000;
        } else if (year >= 2040 && year < 2045) {
            monthlySalary = 350000;
            rent = 0; // assume property purchase
        } else if (year >= 2045) {
            monthlySalary = 450000;
        }

        const activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;
        // Annual investment growth + monthly contributions
        const annualContribution = (monthlySalary + activeOffBook - rent) * savingsRate * 12;
        netWorth = netWorth * (1 + investReturn) + annualContribution - (PERSONAL.monthlyAirtime * 12);

        // Big purchases
        if (year === 2026) netWorth -= (PERSONAL.suitCost + PERSONAL.phoneCost);
        if (year === 2030) netWorth -= 1250000; // car

        projected.push(Math.max(0, Math.round(netWorth)));
        fireTarget.push(fireNum);
    }

    return { labels, projected, fireTarget };
}

// ---- Budget Doughnut ----
function initBudgetDoughnut() {
    const canvas = document.getElementById('budgetDoughnut');
    if (!canvas) return;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');

    budgetDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Essentials (50%)', 'Investment (30%)', 'Entertainment (20%)'],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: ['#06b6d4', '#10b981', '#6366f1'],
                borderColor: 'transparent',
                borderWidth: 0,
                hoverOffset: 8,
                spacing: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#8b92a8',
                        font: { family: 'Inter', size: 11 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                    }
                },
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: ctx => {
                            const income = PERSONAL.currentStipend + (offBookType === 'onetime' ? offBookIncome / 12 : offBookIncome);
                            const val = Math.round(income * ctx.parsed / 100);
                            return ctx.label + ': ' + formatKES(val);
                        }
                    }
                }
            }
        }
    });
}

// ---- Portfolio Allocation ----
function initPortfolioAllocationChart() {
    const canvas = document.getElementById('portfolioAllocationChart');
    if (!canvas) return;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');

    portfolioAllocChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Money Market Funds (20%)',
                'Treasury Bills (15%)',
                'Treasury Bonds (25%)',
                'NSE Stocks (25%)',
                'SACCO (10%)',
                'Private Equity (5%)'
            ],
            datasets: [{
                data: [20, 15, 25, 25, 10, 5],
                backgroundColor: [
                    '#06b6d4', '#22d3ee', '#10b981',
                    '#6366f1', '#fbbf24', '#ef4444'
                ],
                borderColor: 'transparent',
                hoverOffset: 8,
                spacing: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#8b92a8',
                        font: { family: 'Inter', size: 10 },
                        padding: 10,
                        usePointStyle: true,
                        pointStyleWidth: 8,
                    }
                },
                tooltip: chartDefaults.plugins.tooltip,
            }
        }
    });
}

// ---- Investment Growth by Vehicle ----
function initInvestmentGrowthChart() {
    const canvas = document.getElementById('investmentGrowthChart');
    if (!canvas) return;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');

    const years = [];
    for (let y = 2026; y <= 2052; y++) years.push(y.toString());

    // Simulate growth of each vehicle
    const mmf = growAsset(years, 5000, 200, 0.10);
    const tbills = growAsset(years, 0, 300, 0.085, 2027);
    const tbonds = growAsset(years, 0, 500, 0.125, 2027);
    const stocks = growAsset(years, 0, 400, 0.15, 2027);
    const sacco = growAsset(years, 0, 200, 0.14, 2027);

    investGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                { label: 'MMF', data: mmf, borderColor: '#06b6d4', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 },
                { label: 'T-Bills', data: tbills, borderColor: '#22d3ee', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 },
                { label: 'T-Bonds', data: tbonds, borderColor: '#10b981', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 },
                { label: 'NSE Stocks', data: stocks, borderColor: '#6366f1', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 },
                { label: 'SACCO', data: sacco, borderColor: '#fbbf24', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0 },
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#8b92a8',
                        font: { family: 'Inter', size: 11 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                    }
                },
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true)
                    }
                }
            }
        }
    });
}

function growAsset(years, initialInvest, monthlyAdd, annualRate, startYear = 2026) {
    const data = [];
    let balance = 0;

    years.forEach((y, i) => {
        const yr = parseInt(y);
        if (yr < startYear) {
            data.push(0);
            return;
        }
        if (yr === startYear) {
            balance = initialInvest;
        }
        // Scale monthly contributions with career growth
        let monthly = monthlyAdd;
        if (yr >= 2028) monthly *= 1.5;
        if (yr >= 2030) monthly *= 1.8;
        if (yr >= 2035) monthly *= 2.5;
        if (yr >= 2040) monthly *= 3;
        if (yr >= 2045) monthly *= 3.5;

        balance = balance * (1 + annualRate) + monthly * 12;
        data.push(Math.round(balance));
    });

    return data;
}

// ==================== FIRE CALCULATOR ====================
function recalculateFIRE() {
    const annualExpenses = parseFloat(document.getElementById('fireAnnualExpenses').value) || 720000;
    const withdrawalRate = parseFloat(document.getElementById('fireWithdrawalRate').value) / 100 || 0.04;
    const expectedReturn = parseFloat(document.getElementById('fireExpectedReturn').value) / 100 || 0.12;
    const inflationRate = parseFloat(document.getElementById('fireInflation').value) / 100 || 0.06;
    const monthlyInvest = parseFloat(document.getElementById('fireMonthlyInvest').value) || 17700;
    const retireAge = parseInt(document.getElementById('fireRetireAge').value) || 50;

    // FIRE Number = Annual Expenses / Withdrawal Rate
    // Adjust for inflation to retirement
    const yearsToRetire = retireAge - PERSONAL.currentAge;
    const inflatedExpenses = annualExpenses * Math.pow(1 + inflationRate, yearsToRetire);
    const fireNumber = inflatedExpenses / withdrawalRate;

    // Update FIRE metrics
    const activeNetWorth = PERSONAL.currentSavings + (offBookType === 'onetime' ? offBookIncome : 0);
    document.getElementById('fireNumber').textContent = formatKES(Math.round(fireNumber));
    document.getElementById('fireNetWorth').textContent = formatKES(activeNetWorth);
    const progress = (activeNetWorth / fireNumber) * 100;
    document.getElementById('fireProgressPct').textContent = formatPct(progress) + ' of FIRE';
    document.getElementById('fireYears').textContent = yearsToRetire;

    // Update overview KPI
    document.getElementById('kpiFire').textContent = formatPct(progress);
    document.getElementById('kpiFireNote').textContent = `${yearsToRetire} years to FIRE`;

    // Simulate year-by-year to find FIRE crossover
    const labels = [];
    const portfolioData = [];
    const fireTargetData = [];
    let portfolio = PERSONAL.currentSavings;
    if (offBookType === 'onetime') portfolio += offBookIncome;
    let monthlySaving = monthlyInvest;
    let fireAchievedAge = null;
    const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;

    for (let age = PERSONAL.currentAge; age <= Math.max(retireAge + 5, 55); age++) {
        labels.push(`Age ${age}`);

        // Scale monthly savings with career growth (rough model)
        if (age >= 26) monthlySaving = monthlyInvest * 1.3;
        if (age >= 28) monthlySaving = monthlyInvest * 2;
        if (age >= 32) monthlySaving = monthlyInvest * 3;
        if (age >= 38) monthlySaving = monthlyInvest * 4;
        if (age >= 44) monthlySaving = monthlyInvest * 5;

        const activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;
        const activeMonthlySaving = monthlySaving + (activeOffBook * 0.30);
        portfolio = portfolio * (1 + expectedReturn) + activeMonthlySaving * 12 - (PERSONAL.monthlyAirtime * 12);

        // Adjust FIRE number for inflation each year
        const yearlyFireNum = (annualExpenses * Math.pow(1 + inflationRate, age - PERSONAL.currentAge)) / withdrawalRate;

        portfolioData.push(Math.round(portfolio));
        fireTargetData.push(Math.round(yearlyFireNum));

        if (!fireAchievedAge && portfolio >= yearlyFireNum) {
            fireAchievedAge = age;
        }
    }

    // Update on-track status
    const onTrackEl = document.getElementById('fireOnTrack');
    if (fireAchievedAge && fireAchievedAge <= retireAge) {
        onTrackEl.textContent = `On track! FIRE at age ${fireAchievedAge} ✅`;
        onTrackEl.style.color = 'var(--accent-success)';
    } else if (fireAchievedAge) {
        onTrackEl.textContent = `FIRE at age ${fireAchievedAge} - ${fireAchievedAge - retireAge} years late ⚠️`;
        onTrackEl.style.color = 'var(--accent-warning)';
    } else {
        onTrackEl.textContent = 'Increase savings or returns ❌';
        onTrackEl.style.color = 'var(--accent-danger)';
    }

    // Update FIRE Projection Chart
    updateFireProjectionChart(labels, portfolioData, fireTargetData, fireAchievedAge);

    // Update FIRE Types
    updateFireTypes(annualExpenses, fireNumber);
}

function updateFireProjectionChart(labels, portfolioData, fireTargetData, fireAchievedAge) {
    const ctx = document.getElementById('fireProjectionChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

    // Color portfolio green after FIRE is achieved
    const borderColors = labels.map((_, i) => {
        if (fireAchievedAge) {
            const age = PERSONAL.currentAge + i;
            return age >= fireAchievedAge ? '#10b981' : '#6366f1';
        }
        return '#6366f1';
    });

    if (fireProjectionChart) fireProjectionChart.destroy();

    fireProjectionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Portfolio',
                    data: portfolioData,
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    segment: {
                        borderColor: ctx => {
                            const age = PERSONAL.currentAge + ctx.p0DataIndex;
                            return (fireAchievedAge && age >= fireAchievedAge) ? '#10b981' : '#6366f1';
                        }
                    }
                },
                {
                    label: 'FIRE Number',
                    data: fireTargetData,
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true)
                    }
                }
            }
        }
    });
}

// ---- FIRE Types ----
function populateFireTypes() {
    // placeholder - updated dynamically
}

function updateFireTypes(annualExpenses, fireNumber) {
    const types = [
        {
            emoji: '🪶',
            name: 'Lean FIRE',
            desc: 'Minimalist lifestyle. Cover only basic needs.',
            target: formatKES(Math.round(annualExpenses * 0.6 * 25)),
            active: false
        },
        {
            emoji: '⚖️',
            name: 'Regular FIRE',
            desc: 'Comfortable lifestyle matching current spending.',
            target: formatKES(Math.round(fireNumber)),
            active: true
        },
        {
            emoji: '💎',
            name: 'Fat FIRE',
            desc: 'Premium lifestyle with luxury spending.',
            target: formatKES(Math.round(annualExpenses * 1.5 * 25)),
            active: false
        },
        {
            emoji: '☕',
            name: 'Coast FIRE',
            desc: 'Stop investing, let compound growth do the work.',
            target: 'Achievable once portfolio reaches critical mass',
            active: false
        }
    ];

    const grid = document.getElementById('fireTypesGrid');
    grid.innerHTML = types.map(t => `
        <div class="fire-type-card ${t.active ? 'active' : ''}">
            <div class="fire-type-emoji">${t.emoji}</div>
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
            <p style="margin-top:0.5rem;font-family:var(--font-mono);font-size:0.82rem;color:var(--accent-primary-light);">${t.target}</p>
        </div>
    `).join('');
}

// ==================== SIMULATOR ====================
function initSimulatorSliders() {
    const sliders = [
        { id: 'simSalary', display: 'simSalaryValue', format: v => formatKES(parseInt(v)) },
        { id: 'simSavingsRate', display: 'simSavingsRateValue', format: v => v + '%' },
        { id: 'simRent', display: 'simRentValue', format: v => formatKES(parseInt(v)) },
        { id: 'simReturn', display: 'simReturnValue', format: v => v + '%' },
        { id: 'simGrowth', display: 'simGrowthValue', format: v => v + '%' },
        { id: 'simChildren', display: 'simChildrenValue', format: v => v },
    ];

    sliders.forEach(s => {
        const slider = document.getElementById(s.id);
        const display = document.getElementById(s.display);
        slider.addEventListener('input', () => {
            display.textContent = s.format(slider.value);
        });
    });
}

function runSimulation() {
    const salary = parseFloat(document.getElementById('simSalary').value);
    const savingsRate = parseFloat(document.getElementById('simSavingsRate').value) / 100;
    const rent = parseFloat(document.getElementById('simRent').value);
    const annualReturn = parseFloat(document.getElementById('simReturn').value) / 100;
    const salaryGrowth = parseFloat(document.getElementById('simGrowth').value) / 100;
    const children = parseInt(document.getElementById('simChildren').value);

    const activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;
    const monthlyInvest = (salary + activeOffBook - rent) * savingsRate;
    document.getElementById('simMonthlySavings').textContent = formatKES(Math.round(monthlyInvest));

    // Simulate year by year
    let portfolio = PERSONAL.currentSavings;
    if (offBookType === 'onetime') portfolio += offBookIncome;
    let currentSalary = salary;
    let currentRent = rent;
    const labels = [];
    const data = [];
    const fireData = [];
    let fireAge = null;

    // Expenses model (family of 5 baseline scaled by children)
    const baseMonthlyExpense = 60000 + (children * 15000);
    const annualExpense = baseMonthlyExpense * 12;
    const fireNum = annualExpense * 25;

    for (let age = PERSONAL.currentAge; age <= 55; age++) {
        labels.push(`Age ${age}`);

        const yearlyContrib = Math.max(0, (currentSalary + activeOffBook - currentRent) * savingsRate * 12);
        portfolio = portfolio * (1 + annualReturn) + yearlyContrib - (PERSONAL.monthlyAirtime * 12);

        // Deductions
        if (age === 24) portfolio -= (PERSONAL.suitCost + PERSONAL.phoneCost);
        if (age === 28) portfolio -= 1250000; // car

        data.push(Math.round(Math.max(0, portfolio)));

        // Inflation-adjusted FIRE number
        const inflAdjFireNum = fireNum * Math.pow(1.06, age - PERSONAL.currentAge);
        fireData.push(Math.round(inflAdjFireNum));

        if (!fireAge && portfolio >= inflAdjFireNum) fireAge = age;

        // Salary growth
        currentSalary *= (1 + salaryGrowth);
        // Rent growth
        if (currentRent > 0) currentRent *= 1.05;
    }

    // Update results
    const atRetire = data[PERSONAL.retireAge - PERSONAL.currentAge] || data[data.length - 1];
    document.getElementById('simPortfolioAt50').textContent = formatKES(atRetire, true);

    const fireNumAt50 = fireData[PERSONAL.retireAge - PERSONAL.currentAge] || fireData[fireData.length - 1];
    const achieved = atRetire >= fireNumAt50;

    document.getElementById('simFireAchieved').textContent = achieved ? '✅ Yes!' : '❌ Not yet';
    document.getElementById('simFireAchieved').style.color = achieved ? 'var(--accent-success)' : 'var(--accent-danger)';

    document.getElementById('simFireAge').textContent = fireAge ? `Age ${fireAge}` : '> 55';
    document.getElementById('simFireAge').style.color = fireAge && fireAge <= 50 ? 'var(--accent-success)' : 'var(--accent-warning)';

    // Chart
    updateSimChart(labels, data, fireData);
}

function updateSimChart(labels, data, fireData) {
    const ctx = document.getElementById('simChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

    if (simChart) simChart.destroy();

    simChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Portfolio Value',
                    data,
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                },
                {
                    label: 'FIRE Target',
                    data: fireData,
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#8b92a8',
                        font: { family: 'Inter', size: 11 },
                        padding: 16,
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true)
                    }
                }
            }
        }
    });
}

// ---- Presets ----
function loadPreset(name) {
    const presets = {
        current: { salary: 59000, savingsRate: 30, rent: 0, returnRate: 12, growth: 8, children: 3 },
        aggressive: { salary: 59000, savingsRate: 50, rent: 0, returnRate: 15, growth: 10, children: 3 },
        moderate: { salary: 59000, savingsRate: 20, rent: 25000, returnRate: 10, growth: 6, children: 3 },
        highEarner: { salary: 200000, savingsRate: 40, rent: 40000, returnRate: 14, growth: 12, children: 3 },
    };

    const p = presets[name];
    if (!p) return;

    document.getElementById('simSalary').value = p.salary;
    document.getElementById('simSavingsRate').value = p.savingsRate;
    document.getElementById('simRent').value = p.rent;
    document.getElementById('simReturn').value = p.returnRate;
    document.getElementById('simGrowth').value = p.growth;
    document.getElementById('simChildren').value = p.children;

    // Update displays
    document.getElementById('simSalaryValue').textContent = formatKES(p.salary);
    document.getElementById('simSavingsRateValue').textContent = p.savingsRate + '%';
    document.getElementById('simRentValue').textContent = formatKES(p.rent);
    document.getElementById('simReturnValue').textContent = p.returnRate + '%';
    document.getElementById('simGrowthValue').textContent = p.growth + '%';
    document.getElementById('simChildrenValue').textContent = p.children;

    runSimulation();
}

// ==================== UPDATE FLOW AMOUNTS ====================
// Updates when account section is shown
function updateFlowAmounts(income) {
    const flowOffBook = (offBookType === 'onetime') ? (offBookIncome / 12) : offBookIncome;
    const totalIncome = income + flowOffBook;
    const essentialsRaw = Math.round(totalIncome * 0.50);
    const essentials = essentialsRaw - PERSONAL.monthlyAirtime;
    const invest = Math.round(totalIncome * 0.30);
    const fun = Math.round(totalIncome * 0.20);

    document.getElementById('flowIncome').textContent = formatKES(totalIncome);
    document.getElementById('flowEssentials').innerHTML = `${formatKES(essentialsRaw)} <span style="font-size:0.75rem;opacity:0.8;">(incl. KES 1K Airtime)</span>`;
    document.getElementById('flowInvest').textContent = formatKES(invest);
    document.getElementById('flowFun').textContent = formatKES(fun);

    document.getElementById('incomeBalance').textContent = formatKES(totalIncome);
    document.getElementById('incomeInflow').textContent = formatKES(totalIncome);
    document.getElementById('essentialsBalance').textContent = formatKES(essentials);
    document.getElementById('entertainBalance').textContent = formatKES(fun);
    document.getElementById('investMonthlyAlloc').textContent = formatKES(invest);
}

// ==================== 1. DECISION IMPACT LAB ====================
let decisionLog = [];
let decisionChart;

function computeBaselineTrajectory() {
    let portfolio = PERSONAL.currentSavings;
    if (offBookType === 'onetime') portfolio += offBookIncome;

    let salary = PERSONAL.currentStipend;
    const data = [];
    const returnRate = 0.12;
    const savingsRate = 0.30;

    for (let age = PERSONAL.currentAge; age <= 55; age++) {
        if (age >= 24) salary = PERSONAL.jobSalary;
        if (age >= 26) salary = 100000;
        if (age >= 28) salary = 150000;
        if (age >= 33) salary = 250000;
        if (age >= 38) salary = 350000;
        if (age >= 44) salary = 450000;

        let rent = 0;
        if (age >= 28) rent = 40000;
        if (age >= 38) rent = 0; // own property

        const activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;
        portfolio = portfolio * (1 + returnRate) + Math.max(0, (salary + activeOffBook - rent)) * savingsRate * 12 - (PERSONAL.monthlyAirtime * 12);

        if (age === 24) portfolio -= (PERSONAL.suitCost + PERSONAL.phoneCost);
        if (age === 28) portfolio -= 1250000;

        data.push({ age, value: Math.max(0, Math.round(portfolio)) });
    }
    return data;
}

function analyzeDecision() {
    const name = document.getElementById('decisionName').value || 'Unnamed Decision';
    const amount = parseFloat(document.getElementById('decisionAmount').value) || 0;
    const type = document.getElementById('decisionType').value;
    const atAge = parseInt(document.getElementById('decisionAge').value) || 24;
    const duration = parseInt(document.getElementById('decisionDuration').value) || 1;

    decisionLog.push({ name, amount, type, atAge, duration });
    renderDecisionLog();
    calculateDecisionImpact();
}

function calculateDecisionImpact() {
    // Compute baseline
    const baseline = computeBaselineTrajectory();

    // Compute with all decisions applied
    let portfolio = PERSONAL.currentSavings;
    if (offBookType === 'onetime') portfolio += offBookIncome;
    let salary = PERSONAL.currentStipend;
    const withDecision = [];
    const returnRate = 0.12;
    const savingsRate = 0.30;

    for (let age = PERSONAL.currentAge; age <= 55; age++) {
        if (age >= 24) salary = PERSONAL.jobSalary;
        if (age >= 26) salary = 100000;
        if (age >= 28) salary = 150000;
        if (age >= 33) salary = 250000;
        if (age >= 38) salary = 350000;
        if (age >= 44) salary = 450000;

        let rent = 0;
        if (age >= 28) rent = 40000;
        if (age >= 38) rent = 0;

        // Apply all logged decisions
        decisionLog.forEach(d => {
            if (d.type === 'expense' && age === d.atAge) {
                portfolio -= d.amount;
            } else if (d.type === 'monthly_expense' && age >= d.atAge && age < d.atAge + d.duration) {
                portfolio -= d.amount * 12;
            } else if (d.type === 'investment' && age === d.atAge) {
                portfolio += d.amount; // invested, grows with portfolio
            } else if (d.type === 'monthly_invest' && age >= d.atAge && age < d.atAge + d.duration) {
                portfolio += d.amount * 12;
            } else if (d.type === 'asset' && age === d.atAge) {
                portfolio -= d.amount;
            } else if (d.type === 'income_change' && age >= d.atAge && age < d.atAge + d.duration) {
                salary += d.amount;
            }
        });

        const activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;
        portfolio = portfolio * (1 + returnRate) + Math.max(0, (salary + activeOffBook - rent)) * savingsRate * 12 - (PERSONAL.monthlyAirtime * 12);

        if (age === 24) portfolio -= (PERSONAL.suitCost + PERSONAL.phoneCost);
        if (age === 28) portfolio -= 1250000;

        withDecision.push({ age, value: Math.max(0, Math.round(portfolio)) });
    }

    // Update chart
    const labels = baseline.map(d => `Age ${d.age}`);
    const baselineData = baseline.map(d => d.value);
    const decisionData = withDecision.map(d => d.value);

    const canvas = document.getElementById('decisionChart');
    if (canvas) {
        const existingChart = Chart.getChart(canvas);
        if (existingChart) existingChart.destroy();

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

        decisionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Baseline', data: baselineData, borderColor: '#6366f1', backgroundColor: gradient, borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0 },
                    { label: 'With Decision', data: decisionData, borderColor: '#fbbf24', borderWidth: 2.5, fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] }
                ]
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                    legend: { display: true, position: 'top', align: 'end', labels: { color: '#8b92a8', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true } },
                    tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true) } }
                }
            }
        });
    }

    // Impact summary
    const at50Idx = 50 - PERSONAL.currentAge;
    const baseAt50 = baselineData[at50Idx] || baselineData[baselineData.length - 1];
    const decAt50 = decisionData[at50Idx] || decisionData[decisionData.length - 1];
    const diff = baseAt50 - decAt50;
    const totalDirectCost = decisionLog.reduce((sum, d) => {
        if (d.type === 'expense' || d.type === 'asset') return sum + d.amount;
        if (d.type === 'monthly_expense') return sum + d.amount * 12 * d.duration;
        return sum;
    }, 0);

    // Find FIRE age for both
    const annualExpenses = 720000;
    let baseFIREAge = null, decFIREAge = null;
    for (let i = 0; i < baselineData.length; i++) {
        const fireNum = annualExpenses * 25 * Math.pow(1.06, i);
        if (!baseFIREAge && baselineData[i] >= fireNum) baseFIREAge = PERSONAL.currentAge + i;
        if (!decFIREAge && decisionData[i] >= fireNum) decFIREAge = PERSONAL.currentAge + i;
    }
    const fireDelay = (decFIREAge || 60) - (baseFIREAge || 60);

    document.getElementById('impactCost').textContent = formatKES(totalDirectCost);
    document.getElementById('impactCost').style.color = totalDirectCost > 0 ? 'var(--accent-danger)' : 'var(--accent-success)';
    document.getElementById('impactOpportunity').textContent = formatKES(Math.abs(diff), true);
    document.getElementById('impactOpportunity').style.color = diff > 0 ? 'var(--accent-danger)' : 'var(--accent-success)';
    document.getElementById('impactFireDelay').textContent = fireDelay > 0 ? `+${fireDelay} year${fireDelay > 1 ? 's' : ''}` : fireDelay < 0 ? `${fireDelay} years (earlier!)` : 'No change';
    document.getElementById('impactFireDelay').style.color = fireDelay > 0 ? 'var(--accent-danger)' : fireDelay < 0 ? 'var(--accent-success)' : 'var(--text-primary)';
    document.getElementById('impactPortfolio50').textContent = formatKES(decAt50, true);

    // Generate contextual advice
    let advice = 'No active decisions. Model some above to see how they impact your trajectory.';
    if (decisionLog.length > 0) {
        const lastDecision = decisionLog[decisionLog.length - 1];
        if (lastDecision.type === 'expense' || lastDecision.type === 'asset') {
            const oppCost = Math.round(lastDecision.amount * Math.pow(1.12, 50 - lastDecision.atAge));
            advice = `💡 This KES ${lastDecision.amount.toLocaleString()} spent at age ${lastDecision.atAge} has an opportunity cost of ${formatKES(oppCost, true)} by age 50 (at 12% returns). `;
            if (lastDecision.amount > 100000) {
                advice += 'Consider financing through a SACCO loan to preserve invested capital, or spread the purchase over 2-3 months.';
            } else {
                advice += 'Manageable impact - ensure it comes from the entertainment bucket, not the investment allocation.';
            }
        } else if (lastDecision.type === 'income_change') {
            advice = `💡 Additional income of ${formatKES(lastDecision.amount)}/month accelerates FIRE significantly. Invest at least 50% of the increase to maximize compounding.`;
        } else if (lastDecision.type === 'monthly_expense') {
            advice = `💡 Recurring expense of ${formatKES(lastDecision.amount)}/month for ${lastDecision.duration} years totals ${formatKES(lastDecision.amount * 12 * lastDecision.duration)}. Review annually to ensure continued value.`;
        }
    }
    document.getElementById('impactAdvice').innerHTML = `<span class="note-icon">💡</span><span>${advice}</span>`;
}

function renderDecisionLog() {
    const container = document.getElementById('decisionLog');
    if (decisionLog.length === 0) {
        container.innerHTML = '<div class="decision-empty">No decisions modeled yet. Add one above to see the impact.</div>';
        return;
    }
    container.innerHTML = decisionLog.map((d, i) => `
        <div class="decision-log-item">
            <span class="dl-name">${d.name}</span>
            <span class="dl-amount">${d.type.includes('invest') || d.type === 'income_change' ? '+' : '-'}${formatKES(d.amount)}${d.type.includes('monthly') ? '/mo' : ''}</span>
            <button class="dl-remove" onclick="removeDecision(${i})" aria-label="Remove decision: ${d.name}">✕</button>
        </div>
    `).join('');
}

function removeDecision(index) {
    decisionLog.splice(index, 1);
    renderDecisionLog();
    calculateDecisionImpact();
}

function loadDecision(preset) {
    const presets = {
        phone: { name: 'Buy Phone KES 90K', amount: 90000, type: 'expense', age: 24, duration: 1 },
        laptop: { name: 'Buy Laptop KES 150K', amount: 150000, type: 'expense', age: 25, duration: 1 },
        sideHustle: { name: 'Side Hustle Income +KES 20K/mo', amount: 20000, type: 'income_change', age: 25, duration: 10 },
        carUpgrade: { name: 'Car Upgrade KES 2M', amount: 2000000, type: 'asset', age: 32, duration: 1 },
        wedding: { name: 'Wedding KES 500K', amount: 500000, type: 'expense', age: 30, duration: 1 },
        vacation: { name: 'Annual Vacation KES 200K', amount: 200000, type: 'expense', age: 28, duration: 1 },
    };
    const p = presets[preset];
    if (!p) return;
    document.getElementById('decisionName').value = p.name;
    document.getElementById('decisionAmount').value = p.amount;
    document.getElementById('decisionType').value = p.type;
    document.getElementById('decisionAge').value = p.age;
    document.getElementById('decisionDuration').value = p.duration;
    analyzeDecision();
}

// ==================== 2. REVERSE FIRE ENGINEERING ====================
let reverseFIREChart;

function reverseEngineerFIRE() {
    const retireAge = parseInt(document.getElementById('revRetireAge').value) || 50;
    const monthlyExpenseRetire = parseFloat(document.getElementById('revMonthlyExpenseRetire').value) || 150000;
    const withdrawalRate = parseFloat(document.getElementById('revWithdrawalRate').value) / 100 || 0.035;
    const inflation = parseFloat(document.getElementById('revInflation').value) / 100 || 0.06;
    const expectedReturn = parseFloat(document.getElementById('revExpectedReturn').value) / 100 || 0.12;
    const currentAge = parseInt(document.getElementById('revCurrentAge').value) || 23;
    const yearsToRetire = retireAge - currentAge;

    // Step 1: Calculate FIRE Number (inflation-adjusted)
    const inflatedAnnualExpenses = monthlyExpenseRetire * 12 * Math.pow(1 + inflation, yearsToRetire);
    const fireNumber = inflatedAnnualExpenses / withdrawalRate;

    // Step 2: Required monthly savings (using future value of annuity formula)
    // FV = PMT * [((1+r)^n - 1) / r] + PV * (1+r)^n
    // Solve for PMT: PMT = (FV - PV*(1+r)^n) / [((1+r)^n - 1) / r]
    const monthlyRate = expectedReturn / 12;
    const months = yearsToRetire * 12;
    const pvGrown = PERSONAL.currentSavings * Math.pow(1 + monthlyRate, months);
    const annuityFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    const requiredMonthly = Math.max(0, (fireNumber - pvGrown) / annuityFactor);

    // Step 3: Portfolio at age 28 (reverse interpolation)
    const yearsTo28 = 28 - currentAge;
    const monthsTo28 = yearsTo28 * 12;
    const pvAt28 = PERSONAL.currentSavings * Math.pow(1 + monthlyRate, monthsTo28);
    const contributionsTo28 = requiredMonthly * ((Math.pow(1 + monthlyRate, monthsTo28) - 1) / monthlyRate);
    const portfolioAt28 = pvAt28 + contributionsTo28;

    // Step 4: Max monthly expenditure
    const avgSalary = 59000; // starting salary as benchmark
    const maxExpense = avgSalary - requiredMonthly;

    // Step 5: Required return if only saving current rate
    const currentMonthlySaving = PERSONAL.currentStipend * 0.30;
    // Solve: FV = PMT * [((1+r)^n - 1)/r] + PV*(1+r)^n = fireNumber
    // Use Newton's method approximation
    let rGuess = 0.01; // monthly rate guess
    for (let i = 0; i < 50; i++) {
        const fvGuess = currentMonthlySaving * ((Math.pow(1 + rGuess, months) - 1) / rGuess) + PERSONAL.currentSavings * Math.pow(1 + rGuess, months);
        const fvDeriv = currentMonthlySaving * (months * Math.pow(1 + rGuess, months - 1) * rGuess - (Math.pow(1 + rGuess, months) - 1)) / (rGuess * rGuess) + PERSONAL.currentSavings * months * Math.pow(1 + rGuess, months - 1);
        const error = fvGuess - fireNumber;
        rGuess -= error / fvDeriv;
        if (Math.abs(error) < 1000) break;
    }
    const requiredAnnualReturn = ((1 + Math.max(0, rGuess)) ** 12 - 1) * 100;

    // Update display
    document.getElementById('revFireNumber').textContent = formatKES(Math.round(fireNumber));
    document.getElementById('revFireNumberSub').textContent = `${formatKES(Math.round(inflatedAnnualExpenses))}/year × ${(1 / withdrawalRate).toFixed(0)}x`;
    document.getElementById('revAge28').textContent = formatKES(Math.round(portfolioAt28));
    document.getElementById('revMonthlySavings').textContent = formatKES(Math.round(requiredMonthly));
    document.getElementById('revSavingsRateSub').textContent = `${(requiredMonthly / avgSalary * 100).toFixed(1)}% of KES ${avgSalary.toLocaleString()} salary`;
    document.getElementById('revMaxExpense').textContent = formatKES(Math.round(Math.max(0, maxExpense)));
    document.getElementById('revRequiredReturn').textContent = requiredAnnualReturn.toFixed(1) + '% p.a.';

    // Build chart data - required path
    const labels = [];
    const requiredPath = [];
    const actualPath = [];
    let reqPortfolio = PERSONAL.currentSavings;
    let actPortfolio = PERSONAL.currentSavings;
    if (offBookType === 'onetime') {
        reqPortfolio += offBookIncome;
        actPortfolio += offBookIncome;
    }

    for (let age = currentAge; age <= retireAge; age++) {
        labels.push(`Age ${age}`);
        let activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;

        reqPortfolio = reqPortfolio * (1 + expectedReturn) + requiredMonthly * 12 - (PERSONAL.monthlyAirtime * 12);
        requiredPath.push(Math.round(reqPortfolio));

        // Actual path with current savings rate
        let actSalary = PERSONAL.currentStipend;
        if (age >= 24) actSalary = PERSONAL.jobSalary;
        if (age >= 26) actSalary = 100000;
        if (age >= 28) actSalary = 150000;
        if (age >= 33) actSalary = 250000;
        actPortfolio = actPortfolio * (1 + expectedReturn) + (actSalary + activeOffBook) * 0.30 * 12 - (PERSONAL.monthlyAirtime * 12);
        actualPath.push(Math.round(actPortfolio));
    }

    const ctx = document.getElementById('reverseFIREChart').getContext('2d');
    if (reverseFIREChart) reverseFIREChart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
    gradient.addColorStop(1, 'rgba(251, 191, 36, 0.01)');

    reverseFIREChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Required Path', data: requiredPath, borderColor: '#fbbf24', backgroundColor: gradient, borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0 },
                { label: 'Projected Actual', data: actualPath, borderColor: '#6366f1', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] },
                { label: 'FIRE Target', data: requiredPath.map(() => Math.round(fireNumber)), borderColor: '#10b981', borderWidth: 2, borderDash: [6, 4], fill: false, tension: 0, pointRadius: 0 }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { display: true, position: 'top', align: 'end', labels: { color: '#8b92a8', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true } },
                tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true) } }
            }
        }
    });
}

// ==================== BUY VS RENT ANALYSIS ====================
function analyzeBuyVsRent() {
    const monthlyRent = parseFloat(document.getElementById('bvrRentMonthly').value) || 40000;
    const rentGrowth = parseFloat(document.getElementById('bvrRentGrowth').value) / 100 || 0.05;
    const propertyPrice = parseFloat(document.getElementById('bvrPropertyPrice').value) || 8000000;
    const downPaymentPct = parseFloat(document.getElementById('bvrDownPayment').value) / 100 || 0.20;
    const mortgageRate = parseFloat(document.getElementById('bvrMortgageRate').value) / 100 || 0.13;
    const mortgageTerm = parseInt(document.getElementById('bvrMortgageTerm').value) || 20;

    // Calculate total rent over 20 years
    let totalRent = 0;
    let currentRent = monthlyRent;
    for (let y = 0; y < 20; y++) {
        totalRent += currentRent * 12;
        currentRent *= (1 + rentGrowth);
    }

    // Calculate mortgage
    const downPayment = propertyPrice * downPaymentPct;
    const loanAmount = propertyPrice - downPayment;
    const monthlyMortgageRate = mortgageRate / 12;
    const nPayments = mortgageTerm * 12;
    const monthlyMortgage = loanAmount * (monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, nPayments)) / (Math.pow(1 + monthlyMortgageRate, nPayments) - 1);
    const totalMortgagePayments = monthlyMortgage * nPayments;
    const totalBuyCost = downPayment + totalMortgagePayments;

    // Property appreciation (5% p.a.)
    const propertyValueAfter20 = propertyPrice * Math.pow(1.05, 20);
    const netBuyCost = totalBuyCost - propertyValueAfter20;

    // Opportunity cost of down payment if invested
    const downPaymentOpportunityCost = downPayment * Math.pow(1.12, 20);

    document.getElementById('bvrRentTotal').textContent = formatKES(Math.round(totalRent));
    document.getElementById('bvrBuyTotal').textContent = formatKES(Math.round(totalBuyCost));

    // Verdict
    const investDifference = (monthlyMortgage - monthlyRent) * 12; // annual difference if renting is cheaper
    const rentAdvantage = totalRent < netBuyCost;

    let verdict = `<strong>📊 Analysis Results:</strong><br><br>`;
    verdict += `<strong>Monthly mortgage payment:</strong> ${formatKES(Math.round(monthlyMortgage))} vs rent of ${formatKES(monthlyRent)}<br>`;
    verdict += `<strong>Total rent paid (20 years):</strong> ${formatKES(Math.round(totalRent))}<br>`;
    verdict += `<strong>Total mortgage cost:</strong> ${formatKES(Math.round(totalBuyCost))} (incl. ${formatKES(Math.round(downPayment))} down payment)<br>`;
    verdict += `<strong>Property value after 20 years:</strong> ${formatKES(Math.round(propertyValueAfter20), true)}<br>`;
    verdict += `<strong>Net cost of buying:</strong> ${formatKES(Math.round(netBuyCost), true)} (total paid minus property value)<br><br>`;

    if (monthlyMortgage > monthlyRent * 2) {
        verdict += `⚠️ <strong>Recommendation: Continue renting until income exceeds KES ${formatKES(Math.round(monthlyMortgage * 3.33))}/month.</strong> Your mortgage would be ${formatKES(Math.round(monthlyMortgage))}/month - more than double your rent. Optimal buying age: <strong>35-38</strong> when income supports the payment comfortably.<br><br>`;
    } else {
        verdict += `✅ <strong>Buying could work</strong> if you have the down payment of ${formatKES(Math.round(downPayment))} and stable income exceeding ${formatKES(Math.round(monthlyMortgage * 3))}/month.<br><br>`;
    }

    verdict += `💡 <strong>Pro Tip:</strong> With Kenyan mortgage rates at ${(mortgageRate * 100).toFixed(1)}%, consider a SACCO mortgage (typically 10-12% vs bank 13-14%). Alternatively, invest the down payment in T-Bonds (12-14%) while renting - the returns may outpace property appreciation.`;

    document.getElementById('bvrVerdict').innerHTML = verdict;
}

// ==================== 3. MARKET TREND ANALYSIS ====================
let marketSimChart;

function updateAllocDisplay() {
    const ids = ['NSE', 'TBond', 'MMF', 'REIT', 'SACCO', 'Cash'];
    let total = 0;
    ids.forEach(id => {
        const val = parseInt(document.getElementById('alloc' + id).value);
        document.getElementById('alloc' + id + 'Pct').textContent = val + '%';
        total += val;
    });
    const totalEl = document.getElementById('allocTotal');
    totalEl.textContent = `Total: ${total}%`;
    totalEl.style.color = total === 100 ? 'var(--accent-success)' : total > 100 ? 'var(--accent-danger)' : 'var(--accent-warning)';
}

function simulateMarketScenario() {
    const nseReturn = parseFloat(document.getElementById('mktNSE').value) / 100;
    const tBondReturn = parseFloat(document.getElementById('mktTBond').value) / 100;
    const mmfReturn = parseFloat(document.getElementById('mktMMF').value) / 100;
    const reitReturn = parseFloat(document.getElementById('mktREIT').value) / 100;
    const saccoReturn = parseFloat(document.getElementById('mktSACCO').value) / 100;
    const inflation = parseFloat(document.getElementById('mktInflation').value) / 100;

    const allocNSE = parseInt(document.getElementById('allocNSE').value) / 100;
    const allocTBond = parseInt(document.getElementById('allocTBond').value) / 100;
    const allocMMF = parseInt(document.getElementById('allocMMF').value) / 100;
    const allocREIT = parseInt(document.getElementById('allocREIT').value) / 100;
    const allocSACCO = parseInt(document.getElementById('allocSACCO').value) / 100;
    const allocCash = parseInt(document.getElementById('allocCash').value) / 100;

    // Blended return
    const blendedReturn = allocNSE * nseReturn + allocTBond * tBondReturn + allocMMF * mmfReturn + allocREIT * reitReturn + allocSACCO * saccoReturn + allocCash * 0.085;
    const realReturn = (1 + blendedReturn) / (1 + inflation) - 1;

    document.getElementById('mktBlendedReturn').textContent = (blendedReturn * 100).toFixed(1) + '%';
    document.getElementById('mktRealReturn').textContent = (realReturn * 100).toFixed(1) + '%';
    document.getElementById('mktRealReturn').style.color = realReturn > 0 ? 'var(--accent-success)' : 'var(--accent-danger)';

    // Simulate portfolio growth
    let portfolio = PERSONAL.currentSavings;
    if (offBookType === 'onetime') portfolio += offBookIncome;
    let salary = PERSONAL.currentStipend;
    const labels = [];
    const nominalData = [];
    const realData = [];
    const savingsRate = 0.30;

    for (let age = PERSONAL.currentAge; age <= 55; age++) {
        labels.push(`Age ${age}`);
        if (age >= 24) salary = PERSONAL.jobSalary;
        if (age >= 26) salary = 100000;
        if (age >= 28) salary = 150000;
        if (age >= 33) salary = 250000;
        if (age >= 38) salary = 350000;
        if (age >= 44) salary = 450000;

        let rent = 0;
        if (age >= 28) rent = 40000;
        if (age >= 38) rent = 0;

        const activeOffBook = (offBookType === 'monthly') ? offBookIncome : 0;
        portfolio = portfolio * (1 + blendedReturn) + Math.max(0, (salary + activeOffBook - rent)) * savingsRate * 12 - (PERSONAL.monthlyAirtime * 12);
        if (age === 24) portfolio -= (PERSONAL.suitCost + PERSONAL.phoneCost);
        if (age === 28) portfolio -= 1250000;

        nominalData.push(Math.round(Math.max(0, portfolio)));
        realData.push(Math.round(Math.max(0, portfolio / Math.pow(1 + inflation, age - PERSONAL.currentAge))));
    }

    const at50Idx = 50 - PERSONAL.currentAge;
    const portfolioAt50 = nominalData[at50Idx] || nominalData[nominalData.length - 1];
    document.getElementById('mktPortfolio50').textContent = formatKES(portfolioAt50, true);

    const fireNum = 720000 * 25 * Math.pow(1 + inflation, 27);
    const feasible = portfolioAt50 >= fireNum;
    document.getElementById('mktFIREFeasibility').textContent = feasible ? '✅ Achievable' : '⚠️ Gap exists';
    document.getElementById('mktFIREFeasibility').style.color = feasible ? 'var(--accent-success)' : 'var(--accent-warning)';

    // Chart
    const ctx = document.getElementById('marketSimChart').getContext('2d');
    if (marketSimChart) marketSimChart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');

    marketSimChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Nominal', data: nominalData, borderColor: '#10b981', backgroundColor: gradient, borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0 },
                { label: 'Real (inflation-adjusted)', data: realData, borderColor: '#06b6d4', borderWidth: 2, fill: false, tension: 0.4, pointRadius: 0, borderDash: [5, 3] },
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { display: true, position: 'top', align: 'end', labels: { color: '#8b92a8', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true } },
                tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true) } }
            }
        }
    });
}

// Wealth Avenues
function populateWealthAvenues() {
    const avenues = [
        { icon: '🏛️', name: 'Infrastructure Bonds', tag: 'SAFE', tagClass: 'safe', desc: 'Tax-exempt government bonds yielding 12-14%. Best long-term vehicle for Kenyan investors. Locked for 10-25 years but tradeable on NSE secondary market.' },
        { icon: '💵', name: 'Money Market Funds', tag: 'SAFE', tagClass: 'safe', desc: 'Start with KES 100 on Cytonn, Britam, or Sanlam MMFs. Daily compounding at 9-12%. Perfect for emergency fund and short-term parking.' },
        { icon: '📊', name: 'NSE Blue-Chip Stocks', tag: 'MODERATE', tagClass: 'moderate', desc: 'Safaricom (MPESA dominance), Equity Group (banking expansion), KCB (regional growth). NSE returned +51% in 2025. Use Ziidi on M-Pesa.' },
        { icon: '🤝', name: 'SACCO Membership', tag: 'MODERATE', tagClass: 'moderate', desc: 'Member-owned cooperatives offering 10-18% dividends plus affordable loans (3x share capital). Essential for car/property financing.' },
        { icon: '🏢', name: 'D-REITs & I-REITs', tag: 'GROWTH', tagClass: 'growth', desc: 'Acorn D-REIT (real estate exposure without buying property). Green USD I-REITs add USD diversification and inflation hedge.' },
        { icon: '🧺', name: 'Unit Trust Equity Funds', tag: 'GROWTH', tagClass: 'growth', desc: 'Professionally managed stock portfolios (Old Mutual, Sanlam). Returns 12-20% with automatic diversification. Min KES 5,000.' },
        { icon: '💰', name: 'Treasury Bills Laddering', tag: 'SAFE', tagClass: 'safe', desc: 'Stagger 91-day, 182-day, and 364-day T-Bills for regular maturity income. 8.5-8.8% risk-free returns via DhowCSD.' },
        { icon: '🏗️', name: 'Land Banking', tag: 'GROWTH', tagClass: 'growth', desc: 'Buy land in satellite towns (Kitengela, Ruiru, Athi River) before infrastructure development. 15-30% appreciation in growth corridors.' },
    ];

    const grid = document.getElementById('avenueGrid');
    grid.innerHTML = avenues.map(a => `
        <div class="avenue-card">
            <span class="avenue-tag avenue-tag-${a.tagClass}">${a.tag}</span>
            <h4>${a.icon} ${a.name}</h4>
            <p>${a.desc}</p>
        </div>
    `).join('');
}

// ==================== 4. INSURANCE IMPACT ====================
function calculateInsuranceImpact() {
    const nhifMonthly = parseFloat(document.getElementById('insNHIF').value) || 1700;
    const privateHealthMonthly = parseFloat(document.getElementById('insPrivateHealth').value) || 5000;
    const healthStartAge = parseInt(document.getElementById('insHealthStartAge').value) || 28;
    const carValue = parseFloat(document.getElementById('insCarValue').value) || 1250000;
    const carRate = parseFloat(document.getElementById('insCarRate').value) / 100 || 0.05;
    const carStartAge = parseInt(document.getElementById('insCarStartAge').value) || 28;
    const lifeMonthly = parseFloat(document.getElementById('insLifeMonthly').value) || 3000;
    const lifeStartAge = parseInt(document.getElementById('insLifeStartAge').value) || 30;

    // Calculate total insurance cost to age 50
    let totalInsurance = 0;
    let currentMonthly = 0;
    let currentAnnual = 0;

    for (let age = PERSONAL.currentAge; age <= 50; age++) {
        let yearlyIns = nhifMonthly * 12; // NHIF always

        if (age >= healthStartAge) yearlyIns += privateHealthMonthly * 12;
        if (age >= carStartAge) yearlyIns += carValue * carRate * Math.pow(0.90, age - carStartAge); // car depreciates 10%/yr
        if (age >= lifeStartAge) yearlyIns += lifeMonthly * 12;

        totalInsurance += yearlyIns;

        if (age === PERSONAL.currentAge) {
            currentMonthly = nhifMonthly;
            currentAnnual = nhifMonthly * 12;
        }
    }

    // Current monthly insurance cost (at current age)
    currentMonthly = nhifMonthly;
    let peakMonthly = nhifMonthly + privateHealthMonthly + lifeMonthly + Math.round(carValue * carRate / 12);

    document.getElementById('insTotalMonthly').textContent = formatKES(currentMonthly) + ' → ' + formatKES(peakMonthly);
    document.getElementById('insTotalAnnual').textContent = formatKES(currentMonthly * 12) + ' → ' + formatKES(peakMonthly * 12);
    document.getElementById('insLifetimeCost').textContent = formatKES(Math.round(totalInsurance), true);

    // FIRE delay: opportunity cost of insurance spending
    const oppCost = totalInsurance * 0.5; // rough estimate: half could have been invested
    const fireDelay = Math.round(oppCost / (PERSONAL.jobSalary * 0.3 * 12)); // months worth of investing
    const delayYears = (fireDelay / 12).toFixed(1);

    document.getElementById('insFireDelay').textContent = `~${delayYears} years`;
    document.getElementById('insFireDelay').style.color = parseFloat(delayYears) > 2 ? 'var(--accent-warning)' : 'var(--accent-success)';
}

// ==================== 5. TUITION FEE FORECASTING ====================
let tuitionChart;

function forecastTuition() {
    const eduInflation = parseFloat(document.getElementById('tuitionInflation').value) / 100 || 0.08;
    const currentYear = 2026;

    const children = [1, 2, 3].map(i => ({
        birthYear: parseInt(document.getElementById(`child${i}BirthYear`).value),
        primary: parseFloat(document.getElementById(`child${i}PrimaryAnnual`).value) || 0,
        secondary: parseFloat(document.getElementById(`child${i}SecondaryAnnual`).value) || 0,
        uni: parseFloat(document.getElementById(`child${i}UniAnnual`).value) || 0,
    }));

    // Calculate yearly education costs
    const yearlyFees = {};
    let totalNominal = 0;
    let totalInflated = 0;
    let peakYear = currentYear;
    let peakAmount = 0;

    children.forEach(child => {
        // Primary: ages 6-13 (8 years)
        for (let y = 0; y < 8; y++) {
            const year = child.birthYear + 6 + y;
            const yearsFromNow = year - currentYear;
            const inflatedFee = child.primary * Math.pow(1 + eduInflation, Math.max(0, yearsFromNow));
            if (!yearlyFees[year]) yearlyFees[year] = 0;
            yearlyFees[year] += inflatedFee;
            totalNominal += child.primary;
            totalInflated += inflatedFee;
        }
        // Secondary: ages 14-17 (4 years)
        for (let y = 0; y < 4; y++) {
            const year = child.birthYear + 14 + y;
            const yearsFromNow = year - currentYear;
            const inflatedFee = child.secondary * Math.pow(1 + eduInflation, Math.max(0, yearsFromNow));
            if (!yearlyFees[year]) yearlyFees[year] = 0;
            yearlyFees[year] += inflatedFee;
            totalNominal += child.secondary;
            totalInflated += inflatedFee;
        }
        // University: ages 18-21 (4 years)
        for (let y = 0; y < 4; y++) {
            const year = child.birthYear + 18 + y;
            const yearsFromNow = year - currentYear;
            const inflatedFee = child.uni * Math.pow(1 + eduInflation, Math.max(0, yearsFromNow));
            if (!yearlyFees[year]) yearlyFees[year] = 0;
            yearlyFees[year] += inflatedFee;
            totalNominal += child.uni;
            totalInflated += inflatedFee;
        }
    });

    // Find peak year
    Object.entries(yearlyFees).forEach(([year, amount]) => {
        if (amount > peakAmount) {
            peakAmount = amount;
            peakYear = parseInt(year);
        }
    });

    // Required monthly savings: invest in education fund earning 10% to cover total
    const firstFeeYear = Math.min(...Object.keys(yearlyFees).map(Number));
    const monthsUntilFirst = Math.max(1, (firstFeeYear - currentYear) * 12);
    const eduFundReturn = 0.10 / 12;
    const fvFactor = (Math.pow(1 + eduFundReturn, monthsUntilFirst) - 1) / eduFundReturn;
    const requiredMonthly = totalInflated / fvFactor;

    document.getElementById('tuitionTotal').textContent = formatKES(Math.round(totalNominal));
    document.getElementById('tuitionInflatedTotal').textContent = formatKES(Math.round(totalInflated));
    document.getElementById('tuitionMonthlySavings').textContent = formatKES(Math.round(requiredMonthly));
    document.getElementById('tuitionPeakYear').textContent = `${peakYear} (${formatKES(Math.round(peakAmount))})`;

    // Chart
    const sortedYears = Object.keys(yearlyFees).map(Number).sort((a, b) => a - b);
    const labels = sortedYears.map(y => y.toString());
    const data = sortedYears.map(y => Math.round(yearlyFees[y]));

    const ctx = document.getElementById('tuitionChart').getContext('2d');
    if (tuitionChart) tuitionChart.destroy();

    tuitionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Annual Education Cost',
                data,
                backgroundColor: sortedYears.map(y => {
                    // Color by how many children in school
                    const count = children.filter(c => y >= c.birthYear + 6 && y <= c.birthYear + 21).length;
                    if (count >= 3) return 'rgba(239, 68, 68, 0.7)';
                    if (count === 2) return 'rgba(251, 191, 36, 0.7)';
                    return 'rgba(99, 102, 241, 0.7)';
                }),
                borderRadius: 4,
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: { display: false },
                tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: ctx => 'Education: ' + formatKES(ctx.parsed.y, true) } }
            }
        }
    });
}


// ==================== COMPREHENSIVE PDF EXPORT ENGINE ====================
// Transport cost constants (KES 1,000 per week, fixed)
const WEEKLY_TRANSPORT = 1000;
const MONTHLY_TRANSPORT = Math.round(WEEKLY_TRANSPORT * 52 / 12); // 4333
const ANNUAL_TRANSPORT = WEEKLY_TRANSPORT * 52; // 52000

function openExportModal() {
    document.getElementById('pdfExportModal').classList.add('active');
    document.getElementById('exportProgress').style.display = 'none';
    document.getElementById('btnGeneratePDF').disabled = false;
}

function closeExportModal() {
    document.getElementById('pdfExportModal').classList.remove('active');
}

async function exportToPDF() {
    const btn = document.getElementById('btnGeneratePDF');
    const progress = document.getElementById('exportProgress');
    const progressFill = document.getElementById('exportProgressFill');
    const progressText = document.getElementById('exportProgressText');
    const titleInput = document.getElementById('pdfTitle');
    const titleText = (titleInput && titleInput.value) ? titleInput.value : 'FIRE Kenya - Comprehensive Financial Report';

    if (!window.jspdf) {
        alert('jsPDF library failed to load. Please check your internet connection and refresh the page.');
        return;
    }

    if (btn) btn.disabled = true;
    if (progress) progress.style.display = 'block';

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        const PW = doc.internal.pageSize.getWidth();
        const PH = doc.internal.pageSize.getHeight();
        const ML = 15;
        const MR = 15;
        const MT = 24;
        const MB = 20;
        const CW = PW - ML - MR;

        let y = MT;
        let currentPage = 1;
        const TOTAL_STEPS = 12;

        // ── Helper functions ──

        function prog(step, label) {
            if (progressFill) progressFill.style.width = `${(step / TOTAL_STEPS) * 100}%`;
            if (progressText) progressText.textContent = label;
        }

        function addHeader() {
            doc.setFillColor(10, 14, 26);
            doc.rect(0, 0, PW, 16, 'F');
            doc.setFontSize(7.5);
            doc.setTextColor(139, 146, 168);
            doc.setFont('helvetica', 'normal');
            doc.text('FIRE Kenya  |  Comprehensive Financial Independence Report', ML, 10.5);
            doc.text('Page ' + currentPage, PW - MR, 10.5, { align: 'right' });
        }

        function addFooter() {
            doc.setFontSize(6.5);
            doc.setTextColor(150, 155, 170);
            doc.setFont('helvetica', 'italic');
            doc.text('All projections are estimates. Past returns do not guarantee future performance. This is not financial advice.', ML, PH - 7);
        }

        function newPage() {
            doc.addPage();
            currentPage++;
            y = MT;
            addHeader();
            addFooter();
        }

        function checkBreak(needed) {
            if (y + needed > PH - MB) { newPage(); return true; }
            return false;
        }

        function sectionTitle(text) {
            checkBreak(16);
            doc.setFillColor(99, 102, 241);
            doc.rect(ML, y, CW, 10, 'F');
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text(text, ML + 4, y + 7);
            y += 14;
        }

        function subTitle(text) {
            checkBreak(12);
            doc.setFontSize(10.5);
            doc.setTextColor(251, 191, 36);
            doc.setFont('helvetica', 'bold');
            doc.text(text, ML, y);
            y += 2;
            doc.setDrawColor(251, 191, 36);
            doc.setLineWidth(0.3);
            doc.line(ML, y, ML + Math.min(doc.getTextWidth(text), CW), y);
            y += 6;
        }

        function para(text, indent) {
            indent = indent || 0;
            doc.setFontSize(8.5);
            doc.setTextColor(55, 55, 65);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(text, CW - indent);
            for (let i = 0; i < lines.length; i++) {
                checkBreak(4.5);
                doc.text(lines[i], ML + indent, y);
                y += 4;
            }
            y += 2;
        }

        function boldPara(text, indent) {
            indent = indent || 0;
            doc.setFontSize(8.5);
            doc.setTextColor(35, 35, 45);
            doc.setFont('helvetica', 'bold');
            const lines = doc.splitTextToSize(text, CW - indent);
            for (let i = 0; i < lines.length; i++) {
                checkBreak(4.5);
                doc.text(lines[i], ML + indent, y);
                y += 4;
            }
            y += 2;
        }

        function formulaBlock(text) {
            checkBreak(10);
            doc.setFillColor(238, 240, 248);
            const fLines = doc.splitTextToSize(text, CW - 20);
            const boxH = fLines.length * 4.5 + 5;
            doc.rect(ML + 4, y - 2, CW - 8, boxH, 'F');
            doc.setFontSize(8.5);
            doc.setTextColor(79, 82, 201);
            doc.setFont('courier', 'bold');
            for (let i = 0; i < fLines.length; i++) {
                doc.text(fLines[i], ML + 12, y + 2 + i * 4.5);
            }
            y += boxH + 3;
        }

        function kvLine(label, value) {
            checkBreak(5.5);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 110);
            doc.text(label + ':', ML + 4, y);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 40);
            doc.text(String(value), ML + 80, y);
            y += 5;
        }

        function dataTable(headers, rows, colWidths) {
            const rowH = 5.5;
            if (!colWidths) {
                const w = CW / headers.length;
                colWidths = headers.map(() => w);
            }
            checkBreak(rowH * Math.min(rows.length + 2, 8));
            doc.setFillColor(30, 35, 55);
            doc.rect(ML, y, CW, rowH, 'F');
            doc.setFontSize(7.5);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            let x = ML;
            for (let i = 0; i < headers.length; i++) {
                doc.text(headers[i], x + 2, y + 4);
                x += colWidths[i];
            }
            y += rowH;
            for (let ri = 0; ri < rows.length; ri++) {
                checkBreak(rowH);
                if (ri % 2 === 0) {
                    doc.setFillColor(244, 245, 250);
                    doc.rect(ML, y, CW, rowH, 'F');
                }
                doc.setFontSize(7.5);
                doc.setTextColor(50, 50, 60);
                doc.setFont('helvetica', 'normal');
                x = ML;
                for (let ci = 0; ci < rows[ri].length; ci++) {
                    let txt = String(rows[ri][ci]);
                    const maxW = colWidths[ci] - 4;
                    while (doc.getTextWidth(txt) > maxW && txt.length > 3) txt = txt.slice(0, -1);
                    doc.text(txt, x + 2, y + 4);
                    x += colWidths[ci];
                }
                y += rowH;
            }
            y += 3;
        }

        function spacer(h) { y += (h || 4); }

        function fK(val) {
            if (Math.abs(val) >= 1e9) return 'KES ' + (val / 1e9).toFixed(2) + 'B';
            if (Math.abs(val) >= 1e6) return 'KES ' + (val / 1e6).toFixed(2) + 'M';
            return 'KES ' + Math.round(val).toLocaleString('en-KE');
        }

        function fP(val) { return val.toFixed(1) + '%'; }

        // ── Gather all computational inputs ──

        const P = PERSONAL;
        const income = P.currentStipend;
        const savings = P.currentSavings;
        const retireAge = P.retireAge;
        const currentAge = P.currentAge;
        const yearsToRetire = retireAge - currentAge;
        const jobSalary = P.jobSalary;

        const annualExpenses = parseFloat(document.getElementById('fireAnnualExpenses')?.value) || 720000;
        const swr = (parseFloat(document.getElementById('fireWithdrawalRate')?.value) || 4) / 100;
        const expectedReturn = (parseFloat(document.getElementById('fireExpectedReturn')?.value) || 12) / 100;
        const inflationRate = (parseFloat(document.getElementById('fireInflation')?.value) || 6) / 100;
        const monthlyInvest = parseFloat(document.getElementById('fireMonthlyInvest')?.value) || 17700;

        const wkTransport = WEEKLY_TRANSPORT;
        const moTransport = MONTHLY_TRANSPORT;
        const yrTransport = ANNUAL_TRANSPORT;

        // Derived computations
        const inflatedAnnualExpenses = annualExpenses * Math.pow(1 + inflationRate, yearsToRetire);
        const fireNumber = inflatedAnnualExpenses / swr;
        const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
        const monthlyRate = expectedReturn / 12;
        const months = yearsToRetire * 12;
        const pvGrown = savings * Math.pow(1 + monthlyRate, months);
        const annuityFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
        const portfolioBaseline = pvGrown + monthlyInvest * annuityFactor;
        const transportOpportunityCost = moTransport * annuityFactor;

        // Budget breakdowns
        const stipendEssentials = Math.round(income * 0.50);
        const stipendInvest = Math.round(income * 0.30);
        const stipendFun = Math.round(income * 0.20);
        const stipendEssAfterTransport = stipendEssentials - moTransport;

        const jobEssentials = Math.round(jobSalary * 0.50);
        const jobInvest = Math.round(jobSalary * 0.30);
        const jobFun = Math.round(jobSalary * 0.20);
        const jobEssAfterTransport = jobEssentials - moTransport;

        // ════════════════════════════════════════════
        //  COVER PAGE
        // ════════════════════════════════════════════

        prog(1, 'Building cover page...');

        doc.setFillColor(10, 14, 26);
        doc.rect(0, 0, PW, PH, 'F');
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 82, PW, 2.5, 'F');
        doc.setFillColor(251, 191, 36);
        doc.rect(0, 84.5, PW, 1, 'F');

        doc.setFontSize(30);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('FIRE Kenya', PW / 2, 108, { align: 'center' });
        doc.setFontSize(13);
        doc.setTextColor(139, 146, 168);
        doc.setFont('helvetica', 'normal');
        doc.text('Comprehensive Financial Independence Report', PW / 2, 120, { align: 'center' });
        doc.setFontSize(9.5);
        doc.setTextColor(99, 102, 241);
        doc.text('Full Computational Derivations, Transport Integration & ETF Analysis', PW / 2, 130, { align: 'center' });

        doc.setFontSize(8.5);
        doc.setTextColor(139, 146, 168);
        doc.text('FIRE Target: ' + fK(fireNumber), PW / 2, 155, { align: 'center' });
        doc.text('Horizon: ' + yearsToRetire + ' years (Age ' + currentAge + ' to ' + retireAge + ')', PW / 2, 162, { align: 'center' });
        doc.text('Return: ' + fP(expectedReturn * 100) + ' | Inflation: ' + fP(inflationRate * 100) + ' | SWR: ' + fP(swr * 100), PW / 2, 169, { align: 'center' });
        doc.text('Weekly Transport: ' + fK(wkTransport) + ' | Monthly: ' + fK(moTransport), PW / 2, 176, { align: 'center' });

        const dateStr = new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        doc.setFontSize(8);
        doc.setTextColor(100, 105, 120);
        doc.text('Generated on ' + dateStr, PW / 2, PH - 28, { align: 'center' });
        doc.setFontSize(6.5);
        doc.text('All projections are estimates. Past returns do not guarantee future results.', PW / 2, PH - 20, { align: 'center' });

        // ════════════════════════════════════════════
        //  TABLE OF CONTENTS
        // ════════════════════════════════════════════

        prog(2, 'Building table of contents...');
        newPage();
        sectionTitle('Table of Contents');
        spacer(4);

        const tocItems = [
            '1. Executive Summary & Key Metrics',
            '2. Personal Financial Profile',
            '3. Budget Analysis with Transport Costs',
            '4. FIRE Number Derivation',
            '5. Portfolio Growth Projections',
            '6. Kenyan Investment Vehicle Analysis',
            '7. ETFs & Index Funds: Global Opportunities',
            '8. Scenario & Sensitivity Analysis',
            '9. Risk Assessment & Mitigation',
            '10. Action Plan & Conclusion',
        ];
        tocItems.forEach(item => {
            doc.setFontSize(10);
            doc.setTextColor(55, 55, 65);
            doc.setFont('helvetica', 'normal');
            doc.text(item, ML + 4, y);
            y += 8;
        });

        // ════════════════════════════════════════════
        //  SECTION 1: EXECUTIVE SUMMARY
        // ════════════════════════════════════════════

        prog(3, 'Computing executive summary...');
        newPage();
        sectionTitle('1. Executive Summary');
        spacer(2);
        para('This report presents a rigorous computational analysis of the path to Financial Independence, Retire Early (FIRE). Every figure is derived from first-principles financial mathematics with all assumptions and formulae made explicit. A fixed weekly transport expenditure of KES 1,000 is integrated into all financial computations throughout.');
        spacer(2);
        subTitle('Key Metrics at a Glance');
        dataTable(
            ['Metric', 'Value', 'Derivation'],
            [
                ['Current Age', String(currentAge), 'PERSONAL.currentAge'],
                ['Retirement Age', String(retireAge), 'PERSONAL.retireAge'],
                ['Years to FIRE', String(yearsToRetire), retireAge + ' - ' + currentAge],
                ['Current Savings', fK(savings), 'PERSONAL.currentSavings'],
                ['Current Monthly Income', fK(income), 'Stipend income'],
                ['Next Job Salary', fK(jobSalary), 'From Sep 2026'],
                ['Weekly Transport Cost', fK(wkTransport), 'Fixed weekly expenditure'],
                ['Monthly Transport Cost', fK(moTransport), wkTransport + ' x 52/12'],
                ['Annual Transport Cost', fK(yrTransport), wkTransport + ' x 52'],
                ['FIRE Target (nominal)', fK(fireNumber), 'Inflated expenses / SWR'],
                ['Safe Withdrawal Rate', fP(swr * 100), 'Conservative for 40+ yr horizon'],
                ['Expected Return', fP(expectedReturn * 100), 'Blended portfolio return'],
                ['Inflation Rate', fP(inflationRate * 100), 'Kenya long-term average'],
                ['Real Return', fP(realReturn * 100), '(1+nom)/(1+inf) - 1'],
                ['Transport Opp. Cost', fK(transportOpportunityCost), moTransport + ' x annuity factor'],
            ],
            [55, 50, 75]
        );

        // ════════════════════════════════════════════
        //  SECTION 2: PERSONAL PROFILE
        // ════════════════════════════════════════════

        prog(4, 'Building personal profile...');
        newPage();
        sectionTitle('2. Personal Financial Profile');
        spacer(2);

        subTitle('2.1 Income Timeline');
        dataTable(
            ['Period', 'Monthly Income', 'Source', 'Duration'],
            [
                ['Jul - Aug 2026', fK(income), 'Stipend', '3 months'],
                ['Sep 2026 - Jun 2028', fK(jobSalary), 'Contract', '22 months'],
                ['Jul 2028 - Dec 2029', 'KES 100,000', 'Career growth', '18 months'],
                ['Jan 2030 - Dec 2034', 'KES 150,000', 'Mid-career', '5 years'],
                ['Jan 2035 - Dec 2039', 'KES 250,000', 'Senior role', '5 years'],
                ['Jan 2040 - Dec 2044', 'KES 350,000', 'Leadership', '5 years'],
                ['Jan 2045 - Sep 2052', 'KES 450,000', 'Peak career', '~8 years'],
            ],
            [48, 42, 48, 42]
        );

        subTitle('2.2 Transport Expenditure Derivation');
        formulaBlock('Weekly Transport = KES ' + wkTransport.toLocaleString('en-KE') + ' (fixed)');
        formulaBlock('Monthly = ' + wkTransport + ' x (52/12) = KES ' + moTransport.toLocaleString('en-KE'));
        formulaBlock('Annual = ' + wkTransport + ' x 52 = KES ' + yrTransport.toLocaleString('en-KE'));
        formulaBlock('Total over ' + yearsToRetire + ' years = KES ' + (yrTransport * yearsToRetire).toLocaleString('en-KE'));

        subTitle('2.3 Planned Major Expenditures');
        dataTable(
            ['Item', 'Cost (KES)', 'Timing', 'Funding Source'],
            [
                ['Professional Suit', fK(P.suitCost), 'Sep 2026', 'First paycheck'],
                ['Phone Purchase', fK(P.phoneCost), 'Oct 2026', 'Paycheck + KES 21K top-up'],
                ['First Car', 'KES 1,250,000', 'Dec 2030', 'Savings / SACCO loan'],
            ],
            [42, 40, 42, 56]
        );

        // ════════════════════════════════════════════
        //  SECTION 3: BUDGET ANALYSIS
        // ════════════════════════════════════════════

        prog(5, 'Computing budget analysis...');
        newPage();
        sectionTitle('3. Budget Analysis with Transport Costs');
        spacer(2);
        para('The 50/30/20 framework allocates income into Essentials (50%), Investments (30%), and Entertainment (20%). Transport is classified as Essential, preserving the full investment allocation.');
        spacer(2);

        subTitle('3.1 Stipend Phase (KES ' + income.toLocaleString('en-KE') + '/mo)');
        formulaBlock('Essentials (50%) = ' + income.toLocaleString('en-KE') + ' x 0.50 = KES ' + stipendEssentials.toLocaleString('en-KE'));
        formulaBlock('Investments (30%) = ' + income.toLocaleString('en-KE') + ' x 0.30 = KES ' + stipendInvest.toLocaleString('en-KE'));
        formulaBlock('Entertainment (20%) = ' + income.toLocaleString('en-KE') + ' x 0.20 = KES ' + stipendFun.toLocaleString('en-KE'));
        boldPara('After Transport Deduction:');
        formulaBlock('Essentials after Transport = KES ' + stipendEssentials.toLocaleString('en-KE') + ' - KES ' + moTransport.toLocaleString('en-KE') + ' = KES ' + stipendEssAfterTransport.toLocaleString('en-KE'));

        spacer(2);
        subTitle('3.2 Employment Phase (KES ' + jobSalary.toLocaleString('en-KE') + '/mo)');
        formulaBlock('Essentials (50%) = KES ' + jobEssentials.toLocaleString('en-KE'));
        formulaBlock('Investments (30%) = KES ' + jobInvest.toLocaleString('en-KE'));
        formulaBlock('Entertainment (20%) = KES ' + jobFun.toLocaleString('en-KE'));
        boldPara('After Transport Deduction:');
        formulaBlock('Essentials after Transport = KES ' + jobEssentials.toLocaleString('en-KE') + ' - KES ' + moTransport.toLocaleString('en-KE') + ' = KES ' + jobEssAfterTransport.toLocaleString('en-KE'));
        para('Transport = ' + fP(moTransport / jobSalary * 100) + ' of gross salary. The investment bucket of KES ' + jobInvest.toLocaleString('en-KE') + ' is fully preserved.');

        // ════════════════════════════════════════════
        //  SECTION 4: FIRE NUMBER DERIVATION
        // ════════════════════════════════════════════

        prog(6, 'Deriving FIRE number...');
        newPage();
        sectionTitle('4. FIRE Number Derivation');
        spacer(2);

        subTitle('4.1 Inflation-Adjusted Future Expenses');
        formulaBlock('Future Expenses = Current x (1 + inflation)^years');
        formulaBlock('= KES ' + annualExpenses.toLocaleString('en-KE') + ' x (1 + ' + inflationRate + ')^' + yearsToRetire);
        formulaBlock('= KES ' + annualExpenses.toLocaleString('en-KE') + ' x ' + Math.pow(1 + inflationRate, yearsToRetire).toFixed(4));
        formulaBlock('= KES ' + Math.round(inflatedAnnualExpenses).toLocaleString('en-KE'));

        const monthlyInflated = inflatedAnnualExpenses / 12;
        para('KES ' + Math.round(annualExpenses / 12).toLocaleString('en-KE') + '/month today becomes KES ' + Math.round(monthlyInflated).toLocaleString('en-KE') + '/month at age ' + retireAge + '.');

        spacer(2);
        subTitle('4.2 Apply Safe Withdrawal Rate');
        formulaBlock('FIRE Number = Inflated Annual Expenses / SWR');
        formulaBlock('= KES ' + Math.round(inflatedAnnualExpenses).toLocaleString('en-KE') + ' / ' + swr);
        formulaBlock('= KES ' + Math.round(fireNumber).toLocaleString('en-KE'));

        spacer(2);
        subTitle('4.3 SWR Sensitivity');
        dataTable(
            ['SWR', 'Multiplier', 'FIRE Number'],
            [
                ['3.0%', '33.3x', fK(inflatedAnnualExpenses / 0.03)],
                ['3.5%', '28.6x', fK(inflatedAnnualExpenses / 0.035)],
                ['4.0%', '25.0x', fK(inflatedAnnualExpenses / 0.04)],
                ['4.5%', '22.2x', fK(inflatedAnnualExpenses / 0.045)],
                ['5.0%', '20.0x', fK(inflatedAnnualExpenses / 0.05)],
            ],
            [40, 40, 100]
        );

        // ════════════════════════════════════════════
        //  SECTION 5: PORTFOLIO GROWTH
        // ════════════════════════════════════════════

        prog(7, 'Computing portfolio projections...');
        newPage();
        sectionTitle('5. Portfolio Growth Projections');
        spacer(2);

        subTitle('5.1 Future Value Formula');
        formulaBlock('FV = PV x (1 + r_m)^n  +  PMT x ((1 + r_m)^n - 1) / r_m');
        kvLine('PV (Present Value)', fK(savings));
        kvLine('PMT (Monthly Investment)', fK(monthlyInvest));
        kvLine('r_m (Monthly Rate)', expectedReturn + ' / 12 = ' + monthlyRate.toFixed(6));
        kvLine('n (Total Months)', yearsToRetire + ' x 12 = ' + months);

        spacer(2);
        subTitle('5.2 Step-by-Step Computation');
        formulaBlock('PV Growth = ' + savings.toLocaleString('en-KE') + ' x (1 + ' + monthlyRate.toFixed(6) + ')^' + months + ' = KES ' + Math.round(pvGrown).toLocaleString('en-KE'));
        formulaBlock('Annuity Factor = ((1 + ' + monthlyRate.toFixed(6) + ')^' + months + ' - 1) / ' + monthlyRate.toFixed(6) + ' = ' + annuityFactor.toFixed(2));
        formulaBlock('PMT Accumulation = ' + monthlyInvest.toLocaleString('en-KE') + ' x ' + annuityFactor.toFixed(2) + ' = KES ' + Math.round(monthlyInvest * annuityFactor).toLocaleString('en-KE'));
        formulaBlock('Total Portfolio = KES ' + Math.round(portfolioBaseline).toLocaleString('en-KE'));

        spacer(2);
        subTitle('5.3 Transport Opportunity Cost');
        formulaBlock('Opportunity Cost = KES ' + moTransport.toLocaleString('en-KE') + ' x ' + annuityFactor.toFixed(2) + ' = KES ' + Math.round(transportOpportunityCost).toLocaleString('en-KE'));
        para('This is the compound growth of KES ' + moTransport.toLocaleString('en-KE') + '/month over ' + yearsToRetire + ' years at ' + fP(expectedReturn * 100) + '. Transport is necessary for income generation; the key is to optimise, not eliminate.');

        spacer(2);
        subTitle('5.4 Portfolio Milestones (Transport Deducted)');
        const milestones = [];
        let bal = savings;
        let sal = income;
        for (let age = currentAge; age <= retireAge; age++) {
            if (age >= 24) sal = jobSalary;
            if (age >= 26) sal = 100000;
            if (age >= 28) sal = 150000;
            if (age >= 33) sal = 250000;
            if (age >= 38) sal = 350000;
            if (age >= 44) sal = 450000;
            let rent = 0;
            if (age >= 28) rent = 40000;
            if (age >= 38) rent = 0;
            const mSav = Math.max(0, (sal - rent - moTransport) * 0.30);
            bal = bal * (1 + expectedReturn) + mSav * 12;
            if (age === 24) bal -= (P.suitCost + P.phoneCost);
            if (age === 28) bal -= 1250000;
            if ((age - currentAge) % 3 === 0 || age === retireAge) {
                milestones.push(['Age ' + age, fK(sal), fK(mSav), fK(Math.max(0, Math.round(bal)))]);
            }
        }
        dataTable(['Age', 'Salary', 'Monthly Savings', 'Portfolio'], milestones, [35, 40, 50, 55]);

        // ════════════════════════════════════════════
        //  SECTION 6: KENYAN VEHICLES
        // ════════════════════════════════════════════

        prog(8, 'Writing investment analysis...');
        newPage();
        sectionTitle('6. Kenyan Investment Vehicle Analysis');
        spacer(2);

        subTitle('6.1 Vehicle Comparison');
        dataTable(
            ['Vehicle', 'Return', 'Risk', 'Liquidity', 'Min Entry'],
            [
                ['Money Market Funds', '10-12%', 'Very Low', 'T+1', 'KES 100'],
                ['T-Bills (91-day)', '8.5-9%', 'Risk-Free', 'At maturity', 'KES 50,000'],
                ['T-Bonds (5-10yr)', '12-14%', 'Very Low', 'Secondary', 'KES 50,000'],
                ['Infra Bonds (Tax-Free)', '12-14%', 'Very Low', 'Secondary', 'KES 50,000'],
                ['SACCO Deposits', '10-18%', 'Low-Mod', 'Notice', 'KES 200/mo'],
                ['CMA Special Funds', '12-16%', 'Mod-High', 'Daily/Monthly', 'KES 100,000'],
                ['NSE Blue-Chips', '12-20%', 'Mod-High', 'T+3', 'KES 100'],
                ['D-REITs (Acorn)', '7-10%', 'Moderate', 'Monthly', 'KES 5,000'],
                ['Unit Trust Equity', '12-20%', 'Moderate', 'T+2 to T+5', 'KES 5,000'],
            ],
            [42, 26, 26, 36, 30]
        );

        subTitle('6.2 Compound Growth (KES 5,000/mo over ' + yearsToRetire + 'yr)');
        const vRows = [['MMF', 0.10], ['T-Bonds', 0.125], ['Special Funds', 0.142], ['SACCO', 0.14], ['NSE', 0.15], ['Unit Trusts', 0.18]].map(v => {
            const mr = v[1] / 12;
            const fv = 5000 * ((Math.pow(1 + mr, months) - 1) / mr);
            return [v[0], fP(v[1] * 100), fK(5000 * months), fK(fv)];
        });
        dataTable(['Vehicle', 'Return', 'Contributed', 'Future Value'], vRows, [35, 30, 55, 60]);

        // ════════════════════════════════════════════
        //  SECTION 7: ETFs & INDEX FUNDS
        // ════════════════════════════════════════════

        prog(9, 'Writing ETF & Index Fund analysis...');
        newPage();
        sectionTitle('7. ETFs & Index Funds: Global Opportunities');
        spacer(2);

        para('Exchange-Traded Funds (ETFs) and Index Funds represent one of the most powerful wealth-building tools available to modern investors. While Kenya\'s local ETF market is nascent, Kenyan investors can access global markets through international brokerages.');
        spacer(2);

        subTitle('7.1 Definitions');
        boldPara('ETF (Exchange-Traded Fund):');
        para('A fund trading on a stock exchange that holds a basket of assets tracking an index. Key advantages: intraday trading, ultra-low fees (0.03%-0.20% p.a.), instant diversification across hundreds of companies, and tax efficiency.', 4);
        boldPara('Index Fund:');
        para('A mutual fund replicating a market index (e.g., S&P 500). Passive management means no fund manager tries to "beat the market," producing significantly lower fees than active funds which historically underperform indices over long periods.', 4);

        spacer(2);
        subTitle('7.2 Historical Performance');
        dataTable(
            ['Index / ETF', 'Return (USD)', 'Period', 'Characteristic'],
            [
                ['S&P 500 (VOO/SPY)', '10.5% p.a.', '1957-2025', '500 largest US companies'],
                ['MSCI World (IWDA)', '8.8% p.a.', '1987-2025', 'Developed markets globally'],
                ['MSCI Emerging Mkts', '9.2% p.a.', '2000-2025', 'EM incl. Africa & Asia'],
                ['Nasdaq-100 (QQQ)', '14.2% p.a.', '2000-2025', 'Tech-heavy, higher vol.'],
                ['FTSE All-World (VWRA)', '8.5% p.a.', '2005-2025', 'Global all-cap coverage'],
                ['Vanguard Total Bond', '4.1% p.a.', '2007-2025', 'US investment-grade bonds'],
            ],
            [45, 30, 30, 75]
        );

        spacer(2);
        subTitle('7.3 Why ETFs Matter for Kenyan FIRE Investors');

        boldPara('1. Currency Diversification:');
        para('KES has depreciated vs USD at ~3-5% per year. USD ETFs provide a natural hedge:', 4);
        formulaBlock('KES Return = (1 + USD Return) x (1 + KES Depreciation) - 1');
        formulaBlock('= (1 + 0.105) x (1 + 0.04) - 1 = 14.9% in KES terms');

        boldPara('2. Unprecedented Diversification:');
        para('Kenya\'s NSE has ~65 companies (~KES 2.5T market cap). The S&P 500 alone covers 500 companies worth USD 50T+. ETFs give access to thousands of companies across dozens of countries.', 4);

        boldPara('3. Proven Track Record:');
        para('The S&P 500 has survived World Wars, the Great Depression, dot-com crash, 2008 crisis, and COVID-19, returning 10.5% annually over nearly 70 years. Warren Buffett directs 90% of his estate to a low-cost S&P 500 index fund.', 4);

        boldPara('4. Fee Drag Computation:');
        const etfNet = 100000 * Math.pow(1 + 0.12 - 0.0003, yearsToRetire);
        const utNet = 100000 * Math.pow(1 + 0.12 - 0.02, yearsToRetire);
        const feeDrag = etfNet - utNet;
        formulaBlock('KES 100,000 at 12% gross over ' + yearsToRetire + ' years:');
        formulaBlock('ETF (0.03% fee): net 11.97% -> KES ' + Math.round(etfNet).toLocaleString('en-KE'));
        formulaBlock('Unit Trust (2% fee): net 10% -> KES ' + Math.round(utNet).toLocaleString('en-KE'));
        formulaBlock('Fee Drag = KES ' + Math.round(feeDrag).toLocaleString('en-KE') + ' (' + fP(feeDrag / etfNet * 100) + ' lost to fees)');

        spacer(2);
        subTitle('7.4 Access Platforms');
        dataTable(
            ['Platform', 'Min Deposit', 'ETFs', 'Commission'],
            [
                ['Interactive Brokers', 'USD 0', '13,000+', 'USD 1/trade'],
                ['Saxo Bank', 'USD 2,000', '7,000+', 'USD 3/trade'],
                ['Charles Schwab Intl', 'USD 25,000', '4,000+', 'USD 0 (US)'],
                ['eToro', 'USD 50', '250+', '0%'],
            ],
            [45, 35, 45, 55]
        );
        para('Note: US ETF dividends face 30% withholding tax (15% with treaty). Comply with CBK forex regulations. Consult a tax professional.');

        spacer(2);
        subTitle('7.5 Recommended ETF Allocation');
        dataTable(
            ['ETF', 'Ticker', 'Allocation', 'Rationale'],
            [
                ['Vanguard S&P 500', 'VOO', '50%', 'Core US large-cap, 0.03% fee'],
                ['iShares MSCI World', 'IWDA', '25%', 'Developed market diversification'],
                ['Vanguard FTSE EM', 'VWO', '15%', 'Emerging market growth'],
                ['iShares Global Bonds', 'AGGU', '10%', 'Fixed income stability'],
            ],
            [48, 22, 24, 86]
        );

        // ════════════════════════════════════════════
        //  SECTION 8: SCENARIOS
        // ════════════════════════════════════════════

        prog(10, 'Running scenario analysis...');
        newPage();
        sectionTitle('8. Scenario & Sensitivity Analysis');
        spacer(2);

        subTitle('8.1 Return Rate Sensitivity');
        const retScen = [8, 10, 12, 14, 16, 18].map(r => {
            const mr = r / 100 / 12;
            const pv = savings * Math.pow(1 + mr, months);
            const af = (Math.pow(1 + mr, months) - 1) / mr;
            const fv = pv + monthlyInvest * af;
            return [fP(r), fK(fv), fP(fv / fireNumber * 100), fv >= fireNumber ? 'FIRE' : 'Gap'];
        });
        dataTable(['Return', 'Portfolio at ' + retireAge, '% of FIRE', 'Status'], retScen, [35, 55, 45, 45]);

        subTitle('8.2 Savings Rate Sensitivity');
        const srScen = [10, 20, 30, 40, 50].map(sr => {
            const ms = Math.round(jobSalary * sr / 100);
            const pv = savings * Math.pow(1 + monthlyRate, months);
            const af = annuityFactor;
            const fv = pv + ms * af;
            return [fP(sr), fK(ms), fK(fv), fv >= fireNumber ? 'FIRE' : 'Gap'];
        });
        dataTable(['SR', 'Monthly Savings', 'Portfolio at ' + retireAge, 'Status'], srScen, [30, 45, 60, 45]);

        subTitle('8.3 Transport Impact');
        formulaBlock('Baseline Portfolio: KES ' + Math.round(portfolioBaseline).toLocaleString('en-KE'));
        formulaBlock('Transport Opp. Cost (' + yearsToRetire + 'yr): KES ' + Math.round(transportOpportunityCost).toLocaleString('en-KE'));
        para('Every KES 1,000 of weekly recurring expenditure carries KES ' + fK(transportOpportunityCost) + ' in compound opportunity cost over ' + yearsToRetire + ' years.');

        subTitle('8.4 Inflation Sensitivity');
        const infScen = [4, 5, 6, 7, 8, 10].map(inf => {
            const ir = inf / 100;
            const ie = annualExpenses * Math.pow(1 + ir, yearsToRetire);
            return [fP(inf), fK(ie), fK(ie / swr), fP(((1 + expectedReturn) / (1 + ir) - 1) * 100)];
        });
        dataTable(['Inflation', 'Future Expenses', 'FIRE Number', 'Real Return'], infScen, [30, 45, 55, 50]);

        // ════════════════════════════════════════════
        //  SECTION 9: RISK
        // ════════════════════════════════════════════

        prog(11, 'Building risk assessment...');
        newPage();
        sectionTitle('9. Risk Assessment & Mitigation');
        spacer(2);

        dataTable(
            ['Risk Factor', 'Impact', 'Probability', 'Mitigation'],
            [
                ['High Inflation (>8%)', 'Erodes purchasing power', 'Moderate', 'Equity portfolio, USD ETFs'],
                ['KES Depreciation', 'Reduces import power', 'High', '20-30% in USD ETFs/bonds'],
                ['Job Loss', 'Halts contributions', 'Low-Mod', '6-mo emergency fund (MMF)'],
                ['Market Crash (-30%)', 'Portfolio drawdown', 'Low', 'Stay invested, rebalance'],
                ['Sequence-of-Returns', 'Poor returns near retire', 'Moderate', 'Bond tent at age 45+'],
                ['Health Emergency', 'Large unplanned cost', 'Low', 'NHIF + private insurance'],
                ['Education Inflation', 'Fees exceed plan', 'Moderate', 'Dedicated education fund'],
                ['Regulatory Changes', 'Tax/rule shifts', 'Moderate', 'Diversify vehicle types'],
            ],
            [40, 38, 30, 72]
        );

        spacer(2);
        subTitle('9.2 Real Return Derivation');
        formulaBlock('Real Return = (1 + ' + expectedReturn + ') / (1 + ' + inflationRate + ') - 1 = ' + fP(realReturn * 100) + ' p.a.');
        const realGrowth = Math.round(100000 * Math.pow(1 + realReturn, yearsToRetire));
        para('KES 100,000 grows to KES ' + realGrowth.toLocaleString('en-KE') + ' in today\'s purchasing power over ' + yearsToRetire + ' years.');

        // ════════════════════════════════════════════
        //  SECTION 10: ACTION PLAN
        // ════════════════════════════════════════════

        newPage();
        sectionTitle('10. Action Plan & Conclusion');
        spacer(2);

        subTitle('10.1 Immediate Actions');
        const actions = [
            'Open a Money Market Fund (Cytonn, Britam, or Sanlam) and deposit KES 5,000',
            'Register on DhowCSD (Central Bank) for T-Bill/Bond access (free)',
            'Open CDS account on NSE via Ziidi (M-Pesa) for stock trading',
            'Track weekly KES ' + wkTransport.toLocaleString('en-KE') + ' transport budget rigorously',
            'Begin monthly KES ' + stipendInvest.toLocaleString('en-KE') + ' investment (MMF + SACCO split)',
            'Join a reputable SACCO (Stima, Kenya Police, or sector-specific)',
            'Research high-reputation CMA Special Funds and establish advisory prerequisites',
            'Open Interactive Brokers account (free) for future ETF investments',
        ];
        actions.forEach((a, i) => {
            checkBreak(8);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text((i + 1) + '.', ML + 4, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 60);
            const lines = doc.splitTextToSize(a, CW - 14);
            lines.forEach(l => { doc.text(l, ML + 12, y); y += 4; });
            y += 2;
        });

        spacer(4);
        subTitle('10.2 Summary of Computational Results');
        dataTable(
            ['Metric', 'Value'],
            [
                ['FIRE Target Portfolio', fK(fireNumber)],
                ['Current Savings', fK(savings)],
                ['FIRE Progress', fP(savings / fireNumber * 100)],
                ['Monthly Transport', fK(moTransport)],
                ['Annual Transport', fK(yrTransport)],
                ['Transport Opp. Cost (' + yearsToRetire + 'yr)', fK(transportOpportunityCost)],
                ['Real Return', fP(realReturn * 100)],
                ['Projected Portfolio at ' + retireAge, fK(portfolioBaseline)],
                ['ETF vs UT Fee Drag', fK(feeDrag)],
                ['Years to FIRE', String(yearsToRetire)],
            ],
            [100, 80]
        );

        spacer(6);
        checkBreak(24);
        doc.setFillColor(251, 191, 36);
        doc.rect(ML, y, CW, 0.5, 'F');
        y += 5;
        doc.setFontSize(8.5);
        doc.setTextColor(45, 45, 55);
        doc.setFont('helvetica', 'italic');
        const closingLines = doc.splitTextToSize(
            'This report was generated by the FIRE Kenya Financial Independence Dashboard. Every figure is derived from explicit computational formulae using the stated assumptions. Markets are inherently uncertain and past performance does not guarantee future results. This is for educational and planning purposes only. Review your plan regularly as circumstances evolve.',
            CW
        );
        closingLines.forEach(l => { checkBreak(4.5); doc.text(l, ML, y); y += 4.5; });

        // Save
        prog(12, 'Finalising PDF...');
        await new Promise(r => setTimeout(r, 300));
        doc.save(titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.pdf');

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Check the browser console for details.');
    } finally {
        if (btn) btn.disabled = false;
        closeExportModal();
    }
}
