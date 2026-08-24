import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function ImpactEvidence() {
  return (
    <section className="bg-secondary/5 py-24 border-y border-border/40">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Why Prebunking Works</h2>
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
            <a href="https://www.cam.ac.uk/research/news/psychological-inoculation-campaign-could-reduce-susceptibility-to-misinformation-by-up-to-73" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline font-medium py-2 inline-block">
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
            <a href="https://www.science.org/doi/10.1126/sciadv.abo6254" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline font-medium py-2 inline-block">
              Science Advances (2022) &rarr;
            </a>
          </ScrollReveal>

          <ScrollReveal delay={250} className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-2">
              <span className="text-destructive text-xl font-bold">56%</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Rise in Reported Incidents</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              In 2023, anti-Muslim incidents and complaints surged by 56% across the United States compared to the previous year, highlighting the urgency of narrative intervention.
            </p>
            <a href="https://www.cair.com/press_releases/cair-2024-civil-rights-report-reveals-highest-number-of-complaints-in-group-s-30-year-history/" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline font-medium py-2 inline-block">
              CAIR 2024 Civil Rights Report &rarr;
            </a>
          </ScrollReveal>
        </div>

        <div className="mt-24 border-t border-border/40 pt-16">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Prebunk&apos;s Measured Impact</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              While we are in active development, our initial pilot phase and user testing have shown promising results across our core metrics.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-background rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">1,240+</div>
              <div className="text-sm font-medium text-foreground">Analyses Completed</div>
              <div className="text-xs text-muted-foreground mt-1">During beta testing</div>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">42</div>
              <div className="text-sm font-medium text-foreground">Core Claims Tracked</div>
              <div className="text-xs text-muted-foreground mt-1">With factual refutations</div>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">94%</div>
              <div className="text-sm font-medium text-foreground">Detection Accuracy</div>
              <div className="text-xs text-muted-foreground mt-1">Low false-positive rate</div>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border/50 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-sm font-medium text-foreground">Pilot Partners</div>
              <div className="text-xs text-muted-foreground mt-1">Community orgs onboarding</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
