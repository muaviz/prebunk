"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function NavLink({ href, icon, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-sky-400/10 text-sky-400 border-l-2 border-sky-400 rounded-l-none" 
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-50"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
