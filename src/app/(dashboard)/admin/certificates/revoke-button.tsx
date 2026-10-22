"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { revokeCertificate } from "../actions";
import { useRouter } from "next/navigation";

export function RevokeButton({ certificateId }: { certificateId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRevoke() {
    if (!confirm("Are you sure you want to revoke this certificate?")) return;
    setLoading(true);
    await revokeCertificate(certificateId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button 
      onClick={handleRevoke} 
      disabled={loading}
      className="text-ink-400 hover:text-rose-600 transition"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}