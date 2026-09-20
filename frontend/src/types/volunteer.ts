export type VolunteerAssignmentStatus = 'Confirmed' | 'Reporting Soon' | 'Standby' | 'Completed';

export type VolunteerShiftStatus = 'Checked In' | 'Pending Check-in' | 'Excused';

export type TaskPriority = 'urgent' | 'upcoming' | 'completed';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export type NoticeType = 'time_change' | 'venue_update' | 'task_alert' | 'coordinator_message';

export type NoticePriority = 'urgent' | 'notice' | 'info';

export type OperationalStatus = 'On track' | 'Needs attention' | 'Delayed' | 'Ready';

export interface VolunteerAssignment {
  id: string;
  eventId: string;
  eventName: string;
  role: string;
  team: string;
  date: string;
  time: string;
  venue: string;
  reportingTime: string;
  status: VolunteerAssignmentStatus;
  leadCoordinator: string;
  instructions: string;
}

export interface VolunteerShift {
  id: string;
  eventId: string;
  eventName: string;
  role: string;
  date: string;
  reportingTime: string;
  shiftHours: string;
  location: string;
  status: VolunteerShiftStatus;
  checkInTime?: string;
  supervisor: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  eventId: string;
  eventName: string;
  dueTime: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  location?: string;
  assignedBy: string;
}

export interface VolunteerNotice {
  id: string;
  title: string;
  message: string;
  type: NoticeType;
  priority: NoticePriority;
  timestamp: string;
  eventId?: string;
  eventName?: string;
  sender: string;
}

export interface VolunteerEventReadiness {
  id: string;
  eventId: string;
  eventName: string;
  club: string;
  date: string;
  venue: string;
  progressPercent: number;
  volunteersCheckedIn: number;
  volunteersTotal: number;
  operationalStatus: OperationalStatus;
  keyContact: string;
}

export interface VolunteerActivity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: 'check_in' | 'task' | 'assignment' | 'notice';
}

export interface VolunteerStat {
  value: string;
  label: string;
  context?: string;
}

export interface VolunteerDashboardData {
  volunteerName: string;
  role: string;
  crew: string;
  campus: string;
  avatarInitials: string;
  stats: VolunteerStat[];
  nextAssignment: VolunteerAssignment;
  assignments: VolunteerAssignment[];
  tasks: VolunteerTask[];
  shifts: VolunteerShift[];
  eventReadiness: VolunteerEventReadiness[];
  notices: VolunteerNotice[];
  recentActivity: VolunteerActivity[];
}
