"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

export function ProjectForm({ project }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(project ? `/api/projects/${project.id}` : "/api/projects", {
      method: project ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(typeof data.error === "string" ? data.error : "Please check the project details.");
      return;
    }

    router.push(`/projects/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-5 rounded-card border border-bg-border bg-bg-surface p-6">
      {error ? <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      <Field label="Project name">
        <input name="name" required maxLength={100} defaultValue={project?.name || ""} className={inputClass} placeholder="Mobile launch plan" />
      </Field>
      <Field label="Description">
        <textarea name="description" rows={4} maxLength={500} defaultValue={project?.description || ""} className={inputClass} placeholder="What is this team working toward?" />
      </Field>
      <Field label="Deadline">
        <input name="deadline" type="date" defaultValue={project?.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : ""} className={inputClass} />
      </Field>
      <Button disabled={loading} className="w-fit">
        {project ? <Save size={18} /> : <Plus size={18} />}
        {loading ? "Saving..." : project ? "Save project" : "Create project"}
      </Button>
    </form>
  );
}
