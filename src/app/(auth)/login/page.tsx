"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GraffitiLogo } from "@/components/branding/GraffitiLogo";
import { StreetShell } from "@/components/layout/StreetShell";
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
        toast.success("Sesión iniciada (modo demo)");
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
    toast.success(`Entraste como demo ${role}`);
    redirectAfterAuth(user.role);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <GraffitiLogo size="md" />
      </div>

      <Card className="street-card border-orange-200 shadow-md">
        <CardHeader>
          <CardTitle className="street-heading text-2xl normal-case">
            Entrar
          </CardTitle>
          {demoMode && (
            <p className="text-sm text-amber-700">
              Modo demo activo. Usa los botones rápidos o cualquier email
              registrado previamente.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {demoMode && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-[#FF6B00] font-semibold text-[#FF6B00]"
                onClick={() => handleQuickDemo("tourist")}
              >
                Demo Turista
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-neutral-900 font-semibold text-neutral-900"
                onClick={() => handleQuickDemo("vendor")}
              >
                Demo Puesto
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
                className="border-orange-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-orange-100"
                required={!demoMode}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full street-btn"
            >
              {loading ? "Entrando..." : demoMode ? "Entrar (Demo)" : "Entrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-neutral-600">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-[#FF6B00] hover:underline">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <StreetShell centered showTagline={false}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </StreetShell>
  );
}
