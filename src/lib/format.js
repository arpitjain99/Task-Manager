import { format, isPast, isToday } from "date-fns";

export function formatDate(date) {
  if (!date) return "No date";
  return format(new Date(date), "MMM d, yyyy");
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === "DONE") return false;
  const dueDate = new Date(task.dueDate);
  return isPast(dueDate) && !isToday(dueDate);
}

export function initials(name = "U") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
