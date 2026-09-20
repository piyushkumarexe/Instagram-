import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import { initialState, loadState, persist, reducer } from './state'
import type { Action, AppState } from './state'

const StateCtx = createContext<AppState>(initialState)
const DispatchCtx = createContext<React.Dispatch<Action>>(() => {})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const timer = useRef<number | undefined>(undefined)

  // theme → <html data-theme>, resolved once per change (no per-render DOM writes)
  useEffect(() => {
    const root = document.documentElement
    const apply = (mode: 'dark' | 'light') => {
      root.dataset.theme = mode
      root.style.colorScheme = mode
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff')
    }
    if (state.theme !== 'system') {
      apply(state.theme)
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    apply(mq.matches ? 'light' : 'dark')
    const onChange = (e: MediaQueryListEvent) => apply(e.matches ? 'light' : 'dark')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [state.theme])

  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => persist(state), 350)
    return () => window.clearTimeout(timer.current)
  }, [state])

  const value = useMemo(() => state, [state])
  return (
    <StateCtx.Provider value={value}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export const useAppState = () => useContext(StateCtx)
export const useDispatch = () => useContext(DispatchCtx)
