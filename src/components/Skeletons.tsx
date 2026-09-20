/** Placeholder shells shown while a lazy route chunk is in flight. */
export function FeedSkeleton() {
  return (
    <div className="content" aria-busy="true" aria-label="Loading">
      <div className="stories no-scrollbar">
        {Array.from({ length: 7 }, (_, i) => (
          <div className="stories__item" key={i}>
            <div className="skeleton" style={{ width: 64, height: 64, borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: 48, height: 10 }} />
          </div>
        ))}
      </div>
      {Array.from({ length: 2 }, (_, i) => (
        <article className="post" key={i}>
          <div className="post__head">
            <div className="skeleton" style={{ width: 34, height: 34, borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: 120, height: 12 }} />
          </div>
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 0 }} />
          <div className="pad stack">
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
            <div className="skeleton" style={{ height: 12, width: '70%' }} />
          </div>
        </article>
      ))}
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="content content--wide">
      <div className="explore-grid" aria-busy="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div className="skeleton explore-cell" key={i} />
        ))}
      </div>
    </div>
  )
}
