import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
// import Register from "../pages/Register";
// import Login from "../pages/Login";
import DashBoard from "../pages/DashBoard";
import Layout from "../layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "settings", element: <Settings /> },
      { path: "profile", element: <Profile /> },
      { path: "dashboard/:boardId", element: <DashBoard /> },
    ],
  },
]);
