import { PresidentDashboardData } from '../types/dashboard';

export const MOCK_PRESIDENT_DASHBOARD: PresidentDashboardData = {
  presidentName: 'Devansh K.',
  role: 'President, Student Council',
  campus: 'Apex Tech University',
  nextEvent: {
    title: 'TechFest 2026',
    date: '24 OCT',
    venue: 'Main Auditorium',
    volunteers: 32,
    openTasks: 18,
    status: 'On track',
  },
  stats: [
    {
      value: '12',
      label: 'UPCOMING EVENTS',
      context: 'Across 8 registered clubs',
    },
    {
      value: '32',
      label: 'ACTIVE VOLUNTEERS',
      context: 'Deployed across 4 active venues',
    },
    {
      value: '24',
      label: 'OPEN TASKS',
      context: '7 due within next 48 hours',
    },
    {
      value: '03',
      label: 'ITEMS NEEDING ATTENTION',
      context: '1 risk, 2 pending confirmations',
    },
  ],
  upcomingEvents: [
    {
      id: 'ue-1',
      name: 'Hackathon',
      date: '24 OCT',
      volunteers: 32,
      status: 'On track',
      category: 'Technical',
    },
    {
      id: 'ue-2',
      name: 'Cultural Night',
      date: '27 OCT',
      volunteers: 18,
      status: 'Attention',
      category: 'Cultural',
    },
    {
      id: 'ue-3',
      name: 'Football Cup',
      date: '02 NOV',
      volunteers: 41,
      status: 'On track',
      category: 'Sports',
    },
    {
      id: 'ue-4',
      name: 'Workshop Week',
      date: '05 NOV',
      volunteers: 24,
      status: 'Planning',
      category: 'Academic',
    },
  ],
  aiInsights: [
    {
      id: 'ai-1',
      indexStr: '01',
      title: 'Volunteer confirmations',
      description: '4 volunteers haven\'t confirmed their event assignments.',
      tag: 'Staffing',
    },
    {
      id: 'ai-2',
      indexStr: '02',
      title: 'Upcoming deadlines',
      description: '3 important setup tasks are due within the next 24 hours.',
      tag: 'Schedule',
    },
    {
      id: 'ai-3',
      indexStr: '03',
      title: 'Venue capacity',
      description: 'Main Auditorium registration has reached 94% of configured capacity.',
      tag: 'Capacity',
    },
  ],
  risks: [
    {
      id: 'risk-1',
      title: 'Capacity threshold',
      venueOrContext: 'Main Auditorium',
      metric: '94%',
      severity: 'risk',
    },
    {
      id: 'risk-2',
      title: 'Volunteer shortage',
      venueOrContext: '3 event assignments remain unfilled',
      severity: 'attention',
    },
    {
      id: 'risk-3',
      title: 'Critical task',
      venueOrContext: 'Stage setup requires completion today',
      severity: 'risk',
    },
  ],
  recentActivity: [
    {
      id: 'act-1',
      title: 'Volunteer assigned',
      detail: 'Priya assigned to Audio/Visual Crew',
      timestamp: '14m ago',
    },
    {
      id: 'act-2',
      title: 'Task completed',
      detail: 'Registration desk setup completed',
      timestamp: '42m ago',
    },
    {
      id: 'act-3',
      title: 'Announcement published',
      detail: 'TechFest volunteer briefing published',
      timestamp: '2h ago',
    },
  ],
};
