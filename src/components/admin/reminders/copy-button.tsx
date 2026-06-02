"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={handleCopy}
    >
      {copied ? "Copied!" : label}
    </Button>
  );
}
