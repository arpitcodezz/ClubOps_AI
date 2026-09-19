import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
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
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                ClubOps AI
              </span>
            </Link>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              The centralized event operations and discovery platform for collegiate student organizations. Streamlining venue approvals, event scheduling, and attendee participation.
            </p>
            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
              Built for campus clubs, student councils, and university communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#events" className="hover:text-zinc-900 dark:hover:text-white">
                  Discover Events
                </a>
              </li>
              <li>
                <a href="#clubs" className="hover:text-zinc-900 dark:hover:text-white">
                  Registered Clubs
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-zinc-900 dark:hover:text-white">
                  Academic Workshops
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-zinc-900 dark:hover:text-white">
                  Sports Tournaments
                </a>
              </li>
            </ul>
          </div>

          {/* Organizer Info */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
              For Organizers
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <span className="text-zinc-500">Club Portal (Coming Soon)</span>
              </li>
              <li>
                <span className="text-zinc-500">Venue Booking Guidelines</span>
              </li>
              <li>
                <span className="text-zinc-500">Event Approval Workflow</span>
              </li>
              <li>
                <span className="text-zinc-500">Student Code of Conduct</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 sm:flex sm:items-center sm:justify-between sm:text-left dark:border-zinc-800 dark:text-zinc-500">
          <p>&copy; {new Date().getFullYear()} ClubOps AI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">College Operations & Event Discovery Platform</p>
        </div>
      </div>
    </footer>
  );
};
