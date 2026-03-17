const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Ideas
  getIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  getMyIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/mine`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  getTrendingIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/trending`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  getArchivedIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/archived`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  getMyArchivedIdeas: async () => {
    const res = await fetch(`${API_URL}/ideas/archived/mine`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  getIdea: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  createIdea: async (ideaData: any) => {
    const res = await fetch(`${API_URL}/ideas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ideaData),
    });
    return res.json();
  },
  updateIdea: async (id: string, ideaData: any) => {
    const res = await fetch(`${API_URL}/ideas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(ideaData),
    });
    return res.json();
  },
  deleteIdea: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
  toggleVisibility: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}/visibility`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return res.json();
  },
  upvoteIdea: async (id: string) => {
    const res = await fetch(`${API_URL}/ideas/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },
};
