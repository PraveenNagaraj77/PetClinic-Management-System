import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getAllOwners, deleteOwner } from "@/services/api";

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [roles, setRoles] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const decodedRoles = decoded?.roles || [];
        setRoles(decodedRoles);
      } catch (error) {
        console.error("❌ Token decode error:", error);
      }
    }
  }, [token]);

  const isSuperAdmin = roles.includes("ROLE_SUPERADMIN");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await getAllOwners();
        setOwners(res.data);
      } catch (err) {
        toast.error("❌ Failed to load owners");
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const handleDelete = async (id) => {
    if (!isSuperAdmin) {
      toast.error("❌ Only SuperAdmin can delete owners");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this owner?")) return;

    try {
      await deleteOwner(id);
      setOwners((prev) => prev.filter((o) => o.id !== id));
      toast.success("✅ Owner deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Deletion failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Owner List</h2>
          <Button
            onClick={() => navigate("/owner/add")}
            size="sm"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            Add Owner
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto bg-white border rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.length > 0 ? (
                owners.map((owner) => (
                  <tr key={owner.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{owner.id}</td>
                    <td className="p-4">{owner.name}</td>
                    <td className="p-4">{owner.email}</td>
                    <td className="p-4">{owner.phone}</td>
                    <td className="p-4 space-x-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/owner/edit/${owner.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(owner.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No owners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
<div className="md:hidden space-y-4">
  {owners.length > 0 ? (
    owners.map((owner) => (
      <div
        key={owner.id}
        className="bg-white p-4 rounded-lg shadow border border-gray-200"
      >
        <p className="text-xs text-gray-500 mb-1">ID: {owner.id}</p>
        <p className="font-semibold text-gray-800 text-lg mb-1">{owner.name}</p>
        <p className="text-sm text-gray-700 mb-1">📧 {owner.email}</p>
        <p className="text-sm text-gray-700 mb-3">📞 {owner.phone}</p>

        <div className="flex flex-row gap-2 justify-end">
  <Button
    onClick={() => navigate(`/owner/edit/${owner.id}`)}
    className="px-3 py-1 text-xs h-8"
  >
    Edit
  </Button>
  <Button
    variant="destructive"
    onClick={() => handleDelete(owner.id)}
    className="px-3 py-1 text-xs h-8"
  >
    Delete
  </Button>
</div>
      </div>
    ))
  ) : (
    <div className="text-center text-gray-500">No owners found.</div>
  )}
</div>
      </div>
    </div>
  );
};

export default OwnerList;
