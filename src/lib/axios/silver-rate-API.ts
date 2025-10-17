import instance from './instance';

/**
 * Silver rate API interface for jewelry e-commerce
 * Handles fetching and updating silver rates, historical data, and price calculations
 */
export const silverRateAPI = {
  /**
   * Fetches the current silver rate
   * @returns Promise with the current silver rate data
   */
  getCurrentRate: async () => {
    return instance.get('/silver-rate/current');
  },

  /**
   * Updates the current silver rate in the system
   * @param rate - The new silver rate per gram
   * @returns Promise with the updated silver rate data
   */
  updateRate: async (rate: number) => {
    return instance.post('/silver-rate/update', { rate });
  },

  /**
   * Gets the historical silver rates for charting
   * @param days - Number of days of history to retrieve (default 30)
   * @returns Promise with historical silver rate data
   */
  getRateHistory: async (days: number = 30) => {
    return instance.get('/silver-rate/history', { params: { days } });
  },

  /**
   * Gets price calculation breakdown for a specific product
   * @param productId - The ID of the product to get pricing for
   * @returns Promise with the price calculation details
   */
  getProductPriceCalculation: async (productId: string) => {
    return instance.get(`/product/${productId}/price-calculation`);
  },
  
  /**
   * Gets the market rate from an external API
   * @returns Promise with the current market silver rate
   */
  getMarketRate: async () => {
    return instance.get('/silver-rate/market');
  }
};
