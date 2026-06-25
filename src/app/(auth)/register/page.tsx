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
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      if (demoMode) {
        demoSignUp(email, role);
        toast.success("Cuenta demo creada");
        redirectByRole(role);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (error) throw error;

      toast.success("Cuenta creada. Ya puedes entrar.");
      redirectByRole(role);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    demoQuickEnter(demoRole);
    toast.success(`Entraste como demo ${demoRole}`);
    redirectByRole(demoRole);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <GraffitiLogo size="md" />
      </div>

      <Card className="street-card border-orange-200 shadow-md">
        <CardHeader>
          <CardTitle className="street-heading text-2xl normal-case">
            Crear cuenta
          </CardTitle>
          {demoMode && (
            <p className="text-sm text-amber-700">
              Supabase no está configurado. Regístrate en modo demo o entra
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Soy...</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === "tourist" ? "default" : "outline"}
                  className={
                    role === "tourist"
                      ? "rounded-full bg-[#FF6B00] hover:bg-[#E85D04]"
                      : "rounded-full"
                  }
                  onClick={() => setRole("tourist")}
                >
                  Turista
                </Button>
                <Button
                  type="button"
                  variant={role === "vendor" ? "default" : "outline"}
                  className={
                    role === "vendor"
                      ? "rounded-full bg-neutral-900 hover:bg-neutral-800"
                      : "rounded-full"
                  }
                  onClick={() => setRole("vendor")}
                >
                  Comerciante
                </Button>
              </div>
            </div>
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar contraseña</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-orange-100"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full street-btn"
            >
              {loading ? "Creando..." : demoMode ? "Registrarse (Demo)" : "Registrarse"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-neutral-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-[#FF6B00] hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <StreetShell centered showTagline={false}>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </StreetShell>
  );
}
