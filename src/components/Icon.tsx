import { memo } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export type IconName =
  | 'home'
  | 'search'
  | 'explore'
  | 'reels'
  | 'heart'
  | 'comment'
  | 'share'
  | 'bookmark'
  | 'more'
  | 'plus'
  | 'plusSquare'
  | 'message'
  | 'sun'
  | 'moon'
  | 'gear'
  | 'camera'
  | 'grid'
  | 'tagged'
  | 'verified'
  | 'x'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'send'
  | 'smile'
  | 'image'
  | 'location'
  | 'trash'
  | 'edit'
  | 'logout'
  | 'userPlus'
  | 'check'
  | 'play'
  | 'pause'
  | 'volume'
  | 'mute'
  | 'music'
  | 'archive'
  | 'bell'
  | 'info'

/** Outline geometry. `filled` swaps fill on for the handful of icons Instagram fills. */
const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3 10.6 12 3l9 7.6V20a1.5 1.5 0 0 1-1.5 1.5H15v-6.3H9v6.3H4.5A1.5 1.5 0 0 1 3 20z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.6 16.6 4.4 4.4" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5z" />
    </>
  ),
  reels: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="m10.4 9.4 4.6 2.6-4.6 2.6z" />
      <path d="m4.6 8 4.2-4.6M13 3.4 9.6 8M20.6 8.6 15.6 3" />
    </>
  ),
  heart: (
    <path d="M12 20.6 4.9 13.6a4.6 4.6 0 0 1 6.5-6.5l.6.6.6-.6a4.6 4.6 0 1 1 6.5 6.5z" />
  ),
  comment: <path d="M20.9 11.6a8.3 8.3 0 0 1-12.1 7.3L3.2 20.8l1.9-5.4a8.3 8.3 0 1 1 15.8-3.8z" />,
  share: (
    <>
      <path d="m21.5 2.5-8 19-3.2-8.3L2 10z" />
      <path d="m21.5 2.5-11.2 11.2" />
    </>
  ),
  bookmark: <path d="M6.5 3h11v18l-5.5-4.2L6.5 21z" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  plusSquare: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.5c0 4.5-4 8.2-9 8.2a10 10 0 0 1-2.8-.4L3.5 21l1.6-4.2A7.9 7.9 0 0 1 3 11.5C3 7 7 3.3 12 3.3s9 3.7 9 8.2z" />
      <path d="M8 12.5 10.6 15 16 9.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  moon: <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8z" />,
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7l1.2-2h7.2l1.2 2h1.7A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
    </>
  ),
  tagged: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7.6 18.4a4.6 4.6 0 0 1 8.8 0" />
    </>
  ),
  verified: (
    <path d="m12 1.8 2.6 2.2 3.3-.4 1 3.2 3 1.5-1.2 3.1 1.2 3.1-3 1.5-1 3.2-3.3-.4L12 21l-2.6-2.2-3.3.4-1-3.2-3-1.5L3.3 11.4 2.1 8.3l3-1.5 1-3.2 3.3.4z" />
  ),
  x: <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />,
  chevronLeft: <path d="m14.5 5-7 7 7 7" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  chevronDown: <path d="m5 9.5 7 7 7-7" />,
  send: (
    <>
      <path d="M21.5 2.5 2.8 9.9l7.4 2.6 2.6 7.4z" />
      <path d="m21.5 2.5-11.3 11.3" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.2a4.4 4.4 0 0 0 7 0" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17 5-4.5 4 3.4 3-2.6 4 3.7" />
    </>
  ),
  location: (
    <>
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 13.2h9.2L17.5 7" />
    </>
  ),
  edit: <path d="M4 20h4L19.2 8.8a2.1 2.1 0 0 0-3-3L5 17v3zM14.8 5.6l3 3" />,
  logout: <path d="M15 4.5H19A1.5 1.5 0 0 1 20.5 6v12a1.5 1.5 0 0 1-1.5 1.5H15M11 8l-4 4 4 4M7 12h9" />,
  userPlus: (
    <>
      <circle cx="9.5" cy="8" r="3.6" />
      <path d="M3.5 20a6 6 0 0 1 12 0M18 8.5v6M15 11.5h6" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  play: <path d="M8 5.2 18.5 12 8 18.8z" />,
  pause: (
    <>
      <path d="M9 5v14M15 5v14" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9.5h3L11 6v12l-4-3.5H4z" />
      <path d="M15 9.2a4 4 0 0 1 0 5.6M17.8 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5h3L11 6v12l-4-3.5H4z" />
      <path d="m15.5 9.5 5 5M20.5 9.5l-5 5" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6.2l10-2v11" />
      <circle cx="6.6" cy="18" r="2.6" />
      <circle cx="16.4" cy="15.4" r="2.6" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1.5" />
      <path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4" />
    </>
  ),
  bell: <path d="M6.5 10a5.5 5.5 0 1 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10zM10 18.5a2.2 2.2 0 0 0 4 0" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </>
  ),
}

const SOLID: ReadonlySet<IconName> = new Set([
  'home',
  'heart',
  'bookmark',
  'verified',
  'play',
  'location',
  'tagged',
])

export interface IconProps {
  name: IconName
  size?: number
  filled?: boolean
  className?: string
  strokeWidth?: number
  style?: CSSProperties
  title?: string
}

/**
 * Inline SVG icons instead of an icon font / sprite sheet: zero extra requests and the
 * bundler drops anything unused. Memoised so a re-rendering feed does not rebuild paths.
 */
export const Icon = memo(function Icon({
  name,
  size = 24,
  filled = false,
  className,
  strokeWidth = 1.7,
  style,
  title,
}: IconProps) {
  const solid = filled && SOLID.has(name)
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill={solid ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={solid && name !== 'play' && name !== 'verified' ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  )
})
