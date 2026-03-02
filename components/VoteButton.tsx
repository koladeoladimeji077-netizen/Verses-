'use client';

import { useState } from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';

export function VoteButton(props: { tokenId: string; initialVotes: number; compact?: boolean }) {
  const { tokenId, initialVotes, compact } = props;
  const wallet = useTonWallet();
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onVote() {
    if (!wallet?.account?.address) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tokenId, voterWallet: wallet.account.address })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Vote failed');
      setVotes(data.votes24h ?? (votes + 1));
      setMsg('Upvoted ✅');
    } catch (e: any) {
      setMsg(e?.message ?? 'Vote failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <div className="pill" style={compact ? { padding: '6px 10px', fontSize: 12 } : undefined}>
        {compact ? (
          <>
            <b>{votes}</b> votes
          </>
        ) : (
          <>
            Votes (24h): <b>{votes}</b>
          </>
        )}
      </div>

      {!wallet?.account?.address ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {!compact ? <span className="muted" style={{ fontSize: 13 }}>Connect wallet to upvote</span> : null}
          <TonConnectButton />
        </div>
      ) : (
        <button
          className={compact ? 'btn' : 'btn primary'}
          onClick={onVote}
          disabled={loading}
          style={compact ? { padding: '8px 10px', fontSize: 12 } : undefined}
        >
          {loading ? 'Voting…' : 'Upvote'}
        </button>
      )}

      {msg ? <span className="muted" style={{ fontSize: 13 }}>{msg}</span> : null}
    </div>
  );
}
