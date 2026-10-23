"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Code2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/60 via-ink-50 to-ink-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Link href="/" className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">PyLearn</span>
          </Link>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start learning Python for free</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</> : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
          <p className="mt-4 text-center text-xs text-ink-400">
            <Link href="/courses" className="hover:text-ink-700">← Or browse the courses first</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}