import api from './api';

export const historyService = {
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },
  
  saveScore: async (targetSkill, score, feedback) => {
    const response = await api.post('/history', { targetSkill, score, feedback });
    return response.data;
  }
};
