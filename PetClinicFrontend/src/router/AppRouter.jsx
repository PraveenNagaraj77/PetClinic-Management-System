import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Dashboards
import SuperAdminDashboard from "@/pages/dashboard/SuperAdminDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import UserDashboard from "@/pages/dashboard/UserDashboard";

// Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Owner CRUD
import OwnerList from "@/pages/owners/OwnerList";
import AddOwner from "@/pages/owners/AddOwner";
import EditOwner from "@/pages/owners/EditOwner";

// Pet CRUD
import PetList from "@/pages/pets/PetList";
import AddPet from "@/pages/pets/AddPet";
import EditPet from "@/pages/pets/EditPet";

// Vet CRUD
import VetList from "@/pages/vets/VetList";
import AddVet from "@/pages/vets/AddVet";
import EditVet from "@/pages/vets/EditVet";
import VetDetail from "@/pages/vets/VetDetail";

// Visit (Appointment) CRUD
import VisitList from "@/pages/visits/VisitList";
import VisitForm from "@/pages/visits/VisitForm";


import HomePage from "@/pages/homepage/HomePage"; // 👈 Import this


const AppRouter = () => {
  const { user } = useAuth();

  const isRole = (role) =>
    user?.role === role || (Array.isArray(role) && role.includes(user?.role));

  return (
    <Routes>


<Route path="/" element={<HomePage />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes (with Layout) */}
      {user && (
        <Route element={<DashboardLayout />}>
          {/* Dashboards */}
          <Route
            path="/superadmin/dashboard"
            element={
              isRole("SUPERADMIN") ? (
                <SuperAdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              isRole(["ADMIN", "SUPERADMIN"]) ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/user/dashboard"
            element={
              isRole(["USER", "ADMIN", "SUPERADMIN"]) ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Owner CRUD */}
          <Route
            path="/owner"
            element={
              isRole(["ADMIN", "SUPERADMIN"]) ? (
                <OwnerList />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/owner/add"
            element={
              isRole(["ADMIN", "SUPERADMIN"]) ? (
                <AddOwner />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/owner/edit/:id"
            element={
              isRole(["ADMIN", "SUPERADMIN"]) ? (
                <EditOwner />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Pet CRUD */}
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/add" element={<AddPet />} />
          <Route path="/pets/edit/:id" element={<EditPet />} />

          {/* Vet CRUD */}
          <Route path="/vets" element={<VetList />} />
          <Route path="/vets/add" element={<AddVet />} />
          <Route path="/vets/edit/:id" element={<EditVet />} />
          <Route path="/vets/:id" element={<VetDetail />} />

          {/* Visit (Appointment) CRUD */}
          <Route path="/visits" element={<VisitList />} />
          <Route path="/visits/add" element={<VisitForm />} />
          <Route path="/visits/edit/:id" element={<VisitForm />} />
        </Route>
      )}

      {/* Fallback */}
      <Route
        path="*"
        element={
          user?.role ? (
            <Navigate to={`/${user.role.toLowerCase()}/dashboard`} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default AppRouter;
