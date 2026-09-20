'use client';

import { createEvent, generateEventCommunicationAI } from '@/lib/api';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EventBannerConfig, EventCategory } from '@/types/event';
import {
  CATEGORY_BANNERS,
  checkVenueConflict,
  formatDisplayDate,
  formatDisplayTime,
  generateEventBanner,
  generateEventCommunication,
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

export default function NewEventPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [clubName, setClubName] = useState('');
  const [category, setCategory] = useState<EventCategory>('Competition');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState<number | ''>(150);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('AI, Hackathon, Innovation');

  // AI Communication State
  const [hasGeneratedAI, setHasGeneratedAI] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [headline, setHeadline] = useState('');
  const [participantMessage, setParticipantMessage] = useState('');
  const [volunteerMessage, setVolunteerMessage] = useState('');

  // AI Event Identity / Banner State
  const [hasGeneratedBanner, setHasGeneratedBanner] = useState(false);
  const [bannerGenNumber, setBannerGenNumber] = useState(1);
  const [bannerConfig, setBannerConfig] = useState<EventBannerConfig | null>(null);
  const [bannerHeadline, setBannerHeadline] = useState('');
  const [bannerSubheadline, setBannerSubheadline] = useState('');

  // UI / Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear conflict error when user modifies venue, date, or time
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
  const handleGenerateAI = async () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Please enter an event name first.';
    if (!description.trim()) newErrors.description = 'Please enter a description for AI context.';
    if (!venue.trim()) newErrors.venue = 'Please specify a venue.';

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setErrors({});
    setAiError(null);
    setIsGeneratingAI(true);

    try {
      const generated = await generateEventCommunicationAI({
        title,
        description,
        club_name: clubName || undefined,
        category,
        date: date || undefined,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        venue: venue || undefined,
        capacity: typeof capacity === 'number' ? capacity : undefined,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      });

      setHeadline(generated.headline);
      setParticipantMessage(generated.participant_announcement);
      setVolunteerMessage(generated.volunteer_announcement);
      setHasGeneratedAI(true);
    } catch (err: unknown) {
      // Fall back gracefully with clear message
      const errMsg = err instanceof Error ? err.message : 'Failed to generate AI communication';
      setAiError(errMsg);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Generate / Regenerate Event-Specific Banner
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

    const nextGen = hasGeneratedBanner ? bannerGenNumber + 1 : 1;

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
    setHasGeneratedBanner(true);
  };

  // Validate and Publish
  const handlePublish = async (e: React.FormEvent) => {
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

    // Check Venue Conflict
    const conflict = checkVenueConflict({
      venue: venue.trim(),
      date,
      rawDate: date,
      startTime,
      endTime,
    });

    if (conflict.hasConflict && conflict.message) {
      setConflictError(conflict.message);
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Build final banner configuration if generated
    const finalBannerConfig: EventBannerConfig | undefined = bannerConfig
      ? {
          ...bannerConfig,
          headline: bannerHeadline || bannerConfig.headline,
          subheadline: bannerSubheadline || bannerConfig.subheadline,
        }
      : undefined;

    const bannerUrl = finalBannerConfig?.bannerUrl || CATEGORY_BANNERS[category];

try {
const startDateTime = `${date}T${startTime}:00`;
const endDateTime = `${date}T${endTime}:00`;

await createEvent({
  title: title.trim(),
  headline: headline.trim() || null,
  description: description.trim(),
  banner_url: bannerUrl || null,
  event_type: category.toUpperCase(),
  venue: venue.trim(),
  start_datetime: startDateTime,
  end_datetime: endDateTime,
  registration_deadline: null,
  capacity: capacity ? Number(capacity) : null,
  status: 'DRAFT',
  club_id: 1,
  created_by: 8,
});

router.push('/dashboard/president?published=true');

} catch (err: unknown) {
  setIsSubmitting(false);

  const msg = err instanceof Error ? err.message : 'Failed to publish event.';
  setConflictError(msg);
}
  };

  const bannerPreviewUrl = bannerConfig?.bannerUrl || CATEGORY_BANNERS[category];
  const displayDateText = formatDisplayDate(date);
  const displayTimeText = formatDisplayTime(startTime, endTime);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-zinc-950 selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <PresidentNav />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Back Link */}
        <div>
          <Link
            href="/dashboard/president"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
          >
            <span>←</span>
            <span>Back to President Dashboard</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mt-4 border-b border-stone-200/80 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            <span className="text-zinc-400">•</span>
            <span>CREATE EVENT</span>
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            Create a new campus event.
          </h1>
          <p className="mt-2 text-base text-zinc-600">
            Set up the event details and let ClubOps prepare the communication.
          </p>
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

        {/* Two Column Layout on Desktop: Form (Left) & Live Preview (Right) */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT: Event Form */}
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handlePublish} className="space-y-8">
              {/* 1. Basic Information Group */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold tracking-wide text-zinc-950 uppercase">
                  1. Basic Information
                </h3>

                {/* Event Title */}
                <div>
                  <label htmlFor="event-name" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Event Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="event-name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Campus AI Challenge"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                  )}
                </div>

                {/* Club and Category */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="club-name" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Club / Organization <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="club-name"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      placeholder="e.g. AI & Robotics Club"
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.clubName && (
                      <p className="mt-1 text-xs text-rose-600">{errors.clubName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Category <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="category"
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

                {/* Date & Time */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="event-date" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Date <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="date"
                      id="event-date"
                      value={date}
                      onChange={(e) => handleScheduleChange('date', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.date && (
                      <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="start-time" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Start Time <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="time"
                      id="start-time"
                      value={startTime}
                      onChange={(e) => handleScheduleChange('startTime', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-xs text-rose-600">{errors.startTime}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="end-time" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      End Time <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="time"
                      id="end-time"
                      value={endTime}
                      onChange={(e) => handleScheduleChange('endTime', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-xs text-rose-600">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                {/* Venue & Capacity */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="venue" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Venue <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="venue"
                      value={venue}
                      onChange={(e) => handleScheduleChange('venue', e.target.value)}
                      placeholder="e.g. Innovation Hall"
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    {errors.venue && (
                      <p className="mt-1 text-xs text-rose-600">{errors.venue}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="capacity" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Attendee Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value, 10) : '')}
                      placeholder="e.g. 150"
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Description <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A campus-wide AI challenge where student teams build practical solutions for real problems."
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="AI, Hackathon, Innovation"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              {/* 2. AI Event Communication Section */}
              <div className="border-t border-stone-200/80 pt-8 space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-950 uppercase">
                      2. AI Event Communication
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Generate suggestions for headlines, attendee notices, and volunteer briefings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 transition-colors self-start sm:self-auto disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isGeneratingAI ? 'Generating with AI...' : 'Generate event communication'}</span>
                    {!isGeneratingAI && <span aria-hidden="true">→</span>}
                  </button>
                </div>

                {aiError && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
                    <p className="font-semibold">AI Service Notice</p>
                    <p className="mt-0.5 text-amber-800">{aiError}</p>
                  </div>
                )}

                {hasGeneratedAI ? (
                  <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>Suggested Communication Generated (Editable)</span>
                    </div>

                    {/* A. Event Headline */}
                    <div>
                      <label htmlFor="headline" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        A. Event Headline
                      </label>
                      <input
                        type="text"
                        id="headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Build. Ship. Compete."
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>

                    {/* B. Participant Message */}
                    <div>
                      <label htmlFor="participant-message" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        B. Participant Message
                      </label>
                      <textarea
                        id="participant-message"
                        rows={3}
                        value={participantMessage}
                        onChange={(e) => setParticipantMessage(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                      />
                    </div>

                    {/* C. Volunteer Message */}
                    <div>
                      <label htmlFor="volunteer-message" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        C. Volunteer Message
                      </label>
                      <textarea
                        id="volunteer-message"
                        rows={3}
                        value={volunteerMessage}
                        onChange={(e) => setVolunteerMessage(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-zinc-500">
                    Enter basic event details above and click &ldquo;Generate event communication →&rdquo; to produce tailored headline and participant messages.
                  </div>
                )}
              </div>

              {/* 3. Event Identity / Banner Section */}
              <div className="border-t border-stone-200/80 pt-8 space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-zinc-950 uppercase">
                      3. Event Identity & Creative Direction
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Derives identity from full event context (title, description, club, venue, tags). Category is secondary.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateBanner}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 transition-colors self-start sm:self-auto"
                  >
                    <span>{hasGeneratedBanner ? 'Regenerate banner (New Concept)' : 'Generate event banner'}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                {hasGeneratedBanner && bannerConfig ? (
                  <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
                    {/* Variation Header & Theme */}
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

                    {/* Creative Visual Direction */}
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Visual Direction
                      </span>
                      <p className="mt-0.5 text-xs text-zinc-800 leading-relaxed">
                        {bannerConfig.visualDirection}
                      </p>
                    </div>

                    {/* Composition */}
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Composition Strategy
                      </span>
                      <p className="mt-0.5 text-xs text-zinc-700 leading-relaxed">
                        {bannerConfig.composition}
                      </p>
                    </div>

                    {/* Visual Elements Pills */}
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

                    {/* Banner Headline (Editable) */}
                    <div>
                      <label htmlFor="banner-headline" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        Banner Headline (Editable)
                      </label>
                      <input
                        type="text"
                        id="banner-headline"
                        value={bannerHeadline}
                        onChange={(e) => setBannerHeadline(e.target.value)}
                        placeholder="e.g. Build. Ship. Compete."
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>

                    {/* Banner Supporting Message (Editable) */}
                    <div>
                      <label htmlFor="banner-subheadline" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                        Supporting Subheadline (Editable)
                      </label>
                      <input
                        type="text"
                        id="banner-subheadline"
                        value={bannerSubheadline}
                        onChange={(e) => setBannerSubheadline(e.target.value)}
                        placeholder="e.g. Campus AI Challenge 2026 • AI & Robotics Club"
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-zinc-500">
                    Click &ldquo;Generate event banner →&rdquo; to build an event-specific visual concept tailored to this event&apos;s title, description, and audience.
                  </div>
                )}
              </div>

              {/* Publish Action */}
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
                  <span>{isSubmitting ? 'Publishing...' : 'Publish event'}</span>
                  <span className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Live Public Event Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                  • LIVE EVENT PREVIEW
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Public appearance
                </span>
              </div>

              {/* Preview Card */}
              <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition-all">
                {/* Banner image preview */}
                <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={bannerPreviewUrl}
                    alt={title || 'Event preview'}
                    fill
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent" />

                  {/* Category & Status Overlay */}
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

                  {/* Banner identity overlay if generated */}
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

                {/* Content preview */}
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

                  {/* Generated Visual Theme & Metadata Card */}
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

                  {/* Metadata Row */}
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

                  {/* Description Preview */}
                  <p className="text-xs leading-relaxed text-zinc-600">
                    {description || 'Event description will be previewed here as you type.'}
                  </p>

                  {/* Participant Message Callout */}
                  {participantMessage && (
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-zinc-700 leading-relaxed">
                      <p className="font-semibold text-zinc-900 text-[11px] uppercase tracking-wide mb-1">
                        Participant Briefing
                      </p>
                      {participantMessage}
                    </div>
                  )}

                  {/* Simulated CTA Button */}
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
