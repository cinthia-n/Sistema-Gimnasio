import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function AdminRoute({
  children,
}: PropsWithChildren) {

  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}