import { Outlet } from "react-router-dom";
import Footer from "./shared/footer/Footer";
import NavBar from "./shared/navbar/NavBar";

function App() {
  return (
    <div className="h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden">
      <NavBar />

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
