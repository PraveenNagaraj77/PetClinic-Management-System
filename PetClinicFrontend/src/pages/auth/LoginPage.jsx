import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "@/services/api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data);
      const token = res.data.token;
      if (!token) throw new Error("Token not received");

      login(token);
      toast.success("✅ Login successful!");

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.roles?.[0]?.replace("ROLE_", "")?.toLowerCase() || "user";
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error("Invalid credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-lg rounded-2xl">
        <CardContent className="p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
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
                  {...register("password")}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2.5 rounded-md transition"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-green-700 font-medium hover:underline"
            >
              Register here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
