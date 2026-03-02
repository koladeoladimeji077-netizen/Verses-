'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { TokenCard } from './TokenCard';

export function BoostedCarousel({ tokens }: { tokens: any[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(dx: number) {
    scroller.current?.scrollBy({ left: dx, behavior: 'smooth' });
  }

  if (!tokens?.length) return null;

  return (
    <section className="boostedSection">
      <div className="boostedHeader">
        <div className="boostedTitle">
          <span className="boostedLabel">BOOSTED⚡</span>
          <Link href="/boosting" className="boostedHint">Your coin here?</Link>
        </div>
        <div className="boostedControls">
          <button className="boostBtn" onClick={() => scrollBy(-520)} aria-label="Previous">Previous</button>
          <button className="boostBtn" onClick={() => scrollBy(520)} aria-label="Next">Next</button>
        </div>
      </div>

      <div className="boostedScroller" ref={scroller}>
        {tokens.map(t => (
          <div key={t.id} className="boostedCardWrap">
            <TokenCard token={t} votes24h={t.vote24h ?? 0} isBoosted compact />
          </div>
        ))}
      </div>
    </section>
  );
}
