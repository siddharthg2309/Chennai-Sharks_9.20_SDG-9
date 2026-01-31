import 'dotenv/config';
import { db } from '../src/lib/db';
import { funds } from '../src/db/schema';

const invits = [
    {
        name: 'IndiGrid InvIT',
        type: 'INVIT' as const,
        nav: '145.50',
        minInvestment: '1000',
        cagr1y: '12.50',
        cagr3y: '10.80',
        expenseRatio: '0.35',
        launchDate: '2017-06-15',
        description: 'India\'s first listed power sector InvIT sponsored by KKR and GIC. Portfolio includes 49 transmission lines, 15 substations, and 1.1 GW solar capacity.',
    },
    {
        name: 'PowerGrid InvIT',
        type: 'INVIT' as const,
        nav: '91.48',
        minInvestment: '1000',
        cagr1y: '8.50',
        cagr3y: '9.20',
        expenseRatio: '0.25',
        launchDate: '2021-05-10',
        description: 'Backed by PowerGrid Corporation with stable power transmission assets. Offers consistent dividends from regulated tariff income.',
    },
    {
        name: 'IRB InvIT Fund',
        type: 'INVIT' as const,
        nav: '68.25',
        minInvestment: '1000',
        cagr1y: '11.20',
        cagr3y: '9.80',
        expenseRatio: '0.40',
        launchDate: '2017-05-15',
        description: 'IRB\'s infrastructure trust with 26 road project portfolio. Regular dividend payouts from toll collection on highway assets.',
    },
    {
        name: 'National Highways Infra Trust',
        type: 'INVIT' as const,
        nav: '102.75',
        minInvestment: '1000',
        cagr1y: '9.80',
        cagr3y: '8.90',
        expenseRatio: '0.30',
        launchDate: '2021-02-25',
        description: 'NHAI-sponsored InvIT monetizing completed highway projects. Backed by government guarantee for stable returns.',
    },
    {
        name: 'Data Infrastructure Trust (Indus Towers)',
        type: 'INVIT' as const,
        nav: '185.60',
        minInvestment: '1000',
        cagr1y: '14.30',
        cagr3y: '12.50',
        expenseRatio: '0.28',
        launchDate: '2019-11-20',
        description: 'India\'s largest telecom tower infrastructure trust. Portfolio includes 180,000+ towers across the country.',
    },
    {
        name: 'Cube Highways InvIT',
        type: 'INVIT' as const,
        nav: '112.40',
        minInvestment: '1000',
        cagr1y: '10.50',
        cagr3y: '9.40',
        expenseRatio: '0.32',
        launchDate: '2020-08-15',
        description: 'Private InvIT with diversified highway assets across India. Stable toll income from premium road projects.',
    },
];

async function seedInvits() {
    console.log('🌱 Seeding InvITs...');

    for (const invit of invits) {
        try {
            await db.insert(funds).values(invit);
            console.log(`✅ Added: ${invit.name}`);
        } catch (error) {
            console.error(`❌ Failed to add ${invit.name}:`, error);
        }
    }

    console.log('\n🎉 Seeding complete! Added', invits.length, 'InvITs.');
    process.exit(0);
}

seedInvits().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
