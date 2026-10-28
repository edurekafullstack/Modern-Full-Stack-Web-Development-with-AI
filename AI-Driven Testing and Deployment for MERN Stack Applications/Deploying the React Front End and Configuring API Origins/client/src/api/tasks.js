import { apiFetch } from "./client.js";

export function getTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(query ? `/tasks?${query}` : "/tasks");
}

// Resolves to the created task, with `project` populated as { _id, name }.
export function createTask(fields) {
  return apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(fields),
  });
}

// Resolves to the updated task. Note: `project` comes back as an id, not populated.
export function updateTask(id, changes) {
  return apiFetch(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

// The API responds 204 No Content, so this resolves to null on success.
export function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: "DELETE" });
}
