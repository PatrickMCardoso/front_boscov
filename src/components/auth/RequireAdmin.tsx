"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !token) {
        router.replace("/not-authenticated");
      } else if (user.tipoUsuario !== "admin") {
        router.replace("/not-authorized");
      }
    }
  }, [user, token, isLoading, router]);

  if (isLoading) return null;

  return <>{children}</>;
}