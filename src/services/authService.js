// Simulates a real-time authentication backend
// In a real app, this would be replaced by Firebase Auth or Supabase calls

const DELAY_MS = 800; // Simulate network latency

class AuthService {
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const user = storedUsers.find(u => u.email === email && u.password === password);

                if (user) {
                    // Create session
                    const sessionUser = { ...user };
                    delete sessionUser.password; // Don't return password
                    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
                    resolve(sessionUser);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, DELAY_MS);
        });
    }

    async signup(name, email, password, role = 'patient', additionalData = {}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

                // Check if user exists
                if (storedUsers.some(u => u.email === email)) {
                    reject(new Error('User already exists with this email'));
                    return;
                }

                const newUser = {
                    id: crypto.randomUUID(),
                    name,
                    email,
                    password, // In real app, never store plain text!
                    role, // 'patient' or 'doctor'
                    avatar: `https://ui-avatars.com/api/?name=${name}&background=${role === 'doctor' ? '05cccc' : 'random'}&color=fff`,
                    joinedAt: new Date().toISOString(),
                    ...additionalData // Store clinic name, etc.
                };

                storedUsers.push(newUser);
                localStorage.setItem('users', JSON.stringify(storedUsers));

                // Auto login after signup
                const sessionUser = { ...newUser };
                delete sessionUser.password;
                localStorage.setItem('currentUser', JSON.stringify(sessionUser));

                resolve(sessionUser);
            }, DELAY_MS);
        });
    }

    async logout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem('currentUser');
                resolve();
            }, 500);
        });
    }

    async updateProfile(updates) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const currentUser = this.getCurrentUser();
                if (!currentUser) {
                    reject(new Error('No user logged in'));
                    return;
                }

                const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = storedUsers.findIndex(u => u.email === currentUser.email);

                if (userIndex !== -1) {
                    const updatedUser = { ...storedUsers[userIndex], ...updates };
                    storedUsers[userIndex] = updatedUser;
                    localStorage.setItem('users', JSON.stringify(storedUsers));

                    // Update session
                    const sessionUser = { ...updatedUser };
                    delete sessionUser.password;
                    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

                    resolve(sessionUser);
                } else {
                    reject(new Error('User not found'));
                }
            }, DELAY_MS);
        });
    }

    getCurrentUser() {
        // Synchronous check for initial load
        try {
            const userStr = localStorage.getItem('currentUser');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Failed to parse user from local storage:', error);
            localStorage.removeItem('currentUser'); // Clear corrupted data
            return null;
        }
    }
}

export const authService = new AuthService();
