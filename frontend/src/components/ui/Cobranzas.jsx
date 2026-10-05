import { useState, useEffect } from 'react';
import { Search, PlusCircle, CreditCard, X, Receipt } from 'lucide-react';
import api from '../../utils/api'; 

export function Cobranzas() {
  // Datos del sistema
  const [consorcios, setConsorcios] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [pagos, setPagos] = useState([]);

  // Selecciones del usuario
  const [consorcioSeleccionado, setConsorcioSeleccionado] = useState('');
  const [ufSeleccionada, setUfSeleccionada] = useState('');
  const [cargando, setCargando] = useState(false);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    periodo: '', // <-- Apunta correctamente al campo 'periodo' del modelo de Django
    metodo_pago: '',
    monto_pagado: '',
    tipo_pago: 'TOTAL',
    id_transaccion_pasarela: ''
  });

  // 1. Al cargar la pantalla, traemos los combos básicos
  useEffect(() => {
    api.get('core/consorcios/').then(res => setConsorcios(res.data)).catch(err => console.error("Error consorcios:", err));
    api.get('core/periodos/').then(res => setPeriodos(res.data)).catch(err => console.error("Error periodos:", err));
    api.get('cobranzas/tipos-pago/').then(res => setTiposPago(res.data)).catch(err => console.error("Error tipos pago:", err));
  }, []);

  // 2. Si cambia el consorcio, traemos sus UFs
  useEffect(() => {
    setUfSeleccionada('');
    setPagos([]);
    if (consorcioSeleccionado) {
      api.get(`cobranzas/ufs/?consorcio_id=${consorcioSeleccionado}`)
        .then(res => setUfs(res.data))
        .catch(err => console.error("Error UFs:", err));
    } else {
      setUfs([]);
    }
  }, [consorcioSeleccionado]);

  // 3. Si cambia la UF, traemos su historial de pagos
  const fetchPagos = () => {
    if (!ufSeleccionada) {
      setPagos([]);
      return;
    }
    setCargando(true);
    api.get(`cobranzas/pagos/?unidad_funcional=${ufSeleccionada}`)
      .then(res => {
        setPagos(res.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  };

  useEffect(() => {
    fetchPagos();
  }, [ufSeleccionada]);

  // Funciones de ayuda
  const getNombrePeriodo = (id) => periodos.find(p => p.id_periodo === id)?.nombre || 'Desconocido';
  const getNombreMetodo = (id) => tiposPago.find(t => t.id_tipo_pago === id)?.nombre || 'Desconocido';

  // Guardar el nuevo pago
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        unidad_funcional: ufSeleccionada,
        saldo_pendiente: 0.00, 
        id_transaccion_pasarela: formData.id_transaccion_pasarela || `REC-${Date.now()}`
      };
      
      await api.post('cobranzas/pagos/', payload);
      setIsModalOpen(false);
      
      // Limpiamos el formulario
      setFormData({
        periodo: '', metodo_pago: '', monto_pagado: '', tipo_pago: 'TOTAL', id_transaccion_pasarela: ''
      });
      
      // Recargamos el historial
      fetchPagos();
    } catch (error) {
      console.error("Error al registrar pago:", error.response?.data);
      alert("Error al registrar pago: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  return (
    <div className="space-y-6 relative pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Cobranzas</h1>
          <p className="text-gray-500 mt-2">Registrá los pagos de expensas de los vecinos.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!ufSeleccionada}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-purple-200"
        >
          <PlusCircle className="w-5 h-5" />
          Registrar Pago
        </button>
      </div>

      {/* --- FILTROS DE BÚSQUEDA --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
        <Search className="w-8 h-8 text-gray-300" />
        
        <div className="flex-1">
          <label className="text-sm font-bold text-gray-700 block mb-1">1. Edificio</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
            value={consorcioSeleccionado}
            onChange={(e) => setConsorcioSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccionar Consorcio --</option>
            {consorcios.map(c => (
              <option key={c.id_consorcio} value={c.id_consorcio}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-bold text-gray-700 block mb-1">2. Unidad Funcional (Depto)</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
            value={ufSeleccionada}
            onChange={(e) => setUfSeleccionada(e.target.value)}
            disabled={!consorcioSeleccionado}
          >
            <option value="">-- Seleccionar UF --</option>
            {ufs.map(uf => (
              <option key={uf.id_uf} value={uf.id_uf}>UF {uf.numero_uf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- GRILLA DEL HISTORIAL DE PAGOS --- */}
      {!ufSeleccionada ? (
        <div className="text-center py-12 text-gray-400">
          Seleccioná un edificio y un departamento arriba para ver su historial.
        </div>
      ) : cargando ? (
        <div className="text-gray-500 font-medium">Buscando pagos...</div>
      ) : pagos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
            <Receipt className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Sin historial de pagos</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Esta unidad funcional todavía no tiene pagos registrados en el sistema.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Fecha Registro</th>
                <th className="p-4">Mes (Período)</th>
                <th className="p-4">Método</th>
                <th className="p-4">Transacción / Recibo</th>
                <th className="p-4 text-center">Tipo</th>
                <th className="p-4 text-right">Monto Pagado</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {pagos.map((pago) => (
                <tr key={pago.id_pago} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{new Date(pago.fecha_pago).toLocaleDateString('es-AR')}</td>
                  <td className="p-4 font-bold text-gray-900">{getNombrePeriodo(pago.periodo)}</td>
                  <td className="p-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    {getNombreMetodo(pago.metodo_pago)}
                  </td>
                  <td className="p-4 text-gray-500 text-xs font-mono">{pago.id_transaccion_pasarela}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-md font-bold ${pago.tipo_pago === 'TOTAL' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {pago.tipo_pago}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black text-gray-900">
                    ${parseFloat(pago.monto_pagado).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL PARA REGISTRAR PAGO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Pago</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Período (Mes de Expensas)</label>
                  <select 
                    required className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    value={formData.periodo}
                    onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                  >
                    <option value="">-- Seleccionar Período --</option>
                    {periodos.map(p => (
                      <option key={p.id_periodo} value={p.id_periodo}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Monto Abonado ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold"
                    value={formData.monto_pagado}
                    onChange={(e) => setFormData({...formData, monto_pagado: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Forma de Pago</label>
                  <select 
                    required className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                    value={formData.metodo_pago}
                    onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
                  >
                    <option value="">-- Elegir --</option>
                    {tiposPago.map(t => <option key={t.id_tipo_pago} value={t.id_tipo_pago}>{t.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Pago</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                    value={formData.tipo_pago}
                    onChange={(e) => setFormData({...formData, tipo_pago: e.target.value})}
                  >
                    <option value="TOTAL">Pago Total</option>
                    <option value="PARCIAL">Pago Parcial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">N° Comprobante / Transacción (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ej: TRF-123456789 (Si lo dejás vacío se autogenera)"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  value={formData.id_transaccion_pasarela}
                  onChange={(e) => setFormData({...formData, id_transaccion_pasarela: e.target.value})}
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                >
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}