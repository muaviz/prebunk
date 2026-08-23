import { Search, Brain, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-6 w-6 text-blue-500" />,
      title: "1. We Monitor",
      description: "We track social media and forums for emerging anti-Muslim claims before they reach the mainstream."
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "2. We Analyze",
      description: "AI identifies the claim pattern and finds the facts to counter it effectively."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "3. You're Prepared",
      description: "Get refutations backed by the Quran, Hadith, and academic sources, ready to share."
    }
  ];

  return (
    <section className="py-24 bg-muted/50 border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">How Prebunk Works</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            A simple, proactive approach to stopping hate speech before it spreads.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center mb-2">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
