import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, CreditCard, LogOut, Building } from 'lucide-react';

export function Layout({ children }) {
  const navigate = useNavigate();
  
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const rolUsuario = userData.rol;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <Building className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold">Consorcio Up</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* BOTÓN HOME */}
          <button 
            onClick={() => navigate('/portal')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 rounded-lg text-white font-medium transition"
          >
            <LayoutDashboard className="w-5 h-5" />
            Panel Principal
          </button>

          {/* MENÚ EXCLUSIVO DEL ADMINISTRADOR */}
          {rolUsuario === 'administrador' && (
            <>
              <button 
                onClick={() => navigate('/portal/consorcios')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition"
              >
                <Users className="w-5 h-5" />
                Consorcios y UFs
              </button>
              <button 
                onClick={() => navigate('/portal/liquidaciones')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition">
                <FileText className="w-5 h-5" />
                Liquidaciones
              </button>
              
              {/* --- ACÁ ESTABA EL PROBLEMA: AHORA SÍ NAVEGA A COBRANZAS --- */}
              <button 
                onClick={() => navigate('/portal/cobranzas')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition">
                <CreditCard className="w-5 h-5" />
                Cobranzas
              </button>
            </>
          )}

          {/* MENÚ EXCLUSIVO DEL PROPIETARIO */}
          {rolUsuario === 'propietario' && (
            <>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition">
                <CreditCard className="w-5 h-5" />
                Mis Expensas
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg text-slate-300 font-medium transition">
                <FileText className="w-5 h-5" />
                Mis Recibos
              </button>
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
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
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