"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      router.replace("/not-authenticated");
    }
  }, [user, token, isLoading, router]);

  if (isLoading) return null; // ou um loading spinner

  return <>{children}</>;
}