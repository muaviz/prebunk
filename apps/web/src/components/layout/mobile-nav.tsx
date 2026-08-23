"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Activity, FileText, Bell, Settings, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Radar", icon: Shield },
    { href: "/dashboard/trends", label: "Trends", icon: Activity },
    { href: "/dashboard/briefs", label: "Briefs", icon: FileText },
    { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
    { href: "/dashboard/tips", label: "Tips", icon: Lightbulb },
    { href: "/dashboard/generate", label: "Generate", icon: Zap },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-muted-foreground">
        <Menu className="h-6 w-6" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end">
          <div className="w-64 bg-card h-full shadow-2xl flex flex-col p-4 border-l border-border">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold tracking-tight text-foreground">MENU</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-muted-foreground">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="flex-1 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
