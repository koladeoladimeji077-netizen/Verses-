# SpyTON Hunters (SolHunters-style site for TON)

This is a complete starter you can deploy for **SpyTON**:
- Home feeds: Recently Added / Top Upvoted (24h) / Top Gainers (24h)
- Token detail pages
- Listing submission form (pending → admin approval)
- Voting (1 wallet per token per 24h)
- Prisma + Postgres

> Notes
> - Market data is **stubbed** in `scripts/snapshot.ts` (writes dummy numbers). Wire it later to DeDust/STON.fi/TonAPI.
> - Boosting/payments is scaffolded in the database schema and UI copy. You can implement on-chain verification next.

## 1) Setup locally

```bash
npm i
cp .env.example .env
# Set DATABASE_URL (Postgres) and ADMIN_TOKEN

npm run db:push
npm run seed
npm run dev
```

Open http://localhost:3000

## 2) Admin: approve listings

- Go to `/admin`
- Paste your `ADMIN_TOKEN`
- Approve / Reject pending submissions

Admin API uses header `x-admin-token`.

## 3) Market data (snapshots)

Run:

```bash
npm run snapshot
```

Currently writes dummy snapshots. Replace the dummy part with:
- **DeDust API**: pair price/volume endpoints
- **TonConsole/TonAPI Rates** for multi-DEX coverage

## 4) Deploy (Railway / Render / Fly / VPS)

- Provision a Postgres database
- Set environment variables:
  - `DATABASE_URL`
  - `ADMIN_TOKEN`
  - optional `TONCENTER_API_KEY`, `TONAPI_KEY`
- Build & start:
  - `npm run build`
  - `npm run start`

### Optional: run snapshots on a schedule

Use a cron job (every 1–5 minutes) to run:

```bash
npm run snapshot
```

## 5) Next steps (recommended)

1) Production TON Connect manifest + ownership verification
2) Boosting packages + payment verification:
   - user pays a known invoice address
   - backend verifies via TON Center / TonAPI transaction search
3) Add DEX links automatically from pool discovery
4) Add a simple moderation queue (scam flags, duplicates)

## TON Connect (wallet login)

Wallet login is enabled via **TON Connect** (used for upvotes and to attach a wallet to submissions).

- Local dev default: `http://localhost:3000/tonconnect-manifest.json`
- Production: set `NEXT_PUBLIC_TONCONNECT_MANIFEST_URL` to `https://YOUR_DOMAIN/tonconnect-manifest.json`

Update `public/tonconnect-manifest.json` to match your domain (`url`, `iconUrl`, terms/privacy URLs).

---

If you want me to extend this ZIP to include TON Connect UI + real DeDust/TonAPI snapshot ingestion + Boost payment verification, tell me which providers you’re using and your preferred hosting.
