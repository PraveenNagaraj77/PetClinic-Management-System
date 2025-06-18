import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import {
  getAllOwners,
  getMyOwnerProfile,
  createPet,
  createPetForOwner,
} from "@/services/api"; // ✅ centralized APIs

const AddPet = () => {
  const { register, handleSubmit, reset } = useForm();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [role, setRole] = useState("");
  const [currentOwnerId, setCurrentOwnerId] = useState(null);

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const roles = decoded?.roles || [];

      const isAdmin = roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPERADMIN");
      setRole(isAdmin ? "ADMIN" : "USER");

      const fetchOwnerData = async () => {
        try {
          if (isAdmin) {
            const res = await getAllOwners();
            setOwners(res.data);
          } else {
            const res = await getMyOwnerProfile();
            if (res.data?.id) {
              setOwners([res.data]); // Optional internal use
              setCurrentOwnerId(res.data.id);
            } else {
              toast.error("❌ Owner profile not found.");
            }
          }
        } catch (error) {
          console.error("❌ Error fetching owner data:", error);
          toast.error("Failed to load owner info.");
        }
      };

      fetchOwnerData();
    } catch (error) {
      console.error("Token decoding failed:", error);
    }
  }, [token]);

  const onSubmit = async (data) => {
    const ownerId = role === "USER" ? currentOwnerId : data.ownerId;

    if (!ownerId) {
      toast.error("❌ Owner ID is missing.");
      return;
    }

    const payload = {
      name: data.name,
      breed: data.breed,
      birthDate: data.birthDate,
    };

    try {
      if (role === "ADMIN") {
        await createPet(ownerId, payload); // For Admins
      } else {
        await createPetForOwner(payload); // For regular Users
      }

      toast.success("✅ Pet added successfully!");
      reset();
      navigate("/pets");
    } catch (err) {
      console.error("❌ Add Pet Error:", err);
      toast.error(err.response?.data?.message || "Failed to add pet.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <CardContent className="p-10">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
            Add New Pet
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name</Label>
              <Input
                id="name"
                {...register("name")}
                required
                placeholder="Enter pet name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                {...register("breed")}
                required
                placeholder="e.g., Golden Retriever"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                required
              />
            </div>

            {role === "ADMIN" && (
              <div className="space-y-2">
                <Label htmlFor="ownerId">Select Owner</Label>
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

            <div className="flex justify-between pt-6">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2">
                Save Pet
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

export default AddPet;
