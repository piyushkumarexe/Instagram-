package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.AddBox
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import kotlinx.coroutines.launch
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedScreen(
    posts: List<Post>?,
    err: String?,
    me: VUser,
    storyGroups: Map<VUser, List<Story>>,
    onRefresh: () -> Unit,
    onLike: (Post) -> Unit,
    onComments: (Post) -> Unit,
    onProfile: (String) -> Unit,
    onAddStory: () -> Unit,
    onOpenStory: (VUser) -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenCreate: () -> Unit
) {
    var refreshing by remember { mutableStateOf(false) }
    androidx.compose.runtime.LaunchedEffect(posts) { refreshing = false }
    PullToRefreshBox(
        isRefreshing = refreshing,
        onRefresh = { refreshing = true; onRefresh() },
        modifier = Modifier.fillMaxSize().background(Color.Black)
    ) {
        Column(Modifier.fillMaxSize()) {
        // top bar (IG): + create | wordmark | notifications
        Row(
            Modifier.fillMaxWidth().height(56.dp).background(Color.Black).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onOpenCreate) {
                Icon(Icons.Filled.AddBox, null, tint = Color.White, modifier = Modifier.size(27.dp))
            }
            Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
                Text("VibeGram", color = Color.White, fontSize = 27.sp, fontFamily = androidx.compose.ui.text.font.FontFamily.Cursive)
            }
            IconButton(onClick = onOpenNotifications) {
                Icon(Icons.Filled.FavoriteBorder, null, tint = Color.White, modifier = Modifier.size(25.dp))
            }
        }

        if (posts == null) {
            LoadingBox()
        } else if (err != null && posts.isEmpty()) {
            ErrorBox(err)
        } else if (posts.isEmpty()) {
            EmptyBox("No posts yet — follow people or share your first photo!", "📸")
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                // stories bar
                item {
                    StoryBar(
                        me = me,
                        groups = storyGroups.toList(),
                        onAddStory = onAddStory,
                        onOpenStory = onOpenStory
                    )
                }
                items(posts, key = { it.id }) { post ->
                    PostCard(
                        post = post,
                        onLike = onLike,
                        onComments = { onComments(post) },
                        onProfile = onProfile,
                        onAvatar = onOpenStory
                    )
                }
            }
        }
    }
}
}

@Composable
fun StoryBar(
    me: VUser,
    groups: List<Pair<VUser, List<Story>>>,
    onAddStory: () -> Unit,
    onOpenStory: (VUser) -> Unit
) {
    Row(
        Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.clickable { onAddStory() }) {
            Box(contentAlignment = Alignment.BottomEnd) {
                AvatarView(url = me.avatar, size = 60, border = false, name = me.username)
                Box(
                    Modifier.size(22.dp).background(Color(0xFF0095F6), CircleShape).padding(2.dp),
                    contentAlignment = Alignment.Center
                ) { Text("+", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold) }
            }
            Spacer(Modifier.height(4.dp))
            Text("Your story", color = Color.White, fontSize = 11.sp)
        }
        groups.take(8).forEach { (user, stories) ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable { onOpenStory(user) }
            ) {
                AvatarView(url = user.avatar, size = 60, border = true, gradientRing = true, name = user.username)
                Spacer(Modifier.height(4.dp))
                Text(
                    user.username.take(9),
                    color = Color.White,
                    fontSize = 11.sp
                )
            }
        }
    }
}

@Composable
fun AvatarView(url: String?, size: Int, border: Boolean, gradientRing: Boolean = false, name: String = "", showRing: Boolean = false) {
    @Composable
    fun inner(sz: Int) {
        if (url.isNullOrBlank()) {
            Box(
                Modifier.size(sz.dp).background(Color(0xFF262626), CircleShape),
                Alignment.Center
            ) {
                Text(
                    if (name.isNotBlank()) name.take(1).uppercase() else "",
                    color = Color(0xFFBBBBBB),
                    fontWeight = FontWeight.Bold,
                    fontSize = (sz * 0.42).sp
                )
            }
        } else {
            AsyncImage(
                model = url,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.size(sz.dp).clip(CircleShape).background(Color(0xFF262626))
            )
        }
    }
    if (gradientRing || showRing) {
        Box(
            Modifier.size((size + 6).dp).background(
                androidx.compose.ui.graphics.Brush.linearGradient(
                    listOf(Color(0xFFF09433), Color(0xFFDC2743), Color(0xFFBC1888))
                ),
                CircleShape
            ).padding(2.dp)
        ) { inner(size) }
    } else if (border) {
        Box(Modifier.size((size + 4).dp).background(Color(0xFF444444), CircleShape).padding(2.dp)) { inner(size) }
    } else {
        inner(size)
    }
}

