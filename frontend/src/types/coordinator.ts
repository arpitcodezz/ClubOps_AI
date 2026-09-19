export type OperationalStatus = 'On track' | 'Needs attention' | 'Delayed' | 'Ready';

export type TaskPriority = 'urgent' | 'upcoming' | 'completed';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export type VolunteerRecruitmentStatus = 'Full' | 'Recruiting' | 'Critical';

export type RiskSeverity = 'risk' | 'attention' | 'healthy';

export interface CoordinatorNextEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  preparationStatus: string;
  progressPercent: number;
  volunteersNeeded: number;
  volunteersAssigned: number;
  openTasks: number;
}

export interface CoordinatorStat {
  value: string;
  label: string;
  context?: string;
}

export interface EventOperation {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  preparationProgress: number;
  taskStatus: {
    open: number;
    completed: number;
    total: number;
  };
  volunteerStatus: {
    assigned: number;
    needed: number;
  };
  operationalStatus: OperationalStatus;
}

export interface OperationalTask {
  id: string;
  title: string;
  eventId: string;
  eventName: string;
  owner: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface VolunteerCoordinationItem {
  id: string;
  eventId: string;
  eventName: string;
  needed: number;
  assigned: number;
  remaining: number;
  status: VolunteerRecruitmentStatus;
  leadContact: string;
}

export interface OperationalRisk {
  id: string;
  title: string;
  context: string;
  metric?: string;
  severity: RiskSeverity;
  type: 'venue' | 'volunteers' | 'task' | 'deadline';
}

export interface CoordinatorActivity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: 'task' | 'volunteer' | 'event' | 'venue';
}

export interface CoordinatorDashboardData {
  coordinatorName: string;
  role: string;
  campus: string;
  nextEvent: CoordinatorNextEvent;
  stats: CoordinatorStat[];
  eventOperations: EventOperation[];
  tasks: OperationalTask[];
  volunteers: VolunteerCoordinationItem[];
  risks: OperationalRisk[];
  recentActivity: CoordinatorActivity[];
}
