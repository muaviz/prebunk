import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export const metadata = {
  title: "Privacy Policy — Prebunk",
  description: "How Prebunk handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="relative flex-1 overflow-hidden bg-background py-24">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <ScrollReveal className="mb-14">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: August 24, 2026</p>
          </ScrollReveal>
          
          <ScrollReveal delay={100} className="prose prose-invert prose-green max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                <p>Prebunk is designed with privacy as a core principle. We collect minimal data necessary to provide our service:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Browser Extension:</strong> When you use the &quot;Prebunk this text&quot; feature, only the explicitly selected text is sent to our servers for analysis. We do not track your browsing history or page visits.</li>
                  <li><strong>Website Analytics:</strong> We do not use third-party tracking cookies or aggressive analytics on our web dashboard.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Handle Your Data</h2>
                <p>Text snippets analyzed by our backend undergo the following process:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Real-time Processing:</strong> Text is analyzed in real-time and immediately discarded from our active memory once the response is sent back to your browser.</li>
                  <li><strong>No LLM Training:</strong> Data processed through our generative AI fallback (Google Gemini) is explicitly opted out of being used for model training.</li>
                  <li><strong>No Logging:</strong> We do not log or store the text snippets you highlight.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Services</h2>
                <p>We rely on trusted third-party infrastructure:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Supabase:</strong> For our core claims database.</li>
                  <li><strong>Google GenAI:</strong> For advanced narrative analysis.</li>
                  <li><strong>Vercel & Railway:</strong> For hosting our frontend and API backend.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Contact</h2>
                <p>For any privacy-related questions or data deletion requests, please contact the Prebunk team via our GitHub repository or hackathon submission page.</p>
              </section>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
