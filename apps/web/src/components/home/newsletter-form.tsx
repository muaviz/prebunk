"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || "You're subscribed! Check your inbox for a confirmation.");
        setEmail("");
      } else {
        setStatus('error');
        setMessage(data.detail || data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setStatus('error');
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <section className="py-24 bg-muted border-t border-border">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Stay Ahead of the Narrative</h2>
        <p className="text-muted-foreground mt-4 mb-8">
          Subscribe to our weekly digest — the top threats, the facts, and what you can say.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
          <Input 
            type="email" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
            className="flex-1 bg-background border-border text-foreground h-11"
          />
          <Button type="submit" disabled={status === 'loading'} className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </Button>
        </form>
        
        <div className="h-8 mt-4">
          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
