import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  Folder,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Format UTC midnight due date safely
function formatTaskDueDate(value) {
  if (!value) return null;
  const due = new Date(value);
  const now = new Date();

  // Reset to midnight for relative comparison
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dueUtc = new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate()));

  const diffDays = Math.round((dueUtc - today) / (1000 * 60 * 60 * 24));

  const formattedDate = dueUtc.toLocaleDateString(undefined, {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: dueUtc.getUTCFullYear() !== today.getUTCFullYear() ? 'numeric' : undefined,
  });

  let label = formattedDate;
  let isOverdue = false;
  let isToday = false;

  if (diffDays < 0) {
    isOverdue = true;
    label = `Overdue (${formattedDate})`;
  } else if (diffDays === 0) {
    isToday = true;
    label = 'Due Today';
  } else if (diffDays === 1) {
    label = 'Due Tomorrow';
  }

  return { label, isOverdue, isToday };
}

export default function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isBusy,
}) {
  const [expanded, setExpanded] = useState(false);
  const dateInfo = formatTaskDueDate(task.dueDate);

  const isDone = task.status === 'done';
  const isInProgress = task.status === 'in-progress';

  const handleCircleClick = () => {
    if (isBusy) return;
    // Fast cycle: todo -> in-progress -> done -> todo
    const nextStatus = isDone ? 'todo' : isInProgress ? 'done' : 'in-progress';
    onStatusChange(task, nextStatus);
  };

  return (
    <div className={`task-card ${task.status} priority-${task.priority || 'medium'} ${isBusy ? 'busy' : ''}`}>
      <div className="task-card-main">
        {/* Quick status circle button */}
        <button
          type="button"
          className={`status-circle-btn ${task.status}`}
          onClick={handleCircleClick}
          disabled={isBusy}
          title={`Status: ${task.status} (click to advance)`}
          aria-label={`Toggle task status, currently ${task.status}`}
        >
          {isDone ? (
            <CheckCircle2 size={20} className="status-icon done" />
          ) : isInProgress ? (
            <Clock size={20} className="status-icon in-progress" />
          ) : (
            <Circle size={20} className="status-icon todo" />
          )}
        </button>

        {/* Task Content */}
        <div className="task-details">
          <div className="task-title-row">
            <h3 className={`task-title ${isDone ? 'completed' : ''}`}>
              {task.title}
            </h3>

            {/* Status direct badge / dropdown */}
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              disabled={isBusy}
              className={`status-chip ${task.status}`}
              aria-label="Change status"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Description */}
          {task.description && (
            <div className="task-description-wrapper">
              <p className={`task-description ${expanded ? 'expanded' : 'clamped'}`}>
                {task.description}
              </p>
              {task.description.length > 90 && (
                <button
                  type="button"
                  className="btn-expand-desc"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <>
                      <span>Show less</span> <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      <span>Show more</span> <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Metadata badges row */}
          <div className="task-meta">
            {/* Priority Chip */}
            <span className={`priority-badge ${task.priority || 'medium'}`}>
              <span className="priority-dot" />
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
            </span>

            {/* Due date chip */}
            {dateInfo && (
              <span
                className={`due-date-badge ${
                  dateInfo.isOverdue && !isDone
                    ? 'overdue'
                    : dateInfo.isToday && !isDone
                    ? 'today'
                    : ''
                }`}
              >
                <Calendar size={13} />
                <span>{dateInfo.label}</span>
              </span>
            )}

            {/* Project chip */}
            {task.project?.name && (
              <span className="project-badge">
                <Folder size={12} />
                <span>{task.project.name}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="task-card-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(task)}
            disabled={isBusy}
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            className="btn-icon delete"
            onClick={() => onDelete(task)}
            disabled={isBusy}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
