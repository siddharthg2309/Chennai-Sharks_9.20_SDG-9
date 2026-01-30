'use client';

import Link from 'next/link';
import { Building, Leaf, TrendingUp } from 'lucide-react';

import { Card } from '@/components/ui/Card';

const fundTypes = [
  {
    id: 'GREEN_FUND',
    name: 'Green Funds',
    icon: Leaf,
    iconColor: 'text-green-500',
  },
  {
    id: 'GREEN_BOND',
    name: 'Green Bonds',
    icon: Building,
    iconColor: 'text-blue-500',
  },
  {
    id: 'INVIT',
    name: 'InvITs',
    icon: TrendingUp,
    iconColor: 'text-purple-500',
  },
];

export function FundTypeGrid() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">Get started</p>
      <p className="text-base">Find the right fund across these categories</p>

      <div className="space-y-3 mt-4">
        {fundTypes.map(({ id, name, icon: Icon, iconColor }) => (
          <Link key={id} href={`/discover?type=${id}`}>
            <Card className="flex items-center gap-4 hover:bg-neutral-800 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center">
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <span className="font-medium">{name}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
