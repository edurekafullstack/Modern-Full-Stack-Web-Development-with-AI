import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="toast-icon success" size={18} />,
    error: <AlertCircle className="toast-icon error" size={18} />,
    info: <Info className="toast-icon info" size={18} />,
  };

  return (
    <div className={`toast-container show`}>
      <div className={`toast-item ${toast.type || 'info'}`} role="status">
        <div className="toast-body">
          {icons[toast.type || 'info']}
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
