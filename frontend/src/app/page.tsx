'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_EVENTS } from '../data/mockEvents';
import { getAllEvents } from '../lib/events';
import { Event } from '../types/event';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SearchBar } from '../components/SearchBar';
import { EventFilters, FilterCategory } from '../components/EventFilters';
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

  // Distinct clubs list for the Clubs section
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
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:text-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      {/* Top Navigation */}
      <Navbar onNavigateToEvents={scrollToEvents} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
          }}
          onExploreClick={scrollToEvents}
        />

        {/* Event Discovery Section */}
        <section
          id="events"
          ref={eventsSectionRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          {/* Section Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                  Upcoming Events
                </h2>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Explore campus workshops, hackathons, cultural fests, and tournaments.
              </p>
            </div>

            {/* Filter Search Field */}
            <div className="w-full sm:w-72">
              <SearchBar
                id="discovery-search-input"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter by title, club, tag..."
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="mt-6 border-y border-zinc-100 py-3 dark:border-zinc-800/80">
            <EventFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Active Filter Indicators */}
          {isFiltered && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  Category: {selectedCategory}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="ml-1 hover:text-zinc-950 dark:hover:text-white"
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}
              {searchQuery.trim() !== '' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-zinc-950 dark:hover:text-white"
                    aria-label="Clear search text"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Events Grid */}
          <div className="mt-8">
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
          className="border-t border-zinc-200 bg-zinc-50/60 py-16 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Registered Student Clubs & Societies
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Authorized campus organizations hosting certified events, workshops, and competitions.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {campusClubs.map((club) => (
                <div
                  key={club.name}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {club.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {club.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {club.category} Society
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
