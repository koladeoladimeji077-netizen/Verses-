/**
 * Snapshot worker
 *
 * This script is intentionally minimal.
 * Wire it to:
 * - DeDust API (pairs/price/volume) https://api.dedust.io/
 * - TonAPI / TonConsole rates (multi-DEX aggregation)
 *
 * Run:
 *   npm run snapshot
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tokens = await prisma.token.findMany({ where: { isApproved: true } });

  for (const t of tokens) {
    // TODO: Replace with real fetches.
    // For now, store a harmless dummy snapshot so "Top Gainers" works.
    const priceUsd = Math.random() * 0.05;
    const change24h = (Math.random() - 0.5) * 30;
    const volume24hUsd = Math.random() * 20000;
    const liquidityUsd = Math.random() * 50000;
    const holders = Math.floor(100 + Math.random() * 5000);
    const mcapUsd = Math.random() * 200000;

    await prisma.snapshot.create({
      data: {
        tokenId: t.id,
        ts: new Date(),
        priceUsd,
        change24h,
        volume24hUsd,
        liquidityUsd,
        holders,
        mcapUsd
      }
    });
  }

  console.log(`Wrote ${tokens.length} snapshots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
