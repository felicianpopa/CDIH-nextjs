"use client";

import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[]; // Kept for backwards compatibility, but server handles the validation now
}

/**
 * A simplified RequireAuth component that serves as a wrapper
 * Authentication and Role validation is now handled by middleware at the server level
 * This component is kept for backward compatibility
 */
const RequireAuth = ({ children }: RequireAuthProps) => {
  // We don't need any checks here as the middleware already ensures
  // that only authorized users with correct roles can access the page

  return <>{children}</>;
};

export default RequireAuth;
