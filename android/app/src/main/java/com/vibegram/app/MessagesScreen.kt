package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
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

    LaunchedEffect(Unit) {
        threads = try { Fb.threads() } catch (_: Exception) { emptyList() }
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
            if (filtered.isEmpty()) {
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
                            Column {
                                Text(t.user.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                Text(
                                    t.lastText.ifBlank { "Say hi 👋" } + (if (t.lastAt > 0) " · " + timeAgo(t.lastAt) else ""),
                                    color = Color(0xFF8E8E8E),
                                    fontSize = 13.sp,
                                    maxLines = 1
                                )
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
                                    Text("✓", color = Color(0xFF1D9BF0), fontWeight = FontWeight.Bold, fontSize = 12.sp)
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
