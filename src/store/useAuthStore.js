import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
    user: authService.getCurrentUser(),
    isAuthenticated: !!authService.getCurrentUser(),
    isLoading: false,
    error: null,

    updateUser: async (updates) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.updateProfile(updates);
            set({ user, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.login(email, password);
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    signup: async (name, email, password, role = 'patient', additionalData = {}) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.signup(name, email, password, role, additionalData);
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        await authService.logout();
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    upgradePlan: (planId) => {
        set((state) => {
            const updatedUser = { ...state.user, plan: planId };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Persist mock update
            return { user: updatedUser };
        });
    },

    clearError: () => set({ error: null })
}));
