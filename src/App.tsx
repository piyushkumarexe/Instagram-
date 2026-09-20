import { lazy, Suspense, useCallback, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { AppProvider, useDispatch } from './store/AppContext'
import { ToastProvider, useToast } from './components/Toast'
import { Shell } from './components/Shell'
import { StoryViewer } from './components/StoryViewer'
import { ShareSheet } from './components/ShareSheet'
import { ActionSheet } from './components/Modal'
import { Icon } from './components/Icon'
import { useLibrary } from './hooks/useLibrary'
import { useAppState } from './store/AppContext'
import { groupStories } from './lib/stories'
import type { StoryGroup } from './lib/stories'
import { FeedSkeleton } from './components/Skeletons'

const Feed = lazy(() => import('./pages/Feed'))
const Explore = lazy(() => import('./pages/Explore'))
const Reels = lazy(() => import('./pages/Reels'))
const Profile = lazy(() => import('./pages/Profile'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const Messages = lazy(() => import('./pages/Messages'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Saved = lazy(() => import('./pages/Saved'))
const CreatePost = lazy(() => import('./pages/CreatePost'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const Settings = lazy(() => import('./pages/Settings'))

function Root() {
  const lib = useLibrary()
  const state = useAppState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()

  const [trays, setTrays] = useState<{ groups: StoryGroup[]; index: number } | null>(null)
  const [sharePostId, setSharePostId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const openStories = useCallback((groups: StoryGroup[], index: number) => setTrays({ groups, index }), [])
  const closeStories = useCallback(() => setTrays(null), [])

  const openShare = useCallback((postId: string) => setSharePostId(postId), [])
  const closeShare = useCallback(() => setSharePostId(null), [])

  const yourStories = groupStories(lib.stories, state.seenStories, (id) => lib.byId.get(id) ?? lib.you)

  return (
    <div className="app">
      <Shell
        you={lib.you}
        unreadMessages={lib.unreadMessages}
        unreadNotifications={lib.unreadNotifications}
        onOpenMenu={() => setMenuOpen(true)}
      >
        <Suspense fallback={<FeedSkeleton />}>
          <Routes>
            <Route
              path="/"
              element={
                <Feed
                  stories={lib.stories}
                  seenIds={state.seenStories}
                  you={lib.you}
                  posts={lib.posts}
                  users={lib.users}
                  byId={lib.byId}
                  nameOf={lib.nameOf}
                  suggested={lib.users.filter((u) => !u.isFollowing && !u.isYou).slice(0, 6)}
                  onOpenStories={openStories}
                  onShare={openShare}
                  onCreateStory={() => {
                    openStories(yourStories.length ? yourStories : [], 0)
                    toast('Story player opened')
                  }}
                />
              }
            />
            <Route path="/explore" element={<Explore posts={lib.posts} byId={lib.byId} nameOf={lib.nameOf} onShare={openShare} />} />
            <Route path="/reels" element={<Reels posts={lib.posts} byId={lib.byId} you={lib.you} onShare={openShare} />} />
            <Route path="/search" element={<SearchPage users={lib.users} posts={lib.posts} nameOf={lib.nameOf} />} />
            <Route path="/direct" element={<Messages threads={state.threads} byId={lib.byId} you={lib.you} />} />
            <Route
              path="/notifications"
              element={<Notifications items={state.notifications} byId={lib.byId} posts={lib.posts} nameOf={lib.nameOf} />}
            />
            <Route path="/saved" element={<Saved posts={lib.posts} byId={lib.byId} nameOf={lib.nameOf} onShare={openShare} />} />
            <Route path="/create" element={<CreatePost you={lib.you} />} />
            <Route path="/settings" element={<Settings you={lib.you} />} />
            <Route
              path="/p/:postId"
              element={<PostDetail posts={lib.posts} byId={lib.byId} nameOf={lib.nameOf} you={lib.you} onShare={openShare} />}
            />
            <Route
              path="/:username"
              element={<Profile posts={lib.posts} byId={lib.byId} you={lib.you} users={lib.users} onShare={openShare} stories={lib.stories} />}
            />
          </Routes>
        </Suspense>
      </Shell>

      {trays && trays.groups.length ? (
        <StoryViewer
          groups={trays.groups}
          startGroup={trays.index}
          seenIds={state.seenStories}
          likedIds={state.storyLikes}
          onClose={closeStories}
          onSeen={(id) => dispatch({ type: 'viewStory', storyId: id })}
          onLike={(id) => dispatch({ type: 'likeStory', storyId: id })}
          onReply={(group, text) => toast(`Reply sent to ${group.user.username}: ${text}`)}
        />
      ) : null}

      <ShareSheet
        open={Boolean(sharePostId)}
        onClose={closeShare}
        users={lib.users}
        targetId={sharePostId}
        link={sharePostId ? `/p/${sharePostId}` : '/'}
      />

      <ActionSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="More"
        actions={[
          {
            label: 'Settings',
            icon: <Icon name="gear" size={20} />,
            onClick: () => navigate('/settings'),
          },
          {
            label: 'Saved',
            icon: <Icon name="bookmark" size={20} />,
            onClick: () => navigate('/saved'),
          },
          {
            label: state.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
            icon: <Icon name={state.theme === 'light' ? 'moon' : 'sun'} size={20} />,
            onClick: () => dispatch({ type: 'setTheme', theme: state.theme === 'light' ? 'dark' : 'light' }),
          },
          {
            label: 'Log out',
            icon: <Icon name="logout" size={20} />,
            danger: true,
            onClick: () => toast('Demo build — nobody gets logged out'),
          },
        ]}
      />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}
