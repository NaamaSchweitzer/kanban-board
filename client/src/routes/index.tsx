import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Login from "../pages/Login";
import DashBoard from "../pages/DashBoard";
import Layout from "../layout";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  // Public routes (with layout)
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <Home /> },
          { path: "settings", element: <Settings /> },
          { path: "profile", element: <Profile /> },
          { path: "dashboard/:boardId", element: <DashBoard /> },
        ],
      },
    ],
  },
]);
