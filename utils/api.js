// utils/api.js
export const apiFetch = async (endpoint, options = {}) => {
  const baseURL = 'https://job.professionalacademyedu.com';
  
  const config = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${baseURL}${endpoint}`, config);
  return await response.json();
};