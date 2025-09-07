import { mockPriceData } from '../priceData';
import { PriceData } from '../types';

export const getPriceData = (): Promise<PriceData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPriceData);
    }, 500); // Simulate network delay
  });
};
