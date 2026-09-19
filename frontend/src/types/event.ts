export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Competition';

export type RegistrationStatus =
  | 'Open'
  | 'Filling Fast'
  | 'Waitlist'
  | 'Closed';

export interface EventBannerConfig {
  headline: string;
  subheadline: string;
  theme: string;
  visualDirection: string;
  composition: string;
  accent: 'emerald' | 'indigo' | 'amber' | 'rose' | 'cyan' | 'violet';
  elements: string[];
  categoryInfluence: string;
  generationNumber: number;
  generatedAt: string;
  bannerUrl: string;
}

export interface Event {
  id: string;
  title: string;
  clubName: string;
  clubLogo?: string;
  category: EventCategory;
  date: string;
  rawDate?: string;
  time: string;
  venue: string;
  bannerUrl: string;
  registrationStatus: RegistrationStatus;
  description: string;
  shortDescription: string;
  fee?: string;
  teamSize?: string;
  prizes?: string;
  tags?: string[];
  // Extended fields for President-created events and AI communications
  headline?: string;
  participantMessage?: string;
  volunteerMessage?: string;
  capacity?: number;
  createdAt?: string;
  published?: boolean;
  startTime?: string;
  endTime?: string;
  volunteersNeeded?: number;
  openTasksCount?: number;
  bannerConfig?: EventBannerConfig;
}

