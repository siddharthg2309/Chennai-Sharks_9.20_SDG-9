import 'dotenv/config';
import { db } from '../src/lib/db';
import { funds } from '../src/db/schema';

const greenBonds = [
    {
        name: 'NTPC Green Energy Bond - 2026',
        type: 'GREEN_BOND' as const,
        nav: '1000.00',
        minInvestment: '10000',
        fixedReturn: '7.50',
        expenseRatio: '0.10',
        launchDate: '2024-11-15',
        description: 'NTPC Green Energy\'s green bond financing renewable energy projects including solar and wind installations across India.',
    },
    {
        name: 'REC Limited Green Dollar Bond 2029',
        type: 'GREEN_BOND' as const,
        nav: '1000.00',
        minInvestment: '10000',
        fixedReturn: '7.25',
        expenseRatio: '0.08',
        launchDate: '2024-09-27',
        description: 'Rural Electrification Corporation\'s green bond supporting renewable energy transmission and rural electrification projects.',
    },
    {
        name: 'Sovereign Green Bond - 10 Year',
        type: 'GREEN_BOND' as const,
        nav: '1000.00',
        minInvestment: '10000',
        fixedReturn: '6.98',
        expenseRatio: '0.00',
        launchDate: '2025-01-27',
        description: 'Government of India sovereign green bond financing clean transportation and renewable energy infrastructure.',
    },
    {
        name: 'IREDA Perpetual Green Bond',
        type: 'GREEN_BOND' as const,
        nav: '1000.00',
        minInvestment: '10000',
        fixedReturn: '7.70',
        expenseRatio: '0.05',
        launchDate: '2025-09-11',
        description: 'Indian Renewable Energy Development Agency\'s perpetual bond for financing solar, wind, and hydropower projects.',
    },
    {
        name: 'Power Finance Corporation Green Bond',
        type: 'GREEN_BOND' as const,
        nav: '1000.00',
        minInvestment: '10000',
        fixedReturn: '7.35',
        expenseRatio: '0.10',
        launchDate: '2024-06-15',
        description: 'PFC\'s green bond supporting India\'s renewable energy capacity expansion and grid infrastructure development.',
    },
];

async function seedBonds() {
    console.log('🌱 Seeding green bonds...');

    for (const bond of greenBonds) {
        try {
            await db.insert(funds).values(bond);
            console.log(`✅ Added: ${bond.name}`);
        } catch (error) {
            console.error(`❌ Failed to add ${bond.name}:`, error);
        }
    }

    console.log('\n🎉 Seeding complete! Added', greenBonds.length, 'bonds.');
    process.exit(0);
}

seedBonds().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
