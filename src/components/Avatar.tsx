import { memo } from 'react'
import type { User } from '../types'
import { StaticAvatar, ZoomablePhoto } from './ZoomablePhoto'

export interface AvatarProps {
  user: Pick<User, 'username' | 'avatar' | 'name'>
  size?: number
  ring?: 'unseen' | 'seen' | 'none'
  /** hold-to-zoom the profile photo, exactly like Instagram */
  zoom?: boolean
  openOnTap?: boolean
  onTap?: () => void
  className?: string
}

export const Avatar = memo(function Avatar({
  user,
  size = 32,
  ring = 'none',
  zoom = false,
  openOnTap = true,
  onTap,
  className,
}: AvatarProps) {
  if (!zoom) return <StaticAvatar src={user.avatar} alt={user.username} size={size} ring={ring} className={className} />
  return (
    <ZoomablePhoto
      src={user.avatar}
      alt={`${user.name}'s profile photo`}
      username={user.username}
      size={size}
      ring={ring}
      openOnTap={openOnTap}
      onTap={onTap}
      className={className}
    />
  )
})
