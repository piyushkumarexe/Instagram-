import { memo, useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks'

export interface LazyImageProps {
  src: string
  alt: string
  /** aspect ratio (w/h) reserved before the image lands — kills layout shift */
  ratio?: number
  lqip?: string
  color?: string
  className?: string
  imgClassName?: string
  sizes?: string
  eager?: boolean
  /** filter class applied by the create-post editor */
  filter?: string
}

/**
 * Blur-up image: reserves its box from the known aspect ratio, paints the dominant
 * colour / 20px LQIP immediately, then swaps in the real file once it is decoded.
 * Combined with `loading="lazy"` this keeps a long feed cheap to scroll.
 */
export const LazyImage = memo(function LazyImage({
  src,
  alt,
  ratio = 1,
  lqip,
  color = '#111',
  className,
  imgClassName,
  sizes = '(max-width: 735px) 100vw, 470px',
  eager = false,
  filter,
}: LazyImageProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ rootMargin: '150% 0px', once: true })
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // an image that decoded before React attached still counts as loaded
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true)
  }, [inView, src])

  return (
    <span
      ref={ref}
      className={`lazy ${className ?? ''}`}
      style={{ aspectRatio: String(ratio), backgroundColor: color }}
    >
      {lqip ? (
        <img
          className="lazy__lqip"
          src={lqip}
          alt=""
          aria-hidden="true"
          decoding="async"
          style={{ opacity: loaded ? 0 : 1 }}
        />
      ) : null}
      {inView || eager ? (
        <img
          ref={imgRef}
          className={`lazy__img ${imgClassName ?? ''} ${filter ? `f-${filter}` : ''}`}
          src={src}
          alt={alt}
          sizes={sizes}
          srcSet={src.endsWith('.webp') ? `${src} 1080w` : undefined}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      ) : null}
    </span>
  )
})
