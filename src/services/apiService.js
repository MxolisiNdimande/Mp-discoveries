// src/services/apiService.js
const API_BASE = '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper to handle API responses
const handleResponse = async (response) => {
  const text = await response.text();
  
  if (!response.ok) {
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: text
    });
    
    let errorMessage = 'Request failed';
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = text || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('Invalid response from server');
  }
};

export const apiService = {
  // Auth
  async login(credentials) {
    console.log('Attempting login with:', { email: credentials.email });
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (err) {
      console.error('Network error while attempting to login:', err);
      throw new Error('Network error: Unable to reach authentication server. Please ensure the backend is running.');
    }
  },

  async getProfile() {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return handleResponse(response);
  },

  // Animal Sightings
  async getAnimalSightings() {
    const response = await fetch(`${API_BASE}/animal-sightings`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return handleResponse(response);
  },

  async createAnimalSighting(sightingData) {
    const response = await fetch(`${API_BASE}/animal-sightings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(sightingData),
    });
    return handleResponse(response);
  },

  async updateAnimalSighting(id, sightingData) {
    const response = await fetch(`${API_BASE}/animal-sightings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(sightingData),
    });
    return handleResponse(response);
  },

  async deleteAnimalSighting(id) {
    const response = await fetch(`${API_BASE}/animal-sightings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });
    return handleResponse(response);
  },

  // Public routes
  async getRecentAnimalSightings(limit = 10) {
    const response = await fetch(`${API_BASE}/animal-sightings/recent?limit=${limit}`);
    return handleResponse(response);
  },

  async getAnimalSighting(id) {
    const response = await fetch(`${API_BASE}/animal-sightings/${id}`);
    return handleResponse(response);
  },

  // Health check
  async health() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return handleResponse(response);
    } catch (err) {
      console.error('Health check failed:', err);
      throw new Error('Network error: Unable to reach backend health endpoint.');
    }
  },

  // Destinations
  async getDestinations() {
    const response = await fetch(`${API_BASE}/destinations`);
    return handleResponse(response);
  },

  // Accommodations
  async getAccommodations() {
    const response = await fetch(`${API_BASE}/accommodations`);
    return handleResponse(response);
  },
  // Analytics / Interactions
  async recordInteraction(interaction) {
    const response = await fetch(`${API_BASE}/analytics/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interaction)
    });
    return handleResponse(response);
  }
};