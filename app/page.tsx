import { prisma } from '@/lib/prisma';
import { Tabs, TabKey } from '@/components/Tabs';
import { TokenCard } from '@/components/TokenCard';
import { BoostedCarousel } from '@/components/BoostedCarousel';

export const dynamic = 'force-dynamic';

function asTab(value: string | string[] | undefined): TabKey {
  const v = Array.isArray(value) ? value[0] : value;
  if (v === 'upvoted' || v === 'gainers' || v === 'recent') return v;
  return 'recent';
}

export default async function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const tab = asTab(searchParams?.tab);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const projectCount = await prisma.token.count({ where: { isApproved: true } });
  const tonPrice = null; // wire to an API later

  const totalUpvotes = await prisma.vote.count();

  // Votes in last 24h, grouped by token
  const votesByToken = await prisma.vote.groupBy({
    by: ['tokenId'],
    where: { createdAt: { gte: since } },
    _count: { tokenId: true }
  });
  const voteMap = new Map(votesByToken.map(v => [v.tokenId, v._count.tokenId]));

  // Active boosts
  const now = new Date();
  const activeBoosts = await prisma.boost.findMany({
    where: {
      status: 'ACTIVE',
      startAt: { lte: now },
      endAt: { gte: now }
    },
    select: { tokenId: true }
  });
  const boostedSet = new Set(activeBoosts.map(b => b.tokenId));

  const boostedTokens = await prisma.token.findMany({
    where: { id: { in: Array.from(boostedSet) }, isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: {
      id: true,
      jettonMaster: true,
      name: true,
      symbol: true,
      description: true,
      imageUrl: true,
      website: true,
      telegram: true,
      twitter: true,
      category: true,
      createdAt: true,
      snapshots: { orderBy: { ts: 'desc' }, take: 1 }
    }
  });

  // Pull tokens + their latest snapshot
  const tokens = await prisma.token.findMany({
    where: { isApproved: true },
    orderBy: tab === 'recent' ? { createdAt: 'desc' } : { createdAt: 'desc' },
    take: 60,
    select: {
      id: true,
      jettonMaster: true,
      name: true,
      symbol: true,
      description: true,
      imageUrl: true,
      website: true,
      telegram: true,
      twitter: true,
      category: true,
      createdAt: true,
      snapshots: {
        take: 1,
        orderBy: { ts: 'desc' },
        select: {
          change24hPct: true,
          volume24hUsd: true,
          mcapUsd: true
        }
      }
    }
  });

  const enriched = tokens.map(t => {
    const s = t.snapshots[0];
    return {
      token: {
        id: t.id,
        jettonMaster: t.jettonMaster,
        name: t.name,
        symbol: t.symbol,
        description: t.description,
        imageUrl: t.imageUrl,
        website: t.website,
        telegram: t.telegram,
        twitter: t.twitter,
        category: t.category,
        createdAt: t.createdAt.toISOString()
      },
      votes24h: voteMap.get(t.id) ?? 0,
      change24h: s?.change24hPct ?? null,
      volume24hUsd: s?.volume24hUsd ?? null,
      mcapUsd: s?.mcapUsd ?? null,
      isBoosted: boostedSet.has(t.id)
    };
  });

  // Sorting
  let list = enriched;
  if (tab === 'upvoted') {
    list = [...enriched].sort((a, b) => (b.votes24h - a.votes24h) || (Number(b.isBoosted) - Number(a.isBoosted)));
  }
  if (tab === 'gainers') {
    list = [...enriched].sort((a, b) => ((b.change24h ?? -999999) - (a.change24h ?? -999999)) || (b.votes24h - a.votes24h));
  }
  if (tab === 'recent') {
    list = [...enriched].sort((a, b) => (Number(b.isBoosted) - Number(a.isBoosted)) || (new Date(b.token.createdAt).getTime() - new Date(a.token.createdAt).getTime()));
  }

  return (
    <main>
      <div className="topRow">
        <div className="stats">
          <div className="stat"><span className="statLabel">Projects Listed</span><span className="statValue">{projectCount}</span></div>
          <div className="stat"><span className="statLabel">Total Upvotes</span><span className="statValue">{totalUpvotes}</span></div>
        </div>
        {/* Boosted */}
      <BoostedCarousel tokens={boostedTokens.map(t => ({...t, vote24h: voteMap.get(t.id) ?? 0, boosted: true}))} />

      <Tabs active={tab} />
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
Recently Added / Top Upvoted / Top Gainers — TON edition.
      </p>

      <div className="grid" style={{ marginTop: 14 }}>
        {list.map((item) => (
          <TokenCard
            key={item.token.id}
            token={item.token}
            votes24h={item.votes24h}
            change24h={item.change24h}
            volume24hUsd={item.volume24hUsd}
            mcapUsd={item.mcapUsd}
            isBoosted={item.isBoosted}
          />
        ))}
      </div>
    </main>
  );
}
