import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, CheckCircle, X } from 'lucide-react';
import api from '../../utils/api';

export function ConsorciosList() {
  const navigate = useNavigate(); // <-- Agregamos el enrutador
  
  const [consorcios, setConsorcios] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [consorcioId, setConsorcioId] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    cuit_consorcio: '',
    activo: true
  });

  const fetchConsorcios = () => {
    api.get('core/consorcios/')
      .then(respuesta => {
        setConsorcios(respuesta.data);
        setCargando(false);
      })
      .catch(error => console.error("Error trayendo consorcios:", error));
  };

  useEffect(() => {
    fetchConsorcios();
  }, []);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setConsorcioId(null);
    setFormData({ nombre: '', direccion: '', cuit_consorcio: '', activo: true });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (consorcio) => {
    setModoEdicion(true);
    setConsorcioId(consorcio.id_consorcio);
    setFormData({
      nombre: consorcio.nombre,
      direccion: consorcio.direccion,
      cuit_consorcio: consorcio.cuit_consorcio,
      activo: consorcio.activo
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await api.put(`core/consorcios/${consorcioId}/`, formData);
      } else {
        await api.post('core/consorcios/', formData);
      }
      setIsModalOpen(false);
      fetchConsorcios();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el consorcio.");
    }
  };

  if (cargando) {
    return <div className="text-gray-500 font-medium p-8">Cargando consorcios...</div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Mis Consorcios</h1>
          <p className="text-gray-500 mt-2">Listado de edificios bajo tu administración.</p>
        </div>
        <button 
          onClick={abrirModalCrear}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Nuevo Consorcio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consorcios.map(consorcio => (
          <div key={consorcio.id_consorcio} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{consorcio.nombre}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${consorcio.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {consorcio.activo ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {consorcio.direccion}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                CUIT: {consorcio.cuit_consorcio}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
              {/* ¡ACÁ ESTÁ LA SOLUCIÓN! El botón de Ver UFs armado correctamente */}
              <button 
                onClick={() => navigate(`/portal/consorcios/${consorcio.id_consorcio}/ufs`)}
                className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Ver UFs
              </button>
              <button 
                onClick={() => abrirModalEditar(consorcio)}
                className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-700 transition"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {modoEdicion ? 'Editar Consorcio' : 'Agregar Consorcio'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre del Edificio</label>
                <input 
                  type="text" required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Dirección</label>
                <input 
                  type="text" required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CUIT del Consorcio</label>
                <input 
                  type="text" required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.cuit_consorcio}
                  onChange={(e) => setFormData({...formData, cuit_consorcio: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">Consorcio Activo</label>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Guardar Consorcio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}