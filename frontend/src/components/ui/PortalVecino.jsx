import React from 'react';
import { Button } from './button';
import { CheckCircleIcon } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';

export function PortalVecino() {
  return (
    <div className="mx-auto max-w-6xl w-full">
      {/* Encabezado */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl">
          Portal del Vecino
        </h1>
        <p className="mt-4 text-sm text-gray-600 md:text-base">
          Revisá el estado de tus expensas, analizá los gastos mensuales y gestioná todo desde acá.
        </p>
      </div>

      {/* Grilla Principal */}
      <div className="grid rounded-xl border border-gray-200 bg-white md:grid-cols-6 shadow-sm overflow-hidden">
        
        {/* Panel Izquierdo (Resumen de Expensas) */}
        <div className="flex flex-col justify-between border-b border-gray-200 p-6 md:col-span-2 md:border-r md:border-b-0 bg-gray-50/50">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Expensas Actuales</h2>
              <span className="my-3 block text-4xl font-bold text-purple-600">
                $45.500
              </span>
              <p className="text-sm text-gray-500">
                Vencimiento: 10 de este mes
              </p>
            </div>

            <Button className="w-full">
              Pagar Expensas
            </Button>

            <div className="my-6 h-px w-full bg-gray-200" />

            <ul className="space-y-3 text-sm text-gray-600">
              {[
                'Expensas Ordinarias: $40.000',
                'Fondo de Reserva: $5.500',
                'Deuda Anterior: $0',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-purple-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel Derecho (Gráfico e Información) */}
        <div className="z-10 grid gap-8 p-6 md:col-span-4 lg:grid-cols-2 bg-white">
          
          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Historial del Edificio</h2>
              <p className="text-sm text-gray-500 mt-1">
                Evolución de los gastos en los últimos 6 meses.
              </p>
            </div>
            <div className="h-fit w-full rounded-lg border border-gray-200 p-2 bg-white">
              <GastosChart />
            </div>
          </div>
          
          <div className="relative w-full">
            <div className="text-sm font-medium text-gray-900">Novedades del Consorcio:</div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              {[
                'Mantenimiento de ascensores finalizado.',
                'Fumigación programada para el viernes.',
                'Asamblea anual ordinaria el próximo mes.',
                'Reglamento interno actualizado.',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid w-full grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Ver Detalles
              </Button>
              <Button variant="outline" className="w-full">
                Descargar Recibo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GastosChart() {
  const chartData = [
    { mes: 'Ene', gastos: 1200000 },
    { mes: 'Feb', gastos: 1150000 },
    { mes: 'Mar', gastos: 1300000 },
    { mes: 'Abr', gastos: 1450000 },
    { mes: 'May', gastos: 1400000 },
    { mes: 'Jun', gastos: 1800000 },
  ];

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="space-y-0 p-2 pb-4">
        <CardTitle className="text-base text-gray-900">Total Gastos Consorcio</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer className="h-[180px]">
          <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6B7280"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="gastos"
              name="Gasto Total"
              type="monotone"
              stroke="#9333EA" 
              strokeWidth={3}
              dot={{ fill: '#9333EA', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}