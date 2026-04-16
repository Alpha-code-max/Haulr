import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/Layout/ProtectedRoute/ProtectedRoute";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import Onboarding from "./pages/auth/Onboarding/Onboarding";
import VendorDashboard from "./pages/dashboards/Vendor/VendorDashboard";
import HaulerDashboard from "./pages/dashboards/Hauler/HaulerDashboard";
import CustomerDashboard from "./pages/dashboards/Customer/CustomerDashboard";
import { useAuthStore } from "./store/useAuthStore";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage/LandingPage";
import VendorWallet from "./pages/dashboards/Vendor/VendorWallet";
import Profile from "./pages/dashboards/Profile/Profile";

function App() {
  const { checkAuth, isLoading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Attempt to hydrate user profile if token exists on load
    checkAuth();
  }, []);

  if (isLoading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading Haulr securely...</div>;
  }

  // Helper function to determine redirect destination
  const getRedirectDestination = () => {
    if (!isAuthenticated || !user) return "/login";

    // Vendors and haulers need onboarding first
    if ((user.role === "vendor" || user.role === "hauler")) {
      const needsOnboarding = user.kycStatus !== "verified";

      if (needsOnboarding) {
        return "/onboarding";
      }
    }

    // Admin/super_admin users belong in the separate admin app, not the client
    if (user.role === "admin" || user.role === "super_admin") return "/";

    return `/${user.role}`;
  };

  return (
    <ThemeProvider>
      <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={isAuthenticated && user ? <Navigate to={getRedirectDestination()} replace /> : <Login />} />
          <Route path="register" element={isAuthenticated && user ? <Navigate to={getRedirectDestination()} replace /> : <Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="onboarding" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Onboarding />} />

          {/* Protected Dashboards wrapped by Role */}
          <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
            <Route path="vendor" element={<VendorDashboard />} />
            <Route path="vendor/wallet" element={<VendorWallet />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["hauler"]} />}>
            <Route path="hauler" element={<HaulerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="customer" element={<CustomerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["vendor", "hauler", "customer", "admin", "super_admin"]} />}>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
