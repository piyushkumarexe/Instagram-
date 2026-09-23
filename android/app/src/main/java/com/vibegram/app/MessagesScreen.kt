package com.vibegram.app

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.HealthAndSafety
import androidx.compose.material.icons.outlined.Block
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

fun timeAgo(ms: Long): String {
    if (ms <= 0) return ""
    val diff = System.currentTimeMillis() - ms
    val m = diff / 60000
    return when {
        m < 1 -> "now"
        m < 60 -> m.toString() + "m"
        m < 60 * 24 -> (m / 60).toString() + "h"
        m < 60 * 24 * 7 -> (m / 60 / 24).toString() + "d"
        else -> (m / 60 / 24 / 7).toString() + "w"
    }
}

// IG DM inbox: username + compose header, search pill, thread rows with time
@Composable
fun MessagesScreen(me: VUser, onChat: (VUser) -> Unit, onProfile: (String) -> Unit, onMeChanged: (VUser) -> Unit = {}) {
    var threads by remember { mutableStateOf<List<ThreadInfo>?>(null) }
    var q by remember { mutableStateOf("") }
    var composeOpen by remember { mutableStateOf(false) }
    var noteOpen by remember { mutableStateOf(false) }
    var noteTxt by remember { mutableStateOf(me.note) }
    var found by remember { mutableStateOf<List<VUser>>(emptyList()) }
    val msScope = rememberCoroutineScope()
    LaunchedEffect(q) {
        if (q.isBlank()) { found = emptyList(); return@LaunchedEffect }
        val query = q
        kotlinx.coroutines.delay(250)
        found = try { Fb.searchUsers(query) } catch (_: Exception) { emptyList() }
    }

    LaunchedEffect(Unit) {
        threads = try { Fb.threads() } catch (_: Exception) { emptyList() }
        while (true) {
            kotlinx.coroutines.delay(5000)
            val t = try { Fb.threads() } catch (_: Exception) { null }
            if (t != null) threads = t
        }
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        // header: spacer | username | pencil
        Row(
            Modifier.fillMaxWidth().height(56.dp).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(Modifier.weight(1f))
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { }) {
                Text(me.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 19.sp)
                Text(" ▾", color = Color(0xFF8E8E8E), fontSize = 13.sp)
            }
            Box(Modifier.weight(1f)) {
                IconButton(onClick = { composeOpen = true }, modifier = Modifier.align(Alignment.CenterEnd)) {
                    Icon(androidx.compose.ui.res.painterResource(R.drawable.ic_compose), null, tint = Color.White, modifier = Modifier.size(22.dp))
                }
            }
        }

        // search pill
        OutlinedTextField(
            value = q,
            onValueChange = { q = it },
            placeholder = { Text("Search", color = Color(0xFF8E8E8E)) },
            leadingIcon = { Text("🔍", fontSize = 15.sp) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                cursorColor = Color(0xFF0095F6),
                focusedBorderColor = Color(0xFF2A2A2C),
                unfocusedBorderColor = Color(0xFF2A2A2C)
            ),
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp).height(52.dp)
        )

        Spacer(Modifier.height(6.dp))

        // v7.2: IG-style NOTES TRAY — horizontal row of friends with note bubbles above
        // their avatars; your tile is first and opens the note composer.
        val trayUsers = (threads ?: emptyList()).map { it.user }.filter { it.id != me.id }.take(9)
        androidx.compose.foundation.lazy.LazyRow(
            modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp),
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 16.dp)
        ) {
            item {
                NoteTile(
                    avatar = me.avatar, username = "Your note", note = me.note,
                    placeholder = "Share a note…",
                    onClick = { noteTxt = me.note; noteOpen = true }
                )
            }
            items(trayUsers) { u ->
                NoteTile(
                    avatar = u.avatar, username = u.username, note = u.note,
                    placeholder = null,
                    onClick = { onChat(u) }
                )
            }
        }

        val list = threads
        if (list == null) {
            LoadingBox()
        } else {
            // v7.1: blocked people disappear from your inbox
            val visible = list.filter { it.user.id !in me.blocked }
            val filtered = if (q.isBlank()) visible else visible.filter {
                it.user.username.contains(q, true) || it.user.name.contains(q, true)
            }
            if (filtered.isEmpty() && found.isEmpty()) {
                EmptyBox("No messages yet", "✉️")
            } else {
                LazyColumn(Modifier.fillMaxSize()) {
                    items(filtered) { t ->
                        Row(
                            Modifier.fillMaxWidth().clickable { onChat(t.user) }
                                .padding(horizontal = 14.dp, vertical = 9.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AvatarView(url = t.user.avatar, size = 56, border = false, name = t.user.username)
                            Spacer(Modifier.width(12.dp))
                            Column(Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        t.user.username,
                                        color = Color.White,
                                        fontWeight = if (t.unread > 0) FontWeight.Black else FontWeight.Bold,
                                        fontSize = 15.sp
                                    )
                                    if (System.currentTimeMillis() - t.user.lastActive < 300_000) {
                                        Spacer(Modifier.width(6.dp))
                                        Box(Modifier.size(7.dp).background(Color(0xFF31D158), CircleShape))
                                    }
                                }
                                Text(
                                    (if (t.lastText.startsWith("post:")) "📷 Shared a post" else t.lastText.ifBlank { "Say hi 👋" }) +
                                        (if (t.lastAt > 0) " · " + timeAgo(t.lastAt) else ""),
                                    color = if (t.unread > 0) Color.White else Color(0xFF8E8E8E),
                                    fontWeight = if (t.unread > 0) FontWeight.Bold else FontWeight.Normal,
                                    fontSize = 13.sp,
                                    maxLines = 1
                                )
                                if (t.user.note.isNotBlank()) {
                                    Text(
                                        "💭 " + t.user.note,
                                        color = Color(0xFFB0B0B0), fontSize = 11.sp, maxLines = 1
                                    )
                                }
                            }
                            if (t.unread > 0) {
                                Box(
                                    Modifier.size(22.dp).background(Color(0xFFED4956), CircleShape),
                                    Alignment.Center
                                ) {
                                    Text(t.unread.toString(), color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                    if (found.isNotEmpty()) {
                        item {
                            Text(
                                "People",
                                color = Color(0xFF8E8E8E), fontWeight = FontWeight.Bold, fontSize = 13.sp,
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                            )
                        }
                        items(found) { fu ->
                            Row(
                                Modifier.fillMaxWidth().clickable { onChat(fu) }
                                    .padding(horizontal = 14.dp, vertical = 9.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AvatarView(url = fu.avatar, size = 46, border = false, name = fu.username)
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(fu.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        if (fu.verified) {
                                            Spacer(Modifier.width(4.dp))
                                            VerifiedBadge(14)
                                        }
                                    }
                                    Text(fu.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                                }
                                Text("Message", color = Color(0xFF0095F6), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }

    if (noteOpen) {
        androidx.compose.material3.AlertDialog(
            onDismissRequest = { noteOpen = false },
            title = { Text("Your note", color = Color.White) },
            text = {
                androidx.compose.material3.OutlinedTextField(
                    value = noteTxt,
                    onValueChange = { if (it.length <= 60) noteTxt = it },
                    placeholder = { Text("What's on your mind?", color = Color(0xFF8E8E8E)) },
                    colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White, unfocusedTextColor = Color.White, cursorColor = Color(0xFF0095F6)
                    ),
                    singleLine = true
                )
            },
            confirmButton = {
                Text("Share", color = Color(0xFF0095F6), fontWeight = FontWeight.Bold, modifier = Modifier.clickable {
                    noteOpen = false
                    msScope.launch {
                        try { Fb.setNote(noteTxt.trim()); onMeChanged(me.copy(note = noteTxt.trim())) } catch (_: Exception) { }
                    }
                }.padding(6.dp))
            },
            dismissButton = {
                Text("Delete note", color = Color(0xFFED4956), modifier = Modifier.clickable {
                    noteTxt = ""
                    noteOpen = false
                    msScope.launch {
                        try { Fb.setNote(""); onMeChanged(me.copy(note = "")) } catch (_: Exception) { }
                    }
                }.padding(6.dp))
            },
            containerColor = Color(0xFF1C1C1E)
        )
    }

    if (composeOpen) {
        NewChatSheet(
            onPick = { u -> composeOpen = false; onChat(u) },
            onDismiss = { composeOpen = false }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun NewChatSheet(onPick: (VUser) -> Unit, onDismiss: () -> Unit) {
    var q by remember { mutableStateOf("") }
    var users by remember { mutableStateOf<List<VUser>>(emptyList()) }
    var searching by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(q) {
        if (q.isBlank()) { users = emptyList(); return@LaunchedEffect }
        searching = true
        val query = q
        kotlinx.coroutines.delay(250)
        users = try { Fb.searchUsers(query) } catch (_: Exception) { emptyList() }
        searching = false
    }

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = Color(0xFF1C1C1E)) {
        Column(Modifier.padding(horizontal = 16.dp).height(460.dp)) {
            Text("New message", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = q,
                onValueChange = { q = it },
                placeholder = { Text("Search people by username", color = Color(0xFF8E8E8E)) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    cursorColor = Color(0xFF0095F6),
                    focusedBorderColor = Color(0xFF3A3A3C),
                    unfocusedBorderColor = Color(0xFF3A3A3C)
                ),
                singleLine = true,
                shape = RoundedCornerShape(11.dp),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(8.dp))
            if (searching) {
                Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(Modifier.width(18.dp).height(18.dp), color = Color.White, strokeWidth = 2.dp)
                    Spacer(Modifier.width(10.dp))
                    Text("Searching…", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                }
            }
            LazyColumn(Modifier.weight(1f)) {
                items(users) { u ->
                    Row(
                        Modifier.fillMaxWidth().clickable { onPick(u) }.padding(vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AvatarView(url = u.avatar, size = 44, border = false, name = u.username)
                        Spacer(Modifier.width(12.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                if (u.verified) {
                                    Spacer(Modifier.width(4.dp))
                                    VerifiedBadge(14)
                                }
                            }
                            Text(u.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                        }
                    }
                }
            }
            Spacer(Modifier.height(20.dp))
        }
    }
}

// one avatar + note bubble in the notes tray
@Composable
private fun NoteTile(avatar: String?, username: String, note: String, placeholder: String?, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onClick() }.width(74.dp)
    ) {
        Box(Modifier.height(34.dp), contentAlignment = Alignment.BottomCenter) {
            if (note.isNotBlank()) {
                Box(
                    Modifier.background(Color(0xFF2A2A2C), RoundedCornerShape(14.dp))
                        .padding(horizontal = 9.dp, vertical = 5.dp)
                ) {
                    Text(note, color = Color.White, fontSize = 10.sp, maxLines = 1)
                }
            } else if (placeholder != null) {
                Box(
                    Modifier.background(Color(0xFF2A2A2C), RoundedCornerShape(14.dp))
                        .width(74.dp)
                        .padding(horizontal = 6.dp, vertical = 5.dp),
                    Alignment.Center
                ) {
                    Text(placeholder, color = Color(0xFFB0B0B0), fontSize = 9.sp, maxLines = 2)
                }
            }
        }
        Spacer(Modifier.height(5.dp))
        AvatarView(url = avatar, size = 58, border = false, name = username)
        Spacer(Modifier.height(4.dp))
        Text(username, color = Color(0xFFB0B0B0), fontSize = 11.sp, maxLines = 1)
    }
}

// IG-style chat screen (messages list + emoji picker + send)
@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.androidxCombinedClickable(onLongClick: () -> Unit, onClick: () -> Unit): Modifier =
    this.then(
        Modifier.combinedClickable(onClick = onClick, onLongClick = onLongClick)
    )

// v7.1: a post shared inside a DM — thumbnail + caption, tap opens the full post
@Composable
private fun SharedPostCard(postId: String, onOpen: (Post) -> Unit) {
    var p by remember(postId) { mutableStateOf<Post?>(null) }
    LaunchedEffect(postId) { p = try { Fb.getPostById(postId) } catch (_: Exception) { null } }
    val post = p
    if (post == null) {
        Text("📷 Post", color = Color.White, fontSize = 14.sp)
    } else {
        Row(
            Modifier.widthIn(max = 250.dp).clickable { onOpen(post) },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(Modifier.size(56.dp).background(Color(0xFF111111))) {
                DataImage(url = post.media, fallbackLetter = "📷", circle = false, modifier = Modifier.fillMaxSize())
            }
            Spacer(Modifier.width(10.dp))
            Column {
                Text("@" + post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                Text(post.caption.ifBlank { "View post" }, color = Color(0xFFDDDDDD), fontSize = 12.sp, maxLines = 2)
            }
        }
    }
}

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
fun ChatScreen(
    other: VUser,
    me: VUser,
    onProfile: (String) -> Unit,
    onBack: () -> Unit,
    onOpenPost: (Post) -> Unit = {},
    onMeChanged: (VUser) -> Unit = {}
) {
    var msgs by remember { mutableStateOf<List<VMsg>?>(null) }
    var text by remember { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }
    var emojiOpen by remember { mutableStateOf(false) }
    var otherTyping by remember { mutableStateOf(false) }
    var replyToMsg by remember { mutableStateOf<VMsg?>(null) }
    var pendingImage by remember { mutableStateOf<String?>(null) }
    var following by remember { mutableStateOf<Boolean?>(null) }
    var mutual by remember { mutableStateOf<String?>(null) }
    var tipsOpen by remember { mutableStateOf(false) }
    val chatCtx = androidx.compose.ui.platform.LocalContext.current
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()
    val imgPicker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch(kotlinx.coroutines.Dispatchers.IO) {
            try {
                val bmp = chatCtx.contentResolver.openInputStream(uri)?.use { android.graphics.BitmapFactory.decodeStream(it) }
                if (bmp != null) {
                    val data = bmp.toDataUrl(720, 72)
                    kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) { pendingImage = data }
                }
            } catch (_: Exception) { }
        }
    }

    LaunchedEffect(other.id) {
        msgs = try { Fb.messages(other.id) } catch (_: Exception) { emptyList() }
        try { Fb.markThreadRead(other.id) } catch (_: Exception) { }
        following = try { Fb.isFollowing(other.id) } catch (_: Exception) { false }
        try {
            val mine = Fb.followingOf(me.id).map { it.id }.toSet()
            mutual = Fb.followingOf(other.id).firstOrNull { it.id in mine && it.id != me.id }?.username
        } catch (_: Exception) { mutual = null }
    }
    LaunchedEffect(msgs?.size) {
        val n = msgs?.size ?: 0
        if (n > 0) listState.animateScrollToItem(n - 1)
    }
    LaunchedEffect(other.id) {
        while (true) {
            otherTyping = try { System.currentTimeMillis() - Fb.typingOf(other.id) in 1..5000 } catch (_: Exception) { false }
            kotlinx.coroutines.delay(2500)
        }
    }
    LaunchedEffect(text) {
        if (text.isNotBlank()) {
            try { Fb.setTyping(other.id, true) } catch (_: Exception) { }
            kotlinx.coroutines.delay(2500)
            try { Fb.setTyping(other.id, false) } catch (_: Exception) { }
        } else {
            try { Fb.setTyping(other.id, false) } catch (_: Exception) { }
        }
    }

    fun sepLabel(at: Long): String {
        val f = java.text.SimpleDateFormat("d MMM, h:mm a", java.util.Locale.US).format(java.util.Date(at))
        val parts = f.split(" ")
        return if (parts.size > 2) parts[0] + " " + parts[1].uppercase() + ", " + parts.drop(2).joinToString(" ") else f
    }
    fun sameDay(a: Long, b: Long) = a / 86_400_000L == b / 86_400_000L

    Column(
        Modifier.fillMaxSize().background(Color.Black)
            .navigationBarsPadding().imePadding().statusBarsPadding()
    ) {
        // ---- header: back | avatar | name + username/typing ----
        Row(
            Modifier.fillMaxWidth().height(56.dp).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(androidx.compose.ui.res.painterResource(R.drawable.ic_chevron_left), null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            AvatarView(url = other.avatar, size = 34, border = false, name = other.username)
            Spacer(Modifier.width(10.dp))
            Column {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { onProfile(other.username) }) {
                    Text(other.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    if (other.verified) {
                        Spacer(Modifier.width(4.dp))
                        VerifiedBadge(15)
                    }
                }
                Text(
                    if (otherTyping) "typing…" else other.username,
                    color = if (otherTyping) Color(0xFF0095F6) else Color(0xFF8E8E8E), fontSize = 11.sp
                )
            }
        }

        Box(Modifier.weight(1f)) {
            val list = msgs
            if (list == null) {
                LoadingBox()
            } else {
                LazyColumn(state = listState, modifier = Modifier.fillMaxSize().padding(horizontal = 12.dp)) {
                    // ---- IG chat profile header ----
                    item {
                        Column(
                            Modifier.fillMaxWidth().padding(top = 24.dp, bottom = 14.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            AvatarView(url = other.avatar, size = 92, border = false, name = other.username)
                            Spacer(Modifier.height(12.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(other.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                                if (other.verified) {
                                    Spacer(Modifier.width(5.dp))
                                    VerifiedBadge(16)
                                }
                            }
                            Spacer(Modifier.height(3.dp))
                            Text(
                                other.username +
                                    (if (other.createdAt > 0) " · Joined " + java.text.SimpleDateFormat("MMM yyyy", java.util.Locale.US).format(java.util.Date(other.createdAt)) else ""),
                                color = Color(0xFF8E8E8E), fontSize = 13.sp
                            )
                            Spacer(Modifier.height(3.dp))
                            Text(
                                fmtCount(other.followersCount) + " followers · " + other.postsCount + " posts",
                                color = Color(0xFF8E8E8E), fontSize = 13.sp
                            )
                            if (following == true) {
                                Spacer(Modifier.height(3.dp))
                                Text("You follow this account", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                            }
                            mutual?.let { m ->
                                Spacer(Modifier.height(3.dp))
                                Text("You both follow " + m, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                            }
                            Spacer(Modifier.height(18.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(40.dp)) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.clickable { onProfile(other.username) }
                                ) {
                                    Icon(androidx.compose.material.icons.Icons.Outlined.Person, null, tint = Color.White, modifier = Modifier.size(24.dp))
                                    Spacer(Modifier.height(4.dp))
                                    Text("Profile", color = Color.White, fontSize = 12.sp)
                                }
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.clickable { tipsOpen = true }
                                ) {
                                    Icon(androidx.compose.material.icons.Icons.Outlined.HealthAndSafety, null, tint = Color.White, modifier = Modifier.size(24.dp))
                                    Spacer(Modifier.height(4.dp))
                                    Text("Safety tips", color = Color.White, fontSize = 12.sp)
                                }
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    modifier = Modifier.clickable {
                                        scope.launch {
                                            try {
                                                Fb.toggleBlock(other.id, true)
                                                onMeChanged(me.copy(blocked = me.blocked + other.id))
                                                android.widget.Toast.makeText(chatCtx, "@" + other.username + " blocked", android.widget.Toast.LENGTH_SHORT).show()
                                                onBack()
                                            } catch (_: Exception) { }
                                        }
                                    }
                                ) {
                                    Icon(androidx.compose.material.icons.Icons.Outlined.Block, null, tint = Color.White, modifier = Modifier.size(24.dp))
                                    Spacer(Modifier.height(4.dp))
                                    Text("Block", color = Color.White, fontSize = 12.sp)
                                }
                            }
                            Spacer(Modifier.height(10.dp))
                        }
                    }

                    items(list.size) { i ->
                        val m = list[i]
                        val prev = if (i > 0) list[i - 1] else null
                        var menuFor by remember(m.id) { mutableStateOf(false) }
                        if (prev == null || !sameDay(prev.at, m.at)) {
                            Text(
                                sepLabel(m.at),
                                color = Color(0xFF7A7A7A), fontSize = 11.sp,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp)
                            )
                        }
                        Column(
                            Modifier.fillMaxWidth().padding(vertical = 2.dp)
                                .androidxCombinedClickable(onLongClick = { menuFor = true }, onClick = { }),
                            horizontalAlignment = if (m.fromMe) Alignment.End else Alignment.Start
                        ) {
                            Box(
                                Modifier
                                    .widthIn(max = 290.dp)
                                    .background(Color(0xFF262626), RoundedCornerShape(18.dp))
                                    .padding(horizontal = 14.dp, vertical = 9.dp)
                            ) {
                                Column {
                                    if (m.replyTo != null) {
                                        Column(
                                            Modifier.background(Color(0x33000000), RoundedCornerShape(8.dp))
                                                .padding(horizontal = 8.dp, vertical = 5.dp)
                                        ) {
                                            Text(m.replyName ?: "", color = Color(0xFF9ECBFF), fontWeight = FontWeight.Bold, fontSize = 11.sp)
                                            Text(m.replyTo!!, color = Color(0xFFCCCCCC), fontSize = 12.sp, maxLines = 2)
                                        }
                                        Spacer(Modifier.height(4.dp))
                                    }
                                    if (m.image != null) {
                                        DataImage(url = m.image, circle = false, fallbackLetter = "📷", modifier = Modifier.widthIn(max = 220.dp).height(160.dp))
                                        Spacer(Modifier.height(4.dp))
                                    }
                                    if (m.text.startsWith("post:")) {
                                        SharedPostCard(postId = m.text.removePrefix("post:"), onOpen = onOpenPost)
                                    } else if (m.text.isNotBlank()) {
                                        Text(m.text, color = Color.White, fontSize = 15.sp, lineHeight = 20.sp)
                                    }
                                }
                            }
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.End) {
                                if (m.reaction != null) {
                                    Text(m.reaction!!, fontSize = 12.sp, modifier = Modifier.padding(end = 4.dp))
                                }
                            }
                            if (m.fromMe && m.read && (i == list.lastIndex || !list[i + 1].fromMe)) {
                                Text(
                                    "Seen", color = Color(0xFF7A7A7A), fontSize = 10.sp,
                                    modifier = Modifier.padding(top = 1.dp, end = 4.dp)
                                )
                            }
                            androidx.compose.material3.DropdownMenu(expanded = menuFor, onDismissRequest = { menuFor = false }) {
                                Row(Modifier.padding(horizontal = 12.dp, vertical = 6.dp)) {
                                    listOf("❤️", "😂", "😮", "😢", "👍").forEach { e ->
                                        Text(
                                            e, fontSize = 20.sp,
                                            modifier = Modifier.clickable {
                                                menuFor = false
                                                scope.launch { try { Fb.reactToMessage(other.id, m.id, e); msgs = Fb.messages(other.id) } catch (_: Exception) { } }
                                            }.padding(horizontal = 6.dp)
                                        )
                                    }
                                }
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text("Copy") },
                                    onClick = {
                                        menuFor = false
                                        val cm = chatCtx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                                        cm.setPrimaryClip(android.content.ClipData.newPlainText("msg", m.text))
                                    }
                                )
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text("Reply") },
                                    onClick = { menuFor = false; replyToMsg = m }
                                )
                                if (m.fromMe) {
                                    androidx.compose.material3.DropdownMenuItem(
                                        text = { Text("Unsend", color = Color(0xFFED4956)) },
                                        onClick = {
                                            menuFor = false
                                            scope.launch { try { Fb.unsendMessage(other.id, m.id); msgs = Fb.messages(other.id) } catch (_: Exception) { } }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        if (tipsOpen) {
            androidx.compose.material3.AlertDialog(
                onDismissRequest = { tipsOpen = false },
                title = { Text("Safety tips", color = Color.White) },
                text = {
                    Text(
                        "• Only accept messages from people you know.\n• Never share your password or OTP.\n• Report and block accounts that harass you.\n• Think before you share photos.",
                        color = Color(0xFFDDDDDD), fontSize = 13.sp
                    )
                },
                confirmButton = {
                    Text("OK", color = Color(0xFF0095F6), fontWeight = FontWeight.Bold, modifier = Modifier.clickable { tipsOpen = false }.padding(6.dp))
                },
                containerColor = Color(0xFF1C1C1E)
            )
        }

        if (emojiOpen) {
            val emojis = listOf(
                "😀","😃","😄","😁","😆","","😊","😇","😉","😍","🥰","","😋","😜","🤪","","🤓","😎","🥳","","😔","😭","🥺","😤","😱","","😳","🥵","😡","🤬",
                "👍","","👌","️","🤞","🤟","🤘","","🙌","","🙏","","👋","","👀","","✨","⭐","","❤️","🧡","💛","💚","💙","💜","🖤","","🎁","","🎯",
                "🍕","🍔","🍟","🌮","","🍣","","🍪","","🍰","☕","🍵","🧋","🍺","🍷","","🎮","","🎤","","📸","","🏏","","✈️","🌈","☀️","🌙","🌊","🐶"
            )
            Column(Modifier.fillMaxWidth().background(Color(0xFF111111)).padding(horizontal = 8.dp, vertical = 6.dp)) {
                androidx.compose.foundation.layout.FlowRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    emojis.filter { it.isNotBlank() }.forEach { e ->
                        Text(e, fontSize = 25.sp, modifier = Modifier.clickable { text += e }.padding(3.dp))
                    }
                }
                Spacer(Modifier.height(6.dp))
            }
        }

        if (replyToMsg != null || pendingImage != null) {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(Modifier.weight(1f)) {
                    pendingImage?.let { pi ->
                        DataImage(url = pi, circle = false, modifier = Modifier.height(64.dp).width(64.dp))
                    }
                    replyToMsg?.let { rt ->
                        Text(
                            "Replying to " + (if (rt.fromMe) "yourself" else "@" + other.username) + ": " + rt.text.take(60),
                            color = Color(0xFF9ECBFF), fontSize = 11.sp, maxLines = 1
                        )
                    }
                }
                Text("✕", color = Color(0xFF8E8E8E), modifier = Modifier.clickable { replyToMsg = null; pendingImage = null }.padding(8.dp))
            }
        }

        // ---- IG input pill: camera | field | emoji/gallery or send ----
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp)
                .background(Color(0xFF1C1C1E), RoundedCornerShape(26.dp))
                .padding(start = 5.dp, end = 5.dp, top = 5.dp, bottom = 5.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                Modifier.size(36.dp).background(Color(Prefs.accentLong), CircleShape)
                    .clickable { imgPicker.launch(androidx.activity.result.PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                Alignment.Center
            ) {
                Icon(androidx.compose.ui.res.painterResource(R.drawable.ic_camera), null, tint = Color.White, modifier = Modifier.size(20.dp))
            }
            Spacer(Modifier.width(8.dp))
            androidx.compose.foundation.text.BasicTextField(
                value = text,
                onValueChange = { text = it },
                textStyle = androidx.compose.ui.text.TextStyle(color = Color.White, fontSize = 15.sp),
                cursorBrush = androidx.compose.ui.graphics.SolidColor(Color(0xFF0095F6)),
                modifier = Modifier.weight(1f).padding(vertical = 9.dp),
                decorationBox = { inner ->
                    if (text.isEmpty()) Text("Message…", color = Color(0xFF8E8E8E), fontSize = 15.sp)
                    inner()
                }
            )
            if (text.isBlank() && pendingImage == null) {
                Text("😊", fontSize = 21.sp, modifier = Modifier.clickable { emojiOpen = !emojiOpen }.padding(horizontal = 6.dp))
                Icon(
                    androidx.compose.ui.res.painterResource(R.drawable.ic_gallery), null,
                    tint = Color.White, modifier = Modifier.size(24.dp).clickable {
                        imgPicker.launch(androidx.activity.result.PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                    }
                )
            } else {
                Box(
                    Modifier.size(36.dp).background(Color(Prefs.accentLong), CircleShape).clickable {
                        val t = text.trim()
                        if ((t.isEmpty() && pendingImage == null) || sending) return@clickable
                        sending = true
                        val img = pendingImage
                        val rt = replyToMsg
                        text = ""
                        pendingImage = null
                        replyToMsg = null
                        scope.launch {
                            try {
                                Fb.sendDmRich(
                                    other.id, t, img,
                                    rt?.text, if (rt != null) (if (rt.fromMe) "You" else other.username) else null
                                )
                                msgs = Fb.messages(other.id)
                            } catch (_: Exception) {
                            } finally { sending = false }
                        }
                    },
                    Alignment.Center
                ) {
                    Icon(androidx.compose.ui.res.painterResource(R.drawable.ic_dm_filled), null, tint = Color.White, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

