"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Insert into subscribers table
    if (authData.user) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/subscribers/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: authData.user.id,
            contact_email: email,
            org_name: orgName,
            org_type: orgType,
            country: country,
            status: "pending"
          })
        });
        if (!res.ok) {
          throw new Error("Failed to create subscriber record.");
        }
      } catch (err) {
        console.error("Failed to insert subscriber via API", err);
        setError("Failed to create your profile. Please try again or contact support.");
        setLoading(false);
        return; // Do not redirect
      }
    }

    // Redirect to login
    router.push("/login?message=Registration successful. Please log in.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-foreground">Create an Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Register your organization for access to the Prebunk dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div id="error-message" className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                id="email" type="email" placeholder="m@example.com" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                id="password" type="password" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="orgName" className="text-sm font-medium text-foreground">Organization Name</label>
              <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                id="orgName" type="text" placeholder="Community Center" required 
                value={orgName} onChange={(e) => setOrgName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="orgType" className="text-sm font-medium text-foreground">Org Type</label>
                <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                  id="orgType" type="text" placeholder="e.g. Mosque" required 
                  value={orgType} onChange={(e) => setOrgType(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-foreground">Country</label>
                <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                  id="country" type="text" placeholder="UK" required 
                  value={country} onChange={(e) => setCountry(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
