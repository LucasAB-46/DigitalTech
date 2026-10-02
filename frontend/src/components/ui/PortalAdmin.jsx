import React from 'react';
import { Users, FileText, DollarSign, Building } from 'lucide-react';

export function PortalAdmin() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-2">Resumen general de los consorcios gestionados.</p>
      </div>

      {/* Tarjetas de métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Consorcios Activos</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total UFs</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Recaudación Mes</p>
            <p className="text-2xl font-bold text-gray-900">85%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Morosos</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
      </div>
    </div>
  );
}