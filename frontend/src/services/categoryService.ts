import { api } from './api.js';
import type { Category } from './types.js';

export const categoryService = {
  getTree: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getFlat: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories?flat=true');
    return data;
  },

  getOne: async (id: number): Promise<Category> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  create: async (payload: {
    name: string;
    slug: string;
    image_url?: string;
    parentId?: number;
  }): Promise<Category> => {
    const { data } = await api.post('/categories', payload);
    return data;
  },

  update: async (
    id: number,
    payload: Partial<{
      name: string;
      slug: string;
      image_url?: string;
      parentId?: number | null;
    }>,
  ): Promise<Category> => {
    const { data } = await api.patch(`/categories/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
