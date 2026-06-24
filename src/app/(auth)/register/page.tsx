"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { authErrorMessage, demoSignUp, demoQuickEnter } from "@/lib/demo-auth";
import type { UserRole } from "@/lib/types/database";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as UserRole) ?? "tourist";
  const supabase = createClient();
  const demoMode = !isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(
    defaultRole === "vendor" ? "vendor" : "tourist"
  );
  const [loading, setLoading] = useState(false);

  const redirectByRole = (userRole: UserRole) => {
    router.push(userRole === "vendor" ? "/vendor/dashboard" : "/tourist/search");
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (demoMode) {
        demoSignUp(email, role);
        toast.success("Demo account created!");
        redirectByRole(role);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (error) throw error;

      toast.success("Account created! You can sign in now.");
      redirectByRole(role);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    demoQuickEnter(demoRole);
    toast.success(`Entered as demo ${demoRole}`);
    redirectByRole(demoRole);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2D6A4F]">Create account</CardTitle>
        {demoMode && (
          <p className="text-sm text-amber-700">
            Supabase no está configurado. Puedes registrarte en modo demo o entrar
            directamente abajo.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {demoMode && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#E85D04] text-[#E85D04]"
              onClick={() => handleQuickDemo("tourist")}
            >
              Demo Tourist
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[#2D6A4F] text-[#2D6A4F]"
              onClick={() => handleQuickDemo("vendor")}
            >
              Demo Vendor
            </Button>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label>I am a...</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={role === "tourist" ? "default" : "outline"}
                className={
                  role === "tourist"
                    ? "bg-[#E85D04] hover:bg-[#E85D04]/90"
                    : ""
                }
                onClick={() => setRole("tourist")}
              >
                Tourist
              </Button>
              <Button
                type="button"
                variant={role === "vendor" ? "default" : "outline"}
                className={
                  role === "vendor"
                    ? "bg-[#2D6A4F] hover:bg-[#2D6A4F]/90"
                    : ""
                }
                onClick={() => setRole("vendor")}
              >
                Vendor
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A4F] hover:bg-[#2D6A4F]/90"
          >
            {loading ? "Creating account..." : demoMode ? "Register (Demo)" : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E85D04] hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8F0] p-4">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
