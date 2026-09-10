const BASE_URL = 'http://localhost:5000/api';

// Helper for making API requests with credentials (cookies)
const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Important for sending/receiving session cookies
  };

  if (options.body) {
    config.body = isFormData ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
};

export default apiCall;
