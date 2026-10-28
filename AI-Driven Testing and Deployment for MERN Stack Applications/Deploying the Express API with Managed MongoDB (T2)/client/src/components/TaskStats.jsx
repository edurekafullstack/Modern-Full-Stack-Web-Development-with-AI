import { useState, useMemo } from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, TrendingUp } from 'lucide-react';

export default function TaskStats({ tasks = [] }) {
  const [now] = useState(() => Date.now());

  const { total, doneCount, inProgressCount, todoCount, overdueCount, completionRate } = useMemo(() => {
    const totalCount = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;

    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === 'done') return false;
      return new Date(t.dueDate).getTime() < now;
    }).length;

    const rate = totalCount > 0 ? Math.round((done / totalCount) * 100) : 0;

    return {
      total: totalCount,
      doneCount: done,
      inProgressCount: inProgress,
      todoCount: todo,
      overdueCount: overdue,
      completionRate: rate,
    };
  }, [tasks, now]);

  return (
    <div className="stats-grid">
      {/* Total Tasks Card */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Tasks</span>
          <div className="stat-icon-wrap total">
            <ListTodo size={18} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{total}</div>
          <div className="stat-desc">
            <span>{todoCount} pending to start</span>
          </div>
        </div>
      </div>

      {/* In Progress Card */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">In Progress</span>
          <div className="stat-icon-wrap in-progress">
            <Clock size={18} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{inProgressCount}</div>
          <div className="stat-desc">
            <span>Active work items</span>
          </div>
        </div>
      </div>

      {/* Completed Card */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Completed</span>
          <div className="stat-icon-wrap completed">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{doneCount}</div>
          <div className="stat-desc">
            <span>{completionRate}% finished</span>
          </div>
        </div>
      </div>

      {/* Productivity / Overdue Card */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Completion Rate</span>
          <div className="stat-icon-wrap progress">
            {overdueCount > 0 ? <AlertTriangle size={18} /> : <TrendingUp size={18} />}
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{completionRate}%</div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="stat-desc">
            {overdueCount > 0 ? (
              <span className="overdue-text">{overdueCount} task{overdueCount > 1 ? 's' : ''} overdue</span>
            ) : (
              <span>All deadlines on track</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
