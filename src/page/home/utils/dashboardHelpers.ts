import { analyzeItem, cleanNumber } from "./inventoryHelpers";
import type { InventoryGroup } from "../../../types/inventory";

export interface LossItem {
  nombre: string;
  categoria: string;
  diferenciaNum: number;
  unidad: string;
  porcentaje: string;
  costoEstimado: number; // Basado en el volumen de diferencia
}

export function calculateExecutiveMetrics(
  jsonData: InventoryGroup[] | null,
  forceAllBtl: boolean,
) {
  if (!jsonData || jsonData.length === 0) {
    return {
      lossLeaders: [],
      categoryDistribution: [],
      totalFaltantesCount: 0,
      totalSobrantesCount: 0,
      saludScore: 100,
      grade: "A+",
    };
  }

  const lossItems: LossItem[] = [];
  const categoryDistributionMap: Record<string, number> = {};
  let totalItemsEvaluados = 0;
  let totalFaltantesCount = 0;
  let totalSobrantesCount = 0;

  jsonData.forEach((group) => {
    const categoryName = group.categoria || "Sin Categoría";
    let catUsageTotal = 0;

    group.items.forEach((item) => {
      totalItemsEvaluados++;
      const analysis = analyzeItem(item, categoryName, forceAllBtl);

      // Type casting seguro para propiedades dinámicas del item
      const itemRecord = item as unknown as Record<string, unknown>;
      const rawUso = itemRecord.usoReal ?? itemRecord.usoBtl ?? "0";
      const usoVal = Math.abs(cleanNumber(String(rawUso)));

      catUsageTotal += usoVal;

      if (analysis.tieneDiferencia) {
        if (analysis.esFaltante) {
          totalFaltantesCount++;

          const diffVal = analysis.diffAmount;
          const rawPct = item.porcentajeDiferencia
            ? String(item.porcentajeDiferencia)
            : "0";
          const pctVal = parseFloat(rawPct.replace("%", ""));

          lossItems.push({
            nombre: item.nombreArticulo,
            categoria: categoryName,
            diferenciaNum: -diffVal,
            unidad: analysis.unit,
            porcentaje: item.porcentajeDiferencia
              ? String(item.porcentajeDiferencia)
              : `${pctVal}%`,
            costoEstimado: diffVal * 15,
          });
        } else {
          totalSobrantesCount++;
        }
      }
    });

    categoryDistributionMap[categoryName] = catUsageTotal;
  });

  // Ordenar mayores faltantes
  const lossLeaders = lossItems
    .sort((a, b) => Math.abs(b.diferenciaNum) - Math.abs(a.diferenciaNum))
    .slice(0, 5);

  // Formatear distribución para el gráfico
  const categoryDistribution = Object.keys(categoryDistributionMap).map(
    (cat) => ({
      name: cat,
      value: categoryDistributionMap[cat] || 1,
    }),
  );

  // Cálculo de Nota Gerencial (Rating / Grade)
  const pctFaltantes =
    totalItemsEvaluados > 0
      ? (totalFaltantesCount / totalItemsEvaluados) * 100
      : 0;
  const saludScore = Math.max(0, Math.round(100 - pctFaltantes * 1.5));

  let grade = "A+";
  if (saludScore < 95 && saludScore >= 88) grade = "A";
  else if (saludScore < 88 && saludScore >= 80) grade = "B";
  else if (saludScore < 80 && saludScore >= 70) grade = "C";
  else if (saludScore < 70) grade = "D";

  return {
    lossLeaders,
    categoryDistribution,
    totalFaltantesCount,
    totalSobrantesCount,
    saludScore,
    grade,
  };
}
