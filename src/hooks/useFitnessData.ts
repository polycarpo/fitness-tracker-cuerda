import { useState, useEffect, useCallback } from 'react';
import type { FitnessData } from '@/types';

const STORAGE_KEY = 'fitnessTracker';

const getInitialData = (): FitnessData => ({
  saltos: [],
  pesos: [],
});

export function useFitnessData() {
  const [datos, setDatos] = useState<FitnessData>(getInitialData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos desde localStorage
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        setDatos(JSON.parse(guardado));
      } catch {
        setDatos(getInitialData());
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    }
  }, [datos, isLoaded]);

  const registrarSalto = useCallback((fecha: string, cantidad: number, tiempo: number): boolean => {
    setDatos((prev) => {
      const existe = prev.saltos.find((s) => s.fecha === fecha);
      if (existe) {
        return {
          ...prev,
          saltos: prev.saltos.map((s) =>
            s.fecha === fecha ? { ...s, cantidad, tiempo } : s
          ),
        };
      }
      return {
        ...prev,
        saltos: [...prev.saltos, { fecha, cantidad, tiempo }],
      };
    });
    return true;
  }, []);

  const registrarPeso = useCallback((fecha: string, peso: number): boolean => {
    setDatos((prev) => {
      const existe = prev.pesos.find((p) => p.fecha === fecha);
      if (existe) {
        return {
          ...prev,
          pesos: prev.pesos.map((p) =>
            p.fecha === fecha ? { ...p, peso } : p
          ),
        };
      }
      return {
        ...prev,
        pesos: [...prev.pesos, { fecha, peso }],
      };
    });
    return true;
  }, []);

  const eliminarSalto = useCallback((fecha: string) => {
    setDatos((prev) => ({
      ...prev,
      saltos: prev.saltos.filter((s) => s.fecha !== fecha),
    }));
  }, []);

  const eliminarPeso = useCallback((fecha: string) => {
    setDatos((prev) => ({
      ...prev,
      pesos: prev.pesos.filter((p) => p.fecha !== fecha),
    }));
  }, []);

  const limpiarDatos = useCallback(() => {
    setDatos(getInitialData());
  }, []);

  const exportarDatos = useCallback(() => {
    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [datos]);

  const existeSalto = useCallback(
    (fecha: string) => datos.saltos.some((s) => s.fecha === fecha),
    [datos.saltos]
  );

  const existePeso = useCallback(
    (fecha: string) => datos.pesos.some((p) => p.fecha === fecha),
    [datos.pesos]
  );

  return {
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
  };
}
