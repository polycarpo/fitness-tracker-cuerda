import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Save, Calendar, Zap, Clock } from 'lucide-react';
import type { Salto } from '@/types';

interface SaltosTabProps {
  saltos: Salto[];
  onRegistrar: (fecha: string, cantidad: number, tiempo: number) => boolean;
  onEliminar: (fecha: string) => void;
  existeSalto: (fecha: string) => boolean;
}

export function SaltosTab({ saltos, onRegistrar, onEliminar, existeSalto }: SaltosTabProps) {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [cantidad, setCantidad] = useState('');
  const [tiempo, setTiempo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cantidadNum = parseInt(cantidad);
    const tiempoNum = parseInt(tiempo);

    if (!fecha || !cantidadNum || !tiempoNum) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (existeSalto(fecha)) {
      if (!confirm('Ya existe un registro para esta fecha. ¿Deseas actualizarlo?')) {
        return;
      }
    }

    onRegistrar(fecha, cantidadNum, tiempoNum);
    setCantidad('');
    setTiempo('');
    alert('✅ Registro guardado exitosamente');
  };

  const ordenados = [...saltos].sort((a, b) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="h-5 w-5 text-purple-500" />
            Registrar Saltos del Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="fechaSaltos" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha
                </Label>
                <Input
                  id="fechaSaltos"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidadSaltos" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Cantidad de Saltos
                </Label>
                <Input
                  id="cantidadSaltos"
                  type="number"
                  placeholder="500, 1000, 1500..."
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiempoSaltos" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tiempo (minutos)
                </Label>
                <Input
                  id="tiempoSaltos"
                  type="number"
                  placeholder="10, 15, 20..."
                  value={tiempo}
                  onChange={(e) => setTiempo(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Registro
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Saltos</CardTitle>
        </CardHeader>
        <CardContent>
          {saltos.length === 0 ? (
            <div className="rounded-lg bg-muted p-6 text-center text-muted-foreground">
              No hay registros de saltos aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Saltos</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Velocidad</TableHead>
                    <TableHead className="w-24">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenados.map((item) => {
                    const rpm = Math.round(item.cantidad / item.tiempo);
                    return (
                      <TableRow key={item.fecha}>
                        <TableCell>
                          {new Date(item.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {item.cantidad.toLocaleString()}
                        </TableCell>
                        <TableCell>{item.tiempo} min</TableCell>
                        <TableCell>{rpm} saltos/min</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('¿Eliminar este registro de saltos?')) {
                                onEliminar(item.fecha);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
