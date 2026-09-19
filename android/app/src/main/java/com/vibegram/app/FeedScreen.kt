package com.vibegram.app

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.runtime.derivedStateOf
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
    onOpenCreate: () -> Unit,
    onStoryPicked: (Uri) -> Unit,
    onDelete: (Post) -> Unit,
    onLoadMore: () -> Unit = {},
    loadingMore: Boolean = false,
    scrollTick: Int = 0,
    unreadNotifs: Int = 0
) {
    val listState = androidx.compose.foundation.lazy.rememberLazyListState()
    androidx.compose.runtime.LaunchedEffect(scrollTick) {
        if (scrollTick > 0) listState.animateScrollToItem(0)
    }
    val shouldLoadMore by remember {
        androidx.compose.runtime.derivedStateOf {
            val li = listState.layoutInfo
            val last = li.visibleItemsInfo.lastOrNull()?.index ?: 0
            li.totalItemsCount > 0 && last >= li.totalItemsCount - 3
        }
    }
    androidx.compose.runtime.LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore) onLoadMore()
    }
    var refreshing by remember { mutableStateOf(false) }
    androidx.compose.runtime.LaunchedEffect(posts) { refreshing = false }
    val storyPicker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) onStoryPicked(uri)
    }
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
                Box {
                    Icon(Icons.Filled.FavoriteBorder, null, tint = Color.White, modifier = Modifier.size(25.dp))
                    if (unreadNotifs > 0) {
                        Box(
                            Modifier.align(Alignment.TopEnd).offset(x = 4.dp, y = (-1).dp)
                                .size(9.dp).background(Color(0xFFED4956), CircleShape)
                        )
                    }
                }
            }
        }

        if (posts == null) {
            LoadingBox()
        } else if (err != null && posts.isEmpty()) {
            ErrorBox(err)
        } else if (posts.isEmpty()) {
            EmptyBox("No posts yet — follow people or share your first photo!", "📸")
        } else {
            LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
                // stories bar
                item {
                    StoryBar(
                        me = me,
                        groups = storyGroups.toList(),
                        onAddStory = { storyPicker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                        onOpenStory = onOpenStory
                    )
                }
                items(posts, key = { it.id }) { post ->
                    PostCard(
                        post = post,
                        onLike = onLike,
                        onComments = { onComments(post) },
                        onProfile = onProfile,
                        onAvatar = onOpenStory,
                        onDelete = onDelete
                    )
                }
                if (loadingMore) {
                    item {
                        Box(Modifier.fillMaxWidth().padding(14.dp), Alignment.Center) {
                            CircularProgressIndicator(Modifier.size(22.dp), color = Color.White, strokeWidth = 2.dp)
                        }
                    }
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
    val prefs = androidx.compose.ui.platform.LocalContext.current.getSharedPreferences("vibegram", 0)
    val seenTick = remember { mutableStateOf(0) }
    fun isSeen(u: VUser, sts: List<Story>): Boolean =
        sts.isNotEmpty() && sts.all { prefs.getBoolean("seen_" + it.id, false) }
    val ownGroup = groups.firstOrNull { it.first.id == me.id }
    Row(
        Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.clickable {
                if (ownGroup != null) onOpenStory(me) else onAddStory()
            }
        ) {
            Box(contentAlignment = Alignment.BottomEnd) {
                if (ownGroup != null) {
                    AvatarView(url = me.avatar, size = 60, border = true, gradientRing = true, name = me.username)
                } else {
                    AvatarView(url = me.avatar, size = 60, border = false, name = me.username)
                    Box(
                        Modifier.size(22.dp).background(Color(0xFF0095F6), CircleShape).padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) { Text("+", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold) }
                }
            }
            Spacer(Modifier.height(4.dp))
            Text("Your story", color = Color.White, fontSize = 11.sp)
        }
        groups.filter { it.first.id != me.id }.take(8).forEach { (user, stories) ->
            val seen = isSeen(user, stories)
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.clickable { onOpenStory(user) }
            ) {
                AvatarView(url = user.avatar, size = 60, border = true, gradientRing = !seen, showRing = !seen, name = user.username)
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
            DataImage(
                url = url,
                fallbackLetter = if (name.isNotBlank()) name.take(1).uppercase() else "",
                fallbackSize = (sz * 0.42).toInt().coerceAtLeast(10),
                modifier = Modifier.size(sz.dp).clip(CircleShape)
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
    onAvatar: (VUser) -> Unit,
    onDelete: (Post) -> Unit
) {
    var showHeart by remember { mutableStateOf(false) }
    var menu by remember { mutableStateOf(false) }
    var sharedNote by remember { mutableStateOf(false) }
    var savedLoc by remember(post.id) { mutableStateOf(post.savedByMe) }
    var editOpen by remember { mutableStateOf(false) }
    var editTxt by remember { mutableStateOf(post.caption) }
    val cardScope = rememberCoroutineScope()
    val cardCtx = androidx.compose.ui.platform.LocalContext.current
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
                        VerifiedBadge(15)
                    }
                }
            }
            Box {
                IconButton(onClick = { menu = true }) {
                    Icon(Icons.Filled.MoreVert, null, tint = Color.White, modifier = Modifier.size(20.dp))
                }
                androidx.compose.material3.DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                    if (post.caption.isNotBlank()) {
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text("Copy caption", color = Color.White) },
                            onClick = {
                                menu = false
                                val cm = cardCtx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                                cm.setPrimaryClip(android.content.ClipData.newPlainText("caption", post.caption))
                                android.widget.Toast.makeText(cardCtx, "Caption copied", android.widget.Toast.LENGTH_SHORT).show()
                            }
                        )
                    }
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text(if (post.repostedByMe) "Undo repost" else "Repost", color = Color.White) },
                        onClick = {
                            menu = false
                            cardScope.launch { try { Fb.repost(post, !post.repostedByMe) } catch (_: Exception) { } }
                        }
                    )
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text("Save image", color = Color.White) },
                        onClick = {
                            menu = false
                            cardScope.launch(kotlinx.coroutines.Dispatchers.IO) {
                                try {
                                    val b64 = post.media.substringAfter("base64,", "")
                                    if (b64.isNotEmpty()) {
                                        val bytes = android.util.Base64.decode(b64, android.util.Base64.DEFAULT)
                                        val bmpSave = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                                        if (bmpSave != null) {
                                            val vals = android.content.ContentValues().apply {
                                                put(android.provider.MediaStore.Images.Media.DISPLAY_NAME, "vibegram_" + post.id + ".jpg")
                                                put(android.provider.MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                                                put(android.provider.MediaStore.Images.Media.RELATIVE_PATH, "Pictures/VibeGram")
                                            }
                                            val uri = cardCtx.contentResolver.insert(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI, vals)
                                            if (uri != null) cardCtx.contentResolver.openOutputStream(uri)?.use { bmpSave.compress(android.graphics.Bitmap.CompressFormat.JPEG, 90, it) }
                                            kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) {
                                                android.widget.Toast.makeText(cardCtx, "Saved to gallery", android.widget.Toast.LENGTH_SHORT).show()
                                            }
                                        }
                                    }
                                } catch (_: Exception) { }
                            }
                        }
                    )
                    if (post.userId == Fb.uid) {
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text("Edit caption", color = Color.White) },
                            onClick = { menu = false; editTxt = post.caption; editOpen = true }
                        )
                    }
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text("Add to story", color = Color.White) },
                        onClick = {
                            menu = false
                            cardScope.launch {
                                try { Fb.addStoryUrl(post.media); sharedNote = true } catch (_: Exception) { }
                            }
                        }
                    )
                    if (post.userId == Fb.uid) {
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text("Delete", color = Color(0xFFED4956)) },
                            onClick = {
                                menu = false
                                cardScope.launch { onDelete(post) }
                            }
                        )
                    }
                }
            }
        }

        // media (double-tap to like)
        Box(
            Modifier.fillMaxWidth().aspectRatio(1f).background(Color(0xFF111111))
                .pointerInput(post.id) {
                    val haptic = androidx.compose.ui.platform.LocalHapticFeedback.current
                    detectTapGestures(
                        onDoubleTap = {
                            haptic.performHapticFeedback(androidx.compose.ui.hapticfeedback.HapticFeedbackType.LongPress)
                            if (!liked) onLike(post)
                            showHeart = true
                        }
                    )
                }
        ) {
            if (post.isVideo) {
                var playVideo by remember(post.id) { mutableStateOf(false) }
                if (playVideo) {
                    VideoPlayer(media = post.media, muted = true, modifier = Modifier.fillMaxSize())
                } else {
                    DataImage(
                        url = post.media,
                        fallbackLetter = post.username.take(1).uppercase(),
                        circle = false,
                        modifier = Modifier.fillMaxSize()
                    )
                    Box(Modifier.fillMaxSize(), Alignment.Center) {
                        Icon(
                            Icons.Filled.PlayArrow, null,
                            tint = Color.White.copy(alpha = 0.9f),
                            modifier = Modifier.size(64.dp).androidxClickableTap { playVideo = true }
                        )
                    }
                }
            } else {
                DataImage(
                    url = post.media,
                    fallbackLetter = post.username.take(1).uppercase(),
                    circle = false,
                    modifier = Modifier.fillMaxSize()
                )
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
                    if (savedLoc) Icons.Filled.Bookmark else Icons.Filled.BookmarkBorder,
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

        if (likedByOpen) {
            androidx.compose.material3.ModalBottomSheet(onDismissRequest = { likedByOpen = false }, containerColor = Color(0xFF1C1C1E)) {
                Column(Modifier.padding(horizontal = 16.dp).height(400.dp)) {
                    Text("Likes", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                    Spacer(Modifier.height(10.dp))
                    if (likedByList.isEmpty()) Text("No likes yet", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                    LazyColumn(Modifier.weight(1f)) {
                        items(likedByList.size) { i ->
                            val lu = likedByList[i]
                            Row(
                                Modifier.fillMaxWidth().androidxClickableTap { onProfile(lu.username) }
                                    .padding(vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AvatarView(url = lu.avatar, size = 42, border = false, name = lu.username)
                                Spacer(Modifier.width(12.dp))
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(lu.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        if (lu.verified) { Spacer(Modifier.width(4.dp)); VerifiedBadge(14) }
                                    }
                                    Text(lu.name, color = Color(0xFF8E8E8E), fontSize = 12.sp)
                                }
                            }
                        }
                    }
                    Spacer(Modifier.height(20.dp))
                }
            }
        }

        if (editOpen) {
            androidx.compose.material3.AlertDialog(
                onDismissRequest = { editOpen = false },
                title = { Text("Edit caption", color = Color.White) },
                text = {
                    androidx.compose.material3.OutlinedTextField(
                        value = editTxt,
                        onValueChange = { editTxt = it },
                        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White, unfocusedTextColor = Color.White, cursorColor = Color(0xFF0095F6)
                        ),
                        maxLines = 4
                    )
                },
                confirmButton = {
                    Text("Save", color = Color(0xFF0095F6), fontWeight = FontWeight.Bold, modifier = Modifier.clickable {
                        editOpen = false
                        cardScope.launch { try { Fb.updateCaption(post.id, editTxt) } catch (_: Exception) { } }
                    }.padding(6.dp))
                },
                dismissButton = { Text("Cancel", color = Color(0xFF8E8E8E), modifier = Modifier.clickable { editOpen = false }.padding(6.dp)) },
                containerColor = Color(0xFF1C1C1E)
            )
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
                    HashtagText(post.caption)
                }
            }
            if (post.createdAt > 0) {
                Spacer(Modifier.height(3.dp))
                Text(postTimeAgo(post.createdAt), color = Color(0xFF8E8E8E), fontSize = 11.sp)
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

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.androidxClickableTap(onClick: () -> Unit): Modifier =
    this.then(Modifier.clickable { onClick() })

// IG caption style: hashtags/mentions blue
@Composable
fun HashtagText(text: String, fontSizeSp: Int = 13) {
    val spans = androidx.compose.ui.text.buildAnnotatedString {
        append(text)
        text.split(" ").forEach { w ->
            val start = text.indexOf(w)
            if (w.startsWith("#") || w.startsWith("@")) {
                addStyle(
                    androidx.compose.ui.text.SpanStyle(color = Color(0xFF5B9BD5), fontWeight = FontWeight.Bold),
                    start,
                    start + w.length
                )
            }
        }
    }
    Text(spans, color = Color.White, fontSize = fontSizeSp.sp)
}

fun postTimeAgo(ms: Long): String {
    if (ms <= 0) return ""
    val m = (System.currentTimeMillis() - ms) / 60000
    return when {
        m < 1 -> "just now"
        m < 60 -> m.toString() + "m"
        m < 60 * 24 -> (m / 60).toString() + "h"
        m < 60 * 24 * 7 -> (m / 60 / 24).toString() + "d"
        else -> (m / 60 / 24 / 7).toString() + "w"
    }
}
