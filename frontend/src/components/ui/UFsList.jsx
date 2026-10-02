import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User, X } from 'lucide-react';
import axios from 'axios';

export function UFsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ufs, setUfs] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [tiposUnidad, setTiposUnidad] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ufId, setUfId] = useState(null);
  
  const [formData, setFormData] = useState({
    consorcio: id, 
    numero_uf: '',
    tipo_unidad: '',  // Ahora es un ID que viene del backend
    propietario: '',  // Nuevo campo para el dueño
    piso: '',
    departamento: '',
    coeficiente: '' 
  });

  // 1. Traemos las UFs
  const fetchUfs = () => {
    axios.get(`http://127.0.0.1:8000/api/cobranzas/ufs/?consorcio_id=${id}`)
      .then(respuesta => {
        setUfs(respuesta.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error trayendo UFs:", error);
        setCargando(false);
      });
  };

  // 2. Traemos a las personas y los tipos de unidad para los selectores
  const fetchDatosExtra = () => {
    axios.get('http://127.0.0.1:8000/api/core/propietarios/')
      .then(res => setPropietarios(res.data))
      .catch(err => console.error("Error Propietarios:", err));

    axios.get('http://127.0.0.1:8000/api/cobranzas/tipos-unidad/')
      .then(res => setTiposUnidad(res.data))
      .catch(err => console.error("Error Tipos:", err));
  };

  useEffect(() => {
    fetchUfs();
    fetchDatosExtra();
  }, [id]);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setUfId(null);
    setFormData({
      consorcio: id,
      numero_uf: '',
      tipo_unidad: '',
      propietario: '',
      piso: '',
      departamento: '',
      coeficiente: '' 
    });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (uf) => {
    setModoEdicion(true);
    setUfId(uf.id_uf || uf.id);
    setFormData({
      consorcio: id,
      numero_uf: uf.numero_uf,
      tipo_unidad: uf.tipo_unidad || '',
      propietario: uf.propietario || '',
      piso: uf.piso || '',
      departamento: uf.departamento || '',
      coeficiente: uf.coeficiente
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si el select quedó vacío, mandamos null para que Django no se queje
    const dataToSend = { ...formData };
    if (!dataToSend.propietario) dataToSend.propietario = null;
    if (!dataToSend.tipo_unidad) dataToSend.tipo_unidad = null;

    try {
      if (modoEdicion) {
        await axios.put(`http://127.0.0.1:8000/api/cobranzas/ufs/${ufId}/`, dataToSend);
      } else {
        await axios.post('http://127.0.0.1:8000/api/cobranzas/ufs/', dataToSend);
      }
      setIsModalOpen(false);
      fetchUfs();
    } catch (error) {
      console.error("Error exacto de Django:", error.response?.data);
      alert("Hubo un error al guardar. Mirá la consola.");
    }
  };

  // Funciones de ayuda para traducir IDs a nombres en la tabla
  const getPropietarioNombre = (id_prop) => {
    if (!id_prop) return <span className="text-gray-400 italic">Sin dueño</span>;
    const p = propietarios.find(prop => prop.id_propietario === id_prop);
    return p ? `${p.nombre} ${p.apellido}` : 'Desconocido';
  };

  const getTipoUnidadNombre = (id_tipo) => {
    if (!id_tipo) return '-';
    const t = tiposUnidad.find(tipo => tipo.id_tipo_unidad === id_tipo);
    return t ? t.nombre : '-';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/portal/consorcios')}
          className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
          title="Volver a Consorcios"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Unidades Funcionales</h1>
            <p className="text-gray-500 mt-2">Gestionando departamentos del consorcio seleccionado.</p>
          </div>
          <button 
            onClick={abrirModalCrear}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Nueva UF
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-gray-500 font-medium">Cargando unidades funcionales...</div>
      ) : ufs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No hay UFs cargadas</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Este edificio todavía no tiene departamentos ni locales registrados.
          </p>
          <button 
            onClick={abrirModalCrear}
            className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-100 transition"
          >
            Crear la primera UF
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Unidad</th>
                <th className="p-4">Propietario</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Piso/Dpto</th>
                <th className="p-4">Coeficiente</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {ufs.map((uf) => (
                <tr key={uf.id_uf || uf.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    {uf.numero_uf}
                  </td>
                  <td className="p-4 font-medium">
                    {getPropietarioNombre(uf.propietario)}
                  </td>
                  <td className="p-4 uppercase text-xs font-bold text-gray-500 tracking-wider">
                    {getTipoUnidadNombre(uf.tipo_unidad)}
                  </td>
                  <td className="p-4 font-medium">
                    {uf.piso} {uf.departamento}
                  </td>
                  <td className="p-4">
                    {uf.coeficiente}%
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                      HABILITADA
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => abrirModalEditar(uf)}
                      className="text-purple-600 font-medium hover:underline text-xs"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL DE CREACIÓN / EDICIÓN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {modoEdicion ? 'Editar UF' : 'Agregar UF'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* --- NUEVO: SELECTOR DE PROPIETARIO --- */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Propietario / Dueño</label>
                <select 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.propietario}
                  onChange={(e) => setFormData({...formData, propietario: e.target.value})}
                >
                  <option value="">-- Sin dueño asignado --</option>
                  {propietarios.map(prop => (
                    <option key={prop.id_propietario} value={prop.id_propietario}>
                      {prop.nombre} {prop.apellido} (DNI: {prop.dni})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">N° de Unidad</label>
                  <input 
                    type="text" required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.numero_uf}
                    onChange={(e) => setFormData({...formData, numero_uf: e.target.value})}
                  />
                </div>

                {/* --- NUEVO: SELECTOR DE TIPO DE UNIDAD --- */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    value={formData.tipo_unidad}
                    onChange={(e) => setFormData({...formData, tipo_unidad: e.target.value})}
                  >
                    <option value="">-- Seleccionar --</option>
                    {tiposUnidad.map(tipo => (
                      <option key={tipo.id_tipo_unidad} value={tipo.id_tipo_unidad}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Piso</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.piso}
                    onChange={(e) => setFormData({...formData, piso: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Dpto / Letra</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.departamento}
                    onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Coeficiente (%)</label>
                <input 
                  type="number" step="0.01" required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.coeficiente} 
                  onChange={(e) => setFormData({...formData, coeficiente: e.target.value})} 
                />
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
                  {modoEdicion ? 'Guardar Cambios' : 'Guardar UF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}