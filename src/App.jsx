import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/dashboard"
          element={<UserDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}
