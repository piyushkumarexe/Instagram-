import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  wide?: boolean
  labelledBy?: string
}

/** Portal'd modal: scrim + Esc + scroll lock + basic focus management. */
export function Modal({ open, onClose, title, children, wide = false }: ModalProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // focus something so keyboard users are not stuck behind the modal
    const focusable = ref.current?.querySelector<HTMLElement>('input,button,[tabindex]')
    focusable?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-root__scrim" onPointerDown={onClose} />
      <div className={`modal ${wide ? 'modal--wide' : ''}`} ref={ref}>
        {title ? (
          <div className="modal__title">
            {title}
            <button
              type="button"
              className="icon-btn"
              style={{ position: 'absolute', right: 4, top: 4 }}
              onClick={onClose}
              aria-label="Close"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  )
}

/** The action list Instagram shows behind "…" or the share button. */
export function ActionSheet({
  open,
  onClose,
  title,
  actions,
}: {
  open: boolean
  onClose: () => void
  title?: string
  actions: { label: string; icon?: ReactNode; danger?: boolean; onClick: () => void }[]
}) {
  const stop = useCallback((e: ReactMouseEvent) => e.stopPropagation(), [])
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="sheet-list" onClick={stop}>
        {actions.map((a) => (
          <button
            type="button"
            key={a.label}
            className={`modal__row ${a.danger ? 'modal__row--danger' : ''}`}
            onClick={() => {
              a.onClick()
              onClose()
            }}
          >
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
      <div className="divider" />
      <button type="button" className="modal__row" style={{ justifyContent: 'center' }} onClick={onClose}>
        Cancel
      </button>
    </Modal>
  )
}
