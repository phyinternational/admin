import axios from 'axios';
import { getAuthToken } from '@/lib/utils/auth';

// In development, use the Vite proxy (/api prefix)
// In production, use the environment variable or default URL
const isDev = import.meta.env.DEV;
const baseURL = isDev ? '/api' : (import.meta.env.VITE_API_URL ?? "http://localhost:5000");


const instance = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
  },
  // Setting withCredentials to true for HttpOnly cookie authentication
  withCredentials: true,
});

// If token already present, set default Authorization header
const existingToken = getAuthToken();
if (existingToken) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

// Add timing information to requests
const timingMap = new WeakMap<object, number>();

// Add a request interceptor for debugging
instance.interceptors.request.use(function (config) {
  // Ensure Authorization header is present from centralized token store
  try {
    const token = getAuthToken();
    if (token) {
      (config as any).headers = (config as any).headers || {};
      (config as any).headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  // If payload is FormData, let the browser/axios set the Content-Type (with boundary)
  if ((config as any).data instanceof FormData) {
    if ((config as any).headers) delete (config as any).headers['Content-Type'];
  } else {
    (config as any).headers = (config as any).headers || {};
    (config as any).headers['Content-Type'] = 'application/json';
  }
  // Store timing against the config object itself
  timingMap.set(config, Date.now());
  
  console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  if (config.params) console.log("Params:", config.params);
  console.groupEnd();
  
  return config;
}, function (error) {
  console.error("❌ Request setup error:", error);
  return Promise.reject(error);
});

// Add a response interceptor for debugging
instance.interceptors.response.use(function (response) {
  const startTime = timingMap.get(response.config);
  const duration = startTime ? Date.now() - startTime : -1;
  timingMap.delete(response.config);
  
  // Calculate response size
  const responseSize = JSON.stringify(response.data).length;
  const sizeMB = (responseSize / (1024 * 1024)).toFixed(2);
  
  console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
  console.log(`Status: ${response.status} (${response.statusText})`);
  console.log(`Time: ${duration}ms`);
  console.log(`Size: ${sizeMB}MB`);
  console.log("Data:", response.data);
  console.groupEnd();
  
  return response;
}, function (error) {
  const startTime = error.config ? timingMap.get(error.config) : null;
  const duration = startTime ? Date.now() - startTime : -1;
  if (error.config) timingMap.delete(error.config);
  
  console.group(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
  console.log(`Time: ${duration}ms`);
  
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
    console.log("Headers:", error.response.headers);
  } else if (error.request) {
    console.log("No response received");
    console.log("Request:", error.request);
  } else {
    console.log("Error:", error.message);
  }
  
  console.groupEnd();
  
  return Promise.reject(error);
});

export default instance;
