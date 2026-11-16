import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, FullScreenLoader } from '@/components/ProtectedRoute';
import AuthLayout from '@/components/AuthLayout';
import AppLayout from '@/components/AppLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ResetPassword from '@/pages/ResetPassword';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import StyleDna from '@/pages/StyleDna';
import HairStudio from '@/pages/HairStudio';
import OutfitCreator from '@/pages/OutfitCreator';
import CarePlanner from '@/pages/CarePlanner';
import Challenge from '@/pages/Challenge';
import Assistant from '@/pages/Assistant';
import Favorites from '@/pages/Favorites';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Onboarding: signed in only, standalone layout */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* App pages: signed in, sidebar layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/style-dna" element={<StyleDna />} />
            <Route path="/hair-studio" element={<HairStudio />} />
            <Route path="/outfit-creator" element={<OutfitCreator />} />
            <Route path="/care-planner" element={<CarePlanner />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
