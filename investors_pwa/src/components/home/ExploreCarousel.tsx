'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Building, Leaf, TrendingUp } from 'lucide-react';

const categories = [
  {
    id: 'GREEN_FUND',
    title: 'Green Mutual Funds',
    description: 'ESG & renewable energy funds',
    icon: Leaf,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-500',
  },
  {
    id: 'GREEN_BOND',
    title: 'Green Bonds',
    description: 'Fixed return green bonds',
    icon: Building,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    id: 'INVIT',
    title: 'Green InvITs',
    description: 'Infrastructure trusts',
    icon: TrendingUp,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
  },
];

export function ExploreCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.7;
      const gap = 16;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, categories.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth * 0.7;
    const gap = 16;
    const scrollPosition = index * (cardWidth + gap);
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Explore investment ideas</h2>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map(({ id, title, description, icon: Icon, iconBg, iconColor }) => (
          <Link
            key={id}
            href={`/discover?type=${id}`}
            className="snap-start flex-shrink-0"
            style={{ width: '70%' }}
          >
            <div className="bg-neutral-900 rounded-xl p-4 h-40 flex flex-col justify-between hover:bg-neutral-800 transition-colors">
              <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {categories.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === activeIndex ? 'bg-blue-500' : 'bg-neutral-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
