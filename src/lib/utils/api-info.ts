import instance from '../axios/instance';
import { toast } from 'sonner';

/**
 * Displays detailed API configuration information and tests connection
 */
export const showApiInfo = async () => {
  // Show basic configuration
  const apiConfig = {
    baseURL: instance.defaults.baseURL,
    timeout: instance.defaults.timeout,
    withCredentials: instance.defaults.withCredentials,
    headers: instance.defaults.headers,
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    apiUrl: import.meta.env.VITE_API_URL,
  };
  
  // Create a readable message for the user
  const infoMsg = `API Configuration:
- Environment: ${apiConfig.mode}
- Base URL: ${apiConfig.baseURL}
- Credentials: ${apiConfig.withCredentials ? 'Included' : 'Not included'}`;

  toast.info(infoMsg, {
    duration: 10000,
  });

  // Test the connection
  try {
    toast.loading("Testing API connection...");
    const testStart = Date.now();
    const response = await instance.get('/product/category/all');
    const duration = Date.now() - testStart;
    
    toast.success(`API responded in ${duration}ms with status ${response.status}`, {
      duration: 5000,
    });
    
    return {
      success: true,
      response
    };
  } catch (error: any) {
    console.error("API connection test failed:", error);
    
    if (error.response) {
      toast.error(`API responded with error ${error.response.status}: ${error.response.statusText}`, {
        duration: 8000,
      });
    } else if (error.request) {
      toast.error(`Network error: No response received. CORS issue likely.`, {
        duration: 8000,
      });
    } else {
      toast.error(`Request error: ${error.message}`, {
        duration: 8000,
      });
    }
    
    return {
      success: false,
      error
    };
  }
};
