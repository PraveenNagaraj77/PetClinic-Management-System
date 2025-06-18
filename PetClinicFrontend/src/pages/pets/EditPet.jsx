import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import {
  getPetById,
  updatePet,
  getAllOwners,
} from "@/services/api"; // ✅ Centralized APIs

const EditPet = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const roles = decoded?.roles || [];
    const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPERADMIN");
    setUserRole(isAdmin ? "ADMIN" : "USER");

    const fetchData = async () => {
      try {
        // 🔹 1. Fetch pet details
        const res = await getPetById(id);
        const { name, breed, birthDate, owner } = res.data;

        setValue("name", name);
        setValue("breed", breed);
        setValue("birthDate", birthDate?.slice(0, 10)); // yyyy-mm-dd
        setValue("ownerId", owner?.id); // even if hidden for USER

        // 🔹 2. Fetch owners if ADMIN
        if (isAdmin) {
          const ownersRes = await getAllOwners();
          setOwners(ownersRes.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch pet/owner:", err);
        toast.error("Failed to load pet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, setValue]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      breed: data.breed,
      birthDate: data.birthDate,
      owner: {
        id: data.ownerId,
      },
    };

    try {
      await updatePet(id, payload);
      toast.success("✅ Pet updated successfully!");
      navigate("/pets");
    } catch (err) {
      console.error("❌ Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update pet.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-lg">Loading pet data...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <CardContent className="p-10">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
            Edit Pet
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name</Label>
              <Input id="name" {...register("name")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" {...register("breed")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" type="date" {...register("birthDate")} required />
            </div>

            {userRole === "ADMIN" && (
              <div className="space-y-2">
                <Label htmlFor="ownerId">Owner</Label>
                <select
                  id="ownerId"
                  {...register("ownerId")}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="">-- Select Owner --</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {userRole === "USER" && (
              <input type="hidden" {...register("ownerId")} />
            )}

            <div className="flex justify-between pt-6">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2">
                Update Pet
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/pets")}
                className="px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPet;
