'use client';

/**
 * Sticky site navigation shared by every page.
 *
 * Replaces the per-page "← Home" buttons so navigation is in the same
 * place everywhere. Collapses to a disclosure menu under 860px.
 */

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SiteNav.module.css';

const LINKS = [
  { href: '/portfolios', label: 'Portfolios' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#under-the-hood', label: 'Under the hood' },
  { href: '/developer-notes', label: 'Developer notes' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.inner} aria-label="Main">
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className={styles.brandMark}
          />
          <span className={styles.brandName}>StartFolio</span>
        </Link>

        <button
          className={styles.menuButton}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav-links"
        >
          <span className={styles.menuIcon} aria-hidden>
            {open ? '✕' : '☰'}
          </span>
          <span className={styles.srOnly}>
            {open ? 'Close menu' : 'Open menu'}
          </span>
        </button>

        <div
          id="site-nav-links"
          className={`${styles.links} ${open ? styles.linksOpen : ''}`}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                pathname === link.href ? styles.linkActive : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/onboarding" className={`btn btn-primary btn-sm ${styles.cta}`}>
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
