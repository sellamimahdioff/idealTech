import { api } from './api.js';
import type { Order, OrderItemInput, OrderStatus } from './types.js';

export interface CreateOrderPayload {
  type: 'order' | 'quote';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company?: string;
  customer_country?: string;
  customer_region?: string;
  shipping_address?: string;
  items: OrderItemInput[];
}

export const orderService = {
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post('/orders', payload);
    return data;
  },

  track: async (orderNumber: string, email: string): Promise<Order> => {
    const { data } = await api.get(`/orders/track`, {
      params: { orderNumber, email },
    });
    return data;
  },

  getAll: async (params?: {
    type?: 'order' | 'quote';
    status?: OrderStatus;
  }): Promise<Order[]> => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getOne: async (id: number): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  convertQuoteToOrder: async (id: number): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/convert`);
    return data;
  },

  exportCsv: async (): Promise<void> => {
    const response = await api.get('/orders/export', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commandes-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const invoiceService = {
  generate: async (orderId: number): Promise<{ pdf_url: string }> => {
    const { data } = await api.post(`/invoices/from-order/${orderId}`);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get('/invoices');
    return data;
  },
};