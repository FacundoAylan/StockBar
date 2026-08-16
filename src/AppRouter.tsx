import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./page/home/Home";
import ViewReport from "./page/report/ViewReport";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "report",
        element: <ViewReport />,
      },
    ],
  },
]);

export default AppRouter;
