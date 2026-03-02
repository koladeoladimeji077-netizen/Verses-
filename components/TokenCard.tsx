import Link from 'next/link';
import { VoteButton } from './VoteButton';

export type TokenCardData = {
  id: string;
  name: string;
  symbol: string;
  jettonMaster: string;
  description?: string | null;
  imageUrl?: string | null;
  website?: string | null;
  telegram?: string | null;
  twitter?: string | null;
  category?: string | null;
  createdAt?: string;
};

function fmt(n?: number | null, digits = 2) {
  if (n === null || n === undefined) return '—';
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function TokenCard({
  token,
  votes24h,
  change24h,
  volume24hUsd,
  mcapUsd,
  isBoosted,
  compact
}: {
  token: TokenCardData & any;
  votes24h?: number;
  change24h?: number | null;
  volume24hUsd?: number | null;
  mcapUsd?: number | null;
  isBoosted?: boolean;
  compact?: boolean;
}) {
  const social = [
    token.website ? { label: 'Website', href: token.website } : null,
    token.telegram ? { label: 'Telegram', href: token.telegram } : null,
    token.twitter ? { label: 'X', href: token.twitter } : null
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className={'card ' + (compact ? 'cardCompact' : '')}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={token.imageUrl ?? '/logo-placeholder.svg'} alt="" width={46} height={46} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href={'/token/' + token.id} style={{ fontWeight: 900, letterSpacing: 0.2 }}>
              {token.name} <span className="muted">({token.symbol})</span>
            </Link>
            {token.category ? <span className="badge">{token.category}</span> : null}
            {isBoosted ? <span className="badge boosted">Boosted</span> : null}
          </div>
          {!compact ? (
            <div className="muted small" style={{ marginTop: 6, lineHeight: 1.35 }}>
              {(token.description ?? '').slice(0, 130)}
              {(token.description ?? '').length > 130 ? '…' : ''}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <VoteButton tokenId={token.id} initialVotes={votes24h ?? 0} compact={compact} />
        </div>
      </div>

      {!compact ? (
        <>
          <div style={{ height: 12 }} />
          <div className="row">
            <div className="muted small">24h Votes</div>
            <div style={{ fontWeight: 800 }}>{votes24h ?? 0}</div>
          </div>
          <div className="row">
            <div className="muted small">24h Change</div>
            <div style={{ fontWeight: 800 }}>{change24h === null || change24h === undefined ? '—' : `${fmt(change24h, 2)}%`}</div>
          </div>
          <div className="row">
            <div className="muted small">24h Volume</div>
            <div style={{ fontWeight: 800 }}>{volume24hUsd === null || volume24hUsd === undefined ? '—' : `$${fmt(volume24hUsd, 0)}`}</div>
          </div>
          <div className="row">
            <div className="muted small">MCap</div>
            <div style={{ fontWeight: 800 }}>{mcapUsd === null || mcapUsd === undefined ? '—' : `$${fmt(mcapUsd, 0)}`}</div>
          </div>

          {social.length ? (
            <>
              <div style={{ height: 10 }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {social.map(s => (
                  <a key={s.href} className="btn" href={s.href} target="_blank" rel="noreferrer" style={{ padding: '8px 10px', fontSize: 13 }}>
                    {s.label}
                  </a>
                ))}
                <Link className="btn primary" href={'/token/' + token.id} style={{ padding: '8px 10px', fontSize: 13 }}>
                  View
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: 10 }} />
              <Link className="btn primary" href={'/token/' + token.id} style={{ padding: '8px 10px', fontSize: 13, display: 'inline-block' }}>
                View
              </Link>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
