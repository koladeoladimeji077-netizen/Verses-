import Link from 'next/link';

export type TabKey = 'recent' | 'upvoted' | 'gainers';

export function Tabs({ active }: { active: TabKey }) {
  const tabs: { key: TabKey; label: string; href: string }[] = [
    { key: 'recent', label: 'Recently Added', href: '/?tab=recent' },
    { key: 'upvoted', label: 'Top Upvoted (24h)', href: '/?tab=upvoted' },
    { key: 'gainers', label: 'Top Gainers (24h)', href: '/?tab=gainers' }
  ];

  return (
    <div className="tabs">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href} className={`tab ${active === t.key ? 'active' : ''}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
