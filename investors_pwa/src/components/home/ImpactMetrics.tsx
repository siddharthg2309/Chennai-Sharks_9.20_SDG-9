'use client';

import { Cloud, TreePine, Wind } from 'lucide-react';

import { IconWrapper } from '@/components/ui/IconWrapper';

interface ImpactMetricsProps {
  co2Avoided: number;
  cleanEnergyGenerated: number;
  treesEquivalent: number;
}

export function ImpactMetrics({ co2Avoided, cleanEnergyGenerated, treesEquivalent }: ImpactMetricsProps) {
  const metrics = [
    {
      id: 'co2',
      icon: Cloud,
      iconColor: 'text-sky-400',
      glowColor: 'bg-sky-400/10',
      value: co2Avoided.toFixed(1),
      label: 'kg CO₂ avoided',
    },
    {
      id: 'energy',
      icon: Wind,
      iconColor: 'text-emerald-400',
      glowColor: 'bg-emerald-400/10',
      value: cleanEnergyGenerated.toFixed(0),
      label: 'kWh clean energy',
    },
    {
      id: 'trees',
      icon: TreePine,
      iconColor: 'text-teal-400',
      glowColor: 'bg-teal-400/10',
      value: treesEquivalent.toString(),
      label: 'trees equivalent',
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-white mb-4">Impact Metrics</h2>

      <div className="flex flex-col items-stretch gap-3">
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className={`flex items-center gap-4 bg-[#262626] p-4 rounded-sm ${
              index !== metrics.length - 1 ? 'border-b border-[#333333]' : ''
            }`}
          >
            <IconWrapper
              icon={metric.icon}
              size={24}
              strokeWidth={1.5}
              primaryClassName={metric.iconColor}
              secondaryClassName={metric.iconColor}
              glowClassName={metric.glowColor}
            />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-white">{metric.value}</p>
              <p className="text-[13px] text-[#9B9B9B] leading-relaxed">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
