import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ToastItem {
  id: number
  text: string
}

const ToastCtx = createContext<(text: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const seq = useRef(0)
  const timers = useRef<number[]>([])

  const push = useCallback((text: string) => {
    const id = ++seq.current
    setItems((prev) => [...prev.slice(-2), { id, text }])
    const t = window.setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2400)
    timers.current.push(t)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(
        <div className="toasts" aria-live="polite">
          {items.map((i) => (
            <div className="toast" key={i.id}>
              {i.text}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

export function useToasts() {
  const toast = useToast()
  return useMemo(() => ({ toast }), [toast])
}
