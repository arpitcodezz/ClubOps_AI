'use client';

import React, { useEffect, useState } from 'react';
import { MOCK_PRESIDENT_DASHBOARD } from '@/data/mockDashboard';
import { getEvents, getEvent, EventResponse } from '@/lib/api';
import { Event } from '@/types/event';
import {
  NextEventData,
  UpcomingEventItem,
} from '@/types/dashboard';

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

/**
 * Convert a backend API event into the Event shape
 * used by the dashboard and EventModal.
 */
function mapBackendEventToDashboardEvent(e: EventResponse): Event {
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

    category: (e.event_type || 'Technical') as Event['category'],

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

    capacity: e.capacity ?? undefined,

    createdAt: e.created_at,

    published: e.status !== 'draft',
  };
}

export default function PresidentDashboardPage() {
  const [dashboardData, setDashboardData] = useState(
    MOCK_PRESIDENT_DASHBOARD
  );

  const [toastMessage, setToastMessage] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  const [selectedModalEvent, setSelectedModalEvent] =
    useState<Event | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Load events from backend and synchronize dashboard.
   */
  useEffect(() => {
    let mounted = true;

    const refreshData = async () => {
      try {
        const apiEvents = await getEvents();

        if (!mounted) return;

        const upcomingItems: UpcomingEventItem[] = apiEvents.map((e) => ({
          id: String(e.id),

          name: e.title,

          date: new Date(e.start_datetime).toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }
          ),

          volunteers: 28,

          /**
           * Keep this compatible with EventStatus.
           * Backend values that are not recognized are shown as
           * "On track".
           */
          status:
            e.status === 'attention'
              ? 'Attention'
              : e.status === 'planning'
                ? 'Planning'
                : 'On track',

          category: (e.event_type ||
            'Technical') as Event['category'],
        }));

        let activeNextEvent: NextEventData =
          MOCK_PRESIDENT_DASHBOARD.nextEvent;

        if (apiEvents.length > 0) {
          const topEvent = apiEvents[0];

          activeNextEvent = {
            title: topEvent.title,

            date: new Date(
              topEvent.start_datetime
            ).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
            }),

            venue: topEvent.venue || 'TBA',

            volunteers: 28,

            openTasks: 16,

            status:
              topEvent.status === 'attention'
                ? 'Attention'
                : topEvent.status === 'planning'
                  ? 'Planning'
                  : 'On track',
          };
        }

        const totalUpcomingCount = String(
          apiEvents.length
        ).padStart(2, '0');

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
        console.error(
          'Failed to load dashboard events:',
          error
        );
      }
    };

    /**
     * Read query parameters after dashboard mounts.
     */
    const handleQueryParams = () => {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(
        window.location.search
      );

      if (urlParams.get('published') === 'true') {
        setToastMessage({
          title: 'Event published successfully.',
          subtitle:
            'It is now live on the public discovery portal.',
        });

        window.history.replaceState(
          {},
          '',
          window.location.pathname
        );
      } else if (urlParams.get('updated') === 'true') {
        setToastMessage({
          title: 'Event updated successfully.',
          subtitle:
            'All modifications have been synchronized across ClubOps.',
        });

        window.history.replaceState(
          {},
          '',
          window.location.pathname
        );
      } else if (urlParams.get('deleted') === 'true') {
        setToastMessage({
          title: 'Event deleted successfully.',
          subtitle:
            'The event has been removed from workspace and discovery.',
        });

        window.history.replaceState(
          {},
          '',
          window.location.pathname
        );
      }
    };

    /**
     * Initial load.
     */
    handleQueryParams();
    refreshData();

    /**
     * Listen for updates from other parts of ClubOps.
     */
    const handleEventsUpdated = () => {
      refreshData();
    };

    window.addEventListener(
      'clubops_events_updated',
      handleEventsUpdated
    );

    window.addEventListener('storage', handleEventsUpdated);

    return () => {
      mounted = false;

      window.removeEventListener(
        'clubops_events_updated',
        handleEventsUpdated
      );

      window.removeEventListener(
        'storage',
        handleEventsUpdated
      );
    };
  }, []);

  /**
   * Open an event using its REAL backend ID.
   *
   * The dashboard list only contains UpcomingEventItem summaries.
   * Therefore we fetch the complete event from:
   *
   * GET /api/events/{id}/
   */
  const handleOpenEvent = async (
    eventNameOrItem: string | UpcomingEventItem
  ) => {
    const eventId =
      typeof eventNameOrItem === 'object'
        ? eventNameOrItem.id
        : '';

    const titleToFind =
      typeof eventNameOrItem === 'string'
        ? eventNameOrItem
        : eventNameOrItem.name;

    try {
      let apiEvent: EventResponse | null = null;

      /**
       * Preferred path:
       * use the backend ID supplied by UpcomingEventItem.
       */
      if (eventId) {
        apiEvent = await getEvent(eventId);
      } else {
        /**
         * Fallback for callers that only provide an event name.
         */
        const allEvents = await getEvents();

        apiEvent =
          allEvents.find(
            (e) =>
              e.title.toLowerCase() ===
              titleToFind.toLowerCase()
          ) || null;
      }

      if (!apiEvent) {
        console.warn(
          'Event not found:',
          titleToFind
        );
        return;
      }

      /**
       * Convert the complete API object to the Event type
       * expected by EventModal.
       */
      const fullEvent =
        mapBackendEventToDashboardEvent(apiEvent);

      setSelectedModalEvent(fullEvent);
      setIsModalOpen(true);
    } catch (error) {
      console.error(
        'Failed to open event:',
        error
      );
    }
  };

  return (
    <>
      <PresidentNav />

      <main className="min-h-screen bg-[#fcfbf9]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <HeroOverview
            data={dashboardData}
          />

          <div className="mt-6">
            <NextEventCard
              event={dashboardData.nextEvent}
              onSelectEvent={handleOpenEvent}
            />
          </div>

          <div className="mt-6">
            <OperationsStats
              stats={dashboardData.stats}
            />
          </div>

          <div className="mt-6">
            <UpcomingEventsList
              events={dashboardData.upcomingEvents}
              onSelectEvent={handleOpenEvent}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AiOperations
              {...dashboardData.aiOperations}
            />

            <RisksAttention
              {...dashboardData.risksAttention}
            />
          </div>

          <div className="mt-6">
            <RecentActivity
              activities={dashboardData.recentActivity}
            />
          </div>
        </div>

        <DashboardFooter />
      </main>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-stone-200 bg-white p-4 shadow-xl">
          <p className="text-sm font-semibold text-zinc-950">
            {toastMessage.title}
          </p>

          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            {toastMessage.subtitle}
          </p>

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="mt-3 text-xs font-medium text-zinc-700 hover:text-zinc-950"
          >
            Dismiss
          </button>
        </div>
      )}

      <EventModal
        event={selectedModalEvent}
        mode="details"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModalEvent(null);
        }}
      />
    </>
  );
}