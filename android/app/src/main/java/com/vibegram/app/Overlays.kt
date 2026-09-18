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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay

@Composable
fun StoryViewer(user: VUser, stories: List<Story>, onClose: () -> Unit) {
    var idx by remember { mutableStateOf(0) }
    var progress by remember { mutableStateOf(0f) }

    LaunchedEffect(user.id) {
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

    Box(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
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
        }

        // media
        AsyncImage(
            model = story.media,
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier.fillMaxSize()
        )
        if (story.isVideo) {
            Text("▶ video stories play in next update", color = Color.White, fontSize = 12.sp, modifier = Modifier.align(Alignment.Center))
        }

        // tap zones
        Row(Modifier.fillMaxSize()) {
            Box(Modifier.weight(1f).fillMaxSize().clickable {
                if (idx > 0) { idx--; progress = 0f } else onClose()
            })
            Box(Modifier.weight(1f).fillMaxSize().clickable {
                if (idx < stories.size - 1) { idx++; progress = 0f } else onClose()
            })
        }

        // close
        Text(
            "✕", color = Color.White, fontSize = 22.sp,
            modifier = Modifier.align(Alignment.TopEnd).padding(14.dp).clickable { onClose() }
        )
    }
}

@Composable
fun BigAvatar(url: String, onDismiss: () -> Unit) {
    Box(Modifier.fillMaxSize().background(Color(0xEE000000)).clickable { onDismiss() }, Alignment.Center) {
        AsyncImage(
            model = url,
            contentDescription = null,
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
    onAvatar: (String) -> Unit
) {
    var list by remember { mutableStateOf<List<VComment>?>(null) }
    var text by remember { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(post.id) {
        list = try { Fb.comments(post.id) } catch (_: Exception) { emptyList() }
    }

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
                    LazyColumn(Modifier.fillMaxSize()) {
                        items(l) { c ->
                            Row(
                                Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Box(Modifier.clickable { onAvatar(c.avatar ?: "") }) {
                                    AvatarView(url = c.avatar, size = 34, border = false)
                                }
                                Spacer(Modifier.width(10.dp))
                                Column(Modifier.clickable { onProfile(c.username) }) {
                                    Row {
                                        Text(c.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text("  " + c.text, color = Color.White, fontSize = 13.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Row(
                Modifier.fillMaxWidth().padding(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    placeholder = { Text("Add a comment…", color = Color(0xFF8E8E8E)) },
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
                                    Fb.addComment(post, t)
                                    list = Fb.comments(post.id)
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
