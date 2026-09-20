import React, { useState, useRef, useEffect } from 'react'

// IG-style pull-to-refresh — kisi bhi page ko wrap karo
export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(null)
  const pullRef = useRef(0)
  pullRef.current = pull

  useEffect(() => {
    const scrollTop = () => window.scrollY || document.documentElement.scrollTop || 0
    const ts = (e) => { if (scrollTop() <= 0 && !refreshing) startY.current = e.touches[0].clientY }
    const tm = (e) => {
      if (startY.current == null) return
      const d = e.touches[0].clientY - startY.current
      if (d > 0 && scrollTop() <= 0) setPull(Math.min(110, d * 0.45))
      else setPull(0)
    }
    const te = () => {
      if (pullRef.current > 52 && !refreshing) {
        setRefreshing(true)
        setPull(56)
        Promise.resolve(onRefresh()).catch(() => {}).finally(() => { setRefreshing(false); setPull(0) })
      } else setPull(0)
      startY.current = null
    }
    window.addEventListener('touchstart', ts, { passive: true })
    window.addEventListener('touchmove', tm, { passive: true })
    window.addEventListener('touchend', te)
    return () => {
      window.removeEventListener('touchstart', ts)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', te)
    }
  }, [onRefresh, refreshing])

  return (
    <div className="ptr-wrap" style={{ transform: pull ? `translateY(${pull}px)` : undefined, transition: pull && !refreshing ? 'none' : 'transform .25s ease', position: 'relative' }}>
      {(pull > 0 || refreshing) && (
        <div className="ptr-indicator" style={{ opacity: refreshing ? 1 : Math.min(1, pull / 52) }}>
          <div className="ring" />
        </div>
      )}
      {children}
    </div>
  )
}
