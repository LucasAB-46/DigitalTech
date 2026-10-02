import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, PlusCircle, X, Calculator, CheckCircle, Home } from 'lucide-react';
import axios from 'axios';

export function LiquidacionDetalle() {
  const { id } = useParams(); // Sacamos el ID de la liquidación de la URL
  const navigate = useNavigate();
  
  const [liquidacion, setLiquidacion] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [detallesUF, setDetallesUF] = useState([]); // <-- NUEVO: Guarda los resultados del cálculo
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    liquidacion: id,
    proveedor: '',
    concepto: '',
    numero_factura: '',
    monto: '',
    fecha_factura: '',
    tipo_gasto: 'ORDINARIO'
  });

  const fetchData = async () => {
    try {
      setCargando(true);
      // 1. Traemos la info de la cabecera
      const resLiq = await axios.get(`http://127.0.0.1:8000/api/liquidaciones/cabeceras/${id}/`);
      setLiquidacion(resLiq.data);
      
      // 2. Traemos los gastos
      const resGastos = await axios.get(`http://127.0.0.1:8000/api/liquidaciones/gastos/?liquidacion_id=${id}`);
      setGastos(resGastos.data);

      // 3. NUEVO: Traemos los detalles del prorrateo (si ya está cerrado, va a traer la lista de expensas)
      const resDetalles = await axios.get(`http://127.0.0.1:8000/api/liquidaciones/detalles-uf/?liquidacion_id=${id}`);
      setDetallesUF(resDetalles.data);

      // 4. Traemos los proveedores para el desplegable
      const resProv = await axios.get('http://127.0.0.1:8000/api/proveedores/');
      setProveedores(resProv.data);

      setCargando(false);
    } catch (error) {
      console.error("Error trayendo datos:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Si no elige proveedor, mandamos null para no romper Django
    const dataToSend = { ...formData };
    if (!dataToSend.proveedor) dataToSend.proveedor = null;

    try {
      await axios.post('http://127.0.0.1:8000/api/liquidaciones/gastos/', dataToSend);
      setIsModalOpen(false);
      
      // Limpiamos el formulario
      setFormData({
        liquidacion: id,
        proveedor: '',
        concepto: '',
        numero_factura: '',
        monto: '',
        fecha_factura: '',
        tipo_gasto: 'ORDINARIO'
      });
      
      // Recargamos la grilla
      fetchData(); 
    } catch (error) {
      console.error("Error al guardar gasto:", error.response?.data);
      alert("Hubo un error al guardar el gasto. Mirá la consola.");
    }
  };

  // --- NUEVA FUNCIÓN: EL BOTÓN MÁGICO ---
  const handleProrratear = async () => {
    const confirmar = window.confirm("¿Estás seguro de cerrar la liquidación? Se calcularán las expensas de cada unidad y ya no se podrán agregar más gastos.");
    if (!confirmar) return;

    try {
      setCargando(true);
      // Le pegamos a la ruta nueva que creamos en el backend
      await axios.post(`http://127.0.0.1:8000/api/liquidaciones/cabeceras/${id}/prorratear/`);
      
      // Si todo sale bien, recargamos la página entera para ver la nueva tabla
      fetchData(); 
    } catch (error) {
      console.error("Error al prorratear:", error);
      alert(error.response?.data?.error || "Hubo un error al calcular el prorrateo.");
      setCargando(false);
    }
  };

  const getNombreProveedor = (id_prov) => {
    if (!id_prov) return '-';
    const p = proveedores.find(prov => prov.id_proveedor === id_prov);
    return p ? p.razon_social : '-';
  };

  // Calculamos el total de gastos sumando la grilla
  const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);

  if (cargando) return <div className="p-8 text-gray-500 font-medium">Cargando detalle...</div>;

  const esBorrador = liquidacion?.estado === 'BORRADOR';

  return (
    <div className="space-y-6 relative pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/portal/liquidaciones')}
          className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Liquidación #{liquidacion?.id_liquidacion}
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              Estado: 
              <span className={`font-bold px-3 py-1 rounded-full text-xs ${esBorrador ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {liquidacion?.estado}
              </span>
            </p>
          </div>
          
          {/* --- NUEVA BOTONERA DINÁMICA --- */}
          {esBorrador ? (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white border-2 border-purple-600 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Cargar Gasto
              </button>
              <button 
                onClick={handleProrratear}
                disabled={gastos.length === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-purple-200"
              >
                <Calculator className="w-5 h-5" />
                Cerrar y Prorratear
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Liquidación Cerrada
            </div>
          )}
        </div>
      </div>

      {/* Tarjeta de Resumen */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-12">
        <div>
          <p className="text-sm text-gray-500 font-bold mb-1">Total Gastos Cargados</p>
          <p className="text-3xl font-extrabold text-gray-900">${totalGastos.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
        </div>
        <div className="border-l border-gray-200 pl-12">
          <p className="text-sm text-gray-500 font-bold mb-1">Tipo de Liquidación</p>
          <p className="text-xl font-bold text-gray-700">{liquidacion?.tipo_liquidacion}</p>
        </div>
      </div>

      {/* Grilla de Gastos */}
      <h2 className="text-xl font-bold text-gray-800 mt-8">Gastos Registrados</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {gastos.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Aún no hay gastos</h3>
            <p className="text-gray-500">Empezá a cargar facturas con el botón de arriba.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4">Fecha</th>
                <th className="p-4">Concepto</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4 text-center">Tipo</th>
                <th className="p-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {gastos.map((gasto) => (
                <tr key={gasto.id_gasto} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{gasto.fecha_factura}</td>
                  <td className="p-4 font-bold text-gray-900">{gasto.concepto}</td>
                  <td className="p-4">{getNombreProveedor(gasto.proveedor)}</td>
                  <td className="p-4 text-center">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-bold">
                      {gasto.tipo_gasto}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    ${parseFloat(gasto.monto).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- NUEVO: GRILLA DE EXPENSAS CALCULADAS --- */}
      {/* Solo aparece si hay detalles cargados (es decir, si ya se prorrateó) */}
      {detallesUF.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mt-10">Expensas por Unidad Funcional</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                  <th className="p-4">ID Unidad (UF)</th>
                  <th className="p-4 text-center">Coeficiente</th>
                  <th className="p-4 text-right">Gastos Ord.</th>
                  <th className="p-4 text-right">Gastos Extra.</th>
                  <th className="p-4 text-right text-purple-700 font-extrabold">Total a Pagar</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {detallesUF.map((detalle, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      UF #{detalle.unidad_funcional}
                    </td>
                    <td className="p-4 text-center text-gray-500 font-medium">
                      {detalle.coeficiente_aplicado}%
                    </td>
                    <td className="p-4 text-right">
                      ${parseFloat(detalle.importe_ordinario).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4 text-right">
                      ${parseFloat(detalle.importe_extraordinario).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4 text-right font-black text-gray-900 text-base">
                      ${parseFloat(detalle.total_uf).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- MODAL PARA CARGAR GASTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Agregar Gasto / Factura</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Concepto (Ej: Reparación Ascensor)</label>
                <input 
                  type="text" required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.concepto}
                  onChange={(e) => setFormData({...formData, concepto: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Proveedor</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
                  >
                    <option value="">-- Sin proveedor --</option>
                    {proveedores.map(p => (
                      <option key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Número de Factura</label>
                  <input 
                    type="text" placeholder="Opcional"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={formData.numero_factura}
                    onChange={(e) => setFormData({...formData, numero_factura: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <label className="text-sm font-medium text-gray-700">Fecha Factura</label>
                  <input 
                    type="date" required
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={formData.fecha_factura}
                    onChange={(e) => setFormData({...formData, fecha_factura: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                    value={formData.tipo_gasto}
                    onChange={(e) => setFormData({...formData, tipo_gasto: e.target.value})}
                  >
                    <option value="ORDINARIO">Ordinario</option>
                    <option value="EXTRAORDINARIO">Extraordinario</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-sm font-medium text-gray-700">Monto ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  />
                </div>
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
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}