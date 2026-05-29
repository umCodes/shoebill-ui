import { useCallback, useRef, useState } from "react"
import { ConfirmContext, type ConfirmOptions, type ModalVariant } from "../contexts/ConfirmContext.ts"

// =========================
// Internal state shape
// =========================
type ModalState = ConfirmOptions & { open: boolean }

const DEFAULT_STATE: ModalState = {
  open: false,
  title: "",     
  description: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  variant: "info",
}

const ICONS: Record<ModalVariant, string> = {
  danger:  "❗",
  warning: "⚠️",
  info:    "ℹ️",
  success: "✅",
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>(DEFAULT_STATE)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setState({ ...DEFAULT_STATE, ...options, open: true })
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  function handleClose(result: boolean) {
    setState(prev => ({ ...prev, open: false }))
    resolveRef.current?.(result)
    resolveRef.current = null
  }

  const variant = state.variant ?? "danger"

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <div
        className={`modal-overlay${state.open ? " open" : ""}`}
        onClick={() => handleClose(false)}
      >
        <div
          className="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          onClick={e => e.stopPropagation()}
        >
          <div className={`modal-icon-wrap ${variant}`}>
            {ICONS[variant]}
          </div>

          <p className="modal-title" id="modal-title">
            {state.title}
          </p>

          {state.description && (
            <p className="modal-description" id="modal-desc">
              {state.description}
            </p>
          )}

          <div className="modal-divider" />

          <div className="modal-actions">
            <button
              className="modal-btn-cancel"
              onClick={() => handleClose(false)}
            >
              {state.cancelLabel ?? "Cancel"}
            </button>
            <button
              className={`modal-btn-confirm ${variant}`}
              onClick={() => handleClose(true)}
            >
              {state.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </ConfirmContext.Provider>
  )
}