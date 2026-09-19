'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onNavigateToEvents?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToEvents }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleEventsClick = (e: React.MouseEvent) => {
    if (onNavigateToEvents) {
      e.preventDefault();
      onNavigateToEvents();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#fcfbf9]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-zinc-950 transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-2xs">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-medium tracking-tight text-zinc-950">
                ClubOps
              </span>
              <span className="inline-flex items-center rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 ring-1 ring-inset ring-stone-200">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex md:items-center md:gap-7" aria-label="Main Navigation">
            <a
              href="#events"
              onClick={handleEventsClick}
              className="text-xs font-semibold tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950"
            >
              Events
            </a>
            <a
              href="#clubs"
              className="text-xs font-semibold tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950"
            >
              Clubs
            </a>
            <Link
              href="/dashboard/president"
              className="text-xs font-semibold tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950"
            >
              President Workspace
            </Link>
            <Link
              href="/dashboard/coordinator"
              className="text-xs font-semibold tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950"
            >
              Coordinator Workspace
            </Link>
            <Link
              href="/dashboard/volunteer"
              className="text-xs font-semibold tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950"
            >
              Volunteer Ops
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/dashboard/president"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <span>President Portal</span>
            <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-900 shadow-2xs hover:bg-stone-50 transition-colors"
          >
            Login
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-stone-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-900"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-200 bg-[#fcfbf9] px-6 pt-2 pb-5 md:hidden">
          <div className="space-y-1 pt-1 pb-3">
            <a
              href="#events"
              onClick={handleEventsClick}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              Events
            </a>
            <a
              href="#clubs"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              Clubs
            </a>
            <Link
              href="/dashboard/president"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              President Workspace
            </Link>
            <Link
              href="/dashboard/coordinator"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              Coordinator Workspace
            </Link>
            <Link
              href="/dashboard/volunteer"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              Volunteer Ops
            </Link>
          </div>
          <div className="border-t border-stone-200 pt-3">
            <button
              type="button"
              className="w-full rounded-xl bg-zinc-950 py-2.5 text-center text-xs font-medium text-white shadow-xs hover:bg-zinc-800"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
