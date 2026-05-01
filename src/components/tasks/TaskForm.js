"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

export function TaskForm({ projectId, members }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setLoading(true);
    const payload = Object.fromEntries(new FormData(form).entries());

    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Please check the task details.");
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-card border border-bg-border bg-bg-surface p-5">
      <h2 className="text-base font-semibold text-white">Add task</h2>
      {error ? <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      <Field label="Title">
        <input name="title" required maxLength={120} className={inputClass} placeholder="Prepare release notes" />
      </Field>
      <Field label="Description">
        <textarea name="description" rows={3} maxLength={800} className={inputClass} placeholder="Details, scope, or acceptance criteria" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Assignee">
          <select name="assigneeId" className={inputClass}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.name} - {member.user.email}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Priority">
          <select name="priority" defaultValue="MEDIUM" className={inputClass}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </Field>
        <Field label="Due date">
          <input name="dueDate" type="date" className={inputClass} />
        </Field>
      </div>
      <Button disabled={loading} className="w-fit">
        <Plus size={18} />
        {loading ? "Adding..." : "Add task"}
      </Button>
    </form>
  );
}
