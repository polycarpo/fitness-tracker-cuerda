import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import type { Salto, Peso } from '@/types';

interface AnalisisTabProps {
  saltos: Salto[];
  pesos: Peso[];
  onExportar: () => void;
  onLimpiar: () => void;
}

export function AnalisisTab({ saltos, pesos, onExportar, onLimpiar }: AnalisisTabProps) {
  const hoy = new Date();
  const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Síntesis semanal de saltos
  const saltosSemana = saltos.filter((s) => new Date(s.fecha) >= hace7Dias);
  const totalSaltos = saltosSemana.reduce((sum, s) => sum + s.cantidad, 0);
  const totalTiempo = saltosSemana.reduce((sum, s) => sum + s.tiempo, 0);
  const promedioDiario = Math.round(totalSaltos / 7);
  const diasActivos = saltosSemana.length;

  // Datos para el gráfico de los últimos 7 días
  const ultimos7Dias = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
    const fechaStr = fecha.toISOString().split('T')[0];
    const dia = saltos.find((s) => s.fecha === fechaStr);
    ultimos7Dias.push({
      fecha: fecha.toLocaleDateString('es-ES', { weekday: 'short' }),
      valor: dia ? dia.cantidad : 0,
    });
  }
  const maxValor = Math.max(...ultimos7Dias.map((d) => d.valor), 100);

  // Evaluación de peso
  const pesosOrdenados = [...pesos].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );
  const tieneSuficientesPesos = pesosOrdenados.length >= 2;

  let pesoStats = null;
  if (tieneSuficientesPesos) {
    const pesoInicial = pesosOrdenados[0].peso;
    const pesoActual = pesosOrdenados[pesosOrdenados.length - 1].peso;
    const pesoAnterior = pesosOrdenados[pesosOrdenados.length - 2].peso;
    const perdidaTotal = pesoInicial - pesoActual;
    const perdidaReciente = pesoAnterior - pesoActual;

    const diasRegistro = Math.ceil(
      (new Date(pesosOrdenados[pesosOrdenados.length - 1].fecha).getTime() -
        new Date(pesosOrdenados[0].fecha).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const perdidaPromedio = diasRegistro > 0 ? perdidaTotal / (diasRegistro / 7) : 0;

    pesoStats = {
      pesoInicial,
      pesoActual,
      perdidaTotal,
      perdidaReciente,
      perdidaPromedio,
      totalRegistros: pesosOrdenados.length,
    };
  }

  return (
    <div className="space-y-6">
      {/* Síntesis de Saltos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-purple-500" />
            Síntesis Semanal de Saltos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-center text-white">
              <div className="text-sm opacity-90">Total Saltos</div>
              <div className="text-3xl font-bold">{totalSaltos.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 p-4 text-center text-white">
              <div className="text-sm opacity-90">Tiempo Total</div>
              <div className="text-3xl font-bold">{totalTiempo} min</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-center text-white">
              <div className="text-sm opacity-90">Promedio Diario</div>
              <div className="text-3xl font-bold">{promedioDiario}</div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-center text-white">
              <div className="text-sm opacity-90">Días Activos</div>
              <div className="text-3xl font-bold">{diasActivos}/7</div>
            </div>
          </div>

          {/* Gráfico de barras */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Últimos 7 días
            </h4>
            <div className="flex h-48 items-end gap-2 rounded-lg bg-muted p-4">
              {ultimos7Dias.map((dia, index) => (
                <div
                  key={index}
                  className="group relative flex flex-1 flex-col items-center"
                >
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-purple-500 to-pink-400 transition-all hover:opacity-80"
                    style={{ height: `${(dia.valor / maxValor) * 100}%` }}
                  >
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                      {dia.valor > 0 && dia.valor.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{dia.fecha}</div>
                  <div className="absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                    {dia.valor} saltos
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluación de Peso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-5 w-5 text-blue-500" />
            Evaluación de Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!tieneSuficientesPesos ? (
            <div className="rounded-lg bg-muted p-6 text-center text-muted-foreground">
              Necesita al menos 2 registros de peso para evaluación.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-center text-white">
                  <div className="text-sm opacity-90">Peso Inicial</div>
                  <div className="text-3xl font-bold">{pesoStats?.pesoInicial} kg</div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 text-center text-white">
                  <div className="text-sm opacity-90">Peso Actual</div>
                  <div className="text-3xl font-bold">{pesoStats?.pesoActual} kg</div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-center text-white">
                  <div className="text-sm opacity-90">Pérdida Total</div>
                  <div className="text-3xl font-bold">
                    {pesoStats?.perdidaTotal.toFixed(1)} kg
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-center text-white">
                  <div className="text-sm opacity-90">Pérdida/Semana</div>
                  <div className="text-3xl font-bold">
                    {pesoStats?.perdidaPromedio.toFixed(2)} kg
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-l-blue-500 bg-muted p-4">
                <h4 className="mb-2 font-semibold">Evaluación Detallada</h4>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Registros totales:</span>{' '}
                    <strong>{pesoStats?.totalRegistros}</strong>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Pérdida total desde el inicio:</span>{' '}
                    <strong className="text-green-600">
                      {pesoStats?.perdidaTotal.toFixed(1)} kg
                    </strong>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Cambio en último registro:</span>{' '}
                    <strong
                      className={
                        (pesoStats?.perdidaReciente || 0) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {(pesoStats?.perdidaReciente || 0) >= 0 ? '-' : '+'}{' '}
                      {Math.abs(pesoStats?.perdidaReciente || 0).toFixed(1)} kg
                      {(pesoStats?.perdidaReciente || 0) >= 0 ? (
                        <TrendingDown className="ml-1 inline h-4 w-4" />
                      ) : (
                        <TrendingUp className="ml-1 inline h-4 w-4" />
                      )}
                    </strong>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tendencia:</span>{' '}
                    <strong>
                      {(pesoStats?.perdidaPromedio || 0) > 0
                        ? 'Bajando de peso ✅'
                        : 'Estable ⚠️'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onExportar}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Datos JSON
        </Button>
        <Button
          onClick={() => {
            if (
              confirm('⚠️ ¿ESTÁS SEGURO? Esto eliminará TODOS los datos permanentemente.') &&
              confirm('Última advertencia: ¿Realmente quieres borrar todo?')
            ) {
              onLimpiar();
              alert('Datos eliminados correctamente');
            }
          }}
          variant="destructive"
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar Todos los Datos
        </Button>
      </div>
    </div>
  );
}

// Importación necesaria
import { Scale } from 'lucide-react';
