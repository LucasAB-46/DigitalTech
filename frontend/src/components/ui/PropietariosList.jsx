import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Edit, Trash2, Plus, X, Search, Key } from 'lucide-react';
import api from '../../utils/api'; 

export function PropietariosList() {
  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estados Modal ABM (Crear/Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [propId, setPropId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', dni: '', email: '', telefono: ''
  });

  // Estados para el Modal de Crear Usuario (Acceso)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);

  const fetchPropietarios = async () => {
    try {
      const response = await api.get('core/propietarios/');
      setPropietarios(response.data);
    } catch (error) {
      console.error("Error trayendo propietarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPropietarios();
  }, []);

  const abrirModalCrear = () => {
    setModoEdicion(false); setPropId(null);
    setFormData({ nombre: '', apellido: '', dni: '', email: '', telefono: '' });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (prop) => {
    setModoEdicion(true); setPropId(prop.id_propietario || prop.id);
    setFormData({
      nombre: prop.nombre, apellido: prop.apellido, dni: prop.dni,
      email: prop.email || '', telefono: prop.telefono || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) await api.put(`core/propietarios/${propId}/`, formData);
      else await api.post('core/propietarios/', formData);
      setIsModalOpen(false);
      fetchPropietarios();
    } catch (error) {
      alert("Hubo un error al guardar el propietario.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar a este propietario?")) {
      try {
        await api.delete(`core/propietarios/${id}/`);
        fetchPropietarios();
      } catch (error) {
        alert("No se pudo eliminar.");
      }
    }
  };

  const abrirModalUsuario = (prop) => {
    setPropietarioSeleccionado(prop);
    setCredenciales({ usuario: prop.dni || '', password: '' });
    setIsUserModalOpen(true);
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      await api.post(`core/propietarios/${propietarioSeleccionado.id_propietario || propietarioSeleccionado.id}/crear_acceso/`, credenciales);
      alert(`Acceso generado con éxito para ${propietarioSeleccionado.nombre}.`);
      setIsUserModalOpen(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al generar acceso: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  const propietariosFiltrados = propietarios.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.apellido.toLowerCase().includes(busqueda.toLowerCase()) || p.dni.includes(busqueda)
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Propietarios</h1>
          <p className="text-gray-500 mt-2">Directorio de dueños de unidades funcionales.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" placeholder="Buscar por nombre o DNI..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button 
            onClick={abrirModalCrear}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Nuevo Propietario
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-gray-500">Cargando directorio...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Nombre y Apellido</th>
                <th className="p-4">DNI</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {propietariosFiltrados.map((prop) => (
                <tr key={prop.id_propietario || prop.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      {prop.nombre.charAt(0)}{prop.apellido.charAt(0)}
                    </div>
                    <div className="text-gray-900 font-bold">{prop.nombre} {prop.apellido}</div>
                  </td>
                  <td className="p-4 text-gray-600">{prop.dni}</td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-4 h-4 text-gray-400" /> 
                      {prop.email || <span className="text-gray-300 italic">Sin email</span>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="w-4 h-4 text-gray-400" /> 
                      {prop.telefono || <span className="text-gray-300 italic">Sin teléfono</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    {/* Botón de la llave para dar acceso */}
                    <button onClick={() => abrirModalUsuario(prop)} className="text-amber-500 hover:text-amber-700 transition" title="Dar acceso al portal">
                      <Key className="w-5 h-5 inline" />
                    </button>
                    
                    <button onClick={() => abrirModalEditar(prop)} className="text-purple-600 hover:text-purple-800 transition" title="Editar datos">
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button onClick={() => handleDelete(prop.id_propietario || prop.id)} className="text-red-400 hover:text-red-600 transition" title="Eliminar">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal ABM Propietario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {modoEdicion ? 'Editar Propietario' : 'Nuevo Propietario'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Apellido</label>
                  <input type="text" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">DNI</label>
                <input type="text" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                  {modoEdicion ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Generar Acceso */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-amber-500 p-6 text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Key className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Generar Acceso</h2>
              <p className="text-amber-100 text-sm mt-1">Portal del Vecino para {propietarioSeleccionado?.nombre}</p>
            </div>
            
            <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Usuario de Ingreso</label>
                <input 
                  type="text" required 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50"
                  value={credenciales.usuario} 
                  onChange={(e) => setCredenciales({...credenciales, usuario: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Contraseña Provisoria</label>
                <input 
                  type="text" required 
                  placeholder="Ej: Consorcio2026"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={credenciales.password} 
                  onChange={(e) => setCredenciales({...credenciales, password: e.target.value})} 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition shadow-md shadow-amber-200">
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}