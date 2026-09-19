'use client';

import React, { useEffect, useState } from 'react';
import { MOCK_PRESIDENT_DASHBOARD } from '@/data/mockDashboard';
import { getAllEvents } from '@/lib/events';
import { Event } from '@/types/event';
import { NextEventData, OperationStat, UpcomingEventItem } from '@/types/dashboard';
import { PresidentNav } from '@/components/dashboard/PresidentNav';
import { HeroOverview } from '@/components/dashboard/HeroOverview';
import { NextEventCard } from '@/components/dashboard/NextEventCard';
import { OperationsStats } from '@/components/dashboard/OperationsStats';
import { UpcomingEventsList } from '@/components/dashboard/UpcomingEventsList';
import { AiOperations } from '@/components/dashboard/AiOperations';
import { RisksAttention } from '@/components/dashboard/RisksAttention';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { EventModal } from '@/components/EventModal';

export default function PresidentDashboardPage() {
  const [dashboardData, setDashboardData] = useState(MOCK_PRESIDENT_DASHBOARD);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [selectedModalEvent, setSelectedModalEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync dashboard with the unified event registry and detect status query params
  useEffect(() => {
    const refreshData = () => {
      const allEvents = getAllEvents();

      // Convert unified events to upcoming event items
      const upcomingItems: UpcomingEventItem[] = allEvents.map((e) => ({
        id: e.id,
        name: e.title,
        date: e.date,
        volunteers: e.volunteersNeeded || 28,
        status: 'On track',
        category: e.category,
      }));

      // Compute Next Event from the first upcoming event
      let activeNextEvent: NextEventData = MOCK_PRESIDENT_DASHBOARD.nextEvent;
      if (allEvents.length > 0) {
        const topEvent = allEvents[0];
        activeNextEvent = {
          title: topEvent.title,
          date: topEvent.date,
          venue: topEvent.venue,
          volunteers: topEvent.volunteersNeeded || 32,
          openTasks: topEvent.openTasksCount || 16,
          status: 'On track',
        };
      }

      // Dynamically compute stats from unified events
      const totalUpcomingCount = allEvents.length.toString().padStart(2, '0');
      const uniqueClubsCount = new Set(allEvents.map((e) => e.clubName)).size;
      const updatedStats: OperationStat[] = MOCK_PRESIDENT_DASHBOARD.stats.map((s) => {
        if (s.label === 'UPCOMING EVENTS') {
          return {
            ...s,
            value: totalUpcomingCount,
            context: `Across ${uniqueClubsCount} registered clubs`,
          };
        }
        return s;
      });

      setDashboardData({
        ...MOCK_PRESIDENT_DASHBOARD,
        nextEvent: activeNextEvent,
        stats: updatedStats,
        upcomingEvents: upcomingItems,
      });
    };

    const rafId = requestAnimationFrame(() => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('published') === 'true') {
          setToastMessage({
            title: 'Event published successfully.',
            subtitle: 'It is now live on the public discovery portal.',
          });
          window.history.replaceState({}, '', window.location.pathname);
        } else if (urlParams.get('updated') === 'true') {
          setToastMessage({
            title: 'Event updated successfully.',
            subtitle: 'All modifications have been synchronized across ClubOps.',
          });
          window.history.replaceState({}, '', window.location.pathname);
        } else if (urlParams.get('deleted') === 'true') {
          setToastMessage({
            title: 'Event deleted successfully.',
            subtitle: 'The event has been removed from workspace and discovery.',
          });
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
      refreshData();
    });

    window.addEventListener('clubops_events_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('clubops_events_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  // Handle viewing event details modal from dashboard
  const handleOpenEvent = (eventNameOrItem: string | UpcomingEventItem) => {
    const all = getAllEvents();
    const eventId = typeof eventNameOrItem === 'object' ? eventNameOrItem.id : '';
    const titleToFind = typeof eventNameOrItem === 'string' ? eventNameOrItem : eventNameOrItem.name;

    const found = all.find(
      (e) =>
        (eventId && e.id === eventId) ||
        e.title.toLowerCase() === titleToFind.toLowerCase()
    );

    if (found) {
      setSelectedModalEvent(found);
      setIsModalOpen(true);
    } else {
      // Fallback synthetic event if not found
      setSelectedModalEvent({
        id: 'dash-preview',
        title: titleToFind,
        clubName: 'Apex University Council',
        category: 'Technical',
        date: typeof eventNameOrItem === 'object' ? eventNameOrItem.date : '24 OCT',
        time: '10:00 AM - 06:00 PM',
        venue: 'Main Auditorium',
        bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        registrationStatus: 'Open',
        description: 'Comprehensive campus operations scheduled for student club participation.',
        shortDescription: 'Upcoming campus event organized by student council organizations.',
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-zinc-950 selection:bg-zinc-900 selection:text-white">
      {/* 1. Top Navigation */}
      <PresidentNav
        presidentName={dashboardData.presidentName}
        role={dashboardData.role}
      />

      {/* Main Content Composition */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Notification Toast Banner */}
        {toastMessage && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
                ✓
              </span>
              <span className="font-medium">{toastMessage.title}</span>
              <span className="text-emerald-700 text-xs hidden sm:inline">{toastMessage.subtitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2. Hero Overview */}
        <div className="animate-dash-1">
          <HeroOverview
            campus={dashboardData.campus}
            dateStr="Today, 24 Oct"
          />
        </div>

        {/* 3. Next Event Asymmetric Feature Card */}
        <div className="animate-dash-2">
          <NextEventCard
            event={dashboardData.nextEvent}
            onViewEvent={() => handleOpenEvent(dashboardData.nextEvent.title)}
          />
        </div>

        {/* 4. Operations Overview Statistics */}
        <div className="animate-dash-3">
          <OperationsStats stats={dashboardData.stats} />
        </div>

        {/* 6. AI Operations Intelligence Section */}
        <div className="animate-dash-4">
          <AiOperations insights={dashboardData.aiInsights} />
        </div>

        {/* 5, 7, 8. Asymmetric Lower Grid: Upcoming Events & Risks / Recent Activity */}
        <div className="my-10 grid grid-cols-1 gap-8 lg:grid-cols-12 animate-dash-5">
          {/* Left / Major Column: Upcoming Events List (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <UpcomingEventsList
              events={dashboardData.upcomingEvents}
              onSelectEvent={(event) => handleOpenEvent(event)}
            />
          </div>

          {/* Right / Secondary Column: Risks & Attention + Recent Activity (lg:col-span-5) */}
          <div className="space-y-8 lg:col-span-5">
            {/* 7. Risks & Attention */}
            <RisksAttention risks={dashboardData.risks} />

            {/* 8. Recent Activity */}
            <RecentActivity activities={dashboardData.recentActivity} />
          </div>
        </div>

        {/* Minimal Editorial Footer */}
        <DashboardFooter />
      </main>

      {/* Event Details Preview Modal */}
      <EventModal
        event={selectedModalEvent}
        mode="details"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
