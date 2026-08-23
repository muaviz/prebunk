import { Search, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-900/30 border-y border-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-100">How Prebunk Works</h2>
          <p className="text-slate-400 mt-4">A three-step pipeline to intercept coordinated hate campaigns.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10"></div>
          
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
            <div key={i} className="flex flex-col items-center text-center bg-slate-950 p-6 rounded-xl border border-slate-800 w-full md:w-1/3">
              <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 border border-sky-500/20">
                <step.icon className="h-8 w-8 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
