import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200/80 bg-[#fcfbf9] text-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white">
                <svg
                  className="h-3.5 w-3.5"
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
              <span className="text-sm font-medium tracking-tight text-zinc-950">
                ClubOps AI
              </span>
            </Link>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-zinc-600">
              The centralized event operations and discovery platform for collegiate student organizations. Streamlining venue approvals, event scheduling, and attendee participation.
            </p>
            <p className="mt-2 text-[11px] text-zinc-400">
              Built for campus clubs, student councils, and university communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-950 uppercase">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600">
              <li>
                <a href="#events" className="hover:text-zinc-950 transition-colors">
                  Discover Events
                </a>
              </li>
              <li>
                <a href="#clubs" className="hover:text-zinc-950 transition-colors">
                  Registered Clubs
                </a>
              </li>
              <li>
                <Link href="/dashboard/president" className="hover:text-zinc-950 transition-colors">
                  President Workspace
                </Link>
              </li>
              <li>
                <Link href="/dashboard/president/events/new" className="hover:text-zinc-950 transition-colors">
                  Create Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizer Info */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-950 uppercase">
              Operations &amp; Governance
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600">
              <li>
                <span className="text-zinc-500">Student Affairs Council</span>
              </li>
              <li>
                <span className="text-zinc-500">Venue Booking Guidelines</span>
              </li>
              <li>
                <span className="text-zinc-500">Conflict Prevention Protocols</span>
              </li>
              <li>
                <span className="text-zinc-500">Code of Conduct</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200/80 pt-6 text-center text-xs text-zinc-500 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>&copy; {new Date().getFullYear()} ClubOps AI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Campus Event Operations &amp; Discovery</p>
        </div>
      </div>
    </footer>
  );
};
