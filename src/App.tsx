import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFitnessData } from '@/hooks/useFitnessData';
import { SaltosTab } from '@/sections/SaltosTab';
import { PesoTab } from '@/sections/PesoTab';
import { AnalisisTab } from '@/sections/AnalisisTab';
import { Zap, Scale, BarChart3, Activity } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('saltos');
  const {
    datos,
    isLoaded,
    registrarSalto,
    registrarPeso,
    eliminarSalto,
    eliminarPeso,
    limpiarDatos,
    exportarDatos,
    existeSalto,
    existePeso,
  } = useFitnessData();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <div className="text-center text-white">
          <Activity className="mx-auto mb-4 h-12 w-12 animate-pulse" />
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-4 md:p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <header className="bg-gradient-to-r from-pink-400 to-rose-500 p-6 text-center text-white md:p-8">
          <div className="mb-2 flex items-center justify-center gap-3">
            <Activity className="h-8 w-8" />
            <h1 className="text-2xl font-bold md:text-3xl">Tracker Fitness</h1>
          </div>
          <p className="text-sm opacity-90 md:text-base">
            Registro de Saltos y Peso Corporal
          </p>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none bg-gray-100 p-0">
            <TabsTrigger
              value="saltos"
              className="flex items-center justify-center gap-2 rounded-none py-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-white data-[state=active]:text-purple-600"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Saltos Diarios</span>
              <span className="sm:hidden">Saltos</span>
            </TabsTrigger>
            <TabsTrigger
              value="peso"
              className="flex items-center justify-center gap-2 rounded-none py-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-white data-[state=active]:text-purple-600"
            >
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Peso Corporal</span>
              <span className="sm:hidden">Peso</span>
            </TabsTrigger>
            <TabsTrigger
              value="analisis"
              className="flex items-center justify-center gap-2 rounded-none py-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-white data-[state=active]:text-purple-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Análisis</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-4 md:p-6">
            <TabsContent value="saltos" className="mt-0 animate-in fade-in-50">
              <SaltosTab
                saltos={datos.saltos}
                onRegistrar={registrarSalto}
                onEliminar={eliminarSalto}
                existeSalto={existeSalto}
              />
            </TabsContent>

            <TabsContent value="peso" className="mt-0 animate-in fade-in-50">
              <PesoTab
                pesos={datos.pesos}
                onRegistrar={registrarPeso}
                onEliminar={eliminarPeso}
                existePeso={existePeso}
              />
            </TabsContent>

            <TabsContent value="analisis" className="mt-0 animate-in fade-in-50">
              <AnalisisTab
                saltos={datos.saltos}
                pesos={datos.pesos}
                onExportar={exportarDatos}
                onLimpiar={limpiarDatos}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-sm text-white/70">
        <p>Tracker Fitness © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
