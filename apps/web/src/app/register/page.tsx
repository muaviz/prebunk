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
        await fetch(process.env.NEXT_PUBLIC_API_URL + "/subscribers/", {
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
      } catch (err) {
        console.error("Failed to insert subscriber via API", err);
      }
    }

    // Redirect to login (assuming email confirmation is disabled or they just need to log in)
    router.push("/login?message=Registration successful. Please log in.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-50">Create an Account</CardTitle>
          <CardDescription className="text-slate-400">
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
              <label htmlFor="email" className="text-sm font-medium text-slate-200">Email</label>
              <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                id="email" type="email" placeholder="m@example.com" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label>
              <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                id="password" type="password" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="orgName" className="text-sm font-medium text-slate-200">Organization Name</label>
              <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                id="orgName" type="text" placeholder="Community Center" required 
                value={orgName} onChange={(e) => setOrgName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="orgType" className="text-sm font-medium text-slate-200">Org Type</label>
                <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                  id="orgType" type="text" placeholder="e.g. Mosque" required 
                  value={orgType} onChange={(e) => setOrgType(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-slate-200">Country</label>
                <Input aria-invalid={!!error} aria-describedby={error ? "error-message" : undefined} 
                  id="country" type="text" placeholder="UK" required 
                  value={country} onChange={(e) => setCountry(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-50"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <div className="text-sm text-center text-slate-400">
              Already have an account? <Link href="/login" className="text-sky-400 hover:underline">Log in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
