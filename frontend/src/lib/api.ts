const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

interface CreateGroupData {
  name: string;
  description?: string;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  _count?: {
    members: number;
    prayerItems: number;
  };
}

interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

type PrayerStatus = 'praying' | 'partial_answer' | 'answered';

interface CreatePrayerItemData {
  groupId: string;
  title: string;
  content: string;
  category?: string;
  isAnonymous?: boolean;
}

interface PrayerItem {
  id: string;
  groupId: string;
  title: string;
  content: string;
  category: string | null;
  status: PrayerStatus;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  isAuthor: boolean;
  author: {
    id: string | null;
    name: string;
  };
  group?: {
    id: string;
    name: string;
  };
  hasPrayedToday?: boolean;
  _count: {
    reactions: number;
    comments: number;
    updates?: number;
  };
}

interface PrayerItemsResponse {
  items: PrayerItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PrayerUpdate {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  isAuthor: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<{ user: AuthResponse['user'] }> {
    return this.request<{ user: AuthResponse['user'] }>('/auth/me', {
      method: 'GET',
    });
  }

  // Groups
  async createGroup(data: CreateGroupData): Promise<Group> {
    return this.request<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGroups(): Promise<Group[]> {
    return this.request<Group[]>('/groups', {
      method: 'GET',
    });
  }

  async getGroup(id: string): Promise<Group> {
    return this.request<Group>(`/groups/${id}`, {
      method: 'GET',
    });
  }

  async joinGroup(inviteCode: string): Promise<Group> {
    return this.request<Group>('/groups/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  }

  // Prayer Items
  async createPrayerItem(data: CreatePrayerItemData): Promise<PrayerItem> {
    return this.request<PrayerItem>('/prayer-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPrayerItems(
    groupId: string,
    options?: { status?: PrayerStatus; page?: number; limit?: number }
  ): Promise<PrayerItemsResponse> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const query = params.toString();
    const endpoint = `/prayer-items/group/${groupId}${query ? `?${query}` : ''}`;

    return this.request<PrayerItemsResponse>(endpoint, {
      method: 'GET',
    });
  }

  async getPrayerItem(id: string): Promise<PrayerItem> {
    return this.request<PrayerItem>(`/prayer-items/${id}`, {
      method: 'GET',
    });
  }

  async updatePrayerStatus(id: string, status: PrayerStatus): Promise<PrayerItem> {
    return this.request<PrayerItem>(`/prayer-items/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deletePrayerItem(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/prayer-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Prayer Updates
  async createPrayerUpdate(prayerItemId: string, content: string): Promise<PrayerUpdate> {
    return this.request<PrayerUpdate>(`/prayer-items/${prayerItemId}/updates`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getPrayerUpdates(prayerItemId: string): Promise<PrayerUpdate[]> {
    return this.request<PrayerUpdate[]>(`/prayer-items/${prayerItemId}/updates`, {
      method: 'GET',
    });
  }

  async deletePrayerUpdate(updateId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/prayer-updates/${updateId}`, {
      method: 'DELETE',
    });
  }

  // Prayer Reactions
  async pray(
    prayerItemId: string
  ): Promise<{ message: string; prayCount: number; hasPrayedToday: boolean }> {
    return this.request<{ message: string; prayCount: number; hasPrayedToday: boolean }>(
      `/prayer-items/${prayerItemId}/pray`,
      {
        method: 'POST',
      }
    );
  }

  async getPrayersList(
    prayerItemId: string
  ): Promise<{ id: string; name: string; prayedAt: string }[]> {
    return this.request<{ id: string; name: string; prayedAt: string }[]>(
      `/prayer-items/${prayerItemId}/prayers`,
      {
        method: 'GET',
      }
    );
  }
}

export const api = new ApiClient(API_URL);
export type {
  SignupData,
  LoginData,
  AuthResponse,
  CreateGroupData,
  Group,
  GroupMember,
  PrayerStatus,
  CreatePrayerItemData,
  PrayerItem,
  PrayerItemsResponse,
  PrayerUpdate,
};
