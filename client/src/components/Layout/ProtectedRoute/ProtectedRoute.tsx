import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user tries to access a dashboard they don't own, kick them back to their home
    return <Navigate to={`/${user.role}`} replace />;
  }

  // Check if vendor or hauler needs onboarding
  if (user && (user.role === "vendor" || user.role === "hauler")) {
    const needsOnboarding = user.kycStatus !== "verified";

    if (needsOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
