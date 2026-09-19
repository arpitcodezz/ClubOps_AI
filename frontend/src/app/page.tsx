'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_EVENTS } from '../data/mockEvents';
import { getAllEvents } from '../lib/events';
import { Event } from '../types/event';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { EventFilters, FilterCategory } from '../components/EventFilters';
import { FeaturedEvent } from '../components/FeaturedEvent';
import { EventGrid } from '../components/EventGrid';
import { EventModal } from '../components/EventModal';
import { Footer } from '../components/Footer';

export default function HomePage() {
  const [allEvents, setAllEvents] = useState<Event[]>(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'register'>('details');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with localStorage on client mount & listen for event additions
  useEffect(() => {
    const sync = () => {
      setAllEvents(getAllEvents());
    };
    const rafId = requestAnimationFrame(sync);

    window.addEventListener('clubops_events_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('clubops_events_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const eventsSectionRef = useRef<HTMLElement>(null);

  const scrollToEvents = () => {
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category event counts
  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      All: allEvents.length,
      Technical: 0,
      Cultural: 0,
      Sports: 0,
      Workshop: 0,
      Competition: 0,
    };

    allEvents.forEach((event) => {
      if (counts[event.category] !== undefined) {
        counts[event.category]++;
      }
    });

    return counts;
  }, [allEvents]);

  // Filtered events based on search query and category
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Category check
      if (selectedCategory !== 'All' && event.category !== selectedCategory) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesClub = event.clubName.toLowerCase().includes(query);
        const matchesVenue = event.venue.toLowerCase().includes(query);
        const matchesDescription = event.shortDescription.toLowerCase().includes(query);
        const matchesHeadline = event.headline?.toLowerCase().includes(query);
        const matchesTags = event.tags?.some((t) => t.toLowerCase().includes(query));

        return (
          matchesTitle ||
          matchesClub ||
          matchesVenue ||
          matchesDescription ||
          Boolean(matchesHeadline) ||
          Boolean(matchesTags)
        );
      }

      return true;
    });
  }, [allEvents, searchQuery, selectedCategory]);

  const handleViewDetails = (event: Event) => {
    setModalEvent(event);
    setModalMode('details');
    setIsModalOpen(true);
  };

  const handleRegister = (event: Event) => {
    setModalEvent(event);
    setModalMode('register');
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'All';

  // HackNova 2026 as premier featured event
  const featuredEvent = useMemo(() => {
    return allEvents.find((e) => e.title.toLowerCase().includes('hacknova')) || allEvents[0] || null;
  }, [allEvents]);

  // Distinct clubs list for the Clubs directory
  const campusClubs = useMemo(() => {
    const clubMap = new Map<string, { name: string; category: string; count: number }>();
    allEvents.forEach((e) => {
      const existing = clubMap.get(e.clubName);
      if (existing) {
        existing.count++;
      } else {
        clubMap.set(e.clubName, {
          name: e.clubName,
          category: e.category,
          count: 1,
        });
      }
    });
    return Array.from(clubMap.values());
  }, [allEvents]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-zinc-950 selection:bg-zinc-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar onNavigateToEvents={scrollToEvents} />

      <main className="flex-1">
        {/* Compact Editorial Hero */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
          }}
          onExploreClick={scrollToEvents}
          totalEventsCount={allEvents.length}
        />

        {/* Featured Event Section (48-64px spacing after hero) */}
        {featuredEvent && !isFiltered && (
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mt-12 sm:mt-14 lg:mt-16">
            <FeaturedEvent
              event={featuredEvent}
              onViewDetails={handleViewDetails}
              onRegister={handleRegister}
            />
          </div>
        )}

        {/* Upcoming Events (72-96px spacing after featured) */}
        <section
          id="events"
          ref={eventsSectionRef}
          className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mt-16 sm:mt-20 lg:mt-24 pb-16"
        >
          {/* Section Header: Tighter with search horizontally aligned on desktop */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 pb-5 border-b border-stone-200/80">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 mb-1.5">
                <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
                  • UPCOMING EVENTS
                </span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-stone-700">
                  {String(filteredEvents.length).padStart(2, '0')} EVENTS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-zinc-950 leading-tight">
                Events worth showing up for.
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                Browse verified campus workshops, hackathons, competitions, and student-led experiences.
              </p>
            </div>

            {/* Filter Search Field */}
            <div className="w-full md:w-80 shrink-0">
              <SearchBar
                id="discovery-search-input"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search events, clubs, venues..."
              />
            </div>
          </div>

          {/* Category Filter Chips (24px gap after header) */}
          <div className="mt-6">
            <EventFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Active Filter Indicators */}
          {isFiltered && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-600">
              <span className="font-medium text-stone-500">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-stone-800">
                  Category: <span className="font-semibold text-zinc-950">{selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="ml-1 text-stone-400 hover:text-zinc-950 transition-colors"
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}
              {searchQuery.trim() !== '' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-3 py-1 text-stone-800">
                  Search: <span className="font-semibold text-zinc-950">&ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-stone-400 hover:text-zinc-950 transition-colors"
                    aria-label="Clear search text"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-zinc-950 underline underline-offset-4 hover:text-stone-700 transition-colors ml-1"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Event Rows (32-40px gap after filters) */}
          <div className="mt-8 sm:mt-10">
            <EventGrid
              events={filteredEvents}
              onViewDetails={handleViewDetails}
              onRegister={handleRegister}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
            />
          </div>
        </section>

        {/* Campus Clubs Directory Section */}
        <section
          id="clubs"
          className="border-t border-stone-200/80 bg-[#f7f5f0]/60 py-16"
        >
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
                • DIRECTORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-zinc-950 mt-1">
                Student societies &amp; organizing bodies.
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-stone-600 font-sans">
                Official campus chapters and student-led organizations running verified activities.
              </p>
            </div>

            {/* Clean 3-column directory list */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {campusClubs.map((club) => (
                <div
                  key={club.name}
                  className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white px-4 py-3 shadow-2xs hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[11px] font-bold text-zinc-800 tracking-wider">
                      {club.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-950">
                        {club.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {club.category} Society
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {club.count} {club.count === 1 ? 'event' : 'events'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Event Details & Registration Modal */}
      <EventModal
        event={modalEvent}
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
