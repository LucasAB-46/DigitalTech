import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { PortalVecino } from './components/ui/PortalVecino';
import { PortalAdmin } from './components/ui/PortalAdmin';
import { ConsorciosList } from './components/ui/ConsorciosList';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { Layout } from './components/ui/Layout';
import { UFsList } from './components/ui/UFsList';
import { Liquidaciones } from './components/ui/Liquidaciones';
import { LiquidacionDetalle } from './components/ui/LiquidacionDetalle';
import { Cobranzas } from './components/ui/Cobranzas';

// Este componente decide qué Dashboard principal mostrar según el rol
function EnrutadorPortal() {
  const rol = localStorage.getItem('user_role');
  if (rol === 'administrador') {
    return <PortalAdmin />;
  }
  return <PortalVecino />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Panel Principal */}
        <Route path="/portal" element={<ProtectedRoute><Layout><EnrutadorPortal /></Layout></ProtectedRoute>} />

        {/* Consorcios y UFs */}
        <Route path="/portal/consorcios" element={<ProtectedRoute><Layout><ConsorciosList /></Layout></ProtectedRoute>} />
        <Route path="/portal/consorcios/:id/ufs" element={<ProtectedRoute><Layout><UFsList /></Layout></ProtectedRoute>} />
        
        {/* Liquidaciones (Grilla y Detalle) */}
        <Route path="/portal/liquidaciones" element={<ProtectedRoute><Layout><Liquidaciones /></Layout></ProtectedRoute>} />
        <Route path="/portal/liquidaciones/:id" element={<ProtectedRoute><Layout><LiquidacionDetalle /></Layout></ProtectedRoute>} />
        {/* --- RUTA DE COBRANZAS --- */}
        <Route 
          path="/portal/cobranzas" 
          element={<ProtectedRoute><Layout><Cobranzas /></Layout></ProtectedRoute>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;