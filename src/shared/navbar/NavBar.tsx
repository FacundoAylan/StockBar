const NavBar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-2 bg-slate-950 border-b-2 border-slate-500/80 text-slate-100 shadow-2xl z-20">
      <div className="flex items-center gap-1 select-none">
        <div className="flex flex-col">
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-widest uppercase">
            <span className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 bg-clip-text text-transparent">
              StockBar
            </span>

            <span className="relative top-1 text-4xl leading-none">🥃</span>
          </h1>

          <span className="-mt-1 text-[10px] font-semibold tracking-widest uppercase text-slate-400">
            Beverage Inventory
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-sky-400/20 bg-[#0a0e24] px-3 py-1 text-xs font-medium text-sky-200">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"></span>
          Control de Bebidas
        </div>

        <div className="rounded-xl border border-sky-400/25 bg-[#0a0e24] p-1 shadow-[0_0_15px_rgba(56,189,248,0.12)]">
          <div className="flex h-8 w-8 select-none items-center justify-center rounded-lg bg-gradient-to-br from-sky-200 via-sky-400 to-sky-600 text-xs font-black text-[#060818] shadow-inner">
            FA
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
