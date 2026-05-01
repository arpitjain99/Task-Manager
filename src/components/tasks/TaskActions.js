"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Clock, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

export function TaskActions({ projectId, task, canAdmin, canUpdateStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(task.priority);
  const [error, setError] = useState("");

  async function updateStatus(status) {
    setError("");
    setLoading(true);
    const response = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not update status.");
      return;
    }
    router.refresh();
  }

  async function deleteTask() {
    setError("");
    setLoading(true);
    const response = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not delete task.");
      return;
    }
    router.refresh();
  }

  async function updatePriority() {
    if (selectedPriority === task.priority) return;

    setError("");
    setPriorityLoading(true);
    const response = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: selectedPriority }),
    });
    setPriorityLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not update priority.");
      setSelectedPriority(task.priority);
      return;
    }

    router.refresh();
  }

  if (!canAdmin && !canUpdateStatus) return null;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        {canAdmin ? (
          <div className="flex items-center gap-2">
            <select
              aria-label={`Priority for ${task.title}`}
              value={selectedPriority}
              disabled={priorityLoading}
              onChange={(event) => setSelectedPriority(event.target.value)}
              className={`${inputClass} w-28 px-2 py-2 text-xs`}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <button
              type="button"
              aria-label={`Save priority for ${task.title}`}
              title="Save priority"
              disabled={priorityLoading || selectedPriority === task.priority}
              onClick={updatePriority}
              className="rounded-lg border border-bg-border p-2 text-[#8888aa] transition hover:bg-bg-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
            </button>
          </div>
        ) : null}
        {canUpdateStatus && task.status !== "IN_PROGRESS" && task.status !== "DONE" ? (
          <Button type="button" variant="ghost" disabled={loading} onClick={() => updateStatus("IN_PROGRESS")}>
            <Clock size={16} />
            Start
          </Button>
        ) : null}
        {canUpdateStatus && task.status !== "DONE" ? (
          <Button type="button" variant="ghost" disabled={loading} onClick={() => updateStatus("DONE")}>
            <CheckCircle2 size={16} />
            Done
          </Button>
        ) : null}
        {canAdmin ? (
          <Button type="button" variant="danger" disabled={loading} onClick={deleteTask}>
            <Trash2 size={16} />
            Delete
          </Button>
        ) : null}
      </div>
      {error ? (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>
      ) : null}
    </div>
  );
}
