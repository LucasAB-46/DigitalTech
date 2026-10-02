import { useState, useEffect } from 'react';
import { FileText, Search, PlusCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Liquidaciones() {
  const [consorcios, setConsorcios] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [consorcioSeleccionado, setConsorcioSeleccionado] = useState('');
  const navigate = useNavigate();
  
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    consorcio: '',
    periodo: '',
    tipo_liquidacion: 'ORDINARIA',
    monto_total: 0,
    estado: 'BORRADOR'
  });

  // Al cargar la pantalla, traemos los edificios y los períodos (meses)
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/core/consorcios/')
      .then(res => setConsorcios(res.data))
      .catch(err => console.error("Error consorcios:", err));

    axios.get('http://127.0.0.1:8000/api/core/periodos/')
      .then(res => setPeriodos(res.data))
      .catch(err => console.error("Error periodos:", err));
  }, []);

  // Función para buscar liquidaciones del edificio seleccionado
  const fetchLiquidaciones = () => {
    if (!consorcioSeleccionado) {
      setLiquidaciones([]);
      return;
    }
    
    setCargando(true);
    axios.get(`http://127.0.0.1:8000/api/liquidaciones/cabeceras/?consorcio_id=${consorcioSeleccionado}`)
      .then(res => {
        setLiquidaciones(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error trayendo liquidaciones:", err);
        setCargando(false);
      });
  };

  useEffect(() => {
    fetchLiquidaciones();
  }, [consorcioSeleccionado]);

  const abrirModalCrear = () => {
    setFormData({
      consorcio: consorcioSeleccionado, // Lo atamos automáticamente al edificio actual
      periodo: '',
      tipo_liquidacion: 'ORDINARIA',
      monto_total: 0,
      estado: 'BORRADOR'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/liquidaciones/cabeceras/', formData);
      setIsModalOpen(false);
      fetchLiquidaciones(); // Refrescamos la grilla
    } catch (error) {
      console.error("Error exacto de Django:", error.response?.data);
      alert("Faltan datos obligatorios. Revisá la consola.");
    }
  };

  // Función para mostrar el nombre del período en la tabla (en vez del ID)
  const getNombrePeriodo = (id_periodo) => {
    const p = periodos.find(per => per.id_periodo === id_periodo);
    return p ? p.nombre : 'Desconocido';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Liquidaciones de Expensas</h1>
          <p className="text-gray-500 mt-2">Gestioná los gastos y el cierre de mes por edificio.</p>
        </div>
        
        <button 
          onClick={abrirModalCrear}
          disabled={!consorcioSeleccionado}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Nueva Liquidación
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <Search className="w-6 h-6 text-gray-400" />
        <div className="flex-1">
          <label className="text-sm font-bold text-gray-700 block mb-1">Seleccionar Edificio</label>
          <select 
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
            value={consorcioSeleccionado}
            onChange={(e) => setConsorcioSeleccionado(e.target.value)}
          >
            <option value="">-- Elegí un consorcio para ver sus liquidaciones --</option>
            {consorcios.map(c => (
              <option key={c.id_consorcio} value={c.id_consorcio}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {!consorcioSeleccionado ? (
        <div className="text-center py-12 text-gray-400">
          Seleccioná un edificio arriba para empezar.
        </div>
      ) : cargando ? (
        <div className="text-gray-500 font-medium">Buscando liquidaciones...</div>
      ) : liquidaciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No hay liquidaciones</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Este edificio todavía no tiene ningún cierre de expensas registrado.
          </p>
          <button 
            onClick={abrirModalCrear}
            className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-100 transition"
          >
            Crear la primera Liquidación
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">ID / Tipo</th>
                <th className="p-4">Período</th>
                <th className="p-4">Monto Total</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {liquidaciones.map((liq) => (
                <tr key={liq.id_liquidacion} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium uppercase text-gray-900">
                    #{liq.id_liquidacion} - {liq.tipo_liquidacion}
                  </td>
                  <td className="p-4 font-bold">
                    {getNombrePeriodo(liq.periodo)}
                  </td>
                  <td className="p-4 text-gray-900 font-bold">
                    ${parseFloat(liq.monto_total).toLocaleString('es-AR')}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      liq.estado === 'BORRADOR' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {liq.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {/* ACÁ ESTÁ EL BOTÓN ACTUALIZADO */}
                    <button 
                      onClick={() => navigate(`/portal/liquidaciones/${liq.id_liquidacion}`)}
                      className="text-purple-600 font-medium hover:underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL DE CREACIÓN DE LIQUIDACIÓN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Nueva Liquidación</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Período (Mes de Expensas)</label>
                <select 
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.periodo}
                  onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                >
                  <option value="">-- Seleccionar el mes --</option>
                  {periodos.map(p => (
                    <option key={p.id_periodo} value={p.id_periodo}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo de Liquidación</label>
                <select 
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.tipo_liquidacion}
                  onChange={(e) => setFormData({...formData, tipo_liquidacion: e.target.value})}
                >
                  <option value="ORDINARIA">Ordinaria (Gastos Comunes)</option>
                  <option value="EXTRAORDINARIA">Extraordinaria (Arreglos especiales)</option>
                </select>
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
                  Generar Cabecera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}