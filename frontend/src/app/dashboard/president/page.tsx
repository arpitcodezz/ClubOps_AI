'use client';

import React, { useEffect, useState } from 'react';
import { MOCK_PRESIDENT_DASHBOARD } from '@/data/mockDashboard';
import { getEvents, EventResponse } from '@/lib/api';
import { Event, EventCategory } from '@/types/event';
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


function normalizeEventStatus(value: unknown): EventStatus {
  const status = String(value || '').trim().toLowerCase();

  switch (status) {
    case 'published':
    case 'open':
    case 'active':
    case 'on track':
      return 'On track';

    case 'attention':
    case 'filling fast':
    case 'waitlist':
      return 'Attention';

    case 'draft':
    case 'planning':
      return 'Planning';

    case 'closed':
      return 'Planning';

    default:
      return 'Planning';
  }
}

function normalizeEventCategory(value: unknown): EventCategory {
  const category = String(value || '').trim().toLowerCase();

  switch (category) {
    case 'technical':
      return 'Technical';
    case 'cultural':
      return 'Cultural';
    case 'sports':
      return 'Sports';
    case 'workshop':
      return 'Workshop';
    case 'competition':
      return 'Competition';
    default:
      return 'Technical';
  }
}

function mapBackendEventToDashboardEvent(e: any): Event {
  const start = new Date(e.start_datetime);
  const end = new Date(e.end_datetime);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return {
    id: String(e.id),
    title: e.title,
    clubName: `Club ${e.club_id}`,
    category: normalizeEventCategory(e.event_type),
    date: formatDate(start),
    rawDate: start.toISOString().split('T')[0],
    time: `${formatTime(start)} - ${formatTime(end)}`,
    startTime: start.toTimeString().slice(0, 5),
    endTime: end.toTimeString().slice(0, 5),
    venue: e.venue || 'TBA',
    bannerUrl:
      e.banner_url ||
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    registrationStatus:
      e.status === 'closed'
        ? 'Closed'
        : e.status === 'waitlist'
          ? 'Waitlist'
          : 'Open',
    description: e.description || '',
    shortDescription: e.description || '',
    headline: e.headline || undefined,
    capacity: e.capacity || undefined,
    createdAt: e.created_at,
    published: e.status !== 'draft',
  };
}

export default function PresidentDashboardPage() {
  const [dashboardData, setDashboardData] = useState(MOCK_PRESIDENT_DASHBOARD);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [selectedModalEvent, setSelectedModalEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync dashboard with the unified event registry and detect status query params
  // Sync dashboard with the unified event registry and detect status query params
  useEffect(() => {
    const refreshData = async () => {
      try {
        const apiEvents = await getEvents();

        const upcomingItems: UpcomingEventItem[] = apiEvents.map((e) => ({
          id: String(e.id),
          name: e.title,
          date: new Date(e.start_datetime).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          volunteers: 28,
          status: normalizeEventStatus(e.status),
          category: normalizeEventCategory(e.event_type),
        }));

        let activeNextEvent: NextEventData =
          MOCK_PRESIDENT_DASHBOARD.nextEvent;

        if (apiEvents.length > 0) {
          const topEvent = apiEvents[0];

          activeNextEvent = {
            title: topEvent.title,
            date: new Date(topEvent.start_datetime).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
              }
            ),
            venue: topEvent.venue || 'TBA',
            volunteers: 28,
            openTasks: 16,
            status: normalizeEventStatus(topEvent.status),
          };
        }

        const totalUpcomingCount = String(apiEvents.length).padStart(2, '0');

        setDashboardData({
          ...MOCK_PRESIDENT_DASHBOARD,
          nextEvent: activeNextEvent,
          stats: MOCK_PRESIDENT_DASHBOARD.stats.map((s) =>
            s.label === 'UPCOMING EVENTS'
              ? {
                  ...s,
                  value: totalUpcomingCount,
                  context: 'From ClubOps database',
                }
              : s
          ),
          upcomingEvents: upcomingItems,
        });
      } catch (error) {
        console.error('Failed to load dashboard events:', error);
      }
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

        refreshData();
      }
    });

    window.addEventListener('clubops_events_updated', refreshData);
    window.addEventListener('storage', refreshData);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener(
        'clubops_events_updated',
        refreshData
      );
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  // Handle viewing event details from the API-backed dashboard
  const handleOpenEvent = (
    eventNameOrItem: string | UpcomingEventItem
  ) => {
  const eventId =
    typeof eventNameOrItem === 'object' ? eventNameOrItem.id : '';

  const titleToFind =
    typeof eventNameOrItem === 'string'
      ? eventNameOrItem
      : eventNameOrItem.name;

  // Find the event currently loaded into the dashboard.
  const found = dashboardData.upcomingEvents.find(
    (event) =>
      (eventId && event.id === eventId) ||
      event.name.toLowerCase() === titleToFind.toLowerCase()
  );

  if (!found) {
    console.warn('Event not found:', titleToFind);
    return;
  }

  const selectedEvent: Event = {
    id: String(found.id),
    title: found.name,
    clubName: 'Apex University Council',
    category: found.category || 'Technical',
    date: found.date,
    rawDate: found.date,
    time: '10:00 AM - 06:00 PM',
    venue: 'Main Auditorium',
    bannerUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    registrationStatus: 'Open',
    description: 'Event details loaded from the ClubOps API.',
    shortDescription: 'Upcoming campus event.',
  };

  setSelectedModalEvent(selectedEvent);
  setIsModalOpen(true);
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
