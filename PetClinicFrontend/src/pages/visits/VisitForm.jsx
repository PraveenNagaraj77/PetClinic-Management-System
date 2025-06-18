import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import {
  getAllVets,
  getAllPets,
  getMyPets,
  getVisitById,
  createVisit,
  updateVisit,
} from "@/services/api";

const VisitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    petId: "",
    vetId: "",
  });

  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const isEditMode = Boolean(id);

  // 🐾 Fetch pets based on role
  useEffect(() => {
    const fetchPets = async () => {
      try {
        console.log("🔐 JWT Token:", token);
        const decoded = jwtDecode(token);
        console.log("🔍 Decoded JWT:", decoded);

        const roles = decoded?.roles?.map((role) => role.toLowerCase()) || [];
        console.log("🧾 Roles:", roles);

        const isUser = roles.includes("role_user");

        const petsRes = isUser ? await getMyPets() : await getAllPets();
console.log("🐶 Pets Fetched:", petsRes);
setPets(Array.isArray(petsRes?.data) ? petsRes.data : []);

      } catch (err) {
        console.error("❌ Error fetching pets:", err);
        toast.error("Failed to load pets.");
      }
    };

    fetchPets();
  }, [token]);

  // 🩺 Fetch vets
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const data = await getAllVets();
        console.log("🩺 Vets Fetched:", data);
        setVets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching vets:", err);
        toast.error("Failed to load vets.");
      }
    };

    fetchVets();
  }, []);

  // ✏️ If edit mode, fetch visit details
  useEffect(() => {
    const fetchVisit = async () => {
      if (!isEditMode) {
        setLoading(false);
        return;
      }

      try {
        const res = await getVisitById(id);
        console.log("✏️ Visit to Edit:", res);

        setFormData({
          date: res.date,
          description: res.description,
          petId: res.pet?.id?.toString() || "",
          vetId: res.vet?.id?.toString() || "",
        });
      } catch (err) {
        console.error("❌ Error fetching visit:", err);
        toast.error("Failed to load visit.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      petId: parseInt(formData.petId),
      vetId: parseInt(formData.vetId),
    };

    try {
      if (isEditMode) {
        await updateVisit(id, payload);
        toast.success("✅ Visit updated successfully");
      } else {
        await createVisit(payload);
        toast.success("✅ Visit booked successfully");
      }

      navigate("/visits", { state: { refresh: true } });
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error("Failed to save visit");
    }
  };

  if (loading) {
    return <p className="text-center p-6 text-lg">Loading visit form...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditMode ? "✏️ Edit Appointment" : "📅 Book New Appointment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="petId">Pet</Label>
          <select
            id="petId"
            name="petId"
            value={formData.petId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Pet --</option>
            {pets.length > 0 ? (
              pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.breed})
                </option>
              ))
            ) : (
              <option disabled>No pets available</option>
            )}
          </select>
        </div>

        <div>
          <Label htmlFor="vetId">Vet</Label>
          <select
            id="vetId"
            name="vetId"
            value={formData.vetId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Vet --</option>
            {vets.length > 0 ? (
              vets.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  Dr. {vet.name} ({vet.specialization})
                </option>
              ))
            ) : (
              <option disabled>No vets available</option>
            )}
          </select>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            {isEditMode ? "Update Visit" : "Create Visit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VisitForm;
