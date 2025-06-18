import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import {
  getAllPets,
  getPetsByOwner,
  getMyOwnerProfile,
  deletePet,
} from "@/services/api";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [ownerId, setOwnerId] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const roles = decoded?.roles || [];

        const isAdminUser =
          roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPERADMIN");
        const isSuperAdminUser = roles.includes("ROLE_SUPERADMIN");

        setIsAdmin(isAdminUser);
        setIsSuperAdmin(isSuperAdminUser);

        let petList = [];

        if (isAdminUser) {
          const res = await getAllPets();
          petList = res?.data || [];
        } else {
          try {
            const ownerRes = await getMyOwnerProfile();
            const currentOwnerId = ownerRes?.data?.id;
            setOwnerId(currentOwnerId);

            const res = await getPetsByOwner(currentOwnerId);
            petList = res?.data || [];
          } catch (err) {
            if (err.response?.status === 404) {
              toast.error("⚠️ Your owner profile is missing. Please contact admin.");
              setPets([]);
              return;
            } else {
              throw err;
            }
          }
        }

        setPets(Array.isArray(petList) ? petList : []);
      } catch (err) {
        console.error("❌ Fetch pets error", err);
        toast.error("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [token]);

  const handleEdit = (id) => navigate(`/pets/edit/${id}`);
  const handleDelete = async (id) => {
    const decoded = jwtDecode(token);
    const roles = decoded?.roles || [];
    const isSuperAdmin = roles.includes("ROLE_SUPERADMIN");

    if (!isSuperAdmin) {
      toast.error("🚫 Only SuperAdmin can delete pets");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      await deletePet(id);
      toast.success("✅ Pet deleted successfully");
      setPets((prev) => prev.filter((pet) => pet.id !== id));
    } catch (err) {
      console.error("❌ Delete pet error", err);
      if (err?.response?.status === 400 || err?.response?.status === 409) {
        toast.error("❌ Cannot delete: This pet is linked to appointments.");
      } else {
        toast.error("❌ Failed to delete pet. Please try again later.");
      }
    }
  };

  const canEdit = (petOwnerId) => isAdmin || petOwnerId === ownerId;
  const canDelete = () => isSuperAdmin;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700">🐶 Pet List</h2>
          <Button
            onClick={() => navigate("/pets/add")}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            Add Pet
          </Button>
        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <p className="text-center">Loading pets...</p>
        ) : pets.length === 0 ? (
          <p className="text-center text-gray-500">
            {ownerId === null && !isAdmin
              ? "⚠️ Your owner profile is missing. Please contact admin."
              : "No pets found."}
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white border rounded-lg shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Breed</th>
                    <th className="p-4">Birth Date</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {pets.map((pet) => (
                    <tr key={pet.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{pet.name}</td>
                      <td className="p-4">{pet.breed || "N/A"}</td>
                      <td className="p-4">{pet.birthDate}</td>
                      <td className="p-4">{pet.owner?.name || "N/A"}</td>
                      <td className="p-4 text-center space-x-2">
                        {canEdit(pet.owner?.id) && (
                          <Button
                            onClick={() => handleEdit(pet.id)}
                            size="icon"
                            variant="outline"
                            className="text-green-600"
                          >
                            <Pencil size={16} />
                          </Button>
                        )}
                        {canDelete() && (
                          <Button
                            onClick={() => handleDelete(pet.id)}
                            size="icon"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow"
                >
                  <p className="text-xs text-gray-500 mb-1">ID: {pet.id}</p>
                  <p className="text-lg font-semibold text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-700">🐾 Breed: {pet.breed || "N/A"}</p>
                  <p className="text-sm text-gray-700">🎂 Birth Date: {pet.birthDate}</p>
                  <p className="text-sm text-gray-700">👤 Owner: {pet.owner?.name || "N/A"}</p>

                 <div className="mt-3 flex flex-row gap-2 justify-end">
  {canEdit(pet.owner?.id) && (
    <Button
      size="sm"
      onClick={() => handleEdit(pet.id)}
      className="px-2 py-1 text-xs h-7 w-auto min-w-fit"
    >
      Edit
    </Button>
  )}
  {canDelete() && (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => handleDelete(pet.id)}
      className="px-2 py-1 text-xs h-7 w-auto min-w-fit"
    >
      Delete
    </Button>
  )}
</div>


                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PetList;
