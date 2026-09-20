import { memo } from 'react'
import type { Comment, User } from '../types'
import { timeAgo } from '../data/seed'
import { Icon } from './Icon'
import { StaticAvatar } from './ZoomablePhoto'

export interface CommentListProps {
  comments: Comment[]
  byId: Map<string, User>
  onToggleLike: (commentId: string) => void
  onOpenUser: (username: string) => void
  onReply?: (commentId: string, text: string) => void
}

export const CommentList = memo(function CommentList({
  comments,
  byId,
  onToggleLike,
  onOpenUser,
}: CommentListProps) {
  return (
    <div>
      {comments.map((c) => {
        const author = byId.get(c.userId)
        return (
          <div key={c.id}>
            <CommentRow comment={c} author={author} onToggleLike={onToggleLike} onOpenUser={onOpenUser} />
            {c.replies?.map((r) => (
              <div className="comment__reply" key={r.id}>
                <CommentRow
                  comment={r}
                  author={byId.get(r.userId)}
                  onToggleLike={onToggleLike}
                  onOpenUser={onOpenUser}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
})

const CommentRow = memo(function CommentRow({
  comment,
  author,
  onToggleLike,
  onOpenUser,
}: {
  comment: Comment
  author?: User
  onToggleLike: (id: string) => void
  onOpenUser: (username: string) => void
}) {
  const username = author?.username ?? 'user'
  return (
    <div className="comment">
      <button type="button" onClick={() => onOpenUser(username)} aria-label={`Open ${username}`}>
        <StaticAvatar src={author?.avatar ?? ''} alt={username} size={32} />
      </button>
      <div className="comment__body">
        <div className="comment__text">
          <button type="button" className="bold" style={{ marginRight: 6 }} onClick={() => onOpenUser(username)}>
            {username}
          </button>
          {comment.text}
        </div>
        <div className="comment__meta">
          <span>{timeAgo(comment.createdAt)}</span>
          {comment.likes > 0 ? <span>{comment.likes.toLocaleString('en-US')} likes</span> : null}
          <button type="button">Reply</button>
        </div>
      </div>
      <button
        type="button"
        className={`icon-btn ${comment.likedByYou ? 'is-liked' : ''}`}
        style={{ width: 32, height: 32, alignSelf: 'center' }}
        aria-label={comment.likedByYou ? 'Unlike comment' : 'Like comment'}
        aria-pressed={comment.likedByYou}
        onClick={() => onToggleLike(comment.id)}
      >
        <Icon name="heart" filled={comment.likedByYou} size={14} />
      </button>
    </div>
  )
})
