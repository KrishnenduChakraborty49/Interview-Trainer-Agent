import api from './api';

export const pdfService = {
  parsePdf: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/util/parse-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
