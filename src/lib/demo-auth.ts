import type { UserRole } from "@/lib/types/database";

const SESSION_KEY = "carrera_demo_user";
const USERS_KEY = "carrera_demo_users";
const VENDOR_KEY = "carrera_demo_vendor";

export interface DemoUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface DemoVendorData {
  name: string;
  location_name: string;
  city: string;
  latitude: number;
  longitude: number;
  capacity_total: number;
  hours: Record<string, string>;
  menuItems: {
    item_name: string;
    description_original: string;
    description_translated?: string;
    price: number;
    tags?: string[];
  }[];
}

function readUsers(): DemoUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: DemoUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function demoSignUp(email: string, role: UserRole): DemoUser {
  const users = readUsers();
  const existing = users.find((u) => u.email === email);
  const user: DemoUser = existing ?? {
    id: crypto.randomUUID(),
    email,
    role,
  };

  if (!existing) {
    users.push(user);
    writeUsers(users);
  } else {
    existing.role = role;
    writeUsers(users);
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function demoSignIn(email: string): DemoUser | null {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function demoQuickEnter(role: UserRole): DemoUser {
  const email = `demo-${role}@carrera-gourmet.local`;
  return demoSignUp(email, role);
}

export function demoSignOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getDemoVendor(userId: string): DemoVendorData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${VENDOR_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDemoVendor(userId: string, data: DemoVendorData) {
  localStorage.setItem(`${VENDOR_KEY}_${userId}`, JSON.stringify(data));
}

export function authErrorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (message === "Failed to fetch") {
    return "No se pudo conectar con Supabase. Configura .env.local o usa el modo demo.";
  }
  if (lower.includes("rate limit") || lower.includes("email rate limit")) {
    return "Límite de emails de Supabase alcanzado. Desactiva 'Confirm email' en Authentication → Email, o espera ~1 hora.";
  }
  if (lower.includes("user already registered")) {
    return "Este email ya está registrado. Intenta iniciar sesión.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirma tu email antes de iniciar sesión, o desactiva la confirmación en Supabase.";
  }

  return message;
}
