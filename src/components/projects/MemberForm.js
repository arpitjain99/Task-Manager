"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

export function MemberForm({ projectId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setLoading(true);
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch(`/api/projects/${projectId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Unable to add member.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-card border border-bg-border bg-bg-surface p-5">
      <h2 className="text-base font-semibold text-white">Add member</h2>
      {error ? <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      <Field label="Email">
        <input name="email" type="email" required className={inputClass} placeholder="teammate@example.com" />
      </Field>
      <Field label="Role">
        <select name="role" defaultValue="MEMBER" className={inputClass}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
      </Field>
      <Button disabled={loading} className="w-fit">
        <UserPlus size={18} />
        {loading ? "Adding..." : "Add member"}
      </Button>
    </form>
  );
}
