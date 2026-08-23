import { Search, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">How Prebunk Works</h2>
          <p className="text-muted-foreground mt-4">A three-step pipeline to intercept coordinated hate campaigns.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10"></div>
          
          {[
            { 
              icon: Search, 
              title: "1. Monitor", 
              desc: "We ingest data from fringe platforms and news sources, mapping rhetoric to our Islamophobia taxonomy." 
            },
            { 
              icon: TrendingUp, 
              title: "2. Forecast", 
              desc: "Our Velocity Risk Score (VRS) algorithm detects sudden spikes, predicting which narratives will breach the mainstream." 
            },
            { 
              icon: ShieldCheck, 
              title: "3. Inoculate", 
              desc: "Prebunk automatically generates and distributes educational briefs to community leaders before the narrative peaks." 
            }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-background p-6 rounded-md border border-border w-full md:w-1/3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
