import { Radar, Activity, Zap, FileText } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Narrative Radar",
      desc: "Live monitoring of known Islamophobic tropes across the information ecosystem.",
      icon: Radar
    },
    {
      title: "Forecast Engine",
      desc: "Mathematical velocity models that identify coordinated amplification before it succeeds.",
      icon: Activity
    },
    {
      title: "Public Taxonomy",
      desc: "An open-source, comprehensive encyclopedia of anti-Muslim rhetoric and its historical origins.",
      icon: FileText
    },
    {
      title: "Inoculation Briefs",
      desc: "AI-generated counter-messaging ready for deployment by journalists and advocates.",
      icon: Zap
    }
  ];

  return (
    <section className="py-24 max-w-5xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div key={i} className="p-8 rounded-md bg-card border border-border hover:shadow-md transition-shadow transition-colors">
            <f.icon className="h-6 w-6 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
