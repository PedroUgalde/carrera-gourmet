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
import {
  authErrorMessage,
  demoQuickEnter,
  demoSignIn,
  demoSignUp,
} from "@/lib/demo-auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const supabase = createClient();
  const demoMode = !isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectAfterAuth = (role: string) => {
    if (redirect) {
      router.push(redirect);
    } else if (role === "vendor") {
      router.push("/vendor/dashboard");
    } else {
      router.push("/tourist/search");
    }
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (demoMode) {
        const user = demoSignIn(email) ?? demoSignUp(email, "tourist");
        toast.success("Signed in (demo mode)");
        redirectAfterAuth(user.role);
        return;
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      redirectAfterAuth(profile?.role ?? "tourist");
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: "tourist" | "vendor") => {
    const user = demoQuickEnter(role);
    toast.success(`Signed in as demo ${role}`);
    redirectAfterAuth(user.role);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2D6A4F]">Sign in</CardTitle>
        {demoMode && (
          <p className="text-sm text-amber-700">
            Modo demo activo. Usa los botones rápidos o cualquier email registrado
            previamente en demo.
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

        <form onSubmit={handleLogin} className="space-y-4">
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
              required={!demoMode}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A4F] hover:bg-[#2D6A4F]/90"
          >
            {loading ? "Signing in..." : demoMode ? "Sign in (Demo)" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="text-[#E85D04] hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8F0] p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
