import { useState, useEffect } from 'react';
import { X, Calendar, Flag, AlignLeft, CheckSquare, Loader2 } from 'lucide-react';

function formatInitialDate(val) {
  if (!val) return '';
  const d = new Date(val);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  error = null,
}) {
  const [title, setTitle] = useState(() => initialData?.title || '');
  const [description, setDescription] = useState(() => initialData?.description || '');
  const [status, setStatus] = useState(() => initialData?.status || 'todo');
  const [priority, setPriority] = useState(() => initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(() => formatInitialDate(initialData?.dueDate));
  const [clientError, setClientError] = useState('');

  const isEditMode = Boolean(initialData?._id);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setClientError('Title must be at least 3 characters long');
      return;
    }
    if (trimmedTitle.length > 100) {
      setClientError('Title cannot exceed 100 characters');
      return;
    }

    const payload = {
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      ...(dueDate ? { dueDate } : { dueDate: null }),
    };

    onSubmit(payload);
  };

  const setPresetDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <CheckSquare size={20} className="modal-title-icon" />
            <h2 id="modal-heading">{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g., Finalize Q4 architecture review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              autoFocus
            />
            <div className="char-count">{title.length} / 100</div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              <AlignLeft size={14} />
              <span>Description (Optional)</span>
            </label>
            <textarea
              id="task-desc"
              rows={3}
              className="form-textarea"
              placeholder="Add key details, sub-goals, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <div className="char-count">{description.length} / 500</div>
          </div>

          {/* Two-column Status and Priority */}
          <div className="form-row">
            {/* Status selection */}
            <div className="form-group flex-1">
              <label className="form-label">
                <CheckSquare size={14} />
                <span>Status</span>
              </label>
              <div className="pill-selector">
                <button
                  type="button"
                  className={`pill-option ${status === 'todo' ? 'selected todo' : ''}`}
                  onClick={() => setStatus('todo')}
                >
                  To Do
                </button>
                <button
                  type="button"
                  className={`pill-option ${status === 'in-progress' ? 'selected in-progress' : ''}`}
                  onClick={() => setStatus('in-progress')}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`pill-option ${status === 'done' ? 'selected done' : ''}`}
                  onClick={() => setStatus('done')}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Priority selection */}
            <div className="form-group flex-1">
              <label className="form-label">
                <Flag size={14} />
                <span>Priority</span>
              </label>
              <div className="pill-selector">
                <button
                  type="button"
                  className={`pill-option ${priority === 'low' ? 'selected low' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`pill-option ${priority === 'medium' ? 'selected medium' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`pill-option ${priority === 'high' ? 'selected high' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          {/* Due date with presets */}
          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">
              <Calendar size={14} />
              <span>Due Date</span>
            </label>
            <div className="due-date-container">
              <input
                id="task-due-date"
                type="date"
                className="form-input date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <div className="preset-buttons">
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => setPresetDate(0)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => setPresetDate(1)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => setPresetDate(7)}
                >
                  In 1 Week
                </button>
                {dueDate && (
                  <button
                    type="button"
                    className="preset-btn clear"
                    onClick={() => setDueDate('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Errors display */}
          {(clientError || error) && (
            <div className="form-error-banner" role="alert">
              <p>{clientError || error.message || 'An error occurred while saving the task'}</p>
              {error?.errors?.length > 0 && (
                <ul>
                  {error.errors.map((fe, idx) => (
                    <li key={idx}>{fe.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>{isEditMode ? 'Saving…' : 'Creating…'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Changes' : 'Create Task'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
