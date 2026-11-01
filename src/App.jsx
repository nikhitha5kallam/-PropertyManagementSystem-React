import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import Admin from "./pages/Admin";
import AdminPendingProperties from "./pages/Admin-Pending-Properties";
import AdminApproveProperty from "./pages/Admin-Approve-Property";
import AdminUsers from "./pages/Admin-Users";
import AdminReports from "./pages/Admin-Reports";

// Owner Pages
import Owner from "./pages/Owner";
import PostProperty from "./pages/PostProperty";
import MyProperties from "./pages/MyProperties";
import OwnerApplications from "./pages/OwnerApplications";

// Tenant Pages
import Tenant from "./pages/Tenant";
import Properties from "./pages/Properties";
import SavedProperties from "./pages/SavedProperties";
import MyRentals from "./pages/MyRentals";
import TenantProfile from "./pages/TenantProfile";
import TenantApplication from "./pages/TenantApplication";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home and Authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/admin/pending-properties"
          element={<AdminPendingProperties />}
        />
        <Route
          path="/admin/approved-properties"
          element={<AdminApproveProperty />}
        />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* Owner Routes */}
        <Route path="/owner" element={<Owner />} />
        <Route
          path="/owner/post-property"
          element={<PostProperty />}
        />
        <Route
          path="/owner/my-properties"
          element={<MyProperties />}
        />
        <Route
          path="/owner/applications"
          element={<OwnerApplications />}
        />

        {/* Tenant Routes */}
        <Route path="/tenant" element={<Tenant />} />
        <Route
          path="/tenant/properties"
          element={<Properties />}
        />
        <Route
          path="/tenant/saved"
          element={<SavedProperties />}
        />
        <Route
          path="/tenant/my-rentals"
          element={<MyRentals />}
        />
        <Route
          path="/tenant/profile"
          element={<TenantProfile />}
        />
        <Route
          path="/tenant/apply"
          element={<TenantApplication />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;