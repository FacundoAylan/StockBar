import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  type PieLabelRenderProps,
} from "recharts";
import {
  calculateExecutiveMetrics,
  type LossItem,
} from "../utils/dashboardHelpers";
import type { InventoryGroup } from "../../../types/inventory";

interface ExecutiveDashboardProps {
  jsonData: InventoryGroup[] | null;
  forceAllBtl: boolean;
}

const COLORS: readonly string[] = [
  "#0284c7", // Sky
  "#059669", // Emerald
  "#7c3aed", // Violet
  "#d97706", // Amber
  "#e11d48", // Rose
  "#4f46e5", // Indigo
  "#0891b2", // Cyan
  "#c026d3", // Fuchsia
];

// Helper robusto para limpiar y castear números de costo/uso sin fallos por strings o undefined
const parseSafeNumber = (val: unknown): number => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;

  const cleanStr = String(val)
    .replace(/[^0-9.,-]/g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : Math.abs(parsed);
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  jsonData,
  forceAllBtl,
}) => {
  const {
    lossLeaders,
    categoryDistribution,
    totalFaltantesCount,
    totalSobrantesCount,
    saludScore,
    grade,
  } = calculateExecutiveMetrics(jsonData, forceAllBtl);

  if (!jsonData || jsonData.length === 0) return null;

  // 🎯 1. VOLUMEN TOTAL UTILIZADO
  const totalUsoVolumen = categoryDistribution.reduce(
    (acc, curr) => acc + parseSafeNumber(curr.value),
    0,
  );

  // 🎯 2. COSTO TOTAL UTILIZADO Y DESGLOSE POR CATEGORÍA
  let totalCostoConsumido = 0;
  const costByCategoryMap: Record<string, number> = {};

  jsonData.forEach((group) => {
    const categoryName = group.categoria?.trim() || "Sin Categoría";
    let catCostTotal = 0;

    group.items.forEach((item) => {
      const itemRecord = item as unknown as Record<string, unknown>;

      const costoVal = parseSafeNumber(
        itemRecord.costo ?? itemRecord.precio ?? itemRecord.costoUnidad ?? 0,
      );

      const usoVal = parseSafeNumber(
        itemRecord.usoReal ?? itemRecord.usoBtl ?? itemRecord.uso ?? 0,
      );

      const costoItemUso = usoVal * costoVal;
      catCostTotal += costoItemUso;
      totalCostoConsumido += costoItemUso;
    });

    costByCategoryMap[categoryName] =
      (costByCategoryMap[categoryName] || 0) + catCostTotal;
  });

  const costByCategoryData = Object.keys(costByCategoryMap)
    .map((cat) => ({
      name: cat,
      costo: Math.round(costByCategoryMap[cat]),
    }))
    .filter((item) => item.costo > 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);

  // Renderizador de porcentajes limpio en la Dona
  const renderCustomLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    percent = 0,
  }: PieLabelRenderProps) => {
    if (percent < 0.04) return null;
    const RADIAN = Math.PI / 180;
    const radius = Number(outerRadius) + 14;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#334155"
        textAnchor={x > Number(cx) ? "start" : "end"}
        dominantBaseline="central"
        className="text-[10px] font-black"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4 font-sans">
      {/* 🎯 TARJETAS DE AUDITORÍA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Salud del Stock
            </span>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {saludScore}%{" "}
              <span className="text-xs font-normal text-slate-500">Score</span>
            </div>
          </div>
          <div className="text-3xl font-black bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl">
            {grade}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Usado (Auditoría)
          </span>
          <div className="text-2xl font-black text-sky-600 mt-1">
            {totalUsoVolumen.toLocaleString("es-AR")}{" "}
            <span className="text-xs font-medium text-slate-500">
              {forceAllBtl ? "btl" : "btl / ml"}
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            Consumo total registrado
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Costo Total Consumido
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {formatCurrency(totalCostoConsumido)}
          </div>
          <div className="text-[11px] font-bold text-emerald-600/80 mt-1">
            Valor monetario gastado
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ítems con Faltante
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {totalFaltantesCount}{" "}
            <span className="text-xs font-medium text-slate-500">
              artículos
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            Sobrantes: {totalSobrantesCount} ítems
          </div>
        </div>
      </div>

      {/* 📊 SECCIÓN DE GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 1: COSTO DE LO USADO ($) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              💰 Costo de Lo Usado ($)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Gasto monetario por categoría en la auditoría
            </p>
          </div>

          <div className="w-full h-80 min-h-[320px]">
            {costByCategoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                ⚠️ Sin datos de precios/costos registrados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costByCategoryData}
                  margin={{ top: 15, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(val) => `$${val}`}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(parseSafeNumber(value)),
                      "Costo Consumido",
                    ]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                    itemStyle={{ color: "#4ade80" }}
                  />
                  <Bar dataKey="costo" radius={[8, 8, 0, 0]}>
                    {costByCategoryData.map((_, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRÁFICO 2: CANTIDAD USADA (BOTELLAS / ML) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                📦 Cantidad Usada (Botellas / ML)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Volumen consumido por categoría en esta auditoría
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
              {categoryDistribution.length} Categorías
            </span>
          </div>

          <div className="w-full h-80 min-h-[320px] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Usado
              </span>
              <span className="text-lg font-black text-slate-800">
                {totalUsoVolumen.toLocaleString("es-AR")}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {forceAllBtl ? "botellas" : "btl / ml"}
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="42%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {categoryDistribution.map((entry, index: number) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [
                    `${parseSafeNumber(val).toLocaleString("es-AR")} ${
                      forceAllBtl ? "btl" : "btl/ml"
                    }`,
                    "Uso Consumido",
                  ]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  itemStyle={{ color: "#38bdf8" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🚨 RESUMEN DE FALTANTES */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                🚨 Top Faltantes Registrados en Auditoría
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Artículos que presentaron descuadre negativo de stock
              </p>
            </div>
          </div>

          {lossLeaders.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-medium">
              ✅ Excelente. No se detectaron faltantes en esta auditoría.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lossLeaders.map((item: LossItem, idx: number) => (
                <div
                  key={`${item.nombre}-${idx}`}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      {item.nombre}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Categoría: {item.categoria}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-rose-100 text-rose-800 border border-rose-200 text-xs font-black px-2.5 py-1 rounded-lg">
                      {item.diferenciaNum} {item.unidad.toUpperCase()}
                    </span>
                    <div className="text-[11px] font-black text-rose-600 mt-1">
                      {item.porcentaje}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
