import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function ImpactEvidence() {
  return (
    <section className="bg-secondary/5 py-24 border-y border-border/40">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">Why Prebunking Works</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Our methodology is grounded in social science and inoculation theory. By exposing people to a weakened form of misinformation along with facts, we build cognitive immunity.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-12">
          <ScrollReveal delay={50} className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-2">
              <span className="text-primary text-xl font-bold">73%</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Reduction in Susceptibility</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              Prebunking reduces susceptibility to misinformation by up to 73% across diverse demographics.
            </p>
            <a href="https://www.cam.ac.uk/research/news/psychological-inoculation-campaign-could-reduce-susceptibility-to-misinformation-by-up-to-73" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline font-medium">
              Cambridge University (2022) &rarr;
            </a>
          </ScrollReveal>

          <ScrollReveal delay={150} className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-2">
              <span className="text-primary text-xl font-bold">3m+</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Lasting Cognitive Immunity</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              Inoculation-based interventions remain effective for at least 3 months after exposure.
            </p>
            <a href="https://www.science.org/doi/10.1126/sciadv.abo6254" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline font-medium">
              Science Advances (2022) &rarr;
            </a>
          </ScrollReveal>

          <ScrollReveal delay={250} className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-2">
              <span className="text-destructive text-xl font-bold">45%</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Rise in Hate Crimes</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              Anti-Muslim hate crimes surged significantly in recent years, largely driven by online narratives.
            </p>
            <a href="#" className="text-sm text-primary hover:underline font-medium">
              FBI UCR Data & CAIR Reports &rarr;
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
