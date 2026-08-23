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
          <div key={i} className="p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/30 transition-colors">
            <f.icon className="h-6 w-6 text-sky-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">{f.title}</h3>
            <p className="text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
