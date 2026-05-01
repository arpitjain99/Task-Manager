"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

export function MemberActions({ projectId, memberUserId, memberName, role, projectStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role);
  const [error, setError] = useState("");
  const isCompleted = projectStatus === "COMPLETED";

  async function updateRole() {
    if (selectedRole === role) return;

    setError("");
    setRoleLoading(true);
    const response = await fetch(`/api/projects/${projectId}/members/${memberUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole }),
    });
    setRoleLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not update role.");
      setSelectedRole(role);
      return;
    }

    router.refresh();
  }

  async function removeMember() {
    const confirmed = window.confirm(`Remove ${memberName} from this project?`);
    if (!confirmed) return;

    setError("");
    setLoading(true);
    const response = await fetch(`/api/projects/${projectId}/members/${memberUserId}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not remove member.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <select
          aria-label={`Role for ${memberName}`}
          value={selectedRole}
          disabled={roleLoading || isCompleted}
          onChange={(event) => setSelectedRole(event.target.value)}
          className={`${inputClass} w-28 px-2 py-2 text-xs`}
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="button"
          aria-label={`Save role for ${memberName}`}
          title={isCompleted ? "Reopen project before changing roles" : "Save role"}
          disabled={roleLoading || selectedRole === role || isCompleted}
          onClick={updateRole}
          className="rounded-lg border border-bg-border p-2 text-[#8888aa] transition hover:bg-bg-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
        </button>
      </div>
      <Button type="button" variant="danger" disabled={loading || isCompleted} onClick={removeMember} className="px-3 py-2">
        <UserMinus size={16} />
        {loading ? "Removing..." : "Remove"}
      </Button>
      {error ? <p className="text-xs text-red-200">{error}</p> : null}
    </div>
  );
}
