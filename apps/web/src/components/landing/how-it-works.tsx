import { Search, Sparkles, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "1. We Predict",
      description: "We monitor early-stage chatter to detect emerging anti-Muslim claims before they reach the mainstream."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      title: "2. We Pre-bunk",
      description: "Our system deconstructs the narrative and builds fact-backed, religiously-grounded refutations in advance."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-700" />,
      title: "3. You Prepare",
      description: "When the claim finally hits your social feed, you're already equipped with the exact scripts to confidently shut it down."
    }
  ];

  return (
    <section className="py-24 bg-muted/50 border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">How Prebunking Works</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Don't wait to be reactive. Get ahead of the conversation and stop the spread of misinformation at the source.
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
