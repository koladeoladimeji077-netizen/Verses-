import Link from "next/link";
import Image from "next/image";
import { TonConnectButton } from '@tonconnect/ui-react';

export function SiteHeader() {
  return (
    <div className="header">
      <Link href="/" className="logo">
        <Image
          src="/spyton-logo.jpg"
          alt="SpyTON"
          width={30}
          height={30}
          className="logoImg"
          priority
        />
        <span className="logoText">SpyTON</span>
      </Link>

      <nav className="nav">
        <div className="navLinks">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/boosting">Ad &amp; Boosting</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="navActions">
          <Link href="/list" className="cta">Submit Coin</Link>
          <div className="tonBtnWrap">
            <TonConnectButton />
          </div>
          <Link href="/admin" className="mutedLink">Admin</Link>
        </div>
      </nav>
    </div>
  );
}
