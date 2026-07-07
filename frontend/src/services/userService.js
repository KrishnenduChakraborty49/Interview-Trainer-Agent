import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateResume: async (resumeText) => {
    const response = await api.post('/user/profile', { resumeText });
    return response.data;
  }
};
