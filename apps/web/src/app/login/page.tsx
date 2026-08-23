"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const errorParam = searchParams.get("error");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Hard navigation forces the proxy/middleware to re-read the new session cookie
      window.location.href = "/dashboard";
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-foreground">Sign in</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email and password to login to the Prebunk dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {message && (
            <div className="bg-emerald-500/15 text-emerald-400 text-sm p-3 rounded-md border border-emerald-500/20">
              {message}
            </div>
          )}
          {errorParam && (
            <div id="error-param" className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {errorParam}
            </div>
          )}
          {error && (
            <div id="error-state" className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <Input aria-invalid={!!(error || errorParam)} aria-describedby={error ? "error-state" : (errorParam ? "error-param" : undefined)} 
              id="email" type="email" placeholder="m@example.com" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <Input aria-invalid={!!(error || errorParam)} aria-describedby={error ? "error-state" : (errorParam ? "error-param" : undefined)} 
              id="password" type="password" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-border text-foreground"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