// IG-style compact count: 43.6K / 1.6M
fun fmtCount(n: Long): String = when {
    n >= 1_000_000L -> String.format(java.util.Locale.US, "%.1fM", n / 1_000_000.0)
    n >= 1_000L -> String.format(java.util.Locale.US, "%.1fK", n / 1_000.0)
    else -> n.toString()
}

@Composable
fun PostCard(
    post: Post,
    onLike: (Post) -> Unit,
    onComments: () -> Unit,
    onProfile: (String) -> Unit,
    onAvatar: (VUser) -> Unit
) {
    var showHeart by remember { mutableStateOf(false) }
    var menu by remember { mutableStateOf(false) }
    var sharedNote by remember { mutableStateOf(false) }
    var savedLoc by remember(post.id) { mutableStateOf(post.savedByMe) }
    val cardScope = rememberCoroutineScope()
    val myId = Fb.uid
    val liked = myId != null && post.likes.contains(myId)

    Column(Modifier.fillMaxWidth().padding(bottom = 10.dp)) {
        // header
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(Modifier.clickable { onAvatar(VUser(post.userId, post.username, post.name, post.avatar, "", 0, 0, 0, post.verified, false)) }) {
                AvatarView(url = post.avatar, size = 36, border = false)
            }
            Spacer(Modifier.width(9.dp))
            Column(Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    if (post.verified) {
                        Spacer(Modifier.width(4.dp))
                        Text("✓", color = Color(0xFF1D9BF0), fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
            }
            Box {
                IconButton(onClick = { menu = true }) {
                    Icon(Icons.Filled.MoreVert, null, tint = Color.White, modifier = Modifier.size(20.dp))
                }
                androidx.compose.material3.DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text("Add to story", color = Color.White) },
                        onClick = {
                            menu = false
                            cardScope.launch {
                                try { Fb.addStoryUrl(post.media); sharedNote = true } catch (_: Exception) { }
                            }
                        }
                    )
                }
            }
        }

        // media (double-tap to like)
        Box(
            Modifier.fillMaxWidth().aspectRatio(1f).background(Color(0xFF111111))
                .pointerInput(post.id) {
                    detectTapGestures(
                        onDoubleTap = {
                            if (!liked) onLike(post)
                            showHeart = true
                        }
                    )
                }
        ) {
            AsyncImage(
                model = post.media,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            if (post.isVideo) {
                Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Icon(Icons.Filled.PlayArrow, null, tint = Color.White.copy(alpha = 0.9f), modifier = Modifier.size(64.dp))
                }
            }
            if (showHeart) {
                Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Icon(
                        Icons.Filled.Favorite, null,
                        tint = Color(0xFFFF3040),
                        modifier = Modifier.size(90.dp)
                    )
                }
                androidx.compose.runtime.LaunchedEffect(post.id) {
                    kotlinx.coroutines.delay(700)
                    showHeart = false
                }
            }
        }

        // actions
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 6.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { onLike(post) }) {
                Icon(
                    if (liked) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                    null,
                    tint = if (liked) Color(0xFFED4956) else Color.White,
                    modifier = Modifier.size(26.dp)
                )
            }
            IconButton(onClick = onComments) {
                Icon(Icons.Outlined.ChatBubbleOutline, null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            IconButton(onClick = {
                cardScope.launch {
                    try { Fb.addStoryUrl(post.media); sharedNote = true } catch (_: Exception) { }
                }
            }) {
                Icon(Icons.Filled.Send, null, tint = Color.White, modifier = Modifier.size(22.dp))
            }
            IconButton(onClick = {
                val next = !savedLoc
                savedLoc = next
                cardScope.launch { try { Fb.toggleSave(post.id) } catch (_: Exception) { } }
            }) {
                Icon(
                    if (savedLoc) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                    null, tint = Color.White, modifier = Modifier.size(24.dp)
                )
            }
            Box(Modifier.weight(1f))
        }
        if (sharedNote) {
            Text(
                "Added to your story",
                color = Color(0xFF8E8E8E), fontSize = 12.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )
            androidx.compose.runtime.LaunchedEffect(sharedNote) {
                kotlinx.coroutines.delay(2500)
                sharedNote = false
            }
        }

        // likes + caption
        Column(Modifier.padding(horizontal = 12.dp)) {
            Text(
                "${post.likesCount} like" + if (post.likesCount == 1L) "" else "s",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )
            if (post.caption.isNotBlank()) {
                Spacer(Modifier.height(3.dp))
                Row {
                    Text(post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(Modifier.width(6.dp))
                    Text(post.caption, color = Color.White, fontSize = 13.sp)
                }
            }
            if (post.commentsCount > 0) {
                Spacer(Modifier.height(4.dp))
                Text(
                    "View all ${post.commentsCount} comments",
                    color = Color(0xFF8E8E8E),
                    fontSize = 13.sp,
                    modifier = Modifier.clickable { onComments() }
                )
            }
        }
    }
}
