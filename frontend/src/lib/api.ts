const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface CreateEventPayload {
  title: string;
  headline?: string | null;
  description?: string | null;
  banner_url?: string | null;
  event_type?: string | null;
  venue?: string | null;
  start_datetime: string;
  end_datetime: string;
  registration_deadline?: string | null;
  capacity?: number | null;
  status: string;
  club_id: number;
  created_by?: number | null;
}

export interface EventResponse extends CreateEventPayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export async function createEvent(
  payload: CreateEventPayload
): Promise<EventResponse> {
  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to create event';

    try {
      const errorData = await response.json();
      message =
        typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail || errorData);
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getEvents(): Promise<EventResponse[]> {
  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

const data = await response.json();

console.log('RAW API RESPONSE:', data);

return Array.isArray(data) ? data : data.value ?? [];
}

export interface EventCommunicationPayload {
  title: string;
  description: string;
  club_name?: string | null;
  category?: string | null;
  date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  venue?: string | null;
  capacity?: number | null;
  tags?: string[] | null;
  intended_audience?: string | null;
  purpose?: string | null;
}

export interface EventCommunicationAIResponse {
  headline: string;
  participant_announcement: string;
  volunteer_announcement: string;
  promotional_copy: string;
}

export async function generateEventCommunicationAI(
  payload: EventCommunicationPayload
): Promise<EventCommunicationAIResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/event-communication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to generate event communication';

    try {
      const errorData = await response.json();
      message =
        typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail || errorData);
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  return response.json();
}