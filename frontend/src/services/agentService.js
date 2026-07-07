import api from './api';

export const agentService = {
  analyzeResume: async (resumeText) => {
    const response = await api.post('/agent/tools/resume-analysis', { resumeText });
    return response.data;
  },

  analyzeJD: async (jobDescriptionText) => {
    const response = await api.post('/agent/tools/jd-analysis', { jobDescriptionText });
    return response.data;
  },

  analyzeSkillGap: async (resumeSkills, jdSkills) => {
    const response = await api.post('/agent/tools/skill-gap-analysis', { resumeSkills, jdSkills });
    return response.data;
  },

  generateQuestion: async (targetSkill, difficultyLevel = 'Medium') => {
    const response = await api.post('/agent/tools/generate-question', { targetSkill, difficultyLevel });
    return response.data;
  },

  evaluateAnswer: async (question, candidateAnswer, expectedKeyPoints) => {
    const response = await api.post('/agent/tools/evaluate-answer', { question, candidateAnswer, expectedKeyPoints });
    return response.data;
  },

  finalPerformanceAnalysis: async (sessionScores) => {
    const response = await api.post('/agent/tools/final-performance-analysis', { sessionScores });
    return response.data;
  }
};
