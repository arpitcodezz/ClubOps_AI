'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface VolunteerNavProps {
  volunteerName?: string;
  role?: string;
}

export const VolunteerNav: React.FC<VolunteerNavProps> = ({
  volunteerName = 'Priya Patel',
  role = 'Student Volunteer',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#fcfbf9]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Left: Brand + Navigation links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
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
              <span className="text-base font-bold tracking-tight text-zinc-950">
                ClubOps
              </span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-700 uppercase">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex md:items-center md:gap-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Link
              href="/"
              className="transition-colors hover:text-zinc-950"
            >
              Events
            </Link>
            <Link
              href="/#clubs"
              className="transition-colors hover:text-zinc-950"
            >
              Clubs
            </Link>
            <Link
              href="/dashboard/president"
              className="transition-colors hover:text-zinc-950"
            >
              President Workspace
            </Link>
            <Link
              href="/dashboard/coordinator"
              className="transition-colors hover:text-zinc-950"
            >
              Coordinator Ops
            </Link>
            <span className="h-3 w-px bg-stone-300" aria-hidden="true" />
            <div className="flex items-center gap-1.5 text-zinc-950">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span className="font-semibold text-zinc-950">Volunteer Ops</span>
            </div>
          </nav>
        </div>

        {/* Right: Actions, Profile Area & Public Portal link */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            Public portal ↗
          </Link>

          <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 ring-1 ring-stone-300 text-xs font-semibold text-zinc-900">
              {volunteerName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-none text-zinc-900">
                {volunteerName}
              </p>
              <p className="mt-1 text-[11px] leading-none text-zinc-500">
                {role}
              </p>
            </div>
          </div>
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
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              Events
            </Link>
            <Link
              href="/#clubs"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 hover:bg-stone-100"
            >
              Clubs
            </Link>
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
              Coordinator Ops
            </Link>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              ✓ Volunteer Ops (Active)
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
