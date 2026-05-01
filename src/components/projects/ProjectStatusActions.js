"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ProjectStatusActions({ projectId, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nextStatus = status === "COMPLETED" ? "ACTIVE" : "COMPLETED";

  async function updateStatus() {
    setError("");
    setLoading(true);
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not update project status.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <Button type="button" variant={status === "COMPLETED" ? "ghost" : "primary"} disabled={loading} onClick={updateStatus}>
        {status === "COMPLETED" ? <RotateCcw size={18} /> : <CheckCircle2 size={18} />}
        {loading ? "Saving..." : status === "COMPLETED" ? "Reopen project" : "Mark complete"}
      </Button>
      {error ? <p className="text-xs text-red-200">{error}</p> : null}
    </div>
  );
}
