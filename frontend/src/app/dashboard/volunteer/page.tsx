'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MOCK_VOLUNTEER_DASHBOARD } from '@/data/mockVolunteer';
import { getAllEvents } from '@/lib/events';
import { Event } from '@/types/event';
import {
  VolunteerDashboardData,
  VolunteerTask,
  VolunteerShift,
} from '@/types/volunteer';
import { VolunteerNav } from '@/components/volunteer/VolunteerNav';
import { VolunteerHero } from '@/components/volunteer/VolunteerHero';
import { VolunteerNextAssignment } from '@/components/volunteer/VolunteerNextAssignment';
import { VolunteerStats } from '@/components/volunteer/VolunteerStats';
import { VolunteerAssignmentsList } from '@/components/volunteer/VolunteerAssignmentsList';
import { VolunteerTaskList } from '@/components/volunteer/VolunteerTaskList';
import { VolunteerShifts } from '@/components/volunteer/VolunteerShifts';
import { VolunteerEventReadinessList } from '@/components/volunteer/VolunteerEventReadiness';
import { VolunteerNotices } from '@/components/volunteer/VolunteerNotices';
import { VolunteerActivityList } from '@/components/volunteer/VolunteerActivity';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { EventModal } from '@/components/EventModal';

export default function VolunteerDashboardPage() {
  const [data, setData] = useState<VolunteerDashboardData>(MOCK_VOLUNTEER_DASHBOARD);
  const [tasks, setTasks] = useState<VolunteerTask[]>(MOCK_VOLUNTEER_DASHBOARD.tasks);
  const [shifts, setShifts] = useState<VolunteerShift[]>(MOCK_VOLUNTEER_DASHBOARD.shifts);
  const [isNextAssignmentCheckedIn, setIsNextAssignmentCheckedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [selectedModalEvent, setSelectedModalEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksRef = useRef<HTMLDivElement>(null);
  const assignmentsRef = useRef<HTMLDivElement>(null);
  const shiftsRef = useRef<HTMLDivElement>(null);
  const noticesRef = useRef<HTMLDivElement>(null);

  // Sync volunteer dashboard assignments with unified events
  useEffect(() => {
    const refreshData = () => {
      const allEvents = getAllEvents();
      if (allEvents.length > 0) {
        // Update next assignment event title and details if top event exists
        const topEvent = allEvents[0];
        setData((prev) => ({
          ...prev,
          nextAssignment: {
            ...prev.nextAssignment,
            eventId: topEvent.id,
            eventName: topEvent.title,
            date: topEvent.date,
            time: topEvent.time,
            venue: topEvent.venue,
          },
          assignments: prev.assignments.map((asg, idx) => {
            const matching = allEvents[idx % allEvents.length];
            return {
              ...asg,
              eventId: matching.id,
              eventName: matching.title,
              date: matching.date,
              time: matching.time,
              venue: matching.venue,
            };
          }),
        }));
      }
    };

    const rafId = requestAnimationFrame(refreshData);
    window.addEventListener('clubops_events_updated', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('clubops_events_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  // Compute dynamic stats based on tasks & shifts
  const openTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const upcomingShiftsCount = shifts.filter((s) => s.status !== 'Checked In').length;

  const dynamicStats = [
    {
      value: String(data.assignments.length).padStart(2, '0'),
      label: 'Assigned Events',
      context: 'Across campus clubs',
    },
    {
      value: String(openTasksCount).padStart(2, '0'),
      label: 'Open Tasks',
      context: `${openTasksCount} action items remaining`,
    },
    {
      value: String(completedTasksCount).padStart(2, '0'),
      label: 'Completed Tasks',
      context: 'Signed off by coordinators',
    },
    {
      value: String(upcomingShiftsCount).padStart(2, '0'),
      label: 'Upcoming Shifts',
      context: 'Active attendance schedules',
    },
  ];

  // Toast handler
  const triggerToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          const newPriority = newStatus === 'Completed' ? 'completed' : 'urgent';
          triggerToast(
            newStatus === 'Completed' ? 'Task Completed' : 'Task Reopened',
            t.title
          );
          return {
            ...t,
            status: newStatus,
            priority: newPriority,
          };
        }
        return t;
      })
    );
  };

  // Check in for a shift
  const handleCheckInShift = (shiftId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setShifts((prev) =>
      prev.map((s) => {
        if (s.id === shiftId) {
          const isCurrentlyChecked = s.status === 'Checked In';
          triggerToast(
            isCurrentlyChecked ? 'Check-in Revoked' : 'Shift Check-in Confirmed',
            isCurrentlyChecked ? `Status reset for ${s.eventName}` : `Recorded at ${timeString} for ${s.eventName}`
          );
          return {
            ...s,
            status: isCurrentlyChecked ? 'Pending Check-in' : 'Checked In',
            checkInTime: isCurrentlyChecked ? undefined : timeString,
          };
        }
        return s;
      })
    );
  };

  // Next assignment check-in
  const handleNextAssignmentCheckIn = () => {
    setIsNextAssignmentCheckedIn(!isNextAssignmentCheckedIn);
    triggerToast(
      !isNextAssignmentCheckedIn ? 'On-site Check-in Confirmed' : 'Check-in Revoked',
      `Checked in for ${data.nextAssignment.eventName} (${data.nextAssignment.role})`
    );
  };

  // Open event details modal
  const handleViewEventDetails = (eventId: string) => {
    const allEvents = getAllEvents();
    const ev = allEvents.find((e) => e.id === eventId) || allEvents[0];
    if (ev) {
      setSelectedModalEvent(ev);
      setIsModalOpen(true);
    }
  };

  // Smooth scroll helpers
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl border border-stone-300 bg-zinc-950 p-4 text-white shadow-xl max-w-md animate-in slide-in-from-bottom-5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold">{toastMessage.title}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{toastMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* Top Editorial Nav */}
      <VolunteerNav
        volunteerName={data.volunteerName}
        role={data.role}
      />

      {/* Editorial Hero */}
      <VolunteerHero
        onScrollToTasks={() => scrollTo(tasksRef)}
        onScrollToAssignments={() => scrollTo(assignmentsRef)}
        onScrollToShifts={() => scrollTo(shiftsRef)}
        onScrollToNotices={() => scrollTo(noticesRef)}
      />

      {/* Main Content Sections */}
      <main className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-10 space-y-12">
        {/* Next Scheduled Assignment */}
        <section>
          <VolunteerNextAssignment
            assignment={data.nextAssignment}
            onCheckIn={handleNextAssignmentCheckIn}
            isCheckedIn={isNextAssignmentCheckedIn}
            onViewEventDetails={handleViewEventDetails}
          />
        </section>

        {/* Volunteer Statistics Overview */}
        <VolunteerStats stats={dynamicStats} />

        {/* Action Items / My Tasks */}
        <div ref={tasksRef} className="scroll-mt-24">
          <VolunteerTaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
          />
        </div>

        {/* My Assignments */}
        <div ref={assignmentsRef} className="scroll-mt-24">
          <VolunteerAssignmentsList
            assignments={data.assignments}
            onViewEvent={handleViewEventDetails}
          />
        </div>

        {/* Shifts & Attendance */}
        <div ref={shiftsRef} className="scroll-mt-24">
          <VolunteerShifts
            shifts={shifts}
            onCheckInShift={handleCheckInShift}
          />
        </div>

        {/* Event Readiness & Operational Status */}
        <VolunteerEventReadinessList
          readinessItems={data.eventReadiness}
          onViewEventDetails={handleViewEventDetails}
        />

        {/* Important Notices & Briefings */}
        <div ref={noticesRef} className="scroll-mt-24">
          <VolunteerNotices notices={data.notices} />
        </div>

        {/* Recent Activity Log */}
        <VolunteerActivityList activities={data.recentActivity} />
      </main>

      {/* Shared Dashboard Footer */}
      <DashboardFooter />

      {/* Event Details Modal */}
      <EventModal
        event={selectedModalEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="details"
      />
    </div>
  );
}
