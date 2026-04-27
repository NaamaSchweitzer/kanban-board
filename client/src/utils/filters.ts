import type { Card } from "../types/kanban";

export type DueDateFilter = "overdue" | "thisWeek" | "none";

export interface Filters {
  keyword: string;
  assigneeIds: string[];
  tagLabels: string[];
  dueDate: DueDateFilter | null;
}

export const defaultFilters: Filters = {
  keyword: "",
  assigneeIds: [],
  tagLabels: [],
  dueDate: null,
};

export const activeFilterCount = (filters: Filters): number =>
  (filters.keyword.trim() ? 1 : 0) +
  filters.assigneeIds.length +
  filters.tagLabels.length +
  (filters.dueDate ? 1 : 0);

export const cardMatchesFilters = (card: Card, filters: Filters): boolean => {
  // keyword: substring match in title or description
  if (filters.keyword) {
    const q = filters.keyword.toLowerCase();
    const haystack = `${card.title} ${card.description ?? ""}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  // assignee: card must be assigned to one of the selected users
  if (filters.assigneeIds.length > 0) {
    if (!card.assignee) return false;
    if (!filters.assigneeIds.includes(card.assignee._id)) return false;
  }

  // tag: card must have at least one of the selected tag labels
  if (filters.tagLabels.length > 0) {
    if (!card.tags.some((t) => filters.tagLabels.includes(t.label)))
      return false;
  }

  // due date
  if (filters.dueDate === "none") {
    if (card.dueDate) return false;
  } else if (filters.dueDate === "overdue") {
    if (!card.dueDate || new Date(card.dueDate) >= new Date()) return false;
  } else if (filters.dueDate === "thisWeek") {
    if (!card.dueDate) return false;
    const due = new Date(card.dueDate);
    const now = new Date();
    const inSevenDays = new Date(now);
    inSevenDays.setDate(now.getDate() + 7);
    if (due < now || due > inSevenDays) return false;
  }

  return true;
};
