import instance from '../axios/instance';

/**
 * Utility to check if the API server is reachable and responding
 * @returns Promise with API status
 */
export const checkApiStatus = async () => {
  try {
    // Try to reach a health check endpoint or a simple endpoint
    // Using product/category/all as it's likely to exist and return a response
    const response = await instance.get('/product/category/all');
    return {
      reachable: true,
      status: response.status,
      message: 'API is reachable and responding'
    };
  } catch (error: any) {
    // If there's an error response, the API is reachable but returned an error
    if (error.response) {
      return {
        reachable: true,
        status: error.response.status,
        message: `API is reachable but returned status: ${error.response.status}`
      };
    }
    
    // If there's no response, the API might be unreachable
    console.error("API connection error:", error);
    return {
      reachable: false,
      status: null,
      message: error.message || 'API is unreachable'
    };
  }
};
