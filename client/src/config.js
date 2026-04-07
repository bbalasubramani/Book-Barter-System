const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = configuredApiBaseUrl
  || (import.meta.env.PROD ? window.location.origin : 'http://localhost:3030');

export { API_BASE_URL };
