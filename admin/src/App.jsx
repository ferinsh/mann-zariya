import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import AddProduct from "./pages/AddProduct/AddProduct";
import EditProduct from "./pages/EditProduct/EditProduct";
import Login from "./pages/Login/Login";
import AdminLayout from "./components/AdminLayout/AdminLayout";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />



    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/products"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <Products />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/products/new"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <AddProduct />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/products/:id/edit"
      element={
        <ProtectedRoute>
          <AdminLayout>
            <EditProduct />
          </AdminLayout>
        </ProtectedRoute>
      }
    />

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;