import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">New Project</h1>
        <p className="mt-2 text-sm text-[#8888aa]">Create a workspace for tasks, members, and deadlines.</p>
      </div>
      <ProjectForm />
    </div>
  );
}
