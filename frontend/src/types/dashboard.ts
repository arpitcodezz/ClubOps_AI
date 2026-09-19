export type EventStatus = 'On track' | 'Attention' | 'Planning';

export type RiskSeverity = 'healthy' | 'attention' | 'risk';

export interface NextEventData {
  title: string;
  date: string;
  venue: string;
  volunteers: number;
  openTasks: number;
  status: EventStatus;
}

export interface OperationStat {
  value: string;
  label: string;
  context?: string;
}

export interface UpcomingEventItem {
  id: string;
  name: string;
  date: string;
  volunteers: number;
  status: EventStatus;
  category?: string;
}

export interface AiInsightItem {
  id: string;
  indexStr: string;
  title: string;
  description: string;
  tag?: string;
}

export interface RiskItem {
  id: string;
  title: string;
  venueOrContext: string;
  metric?: string;
  severity: RiskSeverity;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
}

export interface PresidentDashboardData {
  presidentName: string;
  role: string;
  campus: string;
  nextEvent: NextEventData;
  stats: OperationStat[];
  upcomingEvents: UpcomingEventItem[];
  aiInsights: AiInsightItem[];
  risks: RiskItem[];
  recentActivity: ActivityItem[];
}
