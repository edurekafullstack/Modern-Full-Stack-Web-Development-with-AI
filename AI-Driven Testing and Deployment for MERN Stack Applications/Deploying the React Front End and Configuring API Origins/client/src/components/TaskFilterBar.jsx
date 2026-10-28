import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function TaskFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  counts = { all: 0, todo: 0, inProgress: 0, done: 0 },
  onResetFilters,
  isFiltered,
}) {
  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks by title or details..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status Segmented Tabs */}
      <div className="status-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={statusFilter === 'all'}
          className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('all')}
        >
          All
          <span className="tab-badge">{counts.all}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={statusFilter === 'todo'}
          className={`status-tab ${statusFilter === 'todo' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('todo')}
        >
          To Do
          <span className="tab-badge">{counts.todo}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={statusFilter === 'in-progress'}
          className={`status-tab ${statusFilter === 'in-progress' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('in-progress')}
        >
          In Progress
          <span className="tab-badge">{counts.inProgress}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={statusFilter === 'done'}
          className={`status-tab ${statusFilter === 'done' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('done')}
        >
          Done
          <span className="tab-badge">{counts.done}</span>
        </button>
      </div>

      {/* Selects: Priority & Sort */}
      <div className="filter-controls">
        <div className="select-wrapper">
          <SlidersHorizontal size={14} className="select-icon" />
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="filter-select"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="select-wrapper">
          <ArrowUpDown size={14} className="select-icon" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
            aria-label="Sort tasks"
          >
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
            <option value="titleAsc">Title (A - Z)</option>
            <option value="newest">Newest Added</option>
          </select>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            title="Reset active filters"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
