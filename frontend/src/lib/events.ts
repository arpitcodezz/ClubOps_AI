import { Event, EventCategory, EventBannerConfig } from '../types/event';
import { MOCK_EVENTS } from '../data/mockEvents';

const UNIFIED_EVENTS_KEY = 'clubops_unified_events_v2';
const LEGACY_EVENTS_KEY = 'clubops_local_events_v1';

export const CATEGORY_BANNERS: Record<EventCategory, string> = {
  Technical: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  Cultural: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
  Sports: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  Workshop: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  Competition: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Format YYYY-MM-DD to human-readable date e.g. "20 Oct 2026"
 */
export function formatDisplayDate(dateInput: string): string {
  if (!dateInput) return 'TBA';
  if (dateInput.includes('-')) {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${months[monthIndex]} ${year}`;
      }
    }
  }
  return dateInput;
}

/**
 * Format 24h time HH:MM to 12h AM/PM
 */
export function formatDisplayTime(startTime: string, endTime?: string): string {
  if (!startTime) return 'TBA';
  const formatSingleTime = (t: string) => {
    if (!t) return '';
    if (t.includes('AM') || t.includes('PM')) return t;
    const [hStr, mStr] = t.split(':');
    const h = parseInt(hStr, 10);
    if (isNaN(h)) return t;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const minute = mStr || '00';
    return `${hour12.toString().padStart(2, '0')}:${minute} ${suffix}`;
  };

  const formattedStart = formatSingleTime(startTime);
  if (endTime) {
    const formattedEnd = formatSingleTime(endTime);
    return `${formattedStart} - ${formattedEnd}`;
  }
  return formattedStart;
}

/**
 * Normalize venue string for conflict comparisons
 */
export function normalizeVenue(venue: string): string {
  return (venue || '').trim().toLowerCase();
}

const MONTH_MAP: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

/**
 * Normalize any date representation into standard YYYY-MM-DD strings.
 * Handles single dates, multi-day ranges (e.g. "Oct 24 - 25, 2026"), and YYYY-MM-DD.
 */
export function parseEventDateToStandard(dateStr: string): string[] {
  if (!dateStr) return [];
  const trimmed = dateStr.trim();

  // Pattern: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return [trimmed];
  }

  // Pattern: DD Mon YYYY e.g. "20 Oct 2026"
  const dmyMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const monKey = dmyMatch[2].slice(0, 3).toLowerCase();
    const year = dmyMatch[3];
    const month = MONTH_MAP[monKey];
    if (month) return [`${year}-${month}-${day}`];
  }

  // Pattern: Mon DD, YYYY e.g. "Oct 20, 2026" or "Oct 20 2026"
  const mdyMatch = trimmed.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,\s*|\s+)(\d{4})$/);
  if (mdyMatch) {
    const monKey = mdyMatch[1].slice(0, 3).toLowerCase();
    const day = mdyMatch[2].padStart(2, '0');
    const year = mdyMatch[3];
    const month = MONTH_MAP[monKey];
    if (month) return [`${year}-${month}-${day}`];
  }

  // Pattern: Mon DD - DD, YYYY e.g. "Oct 24 - 25, 2026"
  const rangeMatch = trimmed.match(/^([A-Za-z]{3,9})\s+(\d{1,2})\s*[-–]\s*(\d{1,2})(?:,\s*|\s+)(\d{4})$/);
  if (rangeMatch) {
    const monKey = rangeMatch[1].slice(0, 3).toLowerCase();
    const startDay = parseInt(rangeMatch[2], 10);
    const endDay = parseInt(rangeMatch[3], 10);
    const year = rangeMatch[4];
    const month = MONTH_MAP[monKey];
    if (month && !isNaN(startDay) && !isNaN(endDay)) {
      const dates: string[] = [];
      for (let d = startDay; d <= endDay; d++) {
        dates.push(`${year}-${month}-${d.toString().padStart(2, '0')}`);
      }
      return dates;
    }
  }

  // Fallback: lowercase string
  return [trimmed.toLowerCase()];
}

/**
 * Convert time string ("HH:MM" or "hh:mm AM/PM") into minutes from midnight (0 - 1440)
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();

  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');

  const numbersOnly = clean.replace(/[^\d:]/g, '');
  const [hStr, mStr] = numbersOnly.split(':');
  let hours = parseInt(hStr || '0', 10);
  const minutes = parseInt(mStr || '0', 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Extract time interval in minutes from an event
 */
export function parseEventTimeInterval(event: {
  startTime?: string;
  endTime?: string;
  time?: string;
}): { startMinutes: number; endMinutes: number } | null {
  if (event.startTime && event.endTime) {
    const startMinutes = parseTimeToMinutes(event.startTime);
    const endMinutes = parseTimeToMinutes(event.endTime);
    return { startMinutes, endMinutes };
  }

  if (event.time) {
    const parts = event.time.split(/[-–]/);
    if (parts.length === 2) {
      const startMinutes = parseTimeToMinutes(parts[0]);
      const endMinutes = parseTimeToMinutes(parts[1]);
      return { startMinutes, endMinutes };
    }
    const single = parseTimeToMinutes(event.time);
    return { startMinutes: single, endMinutes: single + 120 };
  }

  return null;
}

export interface VenueConflictResult {
  hasConflict: boolean;
  conflictEvent?: Event;
  message?: string;
}

/**
 * Validate proposed venue and date/time against all existing events.
 * Overlap condition: startA < endB && endA > startB
 * Touching edges (e.g. 10:00-14:00 and 14:00-17:00) are ALLOWED.
 */
export function checkVenueConflict(
  candidate: {
    venue: string;
    date: string;
    rawDate?: string;
    startTime: string;
    endTime: string;
    id?: string;
  },
  excludeEventId?: string
): VenueConflictResult {
  const normVenue = normalizeVenue(candidate.venue);
  if (!normVenue) {
    return { hasConflict: false };
  }

  const candidateDates = parseEventDateToStandard(candidate.rawDate || candidate.date);
  if (candidateDates.length === 0) {
    return { hasConflict: false };
  }

  const candStart = parseTimeToMinutes(candidate.startTime);
  const candEnd = parseTimeToMinutes(candidate.endTime);

  // Validate end time must be after start time
  if (candEnd <= candStart) {
    return {
      hasConflict: true,
      message: 'End time must be after start time.',
    };
  }

  const allEvents = getAllEvents();
  const idToExclude = excludeEventId || candidate.id;

  for (const existing of allEvents) {
    if (idToExclude && existing.id === idToExclude) {
      continue;
    }

    // Check venue match
    if (normalizeVenue(existing.venue) !== normVenue) {
      continue;
    }

    // Check date match
    const existingDates = parseEventDateToStandard(existing.rawDate || existing.date);
    const hasDateOverlap = candidateDates.some((cd) => existingDates.includes(cd));
    if (!hasDateOverlap) {
      continue;
    }

    // Check time interval overlap
    const existingInterval = parseEventTimeInterval(existing);
    if (!existingInterval) {
      continue;
    }

    const existStart = existingInterval.startMinutes;
    const existEnd = existingInterval.endMinutes;

    // Boundary rule: startA < endB && endA > startB
    const overlaps = candStart < existEnd && candEnd > existStart;

    if (overlaps) {
      const existingTimeDisplay = existing.time || formatDisplayTime(existing.startTime || '', existing.endTime);
      const existingDateDisplay = existing.date || formatDisplayDate(existing.rawDate || '');
      return {
        hasConflict: true,
        conflictEvent: existing,
        message: `Venue conflict: ${candidate.venue.trim()} is already booked for "${existing.title}" from ${existingTimeDisplay} on ${existingDateDisplay}.`,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Enrich baseline mock event with standardized defaults so it can be edited seamlessly
 */
function enrichDefaultEvent(e: Event): Event {
  const standardDates = parseEventDateToStandard(e.date);
  const rawDate = e.rawDate || standardDates[0] || '2026-10-24';
  let startTime = e.startTime || '10:00';
  let endTime = e.endTime || '18:00';

  if (e.time && (!e.startTime || !e.endTime)) {
    const parts = e.time.split(/[-–]/);
    if (parts.length === 2) {
      const sMin = parseTimeToMinutes(parts[0]);
      const eMin = parseTimeToMinutes(parts[1]);
      const sH = Math.floor(sMin / 60).toString().padStart(2, '0');
      const sM = (sMin % 60).toString().padStart(2, '0');
      const eH = Math.floor(eMin / 60).toString().padStart(2, '0');
      const eM = (eMin % 60).toString().padStart(2, '0');
      startTime = `${sH}:${sM}`;
      endTime = `${eH}:${eM}`;
    }
  }

  return {
    ...e,
    rawDate,
    startTime,
    endTime,
    capacity: e.capacity || 250,
    volunteersNeeded: e.volunteersNeeded || 24,
    openTasksCount: e.openTasksCount || 12,
    published: e.published !== undefined ? e.published : true,
    createdAt: e.createdAt || '2026-10-01T00:00:00.000Z',
  };
}

/**
 * Initialize or retrieve the unified event registry from localStorage.
 * Treats mock events as editable/deletable demo data instead of immutable read-only data.
 */
function getUnifiedStore(): Event[] {
  if (typeof window === 'undefined') {
    return MOCK_EVENTS.map(enrichDefaultEvent);
  }

  try {
    const raw = window.localStorage.getItem(UNIFIED_EVENTS_KEY);
    if (raw) {
      return JSON.parse(raw) as Event[];
    }

    // First time migration: Seed with baseline mock events + any previously created custom events
    let initialEvents = MOCK_EVENTS.map(enrichDefaultEvent);

    const legacyRaw = window.localStorage.getItem(LEGACY_EVENTS_KEY);
    if (legacyRaw) {
      try {
        const legacyCustom = JSON.parse(legacyRaw) as Event[];
        if (Array.isArray(legacyCustom) && legacyCustom.length > 0) {
          const customIds = new Set(legacyCustom.map((c) => c.id));
          initialEvents = [...legacyCustom, ...initialEvents.filter((m) => !customIds.has(m.id))];
        }
      } catch (err) {
        console.error('Error migrating legacy custom events:', err);
      }
    }

    window.localStorage.setItem(UNIFIED_EVENTS_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  } catch (err) {
    console.error('Error accessing unified events store:', err);
    return MOCK_EVENTS.map(enrichDefaultEvent);
  }
}

/**
 * Retrieve all events from the unified registry (used across dashboard and public discovery)
 */
export function getAllEvents(): Event[] {
  return getUnifiedStore();
}

/**
 * Retrieve events list (alias for unified store)
 */
export function getStoredEvents(): Event[] {
  return getUnifiedStore();
}

/**
 * Retrieve single event by ID from unified store
 */
export function getEventById(id: string): Event | undefined {
  const all = getAllEvents();
  return all.find((e) => e.id === id);
}

/**
 * Every event in the unified system is manageable by the President
 */
export function isCustomEvent(id: string): boolean {
  if (!id) return false;
  const all = getAllEvents();
  return all.some((e) => e.id === id);
}

/**
 * Save new or edited event to the unified store
 */
export function saveCustomEvent(
  eventData: Omit<Event, 'id' | 'createdAt' | 'published'> & { id?: string }
): Event {
  // Enforce conflict check before saving
  const conflict = checkVenueConflict(
    {
      venue: eventData.venue,
      date: eventData.date,
      rawDate: eventData.rawDate,
      startTime: eventData.startTime || '10:00',
      endTime: eventData.endTime || '18:00',
      id: eventData.id,
    },
    eventData.id
  );

  if (conflict.hasConflict && conflict.message) {
    throw new Error(conflict.message);
  }

  const allEvents = getUnifiedStore();
  const targetId = eventData.id || `evt-custom-${Date.now()}`;
  const existingIdx = allEvents.findIndex((e) => e.id === targetId);

  const bannerUrl =
    eventData.bannerUrl ||
    eventData.bannerConfig?.bannerUrl ||
    CATEGORY_BANNERS[eventData.category] ||
    CATEGORY_BANNERS.Technical;

  const savedEvent: Event = {
    ...eventData,
    id: targetId,
    bannerUrl,
    published: true,
    createdAt:
      existingIdx >= 0 ? allEvents[existingIdx].createdAt : new Date().toISOString(),
  };

  let updated: Event[];
  if (existingIdx >= 0) {
    // Update in-place without duplicating
    updated = [...allEvents];
    updated[existingIdx] = savedEvent;
  } else {
    // Prepend new event
    updated = [savedEvent, ...allEvents];
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(UNIFIED_EVENTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('clubops_events_updated'));
    } catch (err) {
      console.error('Error saving event to unified store:', err);
    }
  }

  return savedEvent;
}

/**
 * Delete ANY event (mock or created) from the unified registry.
 * Deletion persists across page refresh.
 */
export function deleteCustomEvent(id: string): boolean {
  if (!id) return false;
  const allEvents = getUnifiedStore();
  const exists = allEvents.some((e) => e.id === id);
  if (!exists) {
    return false;
  }

  const updated = allEvents.filter((e) => e.id !== id);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(UNIFIED_EVENTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('clubops_events_updated'));
      return true;
    } catch (err) {
      console.error('Error deleting event from unified store:', err);
      return false;
    }
  }
  return true;
}

export interface GeneratedCommunication {
  headline: string;
  participantMessage: string;
  volunteerMessage: string;
}

/**
 * Deterministic generator for AI event communication
 */
export function generateEventCommunication(input: {
  title: string;
  category: EventCategory;
  description: string;
  venue: string;
  date?: string;
  clubName?: string;
}): GeneratedCommunication {
  const { title, category, venue, date, clubName } = input;
  const clubLabel = clubName || 'the campus organizing committee';
  const venueLabel = venue || 'the scheduled venue';
  const dateLabel = date ? formatDisplayDate(date) : 'the event day';

  let headline = 'Build. Ship. Compete.';
  if (category === 'Competition') {
    headline = 'Innovate. Build. Compete.';
  } else if (category === 'Technical') {
    headline = 'Code the Future. Build the Next.';
  } else if (category === 'Workshop') {
    headline = 'Learn Hands-On. Master the Stack.';
  } else if (category === 'Cultural') {
    headline = 'Celebrate Expression. Take the Stage.';
  } else if (category === 'Sports') {
    headline = 'Compete with Passion. Aim for the Cup.';
  }

  const participantMessage = `Join fellow student builders and innovators for ${title} organized by ${clubLabel}. Hosted at ${venueLabel} on ${dateLabel}. Bring your university ID and get ready for an engaging campus experience with live networking, collaborative sessions, and recognition prizes.`;

  const volunteerMessage = `Volunteers are needed across registration check-in, venue coordination, technical staging, and attendee guidance for ${title} at ${venueLabel}. Volunteer briefing begins 45 minutes prior to event start time. Service hours will be certified by the Council.`;

  return {
    headline,
    participantMessage,
    volunteerMessage,
  };
}

export interface EventBannerInput {
  title: string;
  category: EventCategory;
  description: string;
  venue?: string;
  date?: string;
  clubName?: string;
  tags?: string[];
  audience?: string;
  purpose?: string;
  headline?: string;
  participantMessage?: string;
  volunteerMessage?: string;
  generationNumber?: number;
}

interface BannerConceptVariation {
  theme: string;
  visualDirection: string;
  composition: string;
  accent: 'emerald' | 'indigo' | 'amber' | 'rose' | 'cyan' | 'violet';
  elements: string[];
  headline: string;
  subheadlineTemplate: (title: string, club: string) => string;
  bannerUrl: string;
}

/**
 * Topic Concept Dictionary: Driven primarily by the COMPLETE event identity.
 * Category is only ONE secondary contextual input.
 */
const TOPIC_CONCEPTS: Record<string, BannerConceptVariation[]> = {
  // 1. AI & Machine Learning / Intelligent Systems
  ai: [
    {
      theme: 'Futuristic AI Research Laboratory',
      visualDirection:
        'Student builders collaborating around holographic neural-network topologies, live inference telemetry, and illuminated compute workstations.',
      composition: 'Asymmetric laboratory perspective: collaborative team terminal on left, glowing 3D neural connectivity matrix on right.',
      accent: 'emerald',
      elements: ['Neural-network topology', 'Real-time inference telemetry', 'Collaborative student pod', 'Glowing tensor nodes'],
      headline: 'Architect Intelligence. Build Practical Solutions.',
      subheadlineTemplate: (t, c) => `${t} • AI Systems & Neural Challenge • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Autonomous Systems & Agentic Orchestration',
      visualDirection:
        'High-contrast terminal view with multi-agent orchestration graphs, low-latency execution pipelines, and clean streaming metrics.',
      composition: 'Central glowing execution core radiating outward into parallel autonomous task pipelines.',
      accent: 'cyan',
      elements: ['Agentic DAG pipelines', 'Terminal telemetry', 'Autonomous execution graph', 'Model evaluation meters'],
      headline: 'Orchestrate Intelligence. Solve Real Problems.',
      subheadlineTemplate: (t, c) => `${t} • Autonomous Agent Engineering • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Competitive AI Arena & Benchmark Showdown',
      visualDirection:
        'Electrifying tournament atmosphere with giant overhead leaderboards, multi-GPU compute cluster status lights, and intense student team battle stations.',
      composition: 'Wide-angle competition hall perspective with overhead floodlights illuminating battle stations and real-time loss graphs.',
      accent: 'indigo',
      elements: ['Live benchmark scoreboard', 'GPU cluster metrics', 'Team battle consoles', 'Tournament stage lighting'],
      headline: 'Benchmark. Optimize. Dominate the Leaderboard.',
      subheadlineTemplate: (t, c) => `${t} • Campus AI Championship • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 2. Competitive Coding / Algorithmic Sprints / Programming Contests
  coding: [
    {
      theme: 'High-Velocity Algorithmic Battleground',
      visualDirection:
        'Intense competitive programming arena with multi-monitor developer rigs, real-time submission verdict tickers, and accepted test-case matrices.',
      composition: 'Close-perspective dual-monitor view with glowing syntax buffers and live competition leaderboard in background.',
      accent: 'amber',
      elements: ['Dual-monitor vertical rigs', 'Accepted test-case matrix', 'Live submission ticker', 'Mechanical keyboard backlights'],
      headline: 'Solve in O(1). Ship with Zero Errors.',
      subheadlineTemplate: (t, c) => `${t} • National Algorithmic Sprint • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Distributed Systems & Architecture Sprint',
      visualDirection:
        'Editorial technical aesthetic featuring clean distributed system schematics, API gateway latency graphs, and team architecture whiteboards.',
      composition: 'Balanced isometric layout highlighting microservice topological maps and live request throughput telemetry.',
      accent: 'emerald',
      elements: ['Distributed system topologies', 'Microservice gateway graphs', 'Architecture whiteboard diagrams', 'Throughput metrics'],
      headline: 'Scale the Architecture. Engineer the Stack.',
      subheadlineTemplate: (t, c) => `${t} • Systems Engineering Sprint • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Midnight Collegiate Hackathon',
      visualDirection:
        'Atmospheric late-night campus building buzzing with student energy, neon-lit collaborative pods, whiteboard brainstorming, and laptops.',
      composition: 'Cinematic shallow depth-of-field capturing focused team collaboration under warm tungsten desk lamps and neon ambient wash.',
      accent: 'rose',
      elements: ['Team whiteboard brainstorms', 'Neon-lit collaboration pods', 'Warm terminal illumination', 'Fast-paced sprint clock'],
      headline: 'From Midnight to Dawn: Turn Ideas into Software.',
      subheadlineTemplate: (t, c) => `${t} • Collegiate Hackathon • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 3. Dance / Choreography / Performing Arts
  dance: [
    {
      theme: 'Dynamic Stage Choreography & Illumination',
      visualDirection:
        'Dramatic theatrical stage featuring powerful dancer silhouettes against warm backlighting and ambient stage haze.',
      composition: 'Central dramatic spotlight with dynamic kinetic motion trails and audience amphitheater silhouettes.',
      accent: 'rose',
      elements: ['Concert spotlights', 'Stage haze atmospheric glow', 'Performance silhouettes', 'Acoustic waveform visuals'],
      headline: 'Celebrate Expression. Take the Stage.',
      subheadlineTemplate: (t, c) => `${t} • Inter-College Dance Showcase • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Urban Street Dance & Crew Battle Arena',
      visualDirection:
        'High-contrast urban performance environment with neon rim lighting, reflective dance floor, and energetic crowd circle.',
      composition: 'Low-angle energetic shot capturing crew face-off in a spotlight circle.',
      accent: 'amber',
      elements: ['Reflective battle circle', 'Neon rim lighting', 'Crowd energy silhouettes', 'Cypher floor markings'],
      headline: 'Rhythm, Power & Street Battles.',
      subheadlineTemplate: (t, c) => `${t} • Street Crew Championship • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Classical Expressions & Rhythmic Harmony',
      visualDirection:
        'Elegantly composed classical auditorium setting with rich golden illumination, traditional stage drapery, and graceful movement patterns.',
      composition: 'Symmetrical concert hall perspective with warm acoustic lighting.',
      accent: 'indigo',
      elements: ['Golden spotlight array', 'Traditional acoustic drapery', 'Graceful motion blur', 'Cultural stage proscenium'],
      headline: 'A Night of Classical Heritage & Grace.',
      subheadlineTemplate: (t, c) => `${t} • Classical Dance Arts • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 4. Music / Concerts / Acoustic Sessions
  music: [
    {
      theme: 'Sunset Amphitheatre Acoustic Sessions',
      visualDirection:
        'Open-air lawn amphitheater at golden hour with acoustic instruments, festoon fairy lights, and relaxed student crowd.',
      composition: 'Warm golden-hour panorama with acoustic guitar foreground and sun-drenched grass seating.',
      accent: 'amber',
      elements: ['Acoustic guitar curves', 'Festoon ambient bulbs', 'Sunset amphitheatre grass', 'Warm bokeh particles'],
      headline: 'Harmonies Under the Open Sky.',
      subheadlineTemplate: (t, c) => `${t} • Unplugged Acoustic Sessions • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Electrifying Live Concert & Festival Stage',
      visualDirection:
        'Full concert stage with high-output moving lights, atmospheric smoke columns, and high-energy band performance.',
      composition: 'Dynamic stage-front view looking up into beam arrays and crowd hands.',
      accent: 'rose',
      elements: ['High-output moving heads', 'Stage smoke columns', 'Audience crowd hands', 'Dynamic beam spectrum'],
      headline: 'Feel the Sound. Live the Music.',
      subheadlineTemplate: (t, c) => `${t} • Campus Music Festival • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Harmonic Fusion & Instrumental Ensembles',
      visualDirection:
        'Intimate chamber hall setting with precision stage acoustics, warm wooden architecture, and layered soundwave projections.',
      composition: 'Structured ensemble arrangement with focused spotlights on instrument sections.',
      accent: 'cyan',
      elements: ['Chamber acoustic panels', 'Instrument silhouettes', 'Soundwave projections', 'Warm orchestral ambience'],
      headline: 'Precision Melodies. Collaborative Acoustics.',
      subheadlineTemplate: (t, c) => `${t} • Instrumental Showcase • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 5. Sports / Futsal / Football
  sports: [
    {
      theme: 'Floodlit Turf Championship Arena',
      visualDirection:
        'High-velocity floodlit artificial turf stadium with crisp field line markings, dynamic motion-blurred ball trails, and pitchside team dugouts.',
      composition: 'Dynamic diagonal pitch perspective with glowing sideline floodlights.',
      accent: 'emerald',
      elements: ['Floodlit green turf', 'Championship ball trails', 'Scoreboard clock', 'Sideline dugout lighting'],
      headline: 'Compete with Passion. Aim for the Cup.',
      subheadlineTemplate: (t, c) => `${t} • Department Championship • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Campus Champions League Final',
      visualDirection:
        'Dramatic championship arena with gold trophy pedestal, stadium flare lighting, and collegiate flags fluttering in evening breeze.',
      composition: 'Heroic center-court view with tournament trophy in foreground focus and packed spectator stands.',
      accent: 'amber',
      elements: ['Champions rolling trophy', 'Stadium flare lights', 'Collegiate team banners', 'Championship confetti'],
      headline: 'Glory on the Pitch. Champions of Campus.',
      subheadlineTemplate: (t, c) => `${t} • Finals Showdown • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Fast-Paced 5v5 Knockout Clash',
      visualDirection:
        'Close-action athletic battle on indoor court with reflective hardwood, intense player shadows, and digital scoreboard countdown.',
      composition: 'Low-angle action framing capturing intense fast-break movement.',
      accent: 'rose',
      elements: ['Indoor court reflection', 'Fast-break action trails', 'Knockout countdown timer', 'Spectator court lines'],
      headline: 'Speed. Agility. Knockout Intensity.',
      subheadlineTemplate: (t, c) => `${t} • Fast-Paced Knockout Cup • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 6. Chess / Mind Games / Strategy
  chess: [
    {
      theme: 'High-Stakes Blitz Chess Open',
      visualDirection:
        'Dramatic macro view of wooden tournament chess pieces on polished walnut board, flanked by glowing DGT digital timers ticking down.',
      composition: 'Shallow depth-of-field diagonal focus on white Knight and King with digital clock displays.',
      accent: 'amber',
      elements: ['Polished walnut chess pieces', 'DGT digital timer displays', '3+2 Blitz clock telemetry', 'Notation score sheets'],
      headline: 'Master the Board. Outthink the Clock.',
      subheadlineTemplate: (t, c) => `${t} • FIDE Standard Swiss Open • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Strategic Grandmaster Arena',
      visualDirection:
        'Quiet, tension-filled tournament hall with overhead spotlight cones illuminating pristine competition tables in symmetrical alignment.',
      composition: 'Symmetrical perspective through center aisle of tournament tables.',
      accent: 'indigo',
      elements: ['Overhead spotlight cones', 'Broadcast board cameras', 'Tournament table brackets', 'Deep focus hall'],
      headline: 'Calculated Moves. Strategic Mastery.',
      subheadlineTemplate: (t, c) => `${t} • Collegiate Chess Championship • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Tactical Mind Sports & Positional Showdown',
      visualDirection:
        'Clean modern visualization blending physical wooden board with subtle projected vector lines of attack and tactical defense squares.',
      composition: 'Top-down tactical overview with illuminated threat vectors and move notation.',
      accent: 'cyan',
      elements: ['Tactical vector lines', 'King-side assault geometry', 'Endgame time pressure', 'Rating ladder metrics'],
      headline: 'Vision Beyond the Next Move.',
      subheadlineTemplate: (t, c) => `${t} • Campus Blitz Challenge • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 7. Finance / Quantitative Analytics / Trading
  finance: [
    {
      theme: 'High-Frequency Algorithmic Sandbox',
      visualDirection:
        'Multi-panel financial telemetry displays showing order book depth charts, stochastic oscillator graphs, and candlestick price action.',
      composition: 'Asymmetrical command-center multi-screen layout.',
      accent: 'violet',
      elements: ['Tick order depth', 'Candlestick plots', 'Stochastic alpha curves', 'Low-latency execution ticker'],
      headline: 'Decode Signals. Backtest Alpha.',
      subheadlineTemplate: (t, c) => `${t} • Quantitative Challenge • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Venture Portfolio & Quantitative Strategy',
      visualDirection:
        'Executive analytics boardroom with interactive heatmaps, alpha risk frontiers, and team pitch terminals.',
      composition: 'Modern glass boardroom with illuminated financial projection walls.',
      accent: 'emerald',
      elements: ['Risk frontier curves', 'Multi-asset heatmaps', 'Portfolio weights', 'Executive projection walls'],
      headline: 'Quantify Risk. Maximize Yield.',
      subheadlineTemplate: (t, c) => `${t} • Portfolio Analytics Sprint • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Campus Market Sandbox Simulation',
      visualDirection:
        'Dynamic trading floor atmosphere with ticker tapes, real-time bid-ask spreads, and buzzing student portfolio desks.',
      composition: 'Floor-level perspective with fast-moving ticker curves.',
      accent: 'amber',
      elements: ['Bid-ask spread indicators', 'Fast-moving ticker tape', 'Live portfolio leaderboard', 'Trading war room desks'],
      headline: 'Trade the Simulation. Prove Your Instincts.',
      subheadlineTemplate: (t, c) => `${t} • Financial Trading Floor • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 8. Makerspace / 3D Prototyping / Hardware
  makers: [
    {
      theme: 'Precision Rapid Prototyping Studio',
      visualDirection:
        'Industrial makerspace with active FDM 3D printers, glowing tool heads laying down layers, and parametric CAD wireframes on screens.',
      composition: 'Detailed macro view of tool head extruding prototype next to calibrated calipers.',
      accent: 'cyan',
      elements: ['Active 3D print nozzle', 'Parametric wireframes', 'Digital calipers', 'Layer slice preview'],
      headline: 'Learn Hands-On. Model and Fabricate.',
      subheadlineTemplate: (t, c) => `${t} • Rapid Prototyping Sprint • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Hardware Engineering & Combat Robotics Arena',
      visualDirection:
        'Robotics arena pit with polycarbonate shields, spinning weapon test rigs, telemetry diagnostics, and safety goggles.',
      composition: 'Action-ready pit table view with heavy chassis and diagnostic screens.',
      accent: 'rose',
      elements: ['Combat bot chassis', 'Telemetry diagnostics', 'Polycarbonate cage', 'Torque testing meters'],
      headline: 'Fabricate Armor. Engineer Power.',
      subheadlineTemplate: (t, c) => `${t} • Combat Robotics Arena • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Physical Product Craft & Industrial Design',
      visualDirection:
        'Design studio filled with ergonomic prototype models, material swatches, parametric curves, and design review boards.',
      composition: 'Overhead studio workbench with iterative physical models from sketch to finished part.',
      accent: 'amber',
      elements: ['Ergonomic physical mockups', 'Fusion 360 schematics', 'PLA/PETG material spools', 'Design review board'],
      headline: 'From Sketch to Solid Form.',
      subheadlineTemplate: (t, c) => `${t} • Design & Makers Guild • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    },
  ],

  // 9. Debate / Model UN / Parliamentary Oratory
  debate: [
    {
      theme: 'Parliamentary Oratory & Debate Chamber',
      visualDirection:
        'Formal amphitheater chamber with polished wood podiums, microphone rigs, and respectful assembly seating under warm architectural lighting.',
      composition: 'Center podium perspective looking out across tiered delegate benches.',
      accent: 'indigo',
      elements: ['Podium microphone array', 'Tiered parliamentary seating', 'Timekeeper gavel', 'Oratory acoustic hall'],
      headline: 'Argue with Conviction. Persuade the House.',
      subheadlineTemplate: (t, c) => `${t} • Parliamentary Debate Open • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    },
    {
      theme: 'Global Diplomacy & Model UN Assembly',
      visualDirection:
        'Summit hall with international placard arrays, formal briefing folders, and projection screens showing committee resolutions.',
      composition: 'Wide-angle conference perspective with dramatic directional ceiling lighting.',
      accent: 'cyan',
      elements: ['Country placard arrays', 'Draft resolution screens', 'Executive dais', 'Formal diplomatic hall'],
      headline: 'Diplomacy, Strategy & Global Resolutions.',
      subheadlineTemplate: (t, c) => `${t} • Model United Nations • ${c}`,
      bannerUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    },
  ],
};

/**
 * Fallback concepts when specific keywords are not matched
 */
const GENERAL_CONCEPTS: BannerConceptVariation[] = [
  {
    theme: 'Campus Leadership & Collaborative Summit',
    visualDirection:
      'Contemporary collegiate forum with student leaders engaged in collaborative strategic planning under expansive skylights.',
    composition: 'Wide-angle airy campus atrium composition with structured collaborative clusters.',
    accent: 'indigo',
    elements: ['Collegiate atrium skylights', 'Leadership agenda displays', 'Team breakout pods', 'Campus operational hub'],
    headline: 'Experience Campus Excellence.',
    subheadlineTemplate: (t, c) => `${t} • Organized by ${c}`,
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  {
    theme: 'Dynamic Student Engagement Showcase',
    visualDirection:
      'Energetic campus courtyard featuring presentation showcases, interactive attendee stations, and vibrant student participation.',
    composition: 'Vibrant courtyard perspective with interactive presentation pavilions.',
    accent: 'emerald',
    elements: ['Interactive attendee pavilions', 'Presentation screens', 'Courtyard student crowd', 'Live event branding'],
    headline: 'Engage, Connect & Experience.',
    subheadlineTemplate: (t, c) => `${t} • Campus Feature Event • ${c}`,
    bannerUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  },
  {
    theme: 'Flagship Campus Operations Arena',
    visualDirection:
      'High-impact auditorium layout with theatrical lighting, large-format visual stage backdrops, and organized attendee seating.',
    composition: 'Direct frontal perspective of illuminated stage and wide audience tier.',
    accent: 'amber',
    elements: ['Theatrical stage lighting', 'Large-format backdrop graphics', 'Audience tiering', 'Event command center'],
    headline: 'Built for Scale. Driven by Students.',
    subheadlineTemplate: (t, c) => `${t} • Council Flagship • ${c}`,
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
];

/**
 * Event-Specific AI Banner Generator:
 * Driven primarily by the COMPLETE event identity (title, description, club, venue, tags, purpose).
 * Category is only ONE secondary contextual input.
 * Deterministic generation strategy based on COMPLETE EVENT CONTEXT + GENERATION NUMBER.
 */
export function generateEventBanner(input: EventBannerInput): EventBannerConfig {
  const genNum = Math.max(1, input.generationNumber || 1);

  // Pool all contextual textual clues
  const textPool = [
    input.title || '',
    input.description || '',
    (input.tags || []).join(' '),
    input.clubName || '',
    input.venue || '',
    input.audience || '',
    input.purpose || '',
    input.headline || '',
    input.participantMessage || '',
    input.volunteerMessage || '',
  ]
    .join(' ')
    .toLowerCase();

  // Detect primary topic by semantic context
  let matchedTopicKey: string | null = null;

  if (
    textPool.includes('ai') ||
    textPool.includes('neural') ||
    textPool.includes('machine learning') ||
    textPool.includes('deep learning') ||
    textPool.includes('robot') ||
    textPool.includes('agent') ||
    textPool.includes('vision') ||
    textPool.includes('llm') ||
    textPool.includes('intelligence')
  ) {
    matchedTopicKey = 'ai';
  } else if (
    textPool.includes('coding') ||
    textPool.includes('sprint') ||
    textPool.includes('algorithm') ||
    textPool.includes('programming') ||
    textPool.includes('hackathon') ||
    textPool.includes('developer') ||
    textPool.includes('fullstack') ||
    textPool.includes('web3') ||
    textPool.includes('code')
  ) {
    matchedTopicKey = 'coding';
  } else if (
    textPool.includes('dance') ||
    textPool.includes('choreography') ||
    textPool.includes('hip-hop') ||
    textPool.includes('classical') ||
    textPool.includes('natya') ||
    textPool.includes('battle')
  ) {
    matchedTopicKey = 'dance';
  } else if (
    textPool.includes('music') ||
    textPool.includes('acoustic') ||
    textPool.includes('unplugged') ||
    textPool.includes('concert') ||
    textPool.includes('band') ||
    textPool.includes('singer') ||
    textPool.includes('orchestra') ||
    textPool.includes('jam')
  ) {
    matchedTopicKey = 'music';
  } else if (
    textPool.includes('futsal') ||
    textPool.includes('football') ||
    textPool.includes('soccer') ||
    textPool.includes('turf') ||
    textPool.includes('match')
  ) {
    matchedTopicKey = 'sports';
  } else if (
    textPool.includes('chess') ||
    textPool.includes('blitz') ||
    textPool.includes('board') ||
    textPool.includes('fide')
  ) {
    matchedTopicKey = 'chess';
  } else if (
    textPool.includes('quant') ||
    textPool.includes('trading') ||
    textPool.includes('finance') ||
    textPool.includes('market') ||
    textPool.includes('stock')
  ) {
    matchedTopicKey = 'finance';
  } else if (
    textPool.includes('3d') ||
    textPool.includes('cad') ||
    textPool.includes('prototyping') ||
    textPool.includes('maker') ||
    textPool.includes('hardware') ||
    textPool.includes('fabrication')
  ) {
    matchedTopicKey = 'makers';
  } else if (
    textPool.includes('debate') ||
    textPool.includes('mun') ||
    textPool.includes('parliamentary') ||
    textPool.includes('oratory')
  ) {
    matchedTopicKey = 'debate';
  }

  // Retrieve candidate variation pool
  const candidatePool = matchedTopicKey ? TOPIC_CONCEPTS[matchedTopicKey] : GENERAL_CONCEPTS;

  // Variation selection based on deterministic generation number
  const variationIndex = (genNum - 1) % candidatePool.length;
  const variation = candidatePool[variationIndex];

  const clubLabel = input.clubName || 'Student Council';
  const subheadline = variation.subheadlineTemplate(input.title, clubLabel);

  return {
    headline: variation.headline,
    subheadline,
    theme: variation.theme,
    visualDirection: variation.visualDirection,
    composition: variation.composition,
    accent: variation.accent,
    elements: variation.elements,
    categoryInfluence: `Secondary (${input.category} Context)`,
    generationNumber: genNum,
    generatedAt: new Date().toISOString(),
    bannerUrl: variation.bannerUrl,
  };
}
