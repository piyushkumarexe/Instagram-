package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.PageSize
import androidx.compose.foundation.pager.VerticalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

// IG Reels tab (v7.2): full-screen vertical pager over the GLOBAL algorithmic feed —
// every reel reaches every account, ranked by engagement + freshness (Fb.reelsFeed).
@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
fun ReelsScreen(
    me: VUser,
    onLike: (Post) -> Unit,
    onComments: (Post) -> Unit,
    onProfile: (String) -> Unit
) {
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    val ctx = androidx.compose.ui.platform.LocalContext.current
    val dataSaver = remember { ctx.getSharedPreferences("vibegram", 0).getBoolean("data_saver", false) }

    LaunchedEffect(Unit) {
        posts = try { Fb.reelsFeed() } catch (_: Exception) { emptyList() }
    }

    val list = posts
    if (list == null) {
        LoadingBox()
        return
    }
    if (list.isEmpty()) {
        Column(
            Modifier.fillMaxSize().background(Color.Black).statusBarsPadding(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("🎬", fontSize = 44.sp)
            Spacer(Modifier.height(12.dp))
            Text("No reels yet", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(Modifier.height(4.dp))
            Text("Reels shared by anyone on Instagram 2.0 will show up here", color = Color(0xFF8E8E8E), fontSize = 13.sp)
        }
        return
    }

    val pagerState = rememberPagerState(pageCount = { list.size })

    VerticalPager(
        state = pagerState,
        pageSize = PageSize.Fill,
        modifier = Modifier.fillMaxSize().background(Color.Black)
    ) { page ->
        ReelPage(
            post = list[page],
            me = me,
            active = pagerState.currentPage == page,
            dataSaver = dataSaver,
            onLike = onLike,
            onComments = { onComments(list[page]) },
            onProfile = onProfile
        )
    }
}

@Composable
private fun ReelPage(
    post: Post,
    me: VUser,
    active: Boolean,
    dataSaver: Boolean,
    onLike: (Post) -> Unit,
    onComments: () -> Unit,
    onProfile: (String) -> Unit
) {
    var liked by remember(post.id) { mutableStateOf(Fb.uid != null && post.likes.contains(Fb.uid)) }
    var muted by remember { mutableStateOf(true) }
    var started by remember(post.id) { mutableStateOf(!dataSaver) }
    var showHeart by remember { mutableStateOf(false) }
    var shareOpen by remember { mutableStateOf(false) }
    var saved by remember(post.id) { mutableStateOf(post.savedByMe) }
    var plays by remember(post.id) { mutableStateOf(post.views) }
    var following by remember { mutableStateOf<Boolean?>(null) }
    val scope = rememberCoroutineScope()
    val haptic = LocalHapticFeedback.current
    val myId = Fb.uid

    LaunchedEffect(post.userId) {
        following = if (post.userId == myId) true else try { Fb.isFollowing(post.userId) } catch (_: Exception) { false }
    }
    // count a view when the reel becomes the active page
    LaunchedEffect(active) {
        if (active) {
            plays += 1
            try { Fb.incrementViews(post.id) } catch (_: Exception) { }
        }
    }

    Box(Modifier.fillMaxSize().background(Color(0xFF0A0A0A))) {
        // media: autoplay only the active page; data-saver shows a thumb until tapped
        Box(
            Modifier.fillMaxSize()
                .pointerInput(post.id) {
                    detectTapGestures(onDoubleTap = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        if (!liked) { liked = true; onLike(post) }
                        showHeart = true
                    }, onTap = { if (!started) started = true })
                }
        ) {
            if (active && started && post.media.isNotBlank()) {
                VideoPlayer(media = post.media, muted = muted, modifier = Modifier.fillMaxSize())
            } else {
                DataImage(
                    url = post.media,
                    fallbackLetter = post.username.take(1).uppercase(),
                    circle = false,
                    modifier = Modifier.fillMaxSize()
                )
                if (!started) {
                    Box(Modifier.fillMaxSize(), Alignment.Center) {
                        Text("▶", color = Color.White.copy(alpha = 0.85f), fontSize = 52.sp)
                    }
                }
            }
            if (showHeart) {
                Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Icon(
                        painterResource(R.drawable.ic_heart_filled), null,
                        tint = Color(0xFFFF3040), modifier = Modifier.size(110.dp)
                    )
                }
                LaunchedEffect(post.id) {
                    kotlinx.coroutines.delay(700)
                    showHeart = false
                }
            }
        }

        // bottom-left: author + caption + follow chip
        Column(Modifier.align(Alignment.BottomStart).padding(start = 14.dp, bottom = 46.dp, end = 80.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp,
                    modifier = Modifier.clickable { onProfile(post.username) }
                )
                if (post.verified) {
                    Spacer(Modifier.width(4.dp))
                    VerifiedBadge(14)
                }
                if (following == false) {
                    Spacer(Modifier.width(10.dp))
                    Text(
                        "Follow",
                        color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp,
                        modifier = Modifier
                            .background(Color(0xFF262626), androidx.compose.foundation.shape.RoundedCornerShape(8.dp))
                            .clickable {
                                scope.launch {
                                    try {
                                        Fb.follow(post.copy().let { p -> VUser(p.userId, p.username, p.name, p.avatar, "", 0, 0, 0, p.verified, false) }, true)
                                        following = true
                                    } catch (_: Exception) { }
                                }
                            }
                            .padding(horizontal = 12.dp, vertical = 5.dp)
                    )
                }
            }
            if (post.caption.isNotBlank()) {
                Spacer(Modifier.height(6.dp))
                Text(post.caption, color = Color(0xFFEDEDED), fontSize = 13.sp, maxLines = 2)
            }
            Spacer(Modifier.height(4.dp))
            Text(fmtCount(plays) + " plays", color = Color(0xFF9A9A9A), fontSize = 11.sp)
        }

        // right rail (IG)
        Column(
            Modifier.align(Alignment.BottomEnd).padding(end = 10.dp, bottom = 46.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            IconButton(onClick = {
                if (!liked && Prefs.hapticsOn) haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                liked = !liked
                onLike(post)
            }) {
                Icon(
                    if (liked) painterResource(R.drawable.ic_heart_filled) else painterResource(R.drawable.ic_heart),
                    null,
                    tint = if (liked) Color(0xFFED4956) else Color.White,
                    modifier = Modifier.size(30.dp)
                )
            }
            Text(fmtCount(post.likesCount), color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            IconButton(onClick = onComments) {
                Icon(
                    painterResource(R.drawable.ic_comment), null,
                    tint = Color.White, modifier = Modifier.size(27.dp)
                )
            }
            Text(fmtCount(post.commentsCount), color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            IconButton(onClick = { shareOpen = true }) {
                Icon(painterResource(R.drawable.ic_dm), null, tint = Color.White, modifier = Modifier.size(26.dp))
            }
            Text("Share", color = Color.White, fontSize = 11.sp)
            Spacer(Modifier.height(12.dp))
            IconButton(onClick = {
                saved = !saved
                scope.launch { try { Fb.toggleSave(post.id) } catch (_: Exception) { } }
            }) {
                Icon(
                    if (saved) painterResource(R.drawable.ic_bookmark_filled) else painterResource(R.drawable.ic_bookmark),
                    null, tint = Color.White, modifier = Modifier.size(26.dp)
                )
            }
            Text("Save", color = Color.White, fontSize = 11.sp)
            Spacer(Modifier.height(12.dp))
            IconButton(onClick = { muted = !muted }) {
                Text(if (muted) "🔇" else "🔊", fontSize = 20.sp)
            }
        }

        if (shareOpen) {
            ShareSheet(post = post, onDismiss = { shareOpen = false })
        }
    }
}
