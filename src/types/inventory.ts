export interface InventoryItem {
  nombreArticulo: string;
  existenciaPrevia: string | null;
  compras: string | null;
  existencia: string | null;
  usado: string | null;
  vendido: string | null;
  diferencia: string | null;
  porcentajeDiferencia: string | null;
  diferenciaCosto: string | null;
  ingresos: string | null;
  porcentajeCosto: string | null;
  porcentajeCostoIdeal: string | null;
  unidad?: string | null;
}

export interface InventoryGroup {
  categoria: string;
  icono?: string;
  existenciaPrevia: string;
  existencia: string;
  diferencia: string;
  diferenciaCosto: string;
  porcentajeDiferencia?: string | number;
  items: InventoryItem[];
}
