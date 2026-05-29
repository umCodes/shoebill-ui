import {useState, useCallback, type ReactNode } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import { ToastContext, type ToastType } from '../contexts/ToastContext';
import "../styles/Toast.css"


interface Toast {
  id: number;
  message: string;
  type: ToastType;
}


const ICONS: Record<ToastType, ReactNode> = {
  success: <FiCheckCircle size={16} />,
  error:   <FiXCircle size={16} />,
  info:    <FiInfo size={16} />,
};


export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const remove = (id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{ICONS[t.type]}</span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => remove(t.id)}>
              <FiX size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
