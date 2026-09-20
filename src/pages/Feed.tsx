import { memo, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post, Story, User } from '../types'
import type { StoryGroup } from '../lib/stories'
import { PostCard } from '../components/PostCard'
import { StoriesBar } from '../components/StoriesBar'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useDispatch } from '../store/AppContext'
import { newCommentId } from '../lib/posts'
import { useToast } from '../components/Toast'
import { formatCount } from '../data/seed'

export interface FeedProps {
  stories: Story[]
  seenIds: string[]
  you: User
  posts: Post[]
  users: User[]
  byId: Map<string, User>
  nameOf: (id: string) => string
  suggested: User[]
  onOpenStories: (groups: StoryGroup[], index: number) => void
  onShare: (postId: string) => void
  onCreateStory: () => void
}

function FeedInner({
  stories,
  seenIds,
  you,
  posts,
  byId,
  nameOf,
  suggested,
  onOpenStories,
  onShare,
  onCreateStory,
}: FeedProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()

  const comment = useCallback(
    (postId: string, text: string) => {
      dispatch({
        type: 'addComment',
        postId,
        comment: { id: newCommentId(), userId: you.id, text, createdAt: Date.now(), likes: 0, likedByYou: false },
      })
      toast('Comment posted')
    },
    [dispatch, toast, you.id],
  )

  const cards = useMemo(
    () =>
      posts.map((post) => {
        const author = byId.get(post.userId)
        if (!author) return null
        return (
          <PostCard
            key={post.id}
            post={post}
            author={author}
            you={you}
            nameOf={nameOf}
            likedByName={post.likedByAvatars.length ? nameOf('u1') : 'someone'}
            onLike={(on) => {
              dispatch({ type: 'toggleLike', postId: post.id })
              if (on) toast('Added to liked posts')
            }}
            onSave={() => {
              dispatch({ type: 'toggleSave', postId: post.id })
              toast(post.savedByYou ? 'Removed from saved' : 'Saved to collection')
            }}
            onComment={(text) => comment(post.id, text)}
            onOpenDetail={() => navigate(`/p/${post.id}`)}
            onOpenAuthor={() => navigate(`/${author.username}`)}
            onShare={() => onShare(post.id)}
            onFollow={() => {
              dispatch({ type: 'toggleFollow', userId: author.id })
              toast(author.isFollowing ? `Unfollowed ${author.username}` : `Following ${author.username}`)
            }}
          />
        )
      }),
    [byId, comment, dispatch, nameOf, navigate, onShare, posts, toast, you],
  )

  return (
    <>
      <div className="content">
        <StoriesBar
          stories={stories}
          seenIds={seenIds}
          you={you}
          userById={(id) => byId.get(id) ?? you}
          onOpen={onOpenStories}
          onCreate={onCreateStory}
        />
        <div className="feed">{cards}</div>
      </div>

      <aside className="rail">
        <div className="row row--between" style={{ marginBottom: 18 }}>
          <div className="row">
            <StaticAvatar src={you.avatar} alt={you.username} size={44} />
            <div>
              <div className="bold">{you.username}</div>
              <div className="muted small">{you.name}</div>
            </div>
          </div>
          <button type="button" className="link-blue small">
            Switch
          </button>
        </div>

        <div className="row row--between" style={{ marginBottom: 10 }}>
          <span className="muted bold small">Suggested for you</span>
          <button type="button" className="small bold" onClick={() => navigate('/explore')}>
            See all
          </button>
        </div>

        <div className="stack" style={{ gap: 14 }}>
          {suggested.map((u) => (
            <SuggestedRow
              key={u.id}
              user={u}
              onOpen={() => navigate(`/${u.username}`)}
              onFollow={() => {
                dispatch({ type: 'toggleFollow', userId: u.id })
                toast(`Following ${u.username}`)
              }}
            />
          ))}
        </div>

        <p className="tiny muted" style={{ marginTop: 24, lineHeight: 1.6 }}>
          About · Help · Press · API · Jobs · Privacy · Terms
          <br />© {new Date().getFullYear()} PIXOGRAM (demo build)
        </p>
      </aside>
    </>
  )
}

const SuggestedRow = memo(function SuggestedRow({
  user,
  onOpen,
  onFollow,
}: {
  user: User
  onOpen: () => void
  onFollow: () => void
}) {
  return (
    <div className="row">
      <button type="button" onClick={onOpen} aria-label={`Open ${user.username}'s profile`}>
        <StaticAvatar src={user.avatar} alt={user.username} size={34} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <button type="button" className="bold truncate" style={{ display: 'block' }} onClick={onOpen}>
          {user.username}
        </button>
        <div className="muted tiny truncate">{formatCount(user.followers)} followers</div>
      </div>
      <button type="button" className="link-blue small" onClick={onFollow}>
        {user.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  )
})

const Feed = memo(FeedInner)
export default Feed
