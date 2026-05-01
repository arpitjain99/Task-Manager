import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderKanban, Shield } from "lucide-react";

export default function HomePage() {
  const { userId } = auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-bg-primary text-[#f0f0ff]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-sm text-accent">TeamFlow</p>
          <h1 className="text-5xl font-bold tracking-normal sm:text-6xl">Team task management with roles built in.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#8888aa]">
            Create projects, invite teammates, assign work, and track progress without losing control of who can change what.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover" href="/sign-up">
              Get started <ArrowRight size={18} />
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-bg-border px-5 py-3 text-sm font-semibold text-[#f0f0ff] transition hover:bg-bg-hover" href="/sign-in">
              Sign in
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            [FolderKanban, "Projects", "Organize tasks by project and deadline."],
            [CheckCircle2, "Task flow", "Move work from todo to done with clear ownership."],
            [Shield, "Role access", "Admins manage projects while members update their tasks."],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-card border border-bg-border bg-bg-surface p-5">
              <Icon className="mb-4 text-accent" size={24} />
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#8888aa]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
