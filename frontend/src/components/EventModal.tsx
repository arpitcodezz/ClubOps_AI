'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Event } from '../types/event';
import { deleteEvent } from '@/lib/api';

interface EventModalProps {
  event: Event | null;
  mode: 'details' | 'register';
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  mode,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [registeredEventId, setRegisteredEventId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, showDeleteConfirm]);

  const [prevEventId, setPrevEventId] = useState<string | null>(null);
  if (event && event.id !== prevEventId) {
    setPrevEventId(event.id);
    setShowDeleteConfirm(false);
  }

  if (!isOpen || !event) return null;

  const isClosed = event.registrationStatus === 'Closed';
  const registered = registeredEventId === event.id;

  const handleRegisterClick = () => {
    if (!isClosed) {
      setRegisteredEventId(event.id);
    }
  };

const handleDeleteConfirm = async () => {
  try {
    await deleteEvent(event.id);

    setShowDeleteConfirm(false);
    onClose();

    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/dashboard')
    ) {
      router.push('/dashboard/president?deleted=true');
    }
  } catch (error) {
    console.error('Failed to delete event:', error);
    alert(
      error instanceof Error
        ? error.message
        : 'Failed to delete event'
    );
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!showDeleteConfirm) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-xl">
        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 p-6 backdrop-blur-xs">
            <div className="max-w-md text-center space-y-4">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-base font-bold">
                !
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-950">
                  Delete this event?
                </h3>
                <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                  This will remove the event from the President workspace and public event discovery.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
  type="button"
  onClick={() => setShowDeleteConfirm(true)}
  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white shadow-xs transition-colors hover:bg-rose-700"
>
  Delete event
</button>
              </div>
            </div>
          </div>
        )}

        {/* Banner image */}
        <div className="relative aspect-16/7 w-full overflow-hidden bg-stone-100 sm:aspect-21/9">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            unoptimized
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950/70 text-white backdrop-blur-xs hover:bg-zinc-950 focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Close event dialog"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badges Overlay */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-zinc-950/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
              {event.category}
            </span>
            <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-900 backdrop-blur-xs">
              {event.registrationStatus}
            </span>
            {event.bannerConfig && (
              <span className="rounded-md bg-zinc-950/85 px-2.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-xs">
                {event.bannerConfig.theme}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-7">
          <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            {event.clubName}
          </p>
          <h2
            id="modal-event-title"
            className="mt-1 text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl"
          >
            {event.title}
          </h2>

          {/* AI Headline if present */}
          {event.headline && (
            <p className="mt-1.5 text-sm font-medium italic text-emerald-800">
              &ldquo;{event.headline}&rdquo;
            </p>
          )}

          {/* Event Banner Identity elements if present */}
          {event.bannerConfig && event.bannerConfig.elements && event.bannerConfig.elements.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-zinc-400 uppercase">Visual Identity:</span>
              {event.bannerConfig.elements.map((el) => (
                <span
                  key={el}
                  className="rounded-md border border-stone-200 bg-[#fcfbf9] px-2 py-0.5 text-[11px] text-zinc-600"
                >
                  {el}
                </span>
              ))}
            </div>
          )}

          {/* Key Schedule Grid */}
          <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-stone-200/80 bg-[#fcfbf9] p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium text-zinc-400 uppercase">Date</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">{event.date}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400 uppercase">Time</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">{event.time}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400 uppercase">Venue</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">{event.venue}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400 uppercase">Entry Fee</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">
                {event.fee || 'Free'}
              </p>
            </div>
            {event.capacity && (
              <div>
                <p className="text-[11px] font-medium text-zinc-400 uppercase">Capacity</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900">{event.capacity} Attendees</p>
              </div>
            )}
            {event.teamSize && (
              <div>
                <p className="text-[11px] font-medium text-zinc-400 uppercase">Participation</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900">{event.teamSize}</p>
              </div>
            )}
            {event.prizes && (
              <div>
                <p className="text-[11px] font-medium text-zinc-400 uppercase">Prize Pool</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900">{event.prizes}</p>
              </div>
            )}
          </div>

          {/* Detailed Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">About this Event</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {event.description}
            </p>
          </div>

          {/* Participant Notice if present */}
          {event.participantMessage && (
            <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Participant Notice
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-700">
                {event.participantMessage}
              </p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-stone-200 bg-stone-100 px-2 py-0.5 text-xs text-zinc-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Registration Section */}
          <div className="mt-6 border-t border-stone-200 pt-5">
            {registered ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-semibold">Registration pass confirmed (Demo)</p>
                </div>
                <p className="mt-1 text-xs text-emerald-800">
                  You are registered for {event.title}. Bring your college student ID to {event.venue}.
                </p>
              </div>
            ) : isClosed ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-zinc-600">
                <p className="text-sm font-medium">
                  Registration for this event is currently closed.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-950">
                    {mode === 'register' ? 'Confirm Registration' : 'Ready to participate?'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Registration is free for enrolled college students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-zinc-950"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Restrained Delete Action & Edit Link */}
        <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/70 px-6 py-3.5">
         <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() => setShowDeleteConfirm(true)}
    className="text-xs font-medium text-rose-700 hover:text-rose-900 transition-colors"
  >
    Delete event
  </button>

  <span className="text-stone-300">•</span>

  <Link
    href={`/dashboard/president/events/${event.id}/edit`}
    onClick={onClose}
    className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
  >
    Edit event →
  </Link>
</div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-stone-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
