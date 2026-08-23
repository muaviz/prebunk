"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyResponseButtonProps {
  personalScript: string;
}

export function CopyResponseButton({ personalScript }: CopyResponseButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!personalScript) return;
    try {
      await navigator.clipboard.writeText(personalScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button 
      onClick={handleCopy}
      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy Response"}
    </Button>
  );
}
