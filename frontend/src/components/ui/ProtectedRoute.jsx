import { Navigate } from 'react-router-dom';

// Agregamos allowedRoles como propiedad opcional
export function ProtectedRoute({ children, allowedRoles }) {
  // 1. Buscamos el token y el rol
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  // 2. Seguridad real: Si NO hay token de JWT, lo pateamos al Login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Control de Acceso: Si la ruta exige roles específicos y el usuario no los tiene
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Lo devolvemos a su panel principal (o a una página 403 No Autorizado)
    return <Navigate to="/portal" replace />;
  }

  // 4. Si tiene token y el rol corresponde, lo dejamos pasar
  return children;
}