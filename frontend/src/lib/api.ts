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

export async function deleteEvent(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/${id}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let message = 'Failed to delete event';

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
}

export async function getEvent(
  id: string | number
): Promise<EventResponse> {
  const response = await fetch(
    `${API_BASE_URL}/events/${id}/`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  return response.json();
}