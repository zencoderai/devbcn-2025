import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const conferenceApi = {
  getConferenceInfo: () => api.get('/conference-info'),
  
  getTalks: () => api.get('/talks/'),
  
  getTalk: (id) => api.get(`/talks/${id}`),
  
  submitTalk: (talkData) => api.post('/talks/', talkData),
};

export default api;