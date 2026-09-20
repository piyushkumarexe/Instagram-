package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material3.Text
import androidx.compose.material3.IconButton
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Send
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay


@Composable
fun PostModal(
    post: Post,
    onLike: (Post) -> Unit,
    onComments: (Post) -> Unit,
    onProfile: (String) -> Unit,
    onClose: () -> Unit
) {
    var showHeart by remember { mutableStateOf(false) }
    var pmMenu by remember { mutableStateOf(false) }
    var pmSaved by remember(post.id) { mutableStateOf(post.savedByMe) }
    var pmShare by remember { mutableStateOf(false) }
    val pmScope = rememberCoroutineScope()
    val pmCtx = androidx.compose.ui.platform.LocalContext.current
    val myId = Fb.uid
    var liked by remember(post.id) { mutableStateOf(myId != null && post.likes.contains(myId)) }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        // header
        Row(
            Modifier.fillMaxWidth().height(52.dp).padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("←", color = Color.White, fontSize = 21.sp, modifier = Modifier
                .clickable { onClose() }
                .padding(horizontal = 10.dp))
            Text(post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp,
                modifier = Modifier.clickable { onProfile(post.username) })
            if (post.verified) {
                Spacer(Modifier.width(4.dp))
                VerifiedBadge(15)
            }
            Box(Modifier.weight(1f))
            if (post.userId == Fb.uid) {
                Box {
                    IconButton(onClick = { pmMenu = true }) {
                        Text("⋮", color = Color.White, fontSize = 18.sp)
                    }
                    androidx.compose.material3.DropdownMenu(expanded = pmMenu, onDismissRequest = { pmMenu = false }) {
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.pinnedAt > 0) "Unpin" else "Pin to profile", color = Color.White) },
                            onClick = {
                                pmMenu = false
                                pmScope.launch {
                                    try {
                                        if (post.pinnedAt == 0L) {
                                            if (Fb.userPosts(post.username).count { it.pinnedAt > 0 } >= 3) {
                                                android.widget.Toast.makeText(pmCtx, "You can pin up to 3 posts", android.widget.Toast.LENGTH_SHORT).show()
                                            } else Fb.setPostField(post.id, "pinnedAt", System.currentTimeMillis())
                                        } else Fb.setPostField(post.id, "pinnedAt", 0L)
                                    } catch (_: Exception) { }
                                }
                            }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.commentsOff) "Turn on commenting" else "Turn off commenting", color = Color.White) },
                            onClick = { pmMenu = false; pmScope.launch { try { Fb.setPostField(post.id, "commentsOff", !post.commentsOff) } catch (_: Exception) { } } }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.hideLikes) "Show like count" else "Hide like count", color = Color.White) },
                            onClick = { pmMenu = false; pmScope.launch { try { Fb.setPostField(post.id, "hideLikes", !post.hideLikes) } catch (_: Exception) { } } }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text(if (post.archived) "Unarchive" else "Archive", color = Color.White) },
                            onClick = { pmMenu = false; pmScope.launch { try { Fb.setPostField(post.id, "archived", !post.archived) } catch (_: Exception) { } } }
                        )
                        androidx.compose.material3.DropdownMenuItem(
                            text = { Text("Copy link", color = Color.White) },
                            onClick = {
                                pmMenu = false
                                val cm = pmCtx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                                cm.setPrimaryClip(android.content.ClipData.newPlainText("link", "https://instagram2.app/p/" + post.id))
                            }
                        )
                    }
                }
            }
        }

        if (post.isVideo) {
            var pm by remember(post.id) { mutableStateOf(false) }
            if (pm) VideoPlayer(media = post.media, muted = true, modifier = Modifier.fillMaxWidth().aspectRatio(1f))
            else Box(Modifier.fillMaxWidth().aspectRatio(1f).androidxTapPlay { pm = true }, Alignment.Center) {
                Icon(Icons.Filled.PlayArrow, null, tint = Color.White.copy(alpha = 0.9f), modifier = Modifier.size(64.dp))
            }
        } else {
        AsyncImage(
            model = post.media,
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier.fillMaxWidth().aspectRatio(1f)
                .pointerInput(post.id) {
                    detectTapGestures(onDoubleTap = {
                        if (!liked) { liked = true; onLike(post) }
                        showHeart = true
                    })
                }
        )
        }

        Row(
            Modifier.fillMaxWidth().padding(horizontal = 6.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = {
                liked = !liked
                onLike(post)
            }) {
                Icon(
                    if (liked) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder, null,
                    tint = if (liked) Color(0xFFED4956) else Color.White,
                    modifier = Modifier.size(26.dp)
                )
            }
            IconButton(onClick = { onComments(post) }) {
                Icon(Icons.Outlined.ChatBubbleOutline, null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            IconButton(onClick = {
                pmSaved = !pmSaved
                pmScope.launch { try { Fb.toggleSave(post.id) } catch (_: Exception) { } }
            }) {
                Icon(
                    if (pmSaved) Icons.Filled.Bookmark else Icons.Filled.BookmarkBorder, null,
                    tint = Color.White, modifier = Modifier.size(24.dp)
                )
            }
            IconButton(onClick = { pmShare = true }) {
                Icon(Icons.Filled.Send, null, tint = Color.White, modifier = Modifier.size(22.dp))
            }
            Box(Modifier.weight(1f))
        }
        if (pmShare) {
            ShareSheet(post = post, onDismiss = { pmShare = false })
        }

        Column(Modifier.padding(horizontal = 12.dp)) {
            Text(
                post.likesCount.toString() + " like" + if (post.likesCount == 1L) "" else "s",
                color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp
            )
            if (post.caption.isNotBlank()) {
                Spacer(Modifier.height(4.dp))
                Row {
                    Text(post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(Modifier.width(6.dp))
                    Text(post.caption, color = Color.White, fontSize = 13.sp)
                }
            }
        }
        if (showHeart) {
            LaunchedEffect(showHeart) { kotlinx.coroutines.delay(700); showHeart = false }
        }
    }
    if (showHeart) {
        Box(Modifier.fillMaxSize(), Alignment.Center) {
            Icon(Icons.Filled.Favorite, null, tint = Color(0xFFFF3040), modifier = Modifier.size(96.dp))
        }
    }
}

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class, androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun StoryViewer(user: VUser, stories: List<Story>, onClose: () -> Unit) {
    val svCtx = androidx.compose.ui.platform.LocalContext.current
    var idx by remember { mutableStateOf(0) }
    var progress by remember { mutableStateOf(0f) }
    var reply by remember { mutableStateOf("") }
    var player by remember { mutableStateOf<android.media.MediaPlayer?>(null) }
    val replyScope = rememberCoroutineScope()
    val isOwn = user.id == Fb.uid
    var viewersSheet by remember { mutableStateOf(false) }
    var viewers by remember { mutableStateOf<List<VUser>>(emptyList()) }
    var gone by remember { mutableStateOf(false) }
    var held by remember { mutableStateOf(false) }

    suspend fun openViewers() {
        viewers = try { Fb.storyViewers(stories.getOrNull(idx)?.id ?: "") } catch (_: Exception) { emptyList() }
        viewersSheet = true
    }

    // music playback for current story
    androidx.compose.runtime.DisposableEffect(idx, stories.getOrNull(idx)?.musicUrl) {
        val st = stories.getOrNull(idx)
        var mp: android.media.MediaPlayer? = null
        if (st?.musicUrl != null) {
            try {
                mp = android.media.MediaPlayer()
                mp.setDataSource(st.musicUrl)
                mp.prepare()
                mp.isLooping = true
                mp.start()
            } catch (_: Exception) { mp = null }
        }
        onDispose {
            try { mp?.stop(); mp?.release() } catch (_: Exception) { }
        }
    }
    androidx.compose.runtime.DisposableEffect(Unit) {
        onDispose { try { player?.stop(); player?.release() } catch (_: Exception) { } }
    }

    val seenPrefs = androidx.compose.ui.platform.LocalContext.current.getSharedPreferences("vibegram", 0)
    LaunchedEffect(user.id, idx) {
        val st0 = stories.getOrNull(idx)
        if (st0 != null && !isOwn) {
            // StoryBar reads this flag to grey the ring out — it was never written before,
            // so seen stories kept their coloured ring forever.
            seenPrefs.edit().putBoolean("seen_" + st0.id, true).apply()
            try { Fb.viewStory(st0.id) } catch (_: Exception) { }
        }
    }
    LaunchedEffect(user.id, held) {
        if (held) return@LaunchedEffect          // long-press pauses playback
        while (idx < stories.size - 1) {
            for (i in 1..50) {
                delay(100)
                progress = i / 50f
            }
            progress = 0f
            idx++
        }
        delay(5000)
        onClose()
    }

    Box(
        Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()
            .pointerInput(Unit) {
                // v7.3: swipe down closes the story (IG)
                androidx.compose.ui.input.pointer.awaitPointerEventScope {
                    while (true) {
                        androidx.compose.ui.input.pointer.awaitFirstDown(requireUnconsumed = false)
                        var dy = 0f
                        while (true) {
                            val ev = awaitPointerEvent()
                            val ch = ev.changes.firstOrNull() ?: break
                            dy += ch.position.y - ch.previousPosition.y
                            if (dy > 140) { onClose(); break }
                            if (dy < -40 || !ch.pressed) break
                        }
                    }
                }
            }
    ) {
        val story = stories.getOrNull(idx)
        if (story == null) {
            onClose()
            return@Box
        }

        // progress segments
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            repeat(stories.size) { i ->
                Box(Modifier.weight(1f).height(3.dp).background(if (i < idx) Color.White else if (i == idx) Color.White.copy(alpha = 0.4f + 0.6f * progress) else Color(0xFF444444)))
            }
        }

        // header
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AvatarView(url = user.avatar, size = 32, border = false)
            Spacer(Modifier.width(9.dp))
            Text(user.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            val cur0 = stories.getOrNull(idx)
            if (cur0?.musicTitle != null) {
                Spacer(Modifier.width(10.dp))
                Box(
                    Modifier.background(Color(0x66000000), RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🎵", fontSize = 11.sp)
                        Spacer(Modifier.width(4.dp))
                        Text(cur0.musicTitle!!, color = Color.White, fontSize = 11.sp, maxLines = 1)
                    }
                }
            }
            if (stories.getOrNull(idx)?.closeOnly == true) {
                Spacer(Modifier.width(8.dp))
                Text("💚", fontSize = 12.sp)
            }
        }

        // media
        if (story.isVideo) {
            VideoPlayer(media = story.media, modifier = Modifier.fillMaxSize())
        } else {
            DataImage(
                url = story.media,
                circle = false,
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxSize()
            )
        }

        // text overlay (draggable in composer; static here)
        val cur1 = stories.getOrNull(idx)
        if (cur1?.overlayText != null) {
            val fam = when (cur1.overlayFont) {
                "Typewriter" -> androidx.compose.ui.text.font.FontFamily.Monospace
                "Serif" -> androidx.compose.ui.text.font.FontFamily.Serif
                "Neon" -> androidx.compose.ui.text.font.FontFamily.Cursive
                else -> androidx.compose.ui.text.font.FontFamily.SansSerif
            }
            BoxWithConstraints(Modifier.fillMaxSize()) {
                Text(
                    cur1.overlayText!!,
                    color = Color(cur1.overlayColor ?: 0xFFFFFFFFL),
                    fontFamily = fam,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    lineHeight = 32.sp,
                    modifier = Modifier.fillMaxWidth(0.86f)
                        .offset(x = maxWidth * cur1.overlayX - maxWidth * 0.43f, y = maxHeight * cur1.overlayY)
                )
            }
        }

        // tap zones (long-press anywhere = pause, exactly like Instagram)
        Row(Modifier.fillMaxSize()) {
            Box(
                Modifier.weight(1f).fillMaxSize().pointerInput(idx) {
                    detectTapGestures(
                        onPress = {
                            val released = tryAwaitRelease()
                            if (!released) held = false
                        },
                        onTap = { if (idx > 0) { idx--; progress = 0f } else onClose() },
                        onLongPress = { held = true }
                    )
                }
            )
            Box(
                Modifier.weight(1f).fillMaxSize().pointerInput(idx) {
                    detectTapGestures(
                        onPress = {
                            val released = tryAwaitRelease()
                            if (!released) held = false
                        },
                        onTap = { if (idx < stories.size - 1) { idx++; progress = 0f } else onClose() },
                        onLongPress = { held = true }
                    )
                }
            )
        }
        if (held) {
            Text(
                "Paused",
                color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.TopCenter).padding(top = 34.dp)
                    .background(Color(0x66000000), RoundedCornerShape(10.dp))
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            )
        }

        // own story: viewers count + delete
        if (isOwn && !gone) {
            Row(
                Modifier.align(Alignment.BottomCenter).fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 18.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                val stNow = stories.getOrNull(idx)
                Text(
                    (stNow?.viewsCount ?: 0L).toString() + " viewers",
                    color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp,
                    modifier = Modifier
                        .androidxClickable { replyScope.launch { openViewers() } }
                        .background(Color(0x33000000), RoundedCornerShape(18.dp))
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                )
                Box(Modifier.weight(1f))
                Text(
                    "Highlight",
                    color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp,
                    modifier = Modifier
                        .androidxClickable {
                            val stH = stories.getOrNull(idx) ?: return@androidxClickable
                            replyScope.launch {
                                try {
                                    Fb.addHighlight("Story", stH.media)
                                    android.widget.Toast.makeText(svCtx, "Added to highlights", android.widget.Toast.LENGTH_SHORT).show()
                                } catch (_: Exception) { }
                            }
                        }
                        .background(Color(0x33000000), RoundedCornerShape(18.dp))
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                )
                Spacer(Modifier.width(10.dp))
                Text(
                    "Delete",
                    color = Color(0xFFFF5A6E), fontWeight = FontWeight.Bold, fontSize = 14.sp,
                    modifier = Modifier
                        .androidxClickable {
                            val stDel = stories.getOrNull(idx) ?: return@androidxClickable
                            replyScope.launch {
                                try { Fb.deleteStory(stDel.id) } catch (_: Exception) { }
                                if (idx < stories.size - 1) { idx++; progress = 0f } else onClose()
                            }
                        }
                        .background(Color(0x33000000), RoundedCornerShape(18.dp))
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                )
            }
        }

        // reply bar (not on own story)
        if (!isOwn && !gone) {
            // v7.1: IG-style quick reactions, straight into the DM thread
            Row(
                Modifier.align(Alignment.BottomCenter).padding(bottom = 74.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                listOf("❤️", "😂", "🔥", "😮").forEach { e ->
                    Text(
                        e, fontSize = 22.sp,
                        modifier = Modifier
                            .background(Color(0x33000000), RoundedCornerShape(20.dp))
                            .clickable {
                                replyScope.launch { try { Fb.sendDm(user.id, e) } catch (_: Exception) { } }
                            }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                }
            }
            Row(
                Modifier.align(Alignment.BottomCenter).fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = reply,
                    onValueChange = { reply = it },
                    placeholder = { Text("Send message", color = Color.White) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = Color(0xFF0095F6),
                        focusedBorderColor = Color(0x66FFFFFF),
                        unfocusedBorderColor = Color(0x66FFFFFF)
                    ),
                    singleLine = true,
                    shape = RoundedCornerShape(22.dp),
                    modifier = Modifier.weight(1f)
                )
                Spacer(Modifier.width(10.dp))
                Text("❤", fontSize = 24.sp, modifier = Modifier
                    .clickable {
                        val stLike = stories.getOrNull(idx) ?: return@clickable
                        replyScope.launch {
                            try { Fb.likeStory(stLike.id, user.id) } catch (_: Exception) { }
                        }
                    }
                    .padding(8.dp))
                Text(
                    "Send",
                    color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp,
                    modifier = Modifier
                        .clickable {
                            val t = reply.trim()
                            if (t.isNotEmpty()) {
                                reply = ""
                                replyScope.launch {
                                    try { Fb.sendDm(user.id, t) } catch (_: Exception) { }
                                }
                            }
                        }
                        .padding(8.dp)
                )
            }
        }

        // close
        Text(
            "✕", color = Color.White, fontSize = 22.sp,
            modifier = Modifier.align(Alignment.TopEnd).padding(14.dp).clickable { onClose() }
        )
    }

    if (viewersSheet) {
        androidx.compose.material3.ModalBottomSheet(onDismissRequest = { viewersSheet = false }, containerColor = Color(0xFF1C1C1E)) {
            Column(Modifier.padding(horizontal = 16.dp).height(430.dp)) {
                Text("Viewers", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Spacer(Modifier.height(10.dp))
                if (viewers.isEmpty()) {
                    Text("No viewers yet", color = Color(0xFF8E8E8E), fontSize = 13.sp, modifier = Modifier.padding(10.dp))
                }
                androidx.compose.foundation.lazy.LazyColumn(Modifier.weight(1f)) {
                    items(viewers.size) { i ->
                        val v = viewers[i]
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AvatarView(url = v.avatar, size = 42, border = false, name = v.username)
                            Spacer(Modifier.width(12.dp))
                            Column {
                                Text(v.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(v.name, color = Color(0xFF8E8E8E), fontSize = 12.sp)
                            }
                        }
                    }
                }
                Spacer(Modifier.height(20.dp))
            }
        }
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.androidxLongPress(onLongClick: () -> Unit, onClick: () -> Unit = {}): Modifier =
    this.then(Modifier.combinedClickable(onClick = onClick, onLongClick = onLongClick))

private fun Modifier.androidxClickable(onClick: () -> Unit): Modifier =
    this.then(Modifier.clickable { onClick() })

@Composable
fun BigAvatar(url: String, onDismiss: () -> Unit) {
    Box(Modifier.fillMaxSize().background(Color(0xEE000000)).clickable { onDismiss() }, Alignment.Center) {
        DataImage(
            url = url,
            fallbackLetter = "",
            contentScale = ContentScale.Fit,
            modifier = Modifier.size(320.dp)
        )
        Text("✕", color = Color.White, fontSize = 22.sp, modifier = Modifier.align(Alignment.TopEnd).padding(14.dp))
    }
}

@Composable
fun CommentsPanel(
    post: Post,
    onDismiss: () -> Unit,
    onProfile: (String) -> Unit,
    onAvatar: (String) -> Unit,
    onHashtag: (String) -> Unit = {}
) {
    var list by remember { mutableStateOf<List<VComment>?>(null) }
    var text by remember { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }
    var replyTo by remember { mutableStateOf<VComment?>(null) }
    val scope = rememberCoroutineScope()
    val cpCtx = androidx.compose.ui.platform.LocalContext.current

    fun load() {
        scope.launch { list = try { Fb.comments(post.id) } catch (_: Exception) { emptyList() } }
    }
    LaunchedEffect(post.id) { load() }

    Column(Modifier.fillMaxSize().background(Color(0x88000000)).clickable { onDismiss() }) {
        Spacer(Modifier.weight(0.45f))
        Column(
            Modifier.fillMaxWidth().height(560.dp).background(Color(0xFF161616), RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                .clickable(enabled = false) { }
        ) {
            Row(
                Modifier.fillMaxWidth().padding(vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text("Comments", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }

            Box(Modifier.weight(1f)) {
                val l = list
                if (l == null) {
                    LoadingBox()
                } else if (l.isEmpty()) {
                    EmptyBox("No comments yet. Say something nice!", "💬")
                } else {
                    val cScope = rememberCoroutineScope()
                    LazyColumn(Modifier.fillMaxSize()) {
                        items(l) { c ->
                            var cliked by remember(c.id) { mutableStateOf(Fb.uid != null && c.likes.contains(Fb.uid)) }
                            var cDel by remember(c.id) { mutableStateOf(false) }
                            LaunchedEffect(cDel) {
                                if (cDel) { try { Fb.deleteComment(post.id, c.id) } catch (_: Exception) { } }
                            }
                            if (cDel) return@items
                            Row(
                                Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Box(Modifier.clickable { onAvatar(c.avatar ?: "") }) {
                                    AvatarView(url = c.avatar, size = 34, border = false, name = c.username)
                                }
                                Spacer(Modifier.width(10.dp))
                                Column(
                                    Modifier.weight(1f)
                                        .clickable { onProfile(c.username) }
                                        .androidxLongPress {
                                            val cm = cpCtx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                                            cm.setPrimaryClip(android.content.ClipData.newPlainText("comment", c.text))
                                            android.widget.Toast.makeText(cpCtx, "Comment copied", android.widget.Toast.LENGTH_SHORT).show()
                                        }
                                ) {
                                    Text(c.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    HashtagText(c.text, onMention = onProfile, onTag = onHashtag)
                                    Row {
                                        Text(
                                            postTimeAgo(c.createdAt),
                                            color = Color(0xFF8E8E8E), fontSize = 11.sp
                                        )
                                        Spacer(Modifier.width(10.dp))
                                        Text(
                                            "Reply",
                                            color = Color(0xFF8E8E8E), fontWeight = FontWeight.Bold, fontSize = 11.sp,
                                            modifier = Modifier.clickable { replyTo = c }
                                        )
                                        if (cliked) {
                                            Spacer(Modifier.width(10.dp))
                                            Text(
                                                c.likesCount.toString() + if (c.likesCount == 1L) " like" else " likes",
                                                color = Color(0xFF8E8E8E), fontSize = 11.sp
                                            )
                                        }
                                    }
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        if (cliked) "❤️" else "🤍",
                                        fontSize = 13.sp,
                                        modifier = Modifier.clickable {
                                            cliked = !cliked
                                            cScope.launch {
                                                try { Fb.likeComment(post.id, c.id) } catch (_: Exception) { }
                                            }
                                        }.padding(4.dp)
                                    )
                                    if (c.userId == Fb.uid) {
                                        Text(
                                            "✕", color = Color(0xFF8E8E8E), fontSize = 11.sp,
                                            modifier = Modifier.clickable { cDel = true }.padding(4.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (post.commentsOff && post.userId != Fb.uid) {
                Text(
                    "Comments are off.",
                    color = Color(0xFF8E8E8E), fontSize = 13.sp,
                    modifier = Modifier.padding(16.dp)
                )
            } else {
            Row(
                Modifier.fillMaxWidth().padding(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                replyTo?.let { rt ->
                    Text(
                        "Replying to @" + rt.username + "  ✕",
                        color = Color(0xFF0095F6), fontSize = 11.sp,
                        modifier = Modifier.clickable { replyTo = null }.padding(end = 6.dp)
                    )
                }
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    placeholder = { Text(if (replyTo == null) "Add a comment…" else "Reply to @" + replyTo!!.username + "…", color = Color(0xFF8E8E8E)) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = Color(0xFF0095F6)
                    ),
                    maxLines = 2,
                    shape = RoundedCornerShape(22.dp),
                    modifier = Modifier.weight(1f)
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    "Post",
                    color = if (text.isNotBlank()) Color(0xFF0095F6) else Color(0xFF0095F6).copy(alpha = 0.4f),
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    modifier = Modifier
                        .clickable {
                            val t = text.trim()
                            if (t.isEmpty() || sending) return@clickable
                            sending = true
                            text = ""
                            scope.launch {
                                try {
                                    Fb.addComment(post, t, replyTo)
                                    replyTo = null
                                    load()
                                } catch (_: Exception) {
                                } finally { sending = false }
                            }
                        }
                        .padding(10.dp)
                )
            }
            }
        }
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.androidxTapPlay(onClick: () -> Unit): Modifier =
    this.then(Modifier.clickable { onClick() })
