export interface Salto {
  fecha: string;
  cantidad: number;
  tiempo: number;
}

export interface Peso {
  fecha: string;
  peso: number;
}

export interface FitnessData {
  saltos: Salto[];
  pesos: Peso[];
}

export interface StatsSaltos {
  totalSaltos: number;
  totalTiempo: number;
  promedioDiario: number;
  diasActivos: number;
}

export interface StatsPeso {
  pesoInicial: number;
  pesoActual: number;
  perdidaTotal: number;
  perdidaPromedio: number;
}
