# 🍸 StockBar

Una aplicación web moderna y eficiente desarrollada en **React**, **TypeScript** y **Tailwind CSS** para procesar, analizar y formatear reportes de inventario de bar/restaurante a partir de archivos CSV. Permite auditar faltantes, sobrantes, usados negativos e impactos en costo, así como generar un resumen listo para enviar por correo o exportar en PDF.

---

## 🚀 Tecnologías Utilizadas

* **Framework/Librería:** [React 18+](https://react.dev/)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Gestor de paquetes:** [pnpm](https://pnpm.io/)
* **Herramienta de construcción:** [Vite](https://vitejs.dev/)

---

## ✨ Características Principales

* 📄 **Procesamiento de CSV en cliente:** Lee y analiza reportes de inventario sin enviar datos a un servidor externo.
* 📊 **Detección inteligente de unidades:** Reconoce automáticamente volúmenes e ítems (`ml`, `btl`, `L`, `un`).
* 🔍 **Filtros avanzados:**
  * Alterna entre el **Informe General / Sobrantes** y **Usados Negativos**.
  * Filtro por volumen mínimo de variación (ej. mayor a 30 ml o 60 ml).
* ✏️ **Edición rápida:** Elimina ítems irrestrictos o no deseados antes de generar el informe final.
* ✉️ **Generador de texto para Gmail:** Formatea automáticamente el reporte con un solo clic para copiar y pegar en un correo.
* 🖨️ **Exportación a PDF / Impresión:** Estilos optimizados con media queries de impresión para generar PDFs limpios.
### ✏️ Edición e Interacción con Ítems

El reporte permite realizar ajustes en tiempo real sobre los datos procesados sin necesidad de modificar el archivo CSV original:

* **Modo Edición (`✏️ Editar Ítems`)**:
  * Activa la posibilidad de descartar elementos individuales de la lista.
  * Oculta los elementos seleccionados del cálculo visual del informe y de las métricas exportables.

* **Alternar Unidades Individuales (`🍾 ↔ 📦`)**:
  * **Cambio Manual por Ítem**: Al estar en *Modo Edición*, cada producto cuenta con un botón interactivo que permite alternar la unidad de medida individualmente entre **Botellas (`btl`)** y **Mililitros (`ml`)**.
  * **Persistencia Local**: La interfaz ajusta automáticamente la interpretación del volumen y la presentación del faltante/sobrante según la unidad seleccionada.

* **Visualización Global de Botellas (`🍾 Mostrar en botellas`)**:
  * Un botón global de acción rápida que permite forzar temporalmente la conversión y visualización de **todo el inventario a unidades de botella**.
  * Al desactivarlo, el sistema restaura los valores originales o las unidades personalizadas manualmente.

---

## 🛠️ Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión **18** o superior)
- **pnpm** como gestor de paquetes

Instala `pnpm` globalmente si aún no lo tienes:

```bash
npm install -g pnpm
```

---

## 🚀 Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/FacundoAylan/StockBar
cd stockBar
pnpm install
```

---

## ▶️ Ejecutar en desarrollo

Inicia el servidor de desarrollo de Vite:

```bash
pnpm dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

## 📁 Estructura del Proyecto

```text
stockBar/
├── public/                     # Archivos estáticos
├── src/
│   ├── pages/
│   │   └── home/
│   │       ├── components/     # Componentes reutilizables de la página principal
│   │       │   ├── CategoryGroupCard.tsx
│   │       │   └── InventoryItemRow.tsx
│   │       ├── hooks/          # Hooks personalizados
│   │       │   └── useInventoryAnalysis.ts
│   │       ├── utils/          # Utilidades y lógica de negocio
│   │       │   ├── categoryHelper.ts
│   │       │   ├── csvParser.ts
│   │       │   └── inventoryHelpers.ts
│   │       └── Home.tsx
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Punto de entrada de la aplicación
│   └── index.css               # Estilos globales y configuración de Tailwind CSS
├── package.json                # Dependencias y scripts
├── pnpm-lock.yaml              # Lockfile de pnpm
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.ts              # Configuración de Vite
```