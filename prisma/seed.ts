import { PrismaClient, DexName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Sample tokens for local testing (replace with real Jetton masters).
  const samples = [
    {
      jettonMaster: 'EQA_SAMPLE_JETTON_MASTER_1',
      name: 'SpyTON Sample',
      symbol: 'SPY',
      description: 'Example token for local development.',
      website: 'https://spyton-live.netlify.app',
      telegram: 'https://t.me/SpyTonEco',
      twitter: 'https://x.com/hubspyton',
      category: 'Tools'
    },
    {
      jettonMaster: 'EQA_SAMPLE_JETTON_MASTER_2',
      name: 'TON Demo',
      symbol: 'TDEMO',
      description: 'Another example token for local development.',
      website: 'https://ton.org',
      telegram: 'https://t.me/toncoin',
      twitter: 'https://x.com/ton_blockchain',
      category: 'DeFi'
    }
  ];

  for (const t of samples) {
    const token = await prisma.token.upsert({
      where: { jettonMaster: t.jettonMaster },
      update: {
        name: t.name,
        symbol: t.symbol,
        description: t.description,
        website: t.website,
        telegram: t.telegram,
        twitter: t.twitter,
        category: t.category,
        isApproved: true
      },
      create: {
        ...t,
        isApproved: true
      }
    });

    // Add one demo DEX pair
    await prisma.dexPair.upsert({
      where: { tokenId_dex: { tokenId: token.id, dex: DexName.DEDUST } },
      update: {
        poolAddress: 'EQ_POOL_ADDRESS_SAMPLE',
        url: 'https://dedust.io'
      },
      create: {
        tokenId: token.id,
        dex: DexName.DEDUST,
        poolAddress: 'EQ_POOL_ADDRESS_SAMPLE',
        url: 'https://dedust.io'
      }
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
