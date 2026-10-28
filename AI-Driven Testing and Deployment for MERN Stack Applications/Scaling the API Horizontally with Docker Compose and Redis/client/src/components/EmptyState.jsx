import { CheckSquare, SearchX, Plus, RefreshCw } from 'lucide-react';

export default function EmptyState({
  isFiltered = false,
  onCreateClick,
  onResetFilters,
}) {
  if (isFiltered) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon search">
          <SearchX size={36} />
        </div>
        <h3 className="empty-state-title">No matching tasks found</h3>
        <p className="empty-state-desc">
          We couldn't find any tasks matching your current search or filter criteria.
        </p>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onResetFilters}
        >
          <RefreshCw size={14} />
          <span>Reset Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <CheckSquare size={40} />
      </div>
      <h3 className="empty-state-title">No tasks yet</h3>
      <p className="empty-state-desc">
        Your task list is clean and clear. Create your first task to plan, track, and conquer your day!
      </p>
      {onCreateClick && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onCreateClick}
        >
          <Plus size={16} />
          <span>Create Your First Task</span>
        </button>
      )}
    </div>
  );
}
