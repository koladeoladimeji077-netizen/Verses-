'use client';

import { useEffect, useState } from 'react';

type Submission = {
  id: string;
  jettonMaster: string;
  name: string;
  symbol: string;
  description: string | null;
  website: string | null;
  telegram: string | null;
  twitter: string | null;
  category: string | null;
  imageUrl: string | null;
  submitterWallet: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [items, setItems] = useState<Submission[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/submissions?status=pending', {
        headers: { 'x-admin-token': key }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed');
      setItems(data.items ?? []);
    } catch (e: any) {
      setMsg(e?.message ?? 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    try {
      const res = await fetch(`/api/submissions/${id}/approve`, {
        method: 'POST',
        headers: { 'x-admin-token': key }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed');
      setItems(items.filter(i => i.id !== id));
    } catch (e: any) {
      setMsg(e?.message ?? 'Failed');
    }
  }

  async function reject(id: string) {
    try {
      const res = await fetch(`/api/submissions/${id}/approve`, {
        method: 'DELETE',
        headers: { 'x-admin-token': key }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed');
      setItems(items.filter(i => i.id !== id));
    } catch (e: any) {
      setMsg(e?.message ?? 'Failed');
    }
  }

  useEffect(() => {
    setItems([]);
  }, [key]);

  return (
    <main>
      <h1 style={{ margin: 0 }}>Admin</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Enter <span className="code">ADMIN_TOKEN</span> to review pending listings.
      </p>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="formgrid">
          <div>
            <div className="muted small">Admin token</div>
            <input className="input" value={key} onChange={(e) => setKey(e.target.value)} placeholder="ADMIN_TOKEN" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn primary" onClick={load} disabled={loading || key.trim().length < 4}>
              {loading ? 'Loading…' : 'Load pending'}
            </button>
          </div>
        </div>
        {msg ? <div className="muted" style={{ marginTop: 10 }}>{msg}</div> : null}
      </div>

      <div style={{ marginTop: 14 }} className="grid">
        {items.map((s) => (
          <div key={s.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{s.name} <span className="pill">{s.symbol}</span></div>
                <div className="muted" style={{ marginTop: 6 }}>Jetton: <span className="code">{s.jettonMaster}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn primary" onClick={() => approve(s.id)}>Approve</button>
                <button className="btn" onClick={() => reject(s.id)}>Reject</button>
              </div>
            </div>
            <div className="muted" style={{ marginTop: 10 }}>{s.description ?? 'No description'}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {s.website ? <a className="btn" href={s.website} target="_blank" rel="noreferrer">Website</a> : null}
              {s.telegram ? <a className="btn" href={s.telegram} target="_blank" rel="noreferrer">Telegram</a> : null}
              {s.twitter ? <a className="btn" href={s.twitter} target="_blank" rel="noreferrer">X</a> : null}
            </div>
            <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
              Submitted: {new Date(s.createdAt).toLocaleString()} • Wallet: {s.submitterWallet || '—'}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
