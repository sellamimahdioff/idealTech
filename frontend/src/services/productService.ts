import { api } from './api.js';
import type { PaginatedResult, Product ,BrandCount } from './types.js';

export interface ProductQuery {
  categoryId?: number;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export const productService = {
  getAll: async (
    query: ProductQuery = {},
  ): Promise<PaginatedResult<Product>> => {
    const { data } = await api.get('/products', { params: query });
    return data;
  },
getBrands: (): Promise<BrandCount[]> =>
  api.get('/products/brands').then((r) => r.data),
  getOne: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  getRelated: async (id: number): Promise<Product[]> => {
    const { data } = await api.get(`/products/${id}/related`);
    return data;
  },



  create: async (payload: Partial<Product> & { categoryId?: number }) => {
    const { data } = await api.post('/products', payload);
    return data;
  },

  update: async (
    id: number,
    payload: Partial<Product> & { categoryId?: number },
  ) => {
    const { data } = await api.patch(`/products/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  removeImage: async (id: number, imageUrl: string) => {
    const { data } = await api.delete(`/products/${id}/images`, {
      data: { imageUrl },
    });
    return data;
  },

  reorderImages: async (id: number, images: string[]) => {
    const { data } = await api.patch(`/products/${id}/images/reorder`, {
      images,
    });
    return data;
  },

  subscribeStockAlert: async (id: number, email: string) => {
    const { data } = await api.post(`/products/${id}/notify-me`, { email });
    return data;
  },

  exportCsv: async (): Promise<void> => {
    const response = await api.get('/products/export', {
      responseType: 'blob',
    });
    downloadBlob(response.data, `produits-${Date.now()}.csv`);
  },
};

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  uploadImages: async (files: File[]): Promise<{ url: string }[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const { data } = await api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}