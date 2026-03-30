const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Ideas
  getIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getMyIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/mine`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getTrendingIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/trending`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getArchivedIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/archived`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getMyArchivedIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/archived/mine`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getIdea: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  createIdea: async (ideaData: any) => {
    const res = await fetch(`${API_URL}/ideas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ideaData),
    });
    return handleResponse(res);
  },
  updateIdea: async (id: string, ideaData: any) => {
    const res = await fetch(`${API_URL}/ideas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(ideaData),
    });
    return handleResponse(res);
  },
  deleteIdea: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  toggleVisibility: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}/visibility`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  upvoteIdea: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
