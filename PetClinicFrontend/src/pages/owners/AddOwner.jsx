import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOwner } from "@/services/api";

const AddOwner = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await createOwner(data);
      toast.success("✅ Owner added successfully!");
      reset();
      navigate("/owner");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to add owner.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full max-w-xl shadow-md border border-gray-200">
        <CardContent className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-green-700 mb-8">
            Add Owner
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
                placeholder="Enter full name"
                className="h-11 text-base"
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
                placeholder="Enter email"
                className="h-11 text-base"
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
                placeholder="Enter phone number"
                className="h-11 text-base"
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
                Save Owner
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOwner;
