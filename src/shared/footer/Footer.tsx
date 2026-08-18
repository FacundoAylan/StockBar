const Footer = () => {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-950 border-t-2 border-slate-500/80 text-slate-400 text-xs font-medium shadow-2xl z-20 gap-3 sm:gap-0">
      <div className="flex items-center gap-2 select-none">
        <span className="font-black tracking-widest uppercase bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
          StockBar
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">Control de Bebidas</span>
      </div>

      <div className="flex items-center gap-3">
        <span>
          © 2026 <span className="text-slate-200 font-semibold">StockBar</span>{" "}
          - Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
