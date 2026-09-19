import React from 'react';
import Link from 'next/link';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200/80 pt-8 pb-12 text-xs text-zinc-500">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-zinc-700">ClubOps Command</span>
          <span className="text-stone-300">•</span>
          <span>Centralized Council Engine</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Public discovery portal
          </Link>
          <span className="text-stone-300">•</span>
          <span className="text-zinc-400">Authorized President View</span>
        </div>
      </div>
    </footer>
  );
};
