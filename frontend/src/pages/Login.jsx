import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Lock, User } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const response = await api.post('core/login/', { 
        usuario: username,
        password: password
      });

      // Extraemos access y el objeto user_data exactamente como lo manda Django
      const { access, refresh, user_data } = response.data;

      // 1. Guardamos los tokens
      if (access) localStorage.setItem('access_token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
  
      // 2. Extraemos el rol DESDE user_data y lo guardamos
      const rolNormalizado = user_data?.rol ? user_data.rol.toLowerCase() : '';
      localStorage.setItem('user_role', rolNormalizado);
      
      // 3. Guardamos el objeto user_data completo (que trae el id y el nombre de Monica)
      localStorage.setItem('user_data', JSON.stringify(user_data));
  
      // 4. Navegamos al portal
      navigate('/portal');
  

      
    } catch (error) {
      // Manejo de errores
      if (error.response && error.response.status === 401) {
        setErrorMsg('Usuario o contraseña incorrectos. Intentá nuevamente.');
      } else {
        setErrorMsg('Error de conexión con el servidor. Revisá si el backend está corriendo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-purple-600 p-3 rounded-full mb-4 shadow-lg shadow-purple-200">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Consorcio Up</h1>
        <p className="text-gray-500 mt-2">Sistema de Gestión Inteligente</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center text-gray-900">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Ingresá tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Usuario o DNI</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Tu usuario" 
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <a href="#" className="text-xs text-purple-600 hover:underline">¿Olvidaste tu clave?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Ingresar al Sistema"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}