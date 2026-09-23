package com.vibegram.app

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
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
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.res.painterResource
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
    onHashtag: (String) -> Unit = {},
    onHidden: (Post) -> Unit = {},
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
    var feedMode by remember { mutableStateOf("foryou") }
    var followingIds by remember { mutableStateOf<Set<String>?>(null) }
    androidx.compose.runtime.LaunchedEffect(feedMode) {
        if (feedMode == "following" && followingIds == null) {
            followingIds = try { Fb.followingOf(me.id).map { it.id }.toSet() } catch (_: Exception) { setOf() }
        }
    }
    val visiblePosts = posts?.let { pl ->
        if (feedMode == "following") pl.filter { it.userId == me.id || (followingIds?.contains(it.userId) == true) } else pl
    }
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
                Icon(painterResource(R.drawable.ic_create), null, tint = Color.White, modifier = Modifier.size(26.dp))
            }
            Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
                Text(
                    "Instagram 2.0",
                    color = Color.White, fontSize = 30.sp,
                    fontFamily = androidx.compose.ui.text.font.FontFamily(
                        androidx.compose.ui.text.font.Font(R.font.grand_hotel)
                    )
                )
            }
            IconButton(onClick = onOpenNotifications) {
                Box {
                    Icon(painterResource(R.drawable.ic_heart), null, tint = Color.White, modifier = Modifier.size(25.dp))
                    if (unreadNotifs > 0) {
                        Box(
                            Modifier.align(Alignment.TopEnd).offset(x = 4.dp, y = (-1).dp)
                                .size(9.dp).background(Color(0xFFED4956), CircleShape)
                        )
                    }
                }
            }
        }

        // v7.2: IG-style feed switcher
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 2.dp),
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(8.dp)
        ) {
            listOf("foryou" to "For you", "following" to "Following").forEach { (k, label) ->
                Text(
                    label,
                    color = if (feedMode == k) Color.White else Color(0xFF8E8E8E),
                    fontWeight = FontWeight.Bold, fontSize = 13.sp,
                    modifier = Modifier
                        .background(if (feedMode == k) Color(0xFF262626) else Color.Transparent, RoundedCornerShape(16.dp))
                        .clickable { feedMode = k }
                        .padding(horizontal = 12.dp, vertical = 5.dp)
                )
            }
        }

        if (visiblePosts == null) {
            LoadingBox()
        } else if (err != null && visiblePosts.isEmpty()) {
            ErrorBox(err)
        } else if (visiblePosts.isEmpty()) {
            EmptyBox(if (feedMode == "following") "Follow people to see their posts here" else "No posts yet — follow people or share your first photo!", "📸")
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
                items(visiblePosts, key = { it.id }) { post ->
                    PostCard(
                        post = post,
                        onLike = onLike,
                        onComments = { onComments(post) },
                        onProfile = onProfile,
                        onAvatar = onOpenStory,
                        onDelete = onDelete,
                        onHashtag = onHashtag,
                        onHidden = onHidden
                    )
                }
                if (loadingMore) {
                    item {
                        Box(Modifier.fillMaxWidth().padding(14.dp), Alignment.Center) {
                            CircularProgressIndicator(Modifier.size(22.dp), color = Color.White, strokeWidth = 2.dp)
                        }
                    }
                } else {
                    item {
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 26.dp, horizontal = 20.dp),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("✓", color = Color(0xFF31D158), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.width(8.dp))
                            Column {
                                Text("You're all caught up", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("You've seen all new posts from the past 3 days.", color = Color(0xFF8E8E8E), fontSize = 12.sp)
                            }
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
    // LocalContext.current is a @Composable read, so it must happen OUTSIDE remember{}
    val storyCtx = androidx.compose.ui.platform.LocalContext.current
    val prefs = remember { storyCtx.getSharedPreferences("vibegram", 0) }
    fun isSeen(u: VUser, sts: List<Story>): Boolean =
        sts.isNotEmpty() && sts.all { prefs.getBoolean("seen_" + it.id, false) }
    val ownGroup = groups.firstOrNull { it.first.id == me.id }
    Row(
        Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(contentAlignment = Alignment.BottomEnd) {
                if (ownGroup != null) {
                    ZoomableAvatar(
                        url = me.avatar,
                        size = 60,
                        border = true,
                        gradientRing = true,
                        name = me.username,
                        onTap = { onOpenStory(me) }
                    )
                } else {
                    AvatarView(
                        url = me.avatar,
                        size = 60,
                        border = false,
                        name = me.username,
                        modifier = Modifier.clickable { onAddStory() }
                    )
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
            val allClose = stories.isNotEmpty() && stories.all { it.closeOnly }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                if (allClose) {
                    Box(
                        Modifier.size(66.dp).border(2.5.dp, Color(0xFF58C322), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        ZoomableAvatar(
                            url = user.avatar,
                            size = 57,
                            border = true,
                            gradientRing = false,
                            showRing = false,
                            name = user.username,
                            onTap = { onOpenStory(user) }
                        )
                    }
                } else {
                ZoomableAvatar(
                    url = user.avatar,
                    size = 60,
                    border = true,
                    gradientRing = !seen,
                    showRing = !seen,
                    name = user.username,
                    onTap = { onOpenStory(user) }
                )
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    user.username.take(9),
                    color = Color.White,
                    fontSize = 11.sp,
                    modifier = Modifier.clickable { onOpenStory(user) }
                )
            }
        }
    }
}

@Composable
fun AvatarView(
    url: String?,
    size: Int,
    border: Boolean,
    gradientRing: Boolean = false,
    name: String = "",
    showRing: Boolean = false,
    modifier: Modifier = Modifier
) {
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
    Box(modifier) {
        if (gradientRing || showRing) {
            Box(
                Modifier.size((size + 6).dp).background(
                    androidx.compose.ui.graphics.Brush.linearGradient(
                        listOf(Color(0xFFFEDA75), Color(0xFFFA7E1E), Color(0xFFD62976), Color(0xFF962FBF))
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
}

// IG "send to" sheet: pick a person, the post lands in your DM thread as a tappable card
@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun ShareSheet(post: Post, onDismiss: () -> Unit) {
    var targets by remember { mutableStateOf<List<VUser>?>(null) }
    var q by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val ctx = androidx.compose.ui.platform.LocalContext.current
    androidx.compose.runtime.LaunchedEffect(Unit) { targets = try { Fb.shareTargets() } catch (_: Exception) { emptyList() } }
    androidx.compose.runtime.LaunchedEffect(q) {
        if (q.isBlank()) return@LaunchedEffect
        kotlinx.coroutines.delay(250)
        targets = try { Fb.searchUsers(q) } catch (_: Exception) { emptyList() }
    }
    androidx.compose.material3.ModalBottomSheet(onDismissRequest = onDismiss, containerColor = Color(0xFF1C1C1E)) {
        Column(Modifier.padding(horizontal = 16.dp).height(440.dp)) {
            Text("Send post to…", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
            Spacer(Modifier.height(10.dp))
            androidx.compose.material3.OutlinedTextField(
                value = q,
                onValueChange = { q = it },
                placeholder = { Text("Search people", color = Color(0xFF8E8E8E)) },
                colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White, unfocusedTextColor = Color.White, cursorColor = Color(0xFF0095F6),
                    focusedBorderColor = Color(0xFF3A3A3C), unfocusedBorderColor = Color(0xFF3A3A3C)
                ),
                singleLine = true,
                shape = RoundedCornerShape(11.dp),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(6.dp))
            val list = targets
            if (list == null) {
                Box(Modifier.fillMaxWidth().padding(20.dp), Alignment.Center) {
                    CircularProgressIndicator(Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp)
                }
            } else {
                androidx.compose.foundation.lazy.LazyColumn(Modifier.weight(1f)) {
                    items(list.take(40)) { u ->
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 7.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AvatarView(url = u.avatar, size = 44, border = false, name = u.username)
                            Spacer(Modifier.width(12.dp))
                            Column(Modifier.weight(1f)) {
                                Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(u.name, color = Color(0xFF8E8E8E), fontSize = 12.sp)
                            }
                            Text(
                                "Send",
                                color = Color(0xFF0095F6), fontWeight = FontWeight.Bold, fontSize = 13.sp,
                                modifier = Modifier.clickable {
                                    scope.launch {
                                        try {
                                            Fb.sendDm(u.id, "post:" + post.id)
                                            android.widget.Toast.makeText(ctx, "Sent to @" + u.username, android.widget.Toast.LENGTH_SHORT).show()
                                            onDismiss()
                                        } catch (_: Exception) { }
                                    }
                                }.padding(8.dp)
                            )
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// IG-style compact count: 43.6K / 1.6M
fun fmtCount(n: Long): String = when {
    n >= 1_000_000L -> String.format(java.util.Locale.US, "%.1fM", n / 1_000_000.0)
    n >= 1_000L -> String.format(java.util.Locale.US, "%.1fK", n / 1_000.0)
    else -> n.toString()
}

@Composable
@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
fun PostCard(
    post: Post,
    onLike: (Post) -> Unit,
    onComments: () -> Unit,
    onProfile: (String) -> Unit,
    onAvatar: (VUser) -> Unit,
    onDelete: (Post) -> Unit,
    onHashtag: (String) -> Unit = {},
    onHidden: (Post) -> Unit = {}
) {
    var showHeart by remember { mutableStateOf(false) }
    var menu by remember { mutableStateOf(false) }
    var sharedNote by remember { mutableStateOf(false) }
    var savedLoc by remember(post.id) { mutableStateOf(post.savedByMe) }
    var editOpen by remember { mutableStateOf(false) }
    var editTxt by remember { mutableStateOf(post.caption) }
    var likedByOpen by remember { mutableStateOf(false) }
    var likedByList by remember { mutableStateOf<List<VUser>>(emptyList()) }
    var shareOpen by remember { mutableStateOf(false) }
    var insightsOpen by remember { mutableStateOf(false) }
    var mutedLoc by remember(post.id) { mutableStateOf(false) }
    var blockedLoc by remember(post.id) { mutableStateOf(false) }
    val cardScope = rememberCoroutineScope()
    val cardCtx = androidx.compose.ui.platform.LocalContext.current
    val haptic = androidx.compose.ui.platform.LocalHapticFeedback.current
    val myId = Fb.uid
    val liked = myId != null && post.likes.contains(myId)

    Column(Modifier.fillMaxWidth().padding(bottom = 10.dp)) {
        // header
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            ZoomableAvatar(
                url = post.avatar,
                size = 36,
                name = post.username,
                onTap = { onProfile(post.username) }
            )
            Spacer(Modifier.width(9.dp))
            Column(Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        post.username,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        modifier = Modifier.clickable { onProfile(post.username) }
                    )
                    if (post.verified) {
                        Spacer(Modifier.width(4.dp))
                        VerifiedBadge(15)
                    }
                    if (post.userId != myId) {
                        var headFollow by remember(post.id) { mutableStateOf<Boolean?>(null) }
                        androidx.compose.runtime.LaunchedEffect(post.id) {
                            headFollow = try { Fb.isFollowing(post.userId) } catch (_: Exception) { false }
                        }
                        if (headFollow == false) {
                            Spacer(Modifier.width(8.dp))
                            Text(
                                "Follow",
                                color = Color(0xFF0095F6), fontWeight = FontWeight.Bold, fontSize = 13.sp,
                                modifier = Modifier.clickable {
                                    headFollow = true
                                    cardScope.launch {
                                        try { Fb.follow(VUser(post.userId, post.username, post.name, post.avatar, "", 0, 0, 0, post.verified, false), true) } catch (_: Exception) { }
                                    }
                                }
                            )
                        }
                    }
                }
            }
            Box {
                IconButton(onClick = { menu = true }) {
                    Icon(painterResource(R.drawable.ic_dots), null, tint = Color.White, modifier = Modifier.size(20.dp))
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
                                                put(android.provider.MediaStore.Images.Media.DISPLAY_NAME, "instagram2_" + post.id + ".jpg")
                                                put(android.provider.MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                                                put(android.provider.MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Instagram2")
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
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text("Insights", color = Color.White) },
                            onClick = { menu = false; insightsOpen = true }
                        )
                    }
                    if (post.userId != Fb.uid) {
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (mutedLoc) "Unmute posts" else "Mute posts", color = Color.White) },
                            onClick = {
                                menu = false
                                val on = !mutedLoc
                                mutedLoc = on
                                cardScope.launch { try { Fb.toggleMute(post.userId, "mutedPosts", on) } catch (_: Exception) { } }
                                android.widget.Toast.makeText(cardCtx, if (on) "Posts from @" + post.username + " muted" else "Unmuted", android.widget.Toast.LENGTH_SHORT).show()
                            }
                        )
                        if (!blockedLoc) {
                            androidx.compose.material3.DropdownMenuItem(
                                text = { Text("Block @" + post.username, color = Color(0xFFED4956)) },
                                onClick = {
                                    menu = false
                                    blockedLoc = true
                                    cardScope.launch { try { Fb.toggleBlock(post.userId, true) } catch (_: Exception) { } }
                                    android.widget.Toast.makeText(cardCtx, "@" + post.username + " blocked", android.widget.Toast.LENGTH_SHORT).show()
                                    onHidden(post)
                                }
                            )
                        }
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
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text("Not interested", color = Color.White) },
                        onClick = {
                            menu = false
                            try {
                                val pr = cardCtx.getSharedPreferences("vibegram", 0)
                                val cur = pr.getString("hidden_posts", "") ?: ""
                                pr.edit().putString("hidden_posts", (cur + "," + post.id).trim(',')).apply()
                            } catch (_: Exception) { }
                            onHidden(post)
                            android.widget.Toast.makeText(cardCtx, "You'll see fewer posts like this", android.widget.Toast.LENGTH_SHORT).show()
                        }
                    )
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text("Report", color = Color(0xFFED4956)) },
                        onClick = {
                            menu = false
                            cardScope.launch { try { Fb.reportPost(post.id, post.username) } catch (_: Exception) { } }
                            android.widget.Toast.makeText(cardCtx, "Report submitted. Thanks for keeping Instagram 2.0 safe.", android.widget.Toast.LENGTH_SHORT).show()
                        }
                    )
                    androidx.compose.material3.DropdownMenuItem(
                        text = { Text("Copy link", color = Color.White) },
                        onClick = {
                            menu = false
                            val cm = cardCtx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                            cm.setPrimaryClip(android.content.ClipData.newPlainText("link", "https://instagram2.app/p/" + post.id))
                            android.widget.Toast.makeText(cardCtx, "Link copied", android.widget.Toast.LENGTH_SHORT).show()
                        }
                    )
                    if (post.userId == Fb.uid) {
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.pinnedAt > 0) "Unpin from profile" else "Pin to profile", color = Color.White) },
                            onClick = {
                                menu = false
                                cardScope.launch {
                                    try {
                                        if (post.pinnedAt == 0L) {
                                            val pinned = Fb.userPosts(post.username).count { it.pinnedAt > 0 }
                                            if (pinned >= 3) {
                                                android.widget.Toast.makeText(cardCtx, "You can pin up to 3 posts", android.widget.Toast.LENGTH_SHORT).show()
                                                return@launch
                                            }
                                            Fb.setPostField(post.id, "pinnedAt", System.currentTimeMillis())
                                            android.widget.Toast.makeText(cardCtx, "Pinned to your profile", android.widget.Toast.LENGTH_SHORT).show()
                                        } else {
                                            Fb.setPostField(post.id, "pinnedAt", 0L)
                                            android.widget.Toast.makeText(cardCtx, "Unpinned", android.widget.Toast.LENGTH_SHORT).show()
                                        }
                                    } catch (_: Exception) { }
                                }
                            }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.commentsOff) "Turn on commenting" else "Turn off commenting", color = Color.White) },
                            onClick = {
                                menu = false
                                cardScope.launch { try { Fb.setPostField(post.id, "commentsOff", !post.commentsOff) } catch (_: Exception) { } }
                            }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.hideLikes) "Show like count" else "Hide like count", color = Color.White) },
                            onClick = {
                                menu = false
                                cardScope.launch { try { Fb.setPostField(post.id, "hideLikes", !post.hideLikes) } catch (_: Exception) { } }
                            }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.archived) "Unarchive" else "Archive", color = Color.White) },
                            onClick = {
                                menu = false
                                cardScope.launch {
                                    try {
                                        Fb.setPostField(post.id, "archived", !post.archived)
                                        android.widget.Toast.makeText(cardCtx, if (post.archived) "Restored to profile" else "Archived — find it in ⋮ → Archived", android.widget.Toast.LENGTH_SHORT).show()
                                    } catch (_: Exception) { }
                                }
                            }
                        )
                    }
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
                    detectTapGestures(
                        onDoubleTap = {
                            if (Prefs.hapticsOn) haptic.performHapticFeedback(androidx.compose.ui.hapticfeedback.HapticFeedbackType.LongPress)
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
                            painterResource(R.drawable.ic_play), null,
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
                        painterResource(R.drawable.ic_heart_filled), null,
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
                    if (liked) painterResource(R.drawable.ic_heart_filled) else painterResource(R.drawable.ic_heart),
                    null,
                    tint = if (liked) Color(0xFFED4956) else Color.White,
                    modifier = Modifier.size(26.dp)
                )
            }
            IconButton(onClick = onComments) {
                Icon(painterResource(R.drawable.ic_comment), null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            IconButton(onClick = { shareOpen = true }) {
                Icon(painterResource(R.drawable.ic_dm), null, tint = Color.White, modifier = Modifier.size(22.dp))
            }
            IconButton(onClick = {
                val next = !savedLoc
                savedLoc = next
                cardScope.launch { try { Fb.toggleSave(post.id) } catch (_: Exception) { } }
            }) {
                Icon(
                    if (savedLoc) painterResource(R.drawable.ic_bookmark_filled) else painterResource(R.drawable.ic_bookmark),
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

        if (shareOpen) {
            ShareSheet(post = post, onDismiss = { shareOpen = false })
        }

        if (insightsOpen) {
            InsightsSheet(post = post, onDismiss = { insightsOpen = false })
        }

        // likes + caption
        Column(Modifier.padding(horizontal = 12.dp)) {
            if (post.hideLikes && post.userId != myId) {
                Text("Likes hidden", color = Color(0xFF8E8E8E), fontWeight = FontWeight.Bold, fontSize = 13.sp)
            } else {
                Text(
                    fmtCount(post.likesCount) + " like" + if (post.likesCount == 1L) "" else "s",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    modifier = Modifier.clickable {
                        likedByOpen = true
                        cardScope.launch {
                            likedByList = try { Fb.likersOf(post) } catch (_: Exception) { emptyList() }
                        }
                    }
                )
            }
            if (post.caption.isNotBlank()) {
                Spacer(Modifier.height(3.dp))
                Row {
                    Text(post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(Modifier.width(6.dp))
                    HashtagText(post.caption, onMention = onProfile, onTag = onHashtag)
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
// BUGFIX: indexOf(w) coloured the FIRST occurrence of a repeated word; now we scan forward.
// @mentions become tappable when onMention is provided (opens that profile).
@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
fun HashtagText(text: String, fontSizeSp: Int = 13, onMention: ((String) -> Unit)? = null, onTag: ((String) -> Unit)? = null) {
    val spans = androidx.compose.ui.text.buildAnnotatedString {
        append(text)
        var i = 0
        for (w in text.split(" ")) {
            val start = text.indexOf(w, i)
            if (start >= 0) {
                if (w.startsWith("#") || w.startsWith("@")) {
                    addStyle(
                        androidx.compose.ui.text.SpanStyle(color = Color(0xFF5B9BD5), fontWeight = FontWeight.Bold),
                        start,
                        start + w.length
                    )
                    if (w.startsWith("@") && w.length > 1) {
                        addStringAnnotation("mention", w.removePrefix("@").trimEnd(',', '.', '!', '?'), start, start + w.length)
                    }
                    if (w.startsWith("#") && w.length > 1) {
                        addStringAnnotation("tag", w.removePrefix("#").trimEnd(',', '.', '!', '?'), start, start + w.length)
                    }
                }
                i = start + w.length
            }
        }
    }
    if (onMention == null && onTag == null) {
        Text(spans, color = Color.White, fontSize = fontSizeSp.sp)
    } else {
        androidx.compose.foundation.text.ClickableText(spans, style = androidx.compose.ui.text.TextStyle(color = Color.White, fontSize = fontSizeSp.sp)) { off ->
            spans.getStringAnnotations("mention", off, off).firstOrNull()?.let { onMention?.invoke(it.item) }
                ?: spans.getStringAnnotations("tag", off, off).firstOrNull()?.let { onTag?.invoke(it.item) }
        }
    }
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
