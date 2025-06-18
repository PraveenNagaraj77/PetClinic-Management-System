import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getOwnerById, updateOwner } from "@/services/api";

const EditOwner = () => {
  const { id } = useParams();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await getOwnerById(id);
        const { name, email, phone } = res.data;
        setValue("name", name);
        setValue("email", email);
        setValue("phone", phone);
        setLoading(false);
      } catch (err) {
        toast.error("❌ Failed to load owner data");
        console.error(err);
      }
    };
    fetchOwner();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await updateOwner(id, data);
      toast.success("✅ Owner updated successfully!");
      navigate("/owner");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to update owner.");
    }
  };

  if (loading) {
    return <p className="text-center text-lg py-12">Loading owner data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full max-w-xl shadow-md border border-gray-200">
        <CardContent className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-green-700 mb-8">
            Edit Owner
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                required
                className="h-11 text-base"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                required
                className="h-11 text-base"
                placeholder="Enter email"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="text"
                {...register("phone")}
                required
                className="h-11 text-base"
                placeholder="Enter phone number"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/owner")}
                className="w-full sm:w-auto px-6 py-3 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-6 py-3 text-base text-white"
              >
                Update Owner
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditOwner;
