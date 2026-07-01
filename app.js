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

    // Kenya Economic Context
    inflation: 6.0,
    tBillRate: 8.5,
    tBondRate: 12.5,
    mmfRate: 10,
    saccoReturn: 14,
    nseReturn: 15,
    privateEquityReturn: 20,
};

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

function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Update active link
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show section
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(sectionId);
            if (target) {
                target.classList.add('active');
                // Re-trigger animations
                target.style.animation = 'none';
                target.offsetHeight;
                target.style.animation = '';
            }

            // Close mobile nav
            document.getElementById('sidebar').classList.remove('open');
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
        { date: 'Jul 2026', title: '📍 Now - Current Position', desc: 'Stipend income of KES 15,480/month. Total savings: KES 173,000. Investment portfolio: KES 0.', amount: 'Savings: KES 173,000', type: 'current' },
        { date: 'Sep 2026', title: '💼 Start Job', desc: 'Net salary: KES 59,000/month. Buy KES 6,995 suit from first paycheck.', amount: 'Salary: KES 59,000/mo', type: 'milestone' },
        { date: 'Oct 2026', title: '📱 Buy Phone', desc: 'KES 80,000 phone. First paycheck (KES 59,000) + KES 21,000 top-up from savings. Start weekly KES 350 savings.', amount: 'Phone: KES 80,000', type: 'milestone' },
        { date: 'Oct 2026', title: '💰 Weekly Savings Begin', desc: 'KES 350/week = KES 1,400/month deposited into Money Market Fund.', amount: 'KES 350/week', type: '' },
        { date: 'Jan 2027', title: '🏦 Open DhowCSD & SACCO', desc: 'Register on DhowCSD for T-Bills/Bonds. Join a SACCO (KES 2,000/month shares). Start building credit history.', amount: '', type: '' },
        { date: 'Mar 2027', title: '📊 First T-Bill Purchase', desc: 'MMF balance reaches KES 50,000. Roll into 91-day Treasury Bills at ~8.5% yield.', amount: 'T-Bill: KES 50,000', type: '' },
        { date: 'Jun 2027', title: '📈 Start Stock Investing', desc: 'Begin monthly KES 5,000 NSE purchases. Focus on Safaricom, Equity Group, KCB via Ziidi app.', amount: 'Stocks: KES 5,000/mo', type: '' },
        { date: 'Sep 2027', title: '🎂 Turn 25', desc: 'Age 25 - review investment allocation. Portfolio target check: on track for KES 1M by 2030.', amount: '', type: '' },
        { date: 'Jun 2028', title: '🔄 Job Contract Ends', desc: 'End of initial KES 59,000/month contract. Estimated savings: ~KES 350K+. Career transition or upgrade.', amount: '', type: 'milestone' },
        { date: 'Jul 2028', title: '📈 Career Growth', desc: 'Target next role at KES 80K–120K/month. Increase investment allocation to 30%+.', amount: 'Target: KES 100K/mo', type: '' },
        { date: 'Jan 2030', title: '🎯 KES 1M Portfolio!', desc: 'Investment portfolio hits KES 1 million milestone. Diversified across T-Bonds, stocks, MMF, and SACCO.', amount: '🎉 KES 1,000,000', type: 'milestone' },
        { date: 'Dec 2030', title: '🏠 Move Out + 🚗 Buy Car', desc: 'Rent at KES 40,000/month. Purchase first car (KES 1M-1.5M). Major lifestyle upgrade - budget restructure required.', amount: 'Car: KES 1-1.5M', type: 'milestone' },
        { date: '2032–2035', title: '💍 Marriage & Family', desc: 'Start family. Budget for wife and children. Scale investments with growing career income. Open education funds for children.', amount: '', type: '' },
        { date: '2035–2040', title: '🏗️ Property Investment', desc: 'Consider buying property via SACCO mortgage. Build equity and eliminate rent. Explore D-REITs for diversification.', amount: '', type: '' },
        { date: '2040–2045', title: '📚 Children\'s Education Peak', desc: 'School fees for 3 children. Unit trust education funds should cover majority. Maintain investment discipline.', amount: '', type: '' },
        { date: '2045–2050', title: '🛡️ FIRE Glide Path', desc: 'Shift to conservative allocation (70% bonds). Build 2-year cash buffer. Establish passive income streams.', amount: '', type: '' },
        { date: 'Sep 2052', title: '🔥 FIRE - Retire at 50!', desc: 'Financial Independence achieved. Passive income from bonds, dividends, rental income, and SACCO interest covers all family expenses.', amount: '🔥 FIRE!', type: 'milestone' },
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
    const ctx = document.getElementById('netWorthChart').getContext('2d');
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

        // Annual investment growth + monthly contributions
        const annualContribution = (monthlySalary - rent) * savingsRate * 12;
        netWorth = netWorth * (1 + investReturn) + annualContribution;
        
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
    const ctx = document.getElementById('budgetDoughnut').getContext('2d');
    
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
                            const income = PERSONAL.currentStipend;
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
    const ctx = document.getElementById('portfolioAllocationChart').getContext('2d');
    
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
    const ctx = document.getElementById('investmentGrowthChart').getContext('2d');
    
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
    document.getElementById('fireNumber').textContent = formatKES(Math.round(fireNumber));
    document.getElementById('fireNetWorth').textContent = formatKES(PERSONAL.currentSavings);
    const progress = (PERSONAL.currentSavings / fireNumber) * 100;
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
        
        portfolio = portfolio * (1 + expectedReturn) + monthlySaving * 12;
        
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
    
    const monthlyInvest = (salary - rent) * savingsRate;
    document.getElementById('simMonthlySavings').textContent = formatKES(Math.round(monthlyInvest));
    
    // Simulate year by year
    let portfolio = PERSONAL.currentSavings;
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
        
        const yearlyContrib = Math.max(0, (currentSalary - currentRent) * savingsRate * 12);
        portfolio = portfolio * (1 + annualReturn) + yearlyContrib;
        
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
    const essentials = Math.round(income * 0.50);
    const invest = Math.round(income * 0.30);
    const fun = Math.round(income * 0.20);
    
    document.getElementById('flowIncome').textContent = formatKES(income);
    document.getElementById('flowEssentials').textContent = formatKES(essentials);
    document.getElementById('flowInvest').textContent = formatKES(invest);
    document.getElementById('flowFun').textContent = formatKES(fun);
    
    document.getElementById('incomeBalance').textContent = formatKES(income);
    document.getElementById('incomeInflow').textContent = formatKES(income);
    document.getElementById('essentialsBalance').textContent = formatKES(essentials);
    document.getElementById('entertainBalance').textContent = formatKES(fun);
}

