import { create } from 'zustand';
import axios from 'axios';

// const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";
const API_URL = "http://localhost:5000";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async(email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/sign-up`, {username, email, password});
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch(error) {
      set({ error: error.response.data.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // 存储token到localStorage
      localStorage.setItem('authToken', response.data.token);
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

  logout: async () => {
		set({ isLoading: true, error: null });
		try {
			// 删除前端的token
      localStorage.removeItem('authToken');

			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    const token = localStorage.getItem('authToken');
    if(!token) {
      set({ isCheckingAuth: false, isAuthenticated: false });
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch(error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

}))