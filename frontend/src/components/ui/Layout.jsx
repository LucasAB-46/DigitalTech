import { useNavigate, NavLink, useLocation } from 'react-router-dom';
// Agregados los íconos UserSquare (Propietarios) y Briefcase (Proveedores)
import { LayoutDashboard, Users, FileText, CreditCard, LogOut, Building, UserSquare, Briefcase } from 'lucide-react';

export function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber en qué ruta estamos
  
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const rolUsuario = userData.rol;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Diccionario actualizado para cambiar el título del Header dinámicamente
  const titulosHeader = {
    '/portal': 'Panel Principal',
    '/portal/consorcios': 'Gestión de Consorcios y UFs',
    '/portal/propietarios': 'Directorio de Propietarios',
    '/portal/proveedores': 'Gestión de Proveedores',
    '/portal/liquidaciones': 'Liquidaciones de Expensas',
    '/portal/cobranzas': 'Control de Cobranzas',
  };
  // Si la ruta exacta no está en el diccionario, mostramos "Dashboard" por defecto
  const tituloActual = titulosHeader[location.pathname] || 'Dashboard';

  // Función auxiliar para darle estilo al menú según si está activo o no
  const linkClasses = ({ isActive }) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
      isActive 
        ? 'bg-purple-600 text-white shadow-md' // Estilo ACTIVO
        : 'hover:bg-slate-800 text-slate-300'  // Estilo INACTIVO
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <Building className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold">Consorcio Up</span>
        </div>
        
        {/* Le agregamos overflow-y-auto por si el menú crece mucho en pantallas chicas */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* BOTÓN HOME */}
          <NavLink to="/portal" end className={linkClasses}>
            <LayoutDashboard className="w-5 h-5" />
            Panel Principal
          </NavLink>

          {/* MENÚ EXCLUSIVO DEL ADMINISTRADOR */}
          {rolUsuario === 'administrador' && (
            <>
              <NavLink to="/portal/consorcios" className={linkClasses}>
                <Users className="w-5 h-5" />
                Consorcios y UFs
              </NavLink>
              
              <NavLink to="/portal/propietarios" className={linkClasses}>
                <UserSquare className="w-5 h-5" />
                Propietarios
              </NavLink>
              
              <NavLink to="/portal/proveedores" className={linkClasses}>
                <Briefcase className="w-5 h-5" />
                Proveedores
              </NavLink>

              <NavLink to="/portal/liquidaciones" className={linkClasses}>
                <FileText className="w-5 h-5" />
                Liquidaciones
              </NavLink>
              
              <NavLink to="/portal/cobranzas" className={linkClasses}>
                <CreditCard className="w-5 h-5" />
                Cobranzas
              </NavLink>
            </>
          )}

          {/* MENÚ EXCLUSIVO DEL PROPIETARIO */}
          {rolUsuario === 'propietario' && (
            <>
              <NavLink to="/portal/mis-expensas" className={linkClasses}>
                <CreditCard className="w-5 h-5" />
                Mis Expensas
              </NavLink>
              
              <NavLink to="/portal/mis-recibos" className={linkClasses}>
                <FileText className="w-5 h-5" />
                Mis Recibos
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-400 rounded-lg font-medium transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">{tituloActual}</h2>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
              {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="font-medium text-gray-700">
              Hola, {userData.nombre || 'Usuario'}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full uppercase font-bold ml-2">
              {userData.rol}
            </span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}