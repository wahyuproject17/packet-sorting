import { Navigate } from 'react-router-dom';
import React, { ReactNode } from 'react';

// Fungsi untuk mengecek apakah user sudah login
const isAuthenticated = (): boolean =>!!localStorage.getItem('user');

// Tipe untuk props yang diterima oleh ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // Jika belum login, redirect ke halaman sign-in
    return <Navigate to="/sign-in" replace />;
  }

  // Jika sudah login, render children (halaman yang di-protect)
  return <>{children}</>;
};
