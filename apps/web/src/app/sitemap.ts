import { fetchApi } from "@/lib/api";
import { Claim } from "@/types";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let claims: Claim[] = [];
  try { claims = await fetchApi<Claim[]>("/claims/"); } catch {}

  const claimPages = claims.map(claim => ({
    url: `https://prebunk.vercel.app/claims/${claim.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: claim.is_featured ? 0.9 : 0.7,
  }));

  return [
    { url: "https://prebunk.vercel.app", lastModified: new Date(), priority: 1.0 },
    { url: "https://prebunk.vercel.app/claims", lastModified: new Date(), priority: 0.8 },
    { url: "https://prebunk.vercel.app/privacy", lastModified: new Date(), priority: 0.5 },
    ...claimPages,
  ];
}
