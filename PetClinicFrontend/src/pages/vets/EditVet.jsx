import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getVetById, updateVet } from "@/services/api";

const EditVet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
    },
  });

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const vet = await getVetById(id);
        reset(vet);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVet();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await updateVet(id, data);
      toast.success("✅ Vet updated successfully!");
      navigate("/vets");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update vet.");
    }
  };

  if (loading)
    return <p className="p-6 text-center text-lg">Loading vet data...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <CardContent className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center">
            Edit Vet
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                required
                className="mt-1"
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
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                {...register("specialization")}
                required
                className="mt-1"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Vet"}
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

export default EditVet;
