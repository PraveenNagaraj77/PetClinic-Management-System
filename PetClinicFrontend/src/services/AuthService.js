import api from './api';

const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => {
    const payload = { ...userData, username: userData.name };
    return api.post('/auth/register', payload);
  },
};

export default AuthService;