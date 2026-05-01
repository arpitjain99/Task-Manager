import { z } from "zod";

const optionalDate = z
  .string()
  .optional()
  .transform((value) => (value ? new Date(value) : undefined));

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  deadline: optionalDate,
});

export const updateProjectSchema = createProjectSchema.partial();

export const updateProjectWithStatusSchema = updateProjectSchema.extend({
  status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
});

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required").max(120),
  description: z.string().trim().max(800).optional().or(z.literal("")),
  assigneeId: z.string().optional().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z
    .string()
    .optional()
    .refine((value) => !value || new Date(value) >= new Date(new Date().toDateString()), {
      message: "Due date cannot be in the past",
    })
    .transform((value) => (value ? new Date(value) : undefined)),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(800).optional().or(z.literal("")),
  assigneeId: z.string().optional().nullable().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((value) => {
      if (value === undefined) return undefined;
      if (value === null || value === "") return null;
      return new Date(value);
    }),
});

export function jsonError(error, status = 400) {
  return Response.json({ error }, { status });
}
