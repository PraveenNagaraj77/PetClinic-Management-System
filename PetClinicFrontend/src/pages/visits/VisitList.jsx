import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Trash2, X } from "lucide-react";
import api from "@/services/api";

const VisitList = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const decoded = jwtDecode(token);
        const userRoles = (decoded?.roles || []).map((r) => r.toUpperCase());
        setRoles(userRoles);

        const isPrivileged = userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_SUPERADMIN");
        const endpoint = isPrivileged ? "/visits" : "/visits/mine";

        const res = await api.get(endpoint);
        setVisits(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching visits", err);
        toast.error("Failed to load visits");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [token, location.state?.refresh]);

  const isSuperAdmin = useMemo(() => roles.includes("ROLE_SUPERADMIN"), [roles]);
  const isAdmin = useMemo(() => roles.includes("ROLE_ADMIN"), [roles]);
  const isUser = useMemo(() => roles.includes("ROLE_USER"), [roles]);

  const handleDeleteVisit = async (visitId) => {
    if (!isSuperAdmin) {
      toast.error("🚫 Only SuperAdmin can delete a visit");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await api.delete(`/visits/${visitId}`);
      toast.success("✅ Appointment deleted successfully");
      setVisits((prev) => prev.filter((v) => v.id !== visitId));
    } catch (err) {
      console.error("❌ Delete visit error:", err);
      toast.error("Failed to delete appointment");
    }
  };

  const handleCancel = async (visit) => {
    if (!window.confirm("Do you really want to cancel this appointment?")) return;

    try {
      await api.put(`/visits/${visit.id}`, { ...visit, status: "CANCELLED" });
      toast.success("✅ Appointment cancelled");
      setVisits((prev) =>
        prev.map((v) => (v.id === visit.id ? { ...v, status: "CANCELLED" } : v))
      );
    } catch (err) {
      console.error("❌ Cancel visit error:", err);
      toast.error("Unable to cancel appointment");
    }
  };

  const handleStatusChange = async (visitId, newStatus) => {
    try {
      const visitToUpdate = visits.find((v) => v.id === visitId);
      const updatedVisit = { ...visitToUpdate, status: newStatus };

      await api.put(`/visits/${visitId}`, updatedVisit);
      toast.success("✅ Status updated");
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const base = "text-xs font-semibold px-3 py-1 rounded-full inline-block";
    switch (status) {
      case "UPCOMING":
        return `${base} bg-blue-100 text-blue-700`;
      case "COMPLETED":
        return `${base} bg-green-100 text-green-700`;
      case "CANCELLED":
        return `${base} bg-red-100 text-red-700`;
      default:
        return base;
    }
  };

  if (loading) return <p className="text-center p-6 text-lg">Loading visits...</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-purple-700">🩺 Appointments</h2>
        <Button
          onClick={() => navigate("/visits/add")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          + Book Appointment
        </Button>
      </div>

      {visits.length === 0 ? (
        <p className="text-gray-600">No visits found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {visits.map((visit) => (
            <Card key={visit.id} className="border border-gray-200 shadow-md rounded-xl">
              <CardContent className="p-5 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  🐾 {visit.pet?.name || <span className="text-red-500">[No Pet]</span>}
                </h3>
                <p className="text-gray-700">Breed: {visit.pet?.breed || "-"}</p>
                <p className="text-gray-700">Vet: Dr. {visit.vet?.name || "-"}</p>
                <p className="text-gray-700">Date: {new Date(visit.visitDate).toLocaleDateString()}</p>
                <p className="text-gray-700">Description: {visit.description || "-"}</p>

                <div>
                  {isAdmin || isSuperAdmin ? (
                    <div className="mt-2">
                      <label className="text-sm font-medium text-gray-700">Status:</label>
                      <select
                        value={visit.status}
                        onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className={getStatusBadge(visit.status)}>{visit.status}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 flex-wrap">
                  {isUser && visit.status === "UPCOMING" && (
                    <Button
                      onClick={() => handleCancel(visit)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </Button>
                  )}

                  {isSuperAdmin && (
                    <Button
                      onClick={() => handleDeleteVisit(visit.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  )}

                  {isAdmin && !isSuperAdmin && (
                    <Button
                      onClick={() => toast.error("🚫 Only SuperAdmin can delete a visit")}
                      className="bg-red-400 hover:bg-red-500 text-white text-sm cursor-not-allowed"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitList;
