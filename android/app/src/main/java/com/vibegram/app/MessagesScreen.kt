package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@Composable
fun MessagesScreen(onChat: (VUser) -> Unit, onProfile: (String) -> Unit) {
    var threads by remember { mutableStateOf<List<ThreadInfo>?>(null) }

    LaunchedEffect(Unit) {
        threads = try { Fb.threads() } catch (_: Exception) { emptyList() }
    }

    Column(Modifier.fillMaxSize().background(Color.Black)) {
        Header("Messages")
        val list = threads
        if (list == null) {
            LoadingBox()
        } else if (list.isEmpty()) {
            EmptyBox("No messages yet", "✉️")
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                items(list) { t ->
                    Row(
                        Modifier.fillMaxWidth().clickable { onChat(t.user) }
                            .padding(horizontal = 14.dp, vertical = 9.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AvatarView(url = t.user.avatar, size = 54, border = false)
                        Spacer(Modifier.width(12.dp))
                        Column {
                            Text(t.user.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(
                                t.lastText.ifBlank { "Say hi 👋" },
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

@Composable
fun ChatScreen(
    other: VUser,
    me: VUser,
    onProfile: (String) -> Unit,
    onBack: () -> Unit
) {
    var msgs by remember { mutableStateOf<List<VMsg>?>(null) }
    var text by remember { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    LaunchedEffect(other.id) {
        msgs = try { Fb.messages(other.id) } catch (_: Exception) { emptyList() }
    }
    LaunchedEffect(msgs?.size) {
        val n = msgs?.size ?: 0
        if (n > 0) listState.animateScrollToItem(n - 1)
    }

    Column(Modifier.fillMaxSize().background(Color.Black).navigationBarsPadding().imePadding()) {
        // header
        Row(
            Modifier.fillMaxWidth().height(54.dp).background(Color.Black).padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("←", color = Color.White, fontSize = 22.sp, modifier = Modifier
                .clickable { onBack() }
                .padding(horizontal = 8.dp))
            AvatarView(url = other.avatar, size = 32, border = false)
            Spacer(Modifier.width(9.dp))
            Text(other.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp,
                modifier = Modifier.clickable { onProfile(other.username) })
        }

        // messages
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
                    AvatarView(url = other.avatar, size = 72, border = false)
                    Spacer(Modifier.height(10.dp))
                    Text(other.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(other.username + " · VibeGram", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                }
            } else {
                LazyColumn(state = listState, modifier = Modifier.fillMaxSize().padding(horizontal = 10.dp)) {
                    items(list) { m ->
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 3.dp),
                            horizontalArrangement = if (m.fromMe) Arrangement.End else Arrangement.Start
                        ) {
                            Box(
                                Modifier
                                    .background(
                                        if (m.fromMe) Color(0xFF3797F0) else Color(0xFF262626),
                                        RoundedCornerShape(18.dp)
                                    )
                                    .padding(horizontal = 13.dp, vertical = 9.dp)
                            ) {
                                Text(m.text, color = Color.White, fontSize = 15.sp)
                            }
                        }
                    }
                }
            }
        }

        // input
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
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
                shape = CircleShape,
                modifier = Modifier.weight(1f)
            )
            Spacer(Modifier.width(8.dp))
            Button(
                onClick = {
                    val t = text.trim()
                    if (t.isEmpty() || sending) return@Button
                    sending = true
                    text = ""
                    scope.launch {
                        try {
                            Fb.sendDm(other.id, t)
                            msgs = Fb.messages(other.id)
                        } catch (_: Exception) {
                        } finally { sending = false }
                    }
                },
                enabled = !sending,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                shape = CircleShape
            ) { Text("Send", color = Color.White, fontWeight = FontWeight.Bold) }
        }
    }
}
