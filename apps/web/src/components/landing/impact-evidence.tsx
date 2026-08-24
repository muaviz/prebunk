import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function ImpactEvidence() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">Why Prebunking Works</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Our methodology is grounded in social science and inoculation theory. By exposing people to a weakened form of misinformation along with facts, we build cognitive immunity.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          <ScrollReveal delay={50} className="glass-surface p-6 rounded-xl border border-border/50 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold mb-4">
              73%
            </div>
            <h3 className="font-semibold text-foreground mb-2">Reduction in Susceptibility</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Prebunking reduces susceptibility to misinformation by up to 73% across diverse demographics.
            </p>
            <a href="https://www.cam.ac.uk/research/news/psychological-inoculation-campaign-could-reduce-susceptibility-to-misinformation-by-up-to-73" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
              Cambridge University (2022) &rarr;
            </a>
          </ScrollReveal>

          <ScrollReveal delay={150} className="glass-surface p-6 rounded-xl border border-border/50 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold mb-4">
              3m+
            </div>
            <h3 className="font-semibold text-foreground mb-2">Lasting Cognitive Immunity</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Inoculation-based interventions remain effective for at least 3 months after exposure.
            </p>
            <a href="https://www.science.org/doi/10.1126/sciadv.abo6254" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
              Science Advances (2022) &rarr;
            </a>
          </ScrollReveal>

          <ScrollReveal delay={250} className="glass-surface p-6 rounded-xl border border-border/50 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive text-xl font-bold mb-4">
              45%
            </div>
            <h3 className="font-semibold text-foreground mb-2">Rise in Hate Crimes</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Anti-Muslim hate crimes surged significantly in recent years, largely driven by online narratives.
            </p>
            <a href="#" className="text-xs text-muted-foreground hover:underline">
              FBI UCR Data & CAIR Reports &rarr;
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
