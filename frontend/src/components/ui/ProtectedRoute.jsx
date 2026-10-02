import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  // Buscamos si existe el rol del usuario guardado en el navegador
  const userRole = localStorage.getItem('user_role');

  // Si no hay rol, significa que no inició sesión. Lo mandamos al Login.
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // Si hay rol, lo dejamos pasar a la página que pidió (children)
  return children;
}