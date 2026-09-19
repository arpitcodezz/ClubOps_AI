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

export interface Event {
  id: string;
  title: string;
  clubName: string;
  clubLogo?: string;
  category: EventCategory;
  date: string;
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
}
