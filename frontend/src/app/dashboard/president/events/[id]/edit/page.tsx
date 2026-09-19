'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EventBannerConfig, EventCategory } from '@/types/event';
import {
  CATEGORY_BANNERS,
  checkVenueConflict,
  deleteCustomEvent,
  formatDisplayDate,
  formatDisplayTime,
  generateEventBanner,
  generateEventCommunication,
  getEventById,
  saveCustomEvent,
} from '@/lib/events';
import { PresidentNav } from '@/components/dashboard/PresidentNav';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

const CATEGORIES: EventCategory[] = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Competition',
];

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Loading & Form State
  const [isLoaded, setIsLoaded] = useState(false);
  const [eventNotFound, setEventNotFound] = useState(false);

  const [title, setTitle] = useState('');
  const [clubName, setClubName] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // AI Communication State
  const [headline, setHeadline] = useState('');
  const [participantMessage, setParticipantMessage] = useState('');
  const [volunteerMessage, setVolunteerMessage] = useState('');

  // AI Event Identity / Banner State
  const [bannerGenNumber, setBannerGenNumber] = useState(1);
  const [bannerConfig, setBannerConfig] = useState<EventBannerConfig | null>(null);
  const [bannerHeadline, setBannerHeadline] = useState('');
  const [bannerSubheadline, setBannerSubheadline] = useState('');

  // UI / Validation / Delete Dialog State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load existing event data on mount from unified registry
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const existing = getEventById(id);
      if (!existing) {
        setEventNotFound(true);
        setIsLoaded(true);
        return;
      }

      setTitle(existing.title || '');
      setClubName(existing.clubName || '');
      setCategory(existing.category || 'Technical');
      setDate(existing.rawDate || existing.date || '');
      setStartTime(existing.startTime || '10:00');
      setEndTime(existing.endTime || '18:00');
      setVenue(existing.venue || '');
      setCapacity(existing.capacity || '');
      setDescription(existing.description || '');
      setTagsInput((existing.tags || []).join(', '));
      setHeadline(existing.headline || '');
      setParticipantMessage(existing.participantMessage || '');
      setVolunteerMessage(existing.volunteerMessage || '');

      if (existing.bannerConfig) {
        setBannerConfig(existing.bannerConfig);
        setBannerHeadline(existing.bannerConfig.headline);
        setBannerSubheadline(existing.bannerConfig.subheadline);
        setBannerGenNumber(existing.bannerConfig.generationNumber || 1);
      }

      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(rafId);
  }, [id]);

  const handleScheduleChange = (
    field: 'venue' | 'date' | 'startTime' | 'endTime',
    val: string
  ) => {
    if (field === 'venue') setVenue(val);
    if (field === 'date') setDate(val);
    if (field === 'startTime') setStartTime(val);
    if (field === 'endTime') setEndTime(val);
    if (conflictError) setConflictError(null);
  };

  // Generate AI Communication
  const handleGenerateAI = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Please enter an event name first.';
    if (!description.trim()) newErrors.description = 'Please enter a description for AI context.';
    if (!venue.trim()) newErrors.venue = 'Please specify a venue.';

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setErrors({});
    const generated = generateEventCommunication({
      title,
      category,
      description,
      venue,
      date,
      clubName,
    });

    setHeadline(generated.headline);
    setParticipantMessage(generated.participantMessage);
    setVolunteerMessage(generated.volunteerMessage);
  };

  // Regenerate Event-Specific Banner
  const handleGenerateBanner = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Please enter an event name first.';
    if (!description.trim()) newErrors.description = 'Please enter a description for visual direction.';

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const nextGen = bannerGenNumber + 1;

    const generated = generateEventBanner({
      title,
      category,
      description,
      venue,
      date,
      clubName,
      tags,
      headline,
      participantMessage,
      volunteerMessage,
      generationNumber: nextGen,
    });

    setBannerConfig(generated);
    setBannerHeadline(generated.headline);
    setBannerSubheadline(generated.subheadline);
    setBannerGenNumber(nextGen);
  };

  // Handle Save Changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const validationErrors: Record<string, string> = {};
    if (!title.trim()) validationErrors.title = 'Event name is required.';
    if (!clubName.trim()) validationErrors.clubName = 'Club / organization is required.';
    if (!date.trim()) validationErrors.date = 'Date is required.';
    if (!startTime.trim()) validationErrors.startTime = 'Start time is required.';
    if (!endTime.trim()) validationErrors.endTime = 'End time is required.';
    if (!venue.trim()) validationErrors.venue = 'Venue is required.';
    if (!description.trim()) validationErrors.description = 'Description is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check Venue Conflict excluding current event
    const conflict = checkVenueConflict(
      {
        venue: venue.trim(),
        date,
        rawDate: date,
        startTime,
        endTime,
        id,
      },
      id
    );

    if (conflict.hasConflict && conflict.message) {
      setConflictError(conflict.message);
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalBannerConfig: EventBannerConfig | undefined = bannerConfig
      ? {
          ...bannerConfig,
          headline: bannerHeadline || bannerConfig.headline,
          subheadline: bannerSubheadline || bannerConfig.subheadline,
          generationNumber: bannerGenNumber,
        }
      : undefined;

    const bannerUrl = finalBannerConfig?.bannerUrl || CATEGORY_BANNERS[category];

    try {
      saveCustomEvent({
        id,
        title: title.trim(),
        clubName: clubName.trim(),
        category,
        date: formatDisplayDate(date),
        rawDate: date,
        time: formatDisplayTime(startTime, endTime),
        venue: venue.trim(),
        bannerUrl,
        registrationStatus: 'Open',
        description: description.trim(),
        shortDescription: description.trim().slice(0, 140) + (description.length > 140 ? '...' : ''),
        capacity: capacity ? Number(capacity) : undefined,
        headline: headline.trim() || undefined,
        participantMessage: participantMessage.trim() || undefined,
        volunteerMessage: volunteerMessage.trim() || undefined,
        tags: tags.length > 0 ? tags : [category],
        startTime,
        endTime,
        volunteersNeeded: 25,
        openTasksCount: 12,
        bannerConfig: finalBannerConfig,
      });

      router.push('/dashboard/president?updated=true');
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Failed to update event.';
      setConflictError(msg);
    }
  };

  // Handle Confirmed Delete
  const handleConfirmDelete = () => {
    deleteCustomEvent(id);
    router.push('/dashboard/president?deleted=true');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] text-zinc-950">
        <PresidentNav />
        <div className="flex h-96 items-center justify-center text-sm text-zinc-500">
          Loading event details...
        </div>
      </div>
    );
  }

  if (eventNotFound) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] text-zinc-950">
        <PresidentNav />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-zinc-900">Event Not Found</h2>
          <p className="mt-2 text-sm text-zinc-600">
            This event does not exist or has been removed from the registry.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/president"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              ← Back to President Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const bannerPreviewUrl = bannerConfig?.bannerUrl || CATEGORY_BANNERS[category];
  const displayDateText = formatDisplayDate(date);
  const displayTimeText = formatDisplayTime(startTime, endTime);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-zinc-950 selection:bg-zinc-900 selection:text-white">
      <PresidentNav />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div>
          <Link
            href="/dashboard/president"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
          >
            <span>←</span>
            <span>Back to President Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mt-4 flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              <span className="text-zinc-400">•</span>
              <span>EDIT EVENT</span>
            </div>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
              Edit event details.
            </h1>
            <p className="mt-2 text-base text-zinc-600">
              Adjust scheduling, communication copy, or event banner identity.
            </p>
          </div>

          {/* Restrained Delete Action */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="self-start rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-rose-700 hover:border-rose-300 hover:bg-rose-50/50 transition-colors sm:self-auto"
          >
            Delete event
          </button>
        </div>

        {/* Venue Conflict Error Alert */}
        {conflictError && (
          <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50/90 p-4 text-sm text-rose-950 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white text-xs font-bold">
                !
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-rose-900">Venue Schedule Conflict</p>
                <p className="text-rose-800 leading-relaxed">{conflictError}</p>
                <p className="text-xs text-rose-700">
                  Please adjust the venue, event date, or start/end time to resolve the conflict.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal / Dialog */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-sm font-bold">
                  !
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950">Delete this event?</h3>
                  <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                    This will remove the event from the President workspace and public event discovery.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 shadow-xs"
                >
                  Delete event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout on Desktop */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT: Event Edit Form */}
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleSave} className="space-y-8">
              {/* 1. Basic Information */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold tracking-wide text-zinc-950 uppercase">
                  1. Basic Information
                </h3>

                <div>
                  <label htmlFor="edit-event-name" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Event Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-event-name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-club-name" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Club / Organization <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-club-name"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.clubName && <p className="mt-1 text-xs text-rose-600">{errors.clubName}</p>}
                  </div>

                  <div>
                    <label htmlFor="edit-category" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Category <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="edit-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="edit-date" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Date <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="date"
                      id="edit-date"
                      value={date}
                      onChange={(e) => handleScheduleChange('date', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
                  </div>

                  <div>
                    <label htmlFor="edit-start-time" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Start Time <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="time"
                      id="edit-start-time"
                      value={startTime}
                      onChange={(e) => handleScheduleChange('startTime', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.startTime && <p className="mt-1 text-xs text-rose-600">{errors.startTime}</p>}
                  </div>

                  <div>
                    <label htmlFor="edit-end-time" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      End Time <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="time"
                      id="edit-end-time"
                      value={endTime}
                      onChange={(e) => handleScheduleChange('endTime', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.endTime && <p className="mt-1 text-xs text-rose-600">{errors.endTime}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-venue" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Venue <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-venue"
                      value={venue}
                      onChange={(e) => handleScheduleChange('venue', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.venue && <p className="mt-1 text-xs text-rose-600">{errors.venue}</p>}
                  </div>

                  <div>
                    <label htmlFor="edit-capacity" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="edit-capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value, 10) : '')}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Description <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="edit-description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="edit-tags" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    id="edit-tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              {/* 2. AI Communication Section */}
              <div className="border-t border-stone-200/80 pt-8 space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-950 uppercase">
                      2. AI Event Communication
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Headline, participant notices, and volunteer briefings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 transition-colors self-start sm:self-auto"
                  >
                    <span>Regenerate copy</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
                  <div>
                    <label htmlFor="edit-headline" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Headline
                    </label>
                    <input
                      type="text"
                      id="edit-headline"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-participant-msg" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Participant Message
                    </label>
                    <textarea
                      id="edit-participant-msg"
                      rows={3}
                      value={participantMessage}
                      onChange={(e) => setParticipantMessage(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-volunteer-msg" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Volunteer Message
                    </label>
                    <textarea
                      id="edit-volunteer-msg"
                      rows={3}
                      value={volunteerMessage}
                      onChange={(e) => setVolunteerMessage(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Event Identity Section */}
              <div className="border-t border-stone-200/80 pt-8 space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-950 uppercase">
                      3. Event Identity & Creative Direction
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Derives identity from full event context (title, description, club, venue, tags).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateBanner}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 transition-colors self-start sm:self-auto"
                  >
                    <span>Regenerate banner (New Concept)</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                {bannerConfig ? (
                  <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                            Concept #{bannerConfig.generationNumber}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900">{bannerConfig.theme}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500">{bannerConfig.categoryInfluence}</p>
                      </div>
                      <span className="rounded-md bg-stone-200/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-800">
                        Accent: {bannerConfig.accent}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Visual Direction
                      </span>
                      <p className="mt-0.5 text-xs text-zinc-800 leading-relaxed">
                        {bannerConfig.visualDirection}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Composition Strategy
                      </span>
                      <p className="mt-0.5 text-xs text-zinc-700 leading-relaxed">
                        {bannerConfig.composition}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Bespoke Visual Elements
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {bannerConfig.elements.map((el) => (
                          <span
                            key={el}
                            className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs text-zinc-700"
                          >
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-banner-headline" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        Banner Headline (Editable)
                      </label>
                      <input
                        type="text"
                        id="edit-banner-headline"
                        value={bannerHeadline}
                        onChange={(e) => setBannerHeadline(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-banner-subheadline" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        Supporting Subheadline (Editable)
                      </label>
                      <input
                        type="text"
                        id="edit-banner-subheadline"
                        value={bannerSubheadline}
                        onChange={(e) => setBannerSubheadline(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-zinc-500">
                    Click &ldquo;Regenerate banner →&rdquo; to build an event-specific visual identity.
                  </div>
                )}
              </div>

              {/* Save Actions */}
              <div className="border-t border-stone-200/80 pt-6 flex items-center justify-between">
                <Link
                  href="/dashboard/president"
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-zinc-800 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Saving...' : 'Save changes'}</span>
                  <span className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                  • LIVE EVENT PREVIEW
                </h3>
                <span className="text-[11px] text-zinc-400">Public appearance</span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition-all">
                <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={bannerPreviewUrl}
                    alt={title || 'Event preview'}
                    fill
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-zinc-950/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
                      {category}
                    </span>
                    {bannerConfig && (
                      <span className="rounded-md bg-zinc-950/85 px-2 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-xs">
                        Concept #{bannerConfig.generationNumber}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/20 backdrop-blur-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Open
                    </span>
                  </div>

                  {bannerConfig && (
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        {bannerHeadline || bannerConfig.headline}
                      </p>
                      <p className="text-[11px] text-zinc-200 truncate">
                        {bannerSubheadline || bannerConfig.subheadline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {clubName || 'Club / Organization'}
                    </p>
                    <h4 className="mt-1 text-xl font-medium tracking-tight text-zinc-950">
                      {title || 'Untitled Event'}
                    </h4>
                    {headline && (
                      <p className="mt-1 text-xs font-medium text-emerald-800">
                        &ldquo;{headline}&rdquo;
                      </p>
                    )}
                  </div>

                  {bannerConfig && (
                    <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3.5 space-y-2 text-xs text-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900">Concept Theme:</span>
                        <span className="font-medium text-zinc-800">{bannerConfig.theme}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900">Direction: </span>
                        <span className="text-zinc-600">{bannerConfig.visualDirection}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900">Composition: </span>
                        <span className="text-zinc-600">{bannerConfig.composition}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {bannerConfig.elements.map((el) => (
                          <span
                            key={el}
                            className="rounded border border-stone-200 bg-white px-2 py-0.5 text-[10px] text-zinc-600"
                          >
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 border-t border-stone-100 pt-3 text-xs text-zinc-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">Date:</span>
                      <span>{displayDateText}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">Time:</span>
                      <span>{displayTimeText}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">Venue:</span>
                      <span>{venue || 'To be announced'}</span>
                    </div>
                    {capacity && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900">Capacity:</span>
                        <span>{capacity} Attendees</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600">
                    {description || 'Event description.'}
                  </p>

                  {participantMessage && (
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-zinc-700 leading-relaxed">
                      <p className="font-semibold text-zinc-900 text-[11px] uppercase tracking-wide mb-1">
                        Participant Briefing
                      </p>
                      {participantMessage}
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="w-full rounded-xl bg-zinc-950 py-2.5 text-center text-xs font-medium text-white">
                      Register Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
