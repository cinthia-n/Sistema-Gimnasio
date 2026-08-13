import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { getToken } from './storage';

export default function ProtectedRoute({
  children,
}: PropsWithChildren) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}