// ==================== 1. DECISION IMPACT LAB ====================
let decisionLog = [];
let decisionChart;

function computeBaselineTrajectory() {
    let portfolio = PERSONAL.currentSavings;
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
        
        portfolio = portfolio * (1 + returnRate) + Math.max(0, (salary - rent)) * savingsRate * 12;
        
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
    
    // Compute baseline
    const baseline = computeBaselineTrajectory();
    
    // Compute with all decisions applied
    let portfolio = PERSONAL.currentSavings;
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
        
        portfolio = portfolio * (1 + returnRate) + Math.max(0, (salary - rent)) * savingsRate * 12;
        
        if (age === 24) portfolio -= (PERSONAL.suitCost + PERSONAL.phoneCost);
        if (age === 28) portfolio -= 1250000;
        
        withDecision.push({ age, value: Math.max(0, Math.round(portfolio)) });
    }
    
    // Update chart
    const labels = baseline.map(d => `Age ${d.age}`);
    const baselineData = baseline.map(d => d.value);
    const decisionData = withDecision.map(d => d.value);
    
    const ctx = document.getElementById('decisionChart').getContext('2d');
    if (decisionChart) decisionChart.destroy();
    
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
                tooltip: { ...chartDefaults.plugins.tooltip, callbacks: { label: ctx => ctx.dataset.label + ': ' + formatKES(ctx.parsed.y, true) } }
            }
        }
    });
    
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
    let advice = '';
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
            <button class="dl-remove" onclick="removeDecision(${i})">✕</button>
        </div>
    `).join('');
}

function removeDecision(index) {
    decisionLog.splice(index, 1);
    renderDecisionLog();
    if (decisionLog.length > 0) analyzeDecision(); // re-analyze with remaining
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
    document.getElementById('revFireNumberSub').textContent = `${formatKES(Math.round(inflatedAnnualExpenses))}/year × ${(1/withdrawalRate).toFixed(0)}x`;
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
    
    for (let age = currentAge; age <= retireAge; age++) {
        labels.push(`Age ${age}`);
        reqPortfolio = reqPortfolio * (1 + expectedReturn) + requiredMonthly * 12;
        requiredPath.push(Math.round(reqPortfolio));
        
        // Actual path with current savings rate
        let actSalary = PERSONAL.currentStipend;
        if (age >= 24) actSalary = PERSONAL.jobSalary;
        if (age >= 26) actSalary = 100000;
        if (age >= 28) actSalary = 150000;
        if (age >= 33) actSalary = 250000;
        actPortfolio = actPortfolio * (1 + expectedReturn) + actSalary * 0.30 * 12;
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
    
    verdict += `💡 <strong>Pro Tip:</strong> With Kenyan mortgage rates at ${(mortgageRate*100).toFixed(1)}%, consider a SACCO mortgage (typically 10-12% vs bank 13-14%). Alternatively, invest the down payment in T-Bonds (12-14%) while renting - the returns may outpace property appreciation.`;
    
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
        
        portfolio = portfolio * (1 + blendedReturn) + Math.max(0, (salary - rent)) * savingsRate * 12;
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
