import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Force HMR Update
import LandingPage from './pages/LandingPage';
import RecoveryDashboard from './pages/RecoveryDashboard';
import TeleDoctorReport from './pages/TeleDoctorReport';
import TeleDoctor from './pages/TeleDoctor';
import WorkoutHUD from './pages/WorkoutHUD';
import ProgressAnalytics from './pages/ProgressAnalytics';
import ExerciseLibrary from './pages/ExerciseLibrary';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import DoctorSignUp from './pages/auth/DoctorSignUp';
import SettingsPage from './pages/SettingsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import { useAuthStore } from './store/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

import TeleDoctorBooking from './pages/TeleDoctorBooking';

// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/doctor-signup" element={<DoctorSignUp />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RecoveryDashboard />} />
          <Route path="/tele-doctor" element={<TeleDoctorBooking />} />
          <Route path="/live-session" element={<TeleDoctor />} />
          <Route path="/tele-doctor-report" element={<TeleDoctorReport />} />
          <Route path="/workout" element={<WorkoutHUD />} />

          <Route path="/library" element={<ExerciseLibrary />} />
          <Route path="/analytics" element={<ProgressAnalytics />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
