// types/index.ts

export interface Gasto {
  id?: string;
  created_at?: string;
  descripcion: string;
  monto: number;
  categoria: string;
}

export interface NotaDiario {
  id?: string;
  created_at?: string;
  titulo: string;
  contenido: string;
  sentimiento?: string;
}