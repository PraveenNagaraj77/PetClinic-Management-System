import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createVet } from "@/services/api";

const AddVet = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await createVet(data);
      toast.success("✅ Vet added successfully!");
      navigate("/vets");
    } catch (err) {
      console.error("❌ Add vet error:", err);
      toast.error(err.response?.data?.message || "Failed to add vet.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <CardContent className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center">
            Add New Vet
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Vet Name</Label>
              <Input
                id="name"
                {...register("name")}
                required
                className="mt-1"
                placeholder="Enter vet name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                required
                className="mt-1"
                placeholder="vet@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                {...register("phone")}
                required
                className="mt-1"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                {...register("specialization")}
                required
                className="mt-1"
                placeholder="E.g. Surgery, Dentistry"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                Add Vet
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/vets")}
                className="w-full sm:w-auto"
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

export default AddVet;
