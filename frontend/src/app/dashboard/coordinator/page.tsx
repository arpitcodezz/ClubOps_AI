'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MOCK_COORDINATOR_DASHBOARD } from '@/data/mockCoordinator';
import { getAllEvents } from '@/lib/events';
import { Event } from '@/types/event';
import {
  CoordinatorDashboardData,
  CoordinatorNextEvent,
  CoordinatorStat,
  EventOperation,
} from '@/types/coordinator';
import { CoordinatorNav } from '@/components/coordinator/CoordinatorNav';
import { CoordinatorHero } from '@/components/coordinator/CoordinatorHero';
import { CoordinatorNextEventCard } from '@/components/coordinator/CoordinatorNextEvent';
import { CoordinatorStats } from '@/components/coordinator/CoordinatorStats';
import { EventOperationsList } from '@/components/coordinator/EventOperationsList';
import { TaskExecutionBoard } from '@/components/coordinator/TaskExecutionBoard';
import { VolunteerCoordination } from '@/components/coordinator/VolunteerCoordination';
import { OperationalRisks } from '@/components/coordinator/OperationalRisks';
import { CoordinatorActivityList } from '@/components/coordinator/CoordinatorActivity';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { EventModal } from '@/components/EventModal';

export default function CoordinatorDashboardPage() {
  const [data, setData] = useState<CoordinatorDashboardData>(MOCK_COORDINATOR_DASHBOARD);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [selectedModalEvent, setSelectedModalEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksRef = useRef<HTMLDivElement>(null);
  const volunteersRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  // Sync coordinator dashboard with live unified events
  useEffect(() => {
    const refreshData = () => {
      const allEvents = getAllEvents();

      // Dynamically compute Next Event from top unified event
      let activeNextEvent: CoordinatorNextEvent = MOCK_COORDINATOR_DASHBOARD.nextEvent;
      if (allEvents.length > 0) {
        const topEvent = allEvents[0];
        activeNextEvent = {
          id: topEvent.id,
          title: topEvent.title,
          date: topEvent.date,
          time: topEvent.time,
          venue: topEvent.venue,
          preparationStatus: 'Final staging & hardware setup',
          progressPercent: 82,
          volunteersNeeded: topEvent.volunteersNeeded || 32,
          volunteersAssigned: Math.min(topEvent.volunteersNeeded ? topEvent.volunteersNeeded - 4 : 28, 28),
          openTasks: topEvent.openTasksCount || 5,
        };
      }

      // Dynamically convert unified events into EventOperations list
      const dynamicOperations: EventOperation[] = allEvents.map((ev, index) => {
        const matchingMock = MOCK_COORDINATOR_DASHBOARD.eventOperations.find(
          (m) => m.id === ev.id || m.title.toLowerCase() === ev.title.toLowerCase()
        );

        if (matchingMock) {
          return {
            ...matchingMock,
            title: ev.title,
            date: ev.date,
            time: ev.time,
            venue: ev.venue,
            category: ev.category,
          };
        }

        // Staggered realistic progress for newly added events
        const progressValues = [82, 64, 90, 45, 35, 75, 50, 88];
        const progress = progressValues[index % progressValues.length];
        const statusValues: EventOperation['operationalStatus'][] = ['On track', 'Needs attention', 'Ready', 'Delayed'];
        const status = statusValues[index % statusValues.length];

        return {
          id: ev.id,
          title: ev.title,
          date: ev.date,
          time: ev.time,
          venue: ev.venue,
          category: ev.category,
          preparationProgress: progress,
          taskStatus: {
            open: Math.max(1, Math.round((100 - progress) / 10)),
            completed: Math.round(progress / 10),
            total: Math.max(1, Math.round((100 - progress) / 10)) + Math.round(progress / 10),
          },
          volunteerStatus: {
            assigned: Math.round((ev.volunteersNeeded || 20) * 0.75),
            needed: ev.volunteersNeeded || 20,
          },
          operationalStatus: status,
        };
      });

      // Update operational statistics
      const updatedStats: CoordinatorStat[] = [
        {
          value: String(allEvents.length).padStart(2, '0'),
          label: 'UPCOMING EVENTS',
          context: `Across ${new Set(allEvents.map((e) => e.clubName)).size} authorized student clubs`,
        },
        {
          value: '19',
          label: 'OPEN TASKS',
          context: '6 urgent items due within 24 hours',
        },
        {
          value: '54',
          label: 'VOLUNTEERS ASSIGNED',
          context: '14 slots remaining across all tracks',
        },
        {
          value: '04',
          label: 'ITEMS NEEDING ATTENTION',
          context: '1 venue conflict, 3 pending sign-offs',
        },
      ];

      setData((prev) => ({
        ...prev,
        nextEvent: activeNextEvent,
        eventOperations: dynamicOperations,
        stats: updatedStats,
      }));
    };

    const rafId = requestAnimationFrame(() => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('published') === 'true') {
          setToastMessage({
            title: 'Event published successfully.',
            subtitle: 'It has been placed on the coordinator operational calendar.',
          });
          window.history.replaceState({}, '', window.location.pathname);
        } else if (urlParams.get('updated') === 'true') {
          setToastMessage({
            title: 'Event updated successfully.',
            subtitle: 'Operational schedules and venue logs have been synchronized.',
          });
          window.history.replaceState({}, '', window.location.pathname);
        } else if (urlParams.get('deleted') === 'true') {
          setToastMessage({
            title: 'Event removed.',
            subtitle: 'The event has been cleared from coordinator rosters and tasks.',
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

  // Modal handler for clicking on any event
  const handleOpenEventModal = (eventIdOrTitle: string) => {
    const all = getAllEvents();
    const found = all.find(
      (e) => e.id === eventIdOrTitle || e.title.toLowerCase() === eventIdOrTitle.toLowerCase()
    );

    if (found) {
      setSelectedModalEvent(found);
      setIsModalOpen(true);
    } else {
      setSelectedModalEvent({
        id: eventIdOrTitle,
        title: eventIdOrTitle,
        clubName: 'Apex University Council',
        category: 'Technical',
        date: 'Oct 24–25, 2026',
        time: '09:00 AM - 09:00 PM',
        venue: 'Main Auditorium',
        bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        registrationStatus: 'Open',
        description: 'Operational staging for campus club event execution.',
        shortDescription: 'Upcoming campus event managed by event coordination staff.',
      });
      setIsModalOpen(true);
    }
  };

  const scrollToTasks = () => {
    const el = document.getElementById('tasks-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVolunteers = () => {
    const el = document.getElementById('volunteers-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEvents = () => {
    const el = document.getElementById('operations-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-zinc-950 selection:bg-zinc-900 selection:text-white">
      {/* 1. Top Navigation */}
      <CoordinatorNav
        coordinatorName={data.coordinatorName}
        role={data.role}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Notification Toast */}
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

        {/* 1. Editorial Hero */}
        <CoordinatorHero
          campus={data.campus}
          dateStr="Today, 24 Oct"
          onScrollToTasks={scrollToTasks}
          onScrollToVolunteers={scrollToVolunteers}
          onScrollToEvents={scrollToEvents}
        />

        {/* 2. Next Event Feature */}
        <CoordinatorNextEventCard
          event={data.nextEvent}
          onManageEvent={() => handleOpenEventModal(data.nextEvent.id)}
        />

        {/* 3. Operations Overview Statistics */}
        <CoordinatorStats stats={data.stats} />

        {/* 4, 5, 6, 7, 8. Structured Operational Layout */}
        <div className="my-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Event Operations List & Task Execution Board (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-10">
            {/* 4. Event Operations List */}
            <div id="operations-section" ref={eventsRef}>
              <EventOperationsList
                operations={data.eventOperations}
                onSelectEvent={(op) => handleOpenEventModal(op.id)}
              />
            </div>

            {/* 5. Tasks / Execution Board */}
            <div ref={tasksRef}>
              <TaskExecutionBoard initialTasks={data.tasks} />
            </div>
          </div>

          {/* Right Column: Volunteers, Risks, Recent Activity (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-10">
            {/* 6. Volunteer Coordination */}
            <div ref={volunteersRef}>
              <VolunteerCoordination volunteers={data.volunteers} />
            </div>

            {/* 7. Risks & Operational Attention */}
            <OperationalRisks risks={data.risks} />

            {/* 8. Recent Activity Timeline */}
            <CoordinatorActivityList activities={data.recentActivity} />
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
