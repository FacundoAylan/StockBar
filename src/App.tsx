import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/Home";
import ViewReport from "./page/report/ViewReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ViewReport/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
