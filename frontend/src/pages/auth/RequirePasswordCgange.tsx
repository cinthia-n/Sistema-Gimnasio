import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function RequirePasswordChange({
  children,
}: PropsWithChildren) {
  const { user } = useAuth();

  if (
    user &&
    user.mustChangePassword
  ) {
    return (
      <Navigate
        to="/cambiar-contrasena"
        replace
      />
    );
  }

  return <>{children}</>;
}