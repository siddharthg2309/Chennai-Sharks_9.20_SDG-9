import 'dotenv/config';
import { db } from '../src/lib/db';
import { funds } from '../src/db/schema';

const greenFunds = [
    {
        name: 'Quant ESG Equity Fund - Direct Growth',
        type: 'GREEN_FUND' as const,
        nav: '48.50',
        minInvestment: '500',
        cagr1y: '31.58',
        cagr3y: '24.50',
        expenseRatio: '0.62',
        launchDate: '2020-06-01',
        description: 'An actively managed ESG fund investing in companies with strong environmental, social, and governance practices. Top performer in the ESG category.',
    },
    {
        name: 'ICICI Prudential ESG Exclusionary Strategy Fund',
        type: 'GREEN_FUND' as const,
        nav: '15.75',
        minInvestment: '500',
        cagr1y: '17.40',
        cagr3y: '15.20',
        expenseRatio: '0.48',
        launchDate: '2020-10-15',
        description: 'Invests in companies that meet ESG exclusionary criteria, avoiding sectors like tobacco, weapons, and fossil fuels.',
    },
    {
        name: 'SBI ESG Exclusionary Strategy Fund',
        type: 'GREEN_FUND' as const,
        nav: '14.20',
        minInvestment: '500',
        cagr1y: '16.63',
        cagr3y: '14.80',
        expenseRatio: '0.55',
        launchDate: '2020-11-20',
        description: 'Backed by SBI, this fund focuses on sustainable businesses with strong ESG compliance and governance standards.',
    },
    {
        name: 'Kotak ESG Exclusionary Strategy Fund',
        type: 'GREEN_FUND' as const,
        nav: '12.80',
        minInvestment: '500',
        cagr1y: '13.89',
        cagr3y: '12.50',
        expenseRatio: '0.52',
        launchDate: '2020-12-10',
        description: 'Kotak\'s ESG fund that invests in companies demonstrating responsible business practices and sustainability.',
    },
    {
        name: 'Aditya Birla Sun Life ESG Integration Fund',
        type: 'GREEN_FUND' as const,
        nav: '11.95',
        minInvestment: '500',
        cagr1y: '13.59',
        cagr3y: '11.80',
        expenseRatio: '0.58',
        launchDate: '2021-01-15',
        description: 'Integrates ESG factors into fundamental analysis for sustainable long-term wealth creation.',
    },
    {
        name: 'DSP Natural Resources and New Energy Fund',
        type: 'GREEN_FUND' as const,
        nav: '89.25',
        minInvestment: '100',
        cagr1y: '34.19',
        cagr3y: '28.40',
        expenseRatio: '0.85',
        launchDate: '2008-04-25',
        description: 'Invests in companies involved in natural resources and emerging renewable energy technologies. One of the top performers.',
    },
    {
        name: 'Tata Resources & Energy Fund - Direct Growth',
        type: 'GREEN_FUND' as const,
        nav: '42.10',
        minInvestment: '500',
        cagr1y: '17.83',
        cagr3y: '16.20',
        expenseRatio: '0.72',
        launchDate: '2015-12-28',
        description: 'Tata\'s thematic fund focusing on energy and resource sector including renewable energy companies.',
    },
    {
        name: 'Axis ESG Integration Strategy Fund',
        type: 'GREEN_FUND' as const,
        nav: '18.65',
        minInvestment: '500',
        cagr1y: '12.11',
        cagr3y: '10.90',
        expenseRatio: '0.45',
        launchDate: '2021-02-20',
        description: 'Axis fund integrating ESG analysis into investment decisions for sustainable portfolio construction.',
    },
    {
        name: 'Mirae Asset Nifty 100 ESG Sector Leaders FoF',
        type: 'GREEN_FUND' as const,
        nav: '13.40',
        minInvestment: '500',
        cagr1y: '14.34',
        cagr3y: '13.20',
        expenseRatio: '0.30',
        launchDate: '2021-03-15',
        description: 'A Fund of Fund tracking the NIFTY 100 ESG Sector Leaders Index for diversified ESG exposure.',
    },
    {
        name: 'Quantum ESG Best In Class Strategy Fund',
        type: 'GREEN_FUND' as const,
        nav: '16.90',
        minInvestment: '500',
        cagr1y: '14.34',
        cagr3y: '12.60',
        expenseRatio: '0.40',
        launchDate: '2021-06-10',
        description: 'Selects best-in-class ESG performers across sectors for strong sustainability-focused returns.',
    },
];

async function seedFunds() {
    console.log('🌱 Seeding green mutual funds...');

    for (const fund of greenFunds) {
        try {
            await db.insert(funds).values(fund);
            console.log(`✅ Added: ${fund.name}`);
        } catch (error) {
            console.error(`❌ Failed to add ${fund.name}:`, error);
        }
    }

    console.log('\n🎉 Seeding complete! Added', greenFunds.length, 'funds.');
    process.exit(0);
}

seedFunds().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
