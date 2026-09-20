package com.vibegram.app

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
fun MessagesScreen(me: VUser, onChat: (VUser) -> Unit, onProfile: (String) -> Unit) {
    var threads by remember { mutableStateOf<List<ThreadInfo>?>(null) }
    var q by remember { mutableStateOf("") }
    var composeOpen by remember { mutableStateOf(false) }
    var found by remember { mutableStateOf<List<VUser>>(emptyList()) }
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
                    Icon(Icons.Outlined.Edit, null, tint = Color.White, modifier = Modifier.size(22.dp))
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

        val list = threads
        if (list == null) {
            LoadingBox()
        } else {
            val filtered = if (q.isBlank()) list else list.filter {
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
                                    t.lastText.ifBlank { "Say hi 👋" } + (if (t.lastAt > 0) " · " + timeAgo(t.lastAt) else ""),
                                    color = if (t.unread > 0) Color.White else Color(0xFF8E8E8E),
                                    fontWeight = if (t.unread > 0) FontWeight.Bold else FontWeight.Normal,
                                    fontSize = 13.sp,
                                    maxLines = 1
                                )
                            }
                            if (t.unread > 0) {
                                Box(
                                    Modifier.size(22.dp).background(Color(0xFF0095F6), CircleShape),
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

// IG-style chat screen (messages list + emoji picker + send)
@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.androidxCombinedClickable(onLongClick: () -> Unit, onClick: () -> Unit): Modifier =
    this.then(
        Modifier.combinedClickable(onClick = onClick, onLongClick = onLongClick)
    )

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
fun ChatScreen(other: VUser, me: VUser, onProfile: (String) -> Unit, onBack: () -> Unit) {
    var msgs by remember { mutableStateOf<List<VMsg>?>(null) }
    var text by remember { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }
    var emojiOpen by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    LaunchedEffect(other.id) {
        msgs = try { Fb.messages(other.id) } catch (_: Exception) { emptyList() }
        try { Fb.markThreadRead(other.id) } catch (_: Exception) { }
    }
    LaunchedEffect(msgs?.size) {
        val n = msgs?.size ?: 0
        if (n > 0) listState.animateScrollToItem(n - 1)
    }

    Column(
        Modifier.fillMaxSize().background(Color.Black)
            .navigationBarsPadding().imePadding().statusBarsPadding()
    ) {
        Row(
            Modifier.fillMaxWidth().height(56.dp).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            AvatarView(url = other.avatar, size = 32, border = false, name = other.username)
            Spacer(Modifier.width(10.dp))
            Column {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { onProfile(other.username) }) {
                    Text(other.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    if (other.verified) {
                        Spacer(Modifier.width(4.dp))
                        VerifiedBadge(15)
                    }
                }
                Text(
                    if (System.currentTimeMillis() - other.lastActive < 300_000) "Active now" else "",
                    color = Color(0xFF31D158), fontSize = 11.sp
                )
            }
        }

        Box(Modifier.weight(1f)) {
            val list = msgs
            if (list == null) {
                LoadingBox()
            } else if (list.isEmpty()) {
                Column(
                    Modifier.fillMaxSize().padding(30.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    AvatarView(url = other.avatar, size = 72, border = false, name = other.username)
                    Spacer(Modifier.height(10.dp))
                    Text(other.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(other.username + " · Instagram 2.0", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                }
            } else {
                LazyColumn(state = listState, modifier = Modifier.fillMaxSize().padding(horizontal = 10.dp)) {
                    items(list) { m ->
                        var menuFor by remember(m.id) { mutableStateOf(false) }
                        Column(
                            Modifier.fillMaxWidth().padding(vertical = 3.dp)
                                .androidxCombinedClickable(onLongClick = { menuFor = true }, onClick = { }),
                            horizontalAlignment = if (m.fromMe) Alignment.End else Alignment.Start
                        ) {
                            Box(
                                Modifier
                                    .widthIn(max = 290.dp)
                                    .then(
                                        if (m.fromMe) Modifier.background(
                                            androidx.compose.ui.graphics.Brush.horizontalGradient(
                                                listOf(Color(0xFF0095F6), Color(0xFF3797F0))
                                            ),
                                            RoundedCornerShape(20.dp)
                                        ) else Modifier.background(Color(0xFF262626), RoundedCornerShape(20.dp))
                                    )
                                    .padding(horizontal = 14.dp, vertical = 10.dp)
                            ) {
                                Text(m.text, color = Color.White, fontSize = 15.sp, lineHeight = 20.sp)
                            }
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.End) {
                                if (m.fromMe) {
                                    Text(
                                        if (m.read) "✓✓ " else "✓ ",
                                        color = if (m.read) Color(0xFF31D158) else Color(0xFF8E8E8E),
                                        fontSize = 10.sp
                                    )
                                }
                                Text(
                                    java.text.SimpleDateFormat("h:mm a", java.util.Locale.US).format(java.util.Date(m.at)),
                                    color = Color(0xFF7A7A7A), fontSize = 10.sp,
                                    modifier = Modifier.padding(top = 2.dp, end = 2.dp)
                                )
                            }
                            if (m.reaction != null) {
                                Text(m.reaction!!, fontSize = 12.sp, modifier = Modifier.padding(top = 1.dp))
                            }
                            androidx.compose.material3.DropdownMenu(expanded = menuFor, onDismissRequest = { menuFor = false }) {
                                androidx.compose.material3.DropdownMenuItem(
                                    text = { Text("React ❤️") },
                                    onClick = {
                                        menuFor = false
                                        scope.launch { try { Fb.reactToMessage(other.id, m.id, "❤️") ; msgs = Fb.messages(other.id) } catch (_: Exception) { } }
                                    }
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

        if (emojiOpen) {
            val emojis = listOf(
                "😀","😃","😄","😁","😆","🤣","😊","😇","😉","😍","🥰","😘","😋","😜","🤪","🤨","🤓","😎","🥳","😏","😔","😭","🥺","😤","😱","🤯","😳","🥵","😡","🤬",
                "👍","👎","👌","✌️","🤞","🤟","🤘","👏","🙌","🤝","🙏","💪","👋","🤙","👀","🔥","✨","⭐","💔","❤️","🧡","💛","💚","💙","💜","🖤","🎉","🎁","🏆","🎯",
                "🍕","🍔","🍟","🌮","🍜","🍣","🍩","🍪","🎂","🍰","☕","🍵","🧋","🍺","🍷","🥂","🎮","🎸","🎤","🎧","📸","⚽","🏏","🚗","✈️","🌈","☀️","🌙","🌊","🐶"
            )
            Column(Modifier.fillMaxWidth().background(Color(0xFF111111)).padding(horizontal = 8.dp, vertical = 6.dp)) {
                androidx.compose.foundation.layout.FlowRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    emojis.forEach { e ->
                        Text(e, fontSize = 25.sp, modifier = Modifier.clickable { text += e }.padding(3.dp))
                    }
                }
                Spacer(Modifier.height(6.dp))
            }
        }

        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("😊", fontSize = 24.sp, modifier = Modifier.clickable { emojiOpen = !emojiOpen }.padding(6.dp))
            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                placeholder = { Text("Message…", color = Color(0xFF8E8E8E)) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    cursorColor = Color(0xFF0095F6)
                ),
                maxLines = 4,
                shape = RoundedCornerShape(22.dp),
                modifier = Modifier.weight(1f)
            )
            Spacer(Modifier.width(8.dp))
            IconButton(onClick = {
                val t = text.trim()
                if (t.isEmpty() || sending) return@IconButton
                sending = true
                text = ""
                scope.launch {
                    try {
                        Fb.sendDm(other.id, t)
                        msgs = Fb.messages(other.id)
                    } catch (_: Exception) {
                    } finally { sending = false }
                }
            }) {
                Icon(Icons.Filled.Send, null, tint = Color(0xFF0095F6), modifier = Modifier.size(26.dp))
            }
        }
    }
}
