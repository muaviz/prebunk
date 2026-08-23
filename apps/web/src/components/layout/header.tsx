import { LogOut, User } from "lucide-react";
import { MobileNav } from "./mobile-nav";

export function Header({ userEmail }: { userEmail?: string }) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{userEmail || "Admin"}</span>
        </div>
        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border border-transparent hover:border-destructive/20">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
