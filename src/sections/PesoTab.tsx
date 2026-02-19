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
import { Trash2, Save, Calendar, Scale } from 'lucide-react';
import type { Peso } from '@/types';

interface PesoTabProps {
  pesos: Peso[];
  onRegistrar: (fecha: string, peso: number) => boolean;
  onEliminar: (fecha: string) => void;
  existePeso: (fecha: string) => boolean;
}

export function PesoTab({ pesos, onRegistrar, onEliminar, existePeso }: PesoTabProps) {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [peso, setPeso] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pesoNum = parseFloat(peso);

    if (!fecha || !pesoNum) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (existePeso(fecha)) {
      if (!confirm('Ya existe un registro de peso para esta fecha. ¿Deseas actualizarlo?')) {
        return;
      }
    }

    onRegistrar(fecha, pesoNum);
    setPeso('');
    alert('✅ Peso registrado exitosamente');
  };

  const ordenados = [...pesos].sort((a, b) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-5 w-5 text-blue-500" />
            Registrar Peso Corporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fechaPeso" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha
                </Label>
                <Input
                  id="fechaPeso"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoValor" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Peso (kg)
                </Label>
                <Input
                  id="pesoValor"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Peso
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progreso de Peso</CardTitle>
        </CardHeader>
        <CardContent>
          {pesos.length === 0 ? (
            <div className="rounded-lg bg-muted p-6 text-center text-muted-foreground">
              No hay registros de peso aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Peso (kg)</TableHead>
                    <TableHead>Cambio</TableHead>
                    <TableHead className="w-24">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenados.map((item, index) => {
                    let cambio = '-';
                    if (index < ordenados.length - 1) {
                      const diff = ordenados[index + 1].peso - item.peso;
                      const signo = diff > 0 ? '+' : '';
                      cambio = `${signo}${diff.toFixed(1)} kg`;
                    }
                    return (
                      <TableRow key={item.fecha}>
                        <TableCell>
                          {new Date(item.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </TableCell>
                        <TableCell className="font-semibold">{item.peso} kg</TableCell>
                        <TableCell
                          className={
                            cambio.startsWith('+')
                              ? 'text-green-600'
                              : cambio.startsWith('-')
                              ? 'text-red-600'
                              : ''
                          }
                        >
                          {cambio}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('¿Eliminar este registro de peso?')) {
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
