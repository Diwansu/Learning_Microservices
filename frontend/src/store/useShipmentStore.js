import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const useShipmentStore = create((set, get) => ({
  shipments: [],
  analytics: null,
  loading: false,
  error: '',
  success: '',

  setError: (msg) => set({ error: msg }),
  setSuccess: (msg) => set({ success: msg }),
  clearStatus: () => set({ error: '', success: '' }),

  fetchShipments: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE_URL}/shipments`);
      set({ shipments: res.data, error: '' });
    } catch (err) {
      set({ error: 'Failed to fetch shipments. Make sure the Express server is running.' });
    } finally {
      set({ loading: false });
    }
  },

  fetchAnalytics: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/analytics`);
      set({ analytics: res.data });
    } catch (err) {
      console.log('Failed to fetch analytics (likely unauthorized for Operator):', err.message);
    }
  },

  addShipment: async (shipmentData) => {
    set({ loading: true, error: '', success: '' });
    try {
      const res = await axios.post(`${API_BASE_URL}/shipments`, shipmentData);
      set((state) => ({
        shipments: [res.data, ...state.shipments],
        success: `Shipment ${res.data.shipmentNumber} created successfully!`
      }));
      // Automatically refresh analytics
      get().fetchAnalytics();
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create shipment.';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    } finally {
      set({ loading: false });
    }
  },

  triggerDisruption: async (shipmentId, triggerReason, authHeaders) => {
    set({ error: '', success: '' });
    try {
      const res = await axios.post(
        `${API_BASE_URL}/shipments/disrupt`,
        { shipmentId, triggerReason },
        authHeaders
      );
      
      // Update local state directly so we don't have to trigger an extra GET request
      const updatedShipments = get().shipments.map((s) =>
        s._id === shipmentId ? { ...s, status: res.data.shipmentStatus } : s
      );
      
      set({
        shipments: updatedShipments,
        success: 'Multi-agent analysis completed successfully!'
      });
      // Automatically refresh analytics
      get().fetchAnalytics();
      return res.data.disruption;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Analysis failed. Make sure FastAPI and Express are running.';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  deleteShipment: async (shipmentId) => {
    set({ loading: true, error: '', success: '' });
    try {
      await axios.delete(`${API_BASE_URL}/shipments/${shipmentId}`);
      set((state) => ({
        shipments: state.shipments.filter((s) => s._id !== shipmentId),
        success: 'Shipment manifest deleted successfully.'
      }));
      // Automatically refresh analytics
      get().fetchAnalytics();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete shipment.';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    } finally {
      set({ loading: false });
    }
  }
}));
