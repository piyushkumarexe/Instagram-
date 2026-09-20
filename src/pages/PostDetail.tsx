import { memo, useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post, User } from '../types'
import { CommentList } from '../components/Comments'
import { Icon } from '../components/Icon'
import { LazyImage } from '../components/LazyImage'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useDispatch } from '../store/AppContext'
import { useToast } from '../components/Toast'
import { countComments, likedByLine, newCommentId, tokenizeCaption } from '../lib/posts'
import { timeAgo } from '../data/seed'

export interface PostDetailProps {
  posts: Post[]
  byId: Map<string, User>
  nameOf: (id: string) => string
  you: User
  onShare: (postId: string) => void
}

const QUICK_EMOJI = ['❤️', '🙌', '🔥', '👏', '😂', '😮', '😢', '👍']

function PostDetailInner({ posts, byId, nameOf, you, onShare }: PostDetailProps) {
  const { postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const [draft, setDraft] = useState('')

  const post = useMemo(() => posts.find((p) => p.id === postId), [posts, postId])
  const author = post ? byId.get(post.userId) : undefined

  const close = useCallback(() => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }, [navigate])

  const send = useCallback(() => {
    const text = draft.trim()
    if (!text || !post) return
    dispatch({
      type: 'addComment',
      postId: post.id,
      comment: { id: newCommentId(), userId: you.id, text, createdAt: Date.now(), likes: 0, likedByYou: false },
    })
    setDraft('')
    toast('Comment posted')
  }, [draft, dispatch, post, toast, you.id])

  if (!post || !author) {
    return (
      <div className="modal-root">
        <div className="modal-root__scrim" onPointerDown={close} />
        <div className="empty" style={{ position: 'relative', background: 'var(--bg)', borderRadius: 12, width: 320 }}>
          <Icon name="info" size={36} />
          <div>Sorry, this post is not available.</div>
          <button type="button" className="btn btn--ghost" onClick={close}>
            Go back
          </button>
        </div>
      </div>
    )
  }

  const m = post.media[0]

  return (
    <div className="modal-root" role="dialog" aria-modal="true" aria-label="Post detail">
      <div className="modal-root__scrim" onPointerDown={close} />
      <div className="modal modal--wide">
        <div className="detail__media" onDoubleClick={() => !post.likedByYou && dispatch({ type: 'toggleLike', postId: post.id })}>
          <LazyImage src={m.src} alt={post.caption} ratio={m.ratio} lqip={m.lqip} color={m.color} eager />
        </div>

        <div className="detail__side">
          <div className="post__head" style={{ borderBottom: '1px solid var(--border)' }}>
            <button type="button" onClick={() => navigate(`/${author.username}`)} aria-label={`Open ${author.username}`}>
              <StaticAvatar src={author.avatar} alt={author.username} size={32} />
            </button>
            <div className="post__head-text">
              <div className="row" style={{ gap: 4 }}>
                <span className="post__username">{author.username}</span>
                {author.verified ? <Icon name="verified" filled size={13} className="verified" /> : null}
              </div>
              {post.location ? <div className="post__loc">{post.location}</div> : null}
            </div>
            <button type="button" className="icon-btn" onClick={() => onShare(post.id)} aria-label="More options">
              <Icon name="more" size={20} />
            </button>
          </div>

          <div className="detail__comments">
            <div className="comment">
              <StaticAvatar src={author.avatar} alt={author.username} size={32} />
              <div className="comment__body">
                <div className="comment__text">
                  <span className="bold" style={{ marginRight: 6 }}>
                    {author.username}
                  </span>
                  {tokenizeCaption(post.caption).map((t, i) =>
                    t.kind === 'text' ? (
                      <span key={i}>{t.text}</span>
                    ) : (
                      <span key={i} className="tag">
                        {t.text}
                      </span>
                    ),
                  )}
                </div>
                <div className="comment__meta">
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <CommentList
              comments={post.comments}
              byId={byId}
              onToggleLike={(id) => dispatch({ type: 'toggleCommentLike', commentId: id })}
              onOpenUser={(u) => navigate(`/${u}`)}
            />
            {post.comments.length === 0 ? (
              <div className="empty" style={{ padding: '40px 20px' }}>
                <div className="bold" style={{ color: 'var(--text)' }}>
                  No comments yet
                </div>
                <div className="small">Start the conversation.</div>
              </div>
            ) : null}
          </div>

          <div className="detail__actions">
            <div className="post__actions" style={{ padding: 0 }}>
              <button
                type="button"
                className={`icon-btn ${post.likedByYou ? 'is-liked' : ''}`}
                aria-label={post.likedByYou ? 'Unlike' : 'Like'}
                onClick={() => dispatch({ type: 'toggleLike', postId: post.id })}
              >
                <Icon name="heart" filled={post.likedByYou} size={24} />
              </button>
              <button type="button" className="icon-btn" aria-label="Focus comment box" onClick={() => document.getElementById('detail-comment')?.focus()}>
                <Icon name="comment" size={24} />
              </button>
              <button type="button" className="icon-btn" aria-label="Share" onClick={() => onShare(post.id)}>
                <Icon name="share" size={24} />
              </button>
              <span className="spacer" />
              <button
                type="button"
                className="icon-btn"
                aria-label={post.savedByYou ? 'Unsave' : 'Save'}
                onClick={() => {
                  dispatch({ type: 'toggleSave', postId: post.id })
                  toast(post.savedByYou ? 'Removed from saved' : 'Saved')
                }}
              >
                <Icon name="bookmark" filled={post.savedByYou} size={23} />
              </button>
            </div>
            <div className="post__body" style={{ padding: '4px 6px 8px' }}>
              <div className="post__likes">{likedByLine(post, [nameOf(post.likedByUserId)])}</div>
              <div className="post__time">
                {timeAgo(post.createdAt)} ago · {countComments(post).toLocaleString('en-US')} comments
              </div>
            </div>
          </div>

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <div className="emoji-row" aria-hidden="true">
              {QUICK_EMOJI.slice(0, 4).map((e) => (
                <button type="button" key={e} onClick={() => setDraft((d) => d + e)} aria-label={`Insert ${e}`}>
                  {e}
                </button>
              ))}
            </div>
            <input
              id="detail-comment"
              value={draft}
              placeholder="Add a comment…"
              aria-label="Add a comment"
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="link-blue" disabled={!draft.trim()}>
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const PostDetail = memo(PostDetailInner)
export default PostDetail
