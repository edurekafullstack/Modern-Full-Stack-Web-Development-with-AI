import { useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api/tasks.js';
import TaskStats from './TaskStats.jsx';
import TaskFilterBar from './TaskFilterBar.jsx';
import TaskCard from './TaskCard.jsx';
import TaskModal from './TaskModal.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import EmptyState from './EmptyState.jsx';
import { Toast } from './Toast.jsx';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';

// PATCH returns `project` as a bare id; keep the populated { _id, name } we already have.
function mergeUpdated(previous, updated) {
  const projectUnchanged =
    typeof updated.project === 'string' && previous.project?._id === updated.project;
  return projectUnchanged ? { ...updated, project: previous.project } : updated;
}

export default function TaskList({ isCreateModalOpen, setIsCreateModalOpen }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Modals
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [submittingModal, setSubmittingModal] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Async row operation states
  const [busyId, setBusyId] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    let cancelled = false;

    async function initialFetch() {
      try {
        const data = await getTasks({ limit: 50, sort: 'dueDate' });
        if (!cancelled) setTasks(data?.tasks ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load tasks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialFetch();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks({ limit: 50, sort: 'dueDate' });
      setTasks(data?.tasks ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Handle Create or Edit submission
  const handleModalSubmit = async (formData) => {
    setSubmittingModal(true);
    setModalError(null);

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, formData);
        setTasks((current) =>
          current.map((t) => (t._id === editingTask._id ? mergeUpdated(t, updated) : t))
        );
        setEditingTask(null);
        showToast('Task updated successfully', 'success');
      } else {
        const newTask = await createTask(formData);
        setTasks((current) => [newTask, ...current]);
        if (setIsCreateModalOpen) setIsCreateModalOpen(false);
        showToast('New task added to your workspace', 'success');
      }
    } catch (err) {
      setModalError(err);
    } finally {
      setSubmittingModal(false);
    }
  };

  // Quick Status change from card
  const handleStatusChange = async (task, nextStatus) => {
    if (task.status === nextStatus) return;
    setBusyId(task._id);

    try {
      const updated = await updateTask(task._id, { status: nextStatus });
      setTasks((current) =>
        current.map((t) => (t._id === task._id ? mergeUpdated(t, updated) : t))
      );
      const labels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
      showToast(`Status changed to ${labels[nextStatus] || nextStatus}`, 'info');
    } catch (err) {
      showToast(err.message || 'Could not update status', 'error', 'Action Failed');
    } finally {
      setBusyId(null);
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    setBusyId(deletingTask._id);

    try {
      await deleteTask(deletingTask._id);
      setTasks((current) => current.filter((t) => t._id !== deletingTask._id));
      showToast('Task removed', 'info');
      setDeletingTask(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error', 'Delete Failed');
    } finally {
      setBusyId(null);
    }
  };

  // Compute counts for status tabs
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks]);

  // Filter & Sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query)) ||
          (t.project?.name && t.project.name.toLowerCase().includes(query))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'dueDateDesc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      if (sortBy === 'titleAsc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, searchQuery, sortBy]);

  const isFiltered =
    statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="task-manager-view">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Section: Dashboard stats */}
      <TaskStats tasks={tasks} />

      {/* Main Section Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title">My Tasks</h2>
          <span className="section-subtitle">
            Manage, organize, and track your daily priorities
          </span>
        </div>
        <div className="section-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            title="Refresh tasks"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsCreateModalOpen && setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <TaskFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        counts={counts}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Loading Skeleton */}
      {loading && (
        <div className="task-loading-list">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="task-skeleton-card">
              <div className="skeleton skeleton-circle" />
              <div className="skeleton-details">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-meta" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="error-banner" role="alert">
          <AlertCircle size={20} className="error-banner-icon" />
          <div className="error-banner-body">
            <h4>Failed to retrieve tasks</h4>
            <p>{error}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleRefresh}>
            Try again
          </button>
        </div>
      )}

      {/* Tasks List */}
      {!loading && !error && (
        <>
          {filteredAndSortedTasks.length === 0 ? (
            <EmptyState
              isFiltered={isFiltered}
              onCreateClick={() => setIsCreateModalOpen && setIsCreateModalOpen(true)}
              onResetFilters={handleResetFilters}
            />
          ) : (
            <div className="task-cards-list">
              {filteredAndSortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(t) => setDeletingTask(t)}
                  isBusy={busyId === task._id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <TaskModal
          key="create-modal"
          isOpen={true}
          onClose={() => setIsCreateModalOpen && setIsCreateModalOpen(false)}
          onSubmit={handleModalSubmit}
          isSubmitting={submittingModal}
          error={modalError}
        />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <TaskModal
          key={`edit-modal-${editingTask._id}`}
          isOpen={true}
          initialData={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleModalSubmit}
          isSubmitting={submittingModal}
          error={modalError}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        title="Delete this task?"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This cannot be undone.`}
        confirmText="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isConfirming={busyId === deletingTask?._id}
      />
    </div>
  );
}
