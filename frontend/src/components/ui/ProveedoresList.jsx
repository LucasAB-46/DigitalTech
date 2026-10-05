import { useState, useEffect } from 'react';
import { Briefcase, Mail, Phone, Edit, Trash2, Plus, X, Search, Wrench } from 'lucide-react';
import api from '../../utils/api'; 

export function ProveedoresList() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [provId, setProvId] = useState(null);
  
  // CAMBIADO: 'rubro' por 'tipo_servicio' para que coincida con Django
  const [formData, setFormData] = useState({
    razon_social: '',
    cuit: '',
    tipo_servicio: '',
    telefono: '',
    email: ''
  });

  const fetchProveedores = async () => {
    try {
      const response = await api.get('proveedores/');
      setProveedores(response.data);
    } catch (error) {
      console.error("Error trayendo proveedores:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProvId(null);
    setFormData({ razon_social: '', cuit: '', tipo_servicio: '', telefono: '', email: '' });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (prov) => {
    setModoEdicion(true);
    setProvId(prov.id_proveedor || prov.id);
    setFormData({
      razon_social: prov.razon_social || prov.nombre, 
      cuit: prov.cuit,
      tipo_servicio: prov.tipo_servicio || prov.rubro || '',
      telefono: prov.telefono || '',
      email: prov.email || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await api.put(`proveedores/${provId}/`, formData);
      } else {
        await api.post('proveedores/', formData);
      }
      setIsModalOpen(false);
      fetchProveedores();
    } catch (error) {
      console.error("Error exacto del backend:", error.response?.data);
      alert("Error de Django: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar a este proveedor?")) {
      try {
        await api.delete(`proveedores/${id}/`);
        fetchProveedores();
      } catch (error) {
        alert("No se pudo eliminar.");
      }
    }
  };

  const proveedoresFiltrados = proveedores.filter(p => 
    (p.razon_social || p.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || 
    (p.tipo_servicio || p.rubro || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.cuit || '').includes(busqueda)
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Proveedores</h1>
          <p className="text-gray-500 mt-2">Gestión de profesionales y servicios del consorcio.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre, CUIT o servicio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button 
            onClick={abrirModalCrear}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Nuevo Proveedor
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-gray-500">Cargando proveedores...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Razón Social / Nombre</th>
                <th className="p-4">Tipo de Servicio</th>
                <th className="p-4">CUIT</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {proveedoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No se encontraron proveedores registrados.
                  </td>
                </tr>
              ) : (
                proveedoresFiltrados.map((prov) => (
                  <tr key={prov.id_proveedor || prov.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      {prov.razon_social || prov.nombre}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                        {prov.tipo_servicio || prov.rubro || 'General'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-xs">{prov.cuit}</td>
                    <td className="p-4 space-y-1">
                      {prov.telefono && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Phone className="w-3 h-3 text-gray-400" /> {prov.telefono}
                        </div>
                      )}
                      {prov.email && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Mail className="w-3 h-3 text-gray-400" /> {prov.email}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => abrirModalEditar(prov)} className="text-purple-600 hover:text-purple-800 transition" title="Editar">
                        <Edit className="w-5 h-5 inline" />
                      </button>
                      <button onClick={() => handleDelete(prov.id_proveedor || prov.id)} className="text-red-400 hover:text-red-600 transition" title="Eliminar">
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-600" />
                {modoEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Razón Social o Nombre</label>
                <input type="text" required className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.razon_social} onChange={(e) => setFormData({...formData, razon_social: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CUIT</label>
                  <input type="text" required placeholder="Sin guiones" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={formData.cuit} onChange={(e) => setFormData({...formData, cuit: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Servicio</label>
                  <input type="text" required placeholder="Ej: Plomería" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={formData.tipo_servicio} onChange={(e) => setFormData({...formData, tipo_servicio: e.target.value})} />
                </div>
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
                <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                  {modoEdicion ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}