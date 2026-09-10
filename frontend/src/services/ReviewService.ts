import { api } from './api.js';
import type { Review } from './types.js';

export const reviewService = {
  getByProduct: async (productId: number): Promise<Review[]> => {
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data;
  },

  getSummary: async (
    productId: number,
  ): Promise<{ average: number; count: number }> => {
    const { data } = await api.get(`/products/${productId}/reviews/summary`);
    return data;
  },

  create: async (
    productId: number,
    payload: {
      author_name: string;
      author_email: string;
      rating: number;
      comment: string;
    },
  ): Promise<Review> => {
    const { data } = await api.post(`/products/${productId}/reviews`, payload);
    return data;
  },

  // ---- Admin ----
  getAllForAdmin: async (): Promise<Review[]> => {
    const { data } = await api.get('/reviews');
    return data;
  },

  approve: async (id: number): Promise<Review> => {
    const { data } = await api.patch(`/reviews/${id}/approve`);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};