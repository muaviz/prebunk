import { fetchApi } from "@/lib/api";
import { Claim } from "@/types";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { ClaimCard } from "@/components/claims/claim-card";
import { Shield } from "lucide-react";

export const revalidate = 60;

export default async function ClaimsPage() {
  let claims: Claim[] = [];
  try {
    claims = await fetchApi<Claim[]>("/claims/");
  } catch (error) {
    console.error("Failed to fetch claims:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 bg-muted/20 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12 border-b border-border pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Claim Database</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Browse our comprehensive database of debunked anti-Muslim tropes.
              </p>
            </div>
          </div>
          
          {claims.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">No claims found in the database.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
