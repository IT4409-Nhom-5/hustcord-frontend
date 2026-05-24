import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('[API Interceptor] Request URL:', config.url, 'Token found:', token ? (token.substring(0, 15) + '...') : 'none');
  if (token) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[API Interceptor] Authorization Header Set:', config.headers['Authorization']);
    }
  }
  return config;
}, (error) => {
  console.error('[API Interceptor] Request Error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API Interceptor] 401 Unauthorized detected. Logging out...');
      localStorage.removeItem('token');
      
      // Sử dụng dynamic import để tránh vòng lặp phụ thuộc (circular dependency)
      import('../store').then(({ store }) => {
        import('../store/slices/authSlice').then(({ logout }) => {
          store.dispatch(logout());
        });
      }).catch(err => console.error('Failed to dispatch logout:', err));

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
