import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "@/services/api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        username: formData.name,
      };

      await registerUser(payload);
      toast.success("✅ Registration successful! Please login.");
      reset();
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardContent className="p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-sm text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm text-gray-700">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                {...register("phone")}
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm text-gray-700">
                Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                {...register("address")}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2.5 rounded-md transition"
            >
              Register
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-700 font-medium hover:underline"
            >
              Login here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
