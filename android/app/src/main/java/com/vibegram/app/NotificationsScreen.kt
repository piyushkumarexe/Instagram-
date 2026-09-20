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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@Composable
fun NotificationsScreen(me: VUser, onProfile: (String) -> Unit, onOpenPost: (String) -> Unit = { _ -> }) {
    var rows by remember { mutableStateOf<List<NotifRow>?>(null) }
    var reqs by remember { mutableStateOf<List<Pair<String, VUser>>?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        rows = try { Fb.notifications() } catch (_: Exception) { emptyList() }
        reqs = try { Fb.listRequests() } catch (_: Exception) { emptyList() }
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Text(
            "Notifications",
            color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
        )
        val list = rows
        if (list == null) {
            LoadingBox()
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                // ---- follow requests (IG style) ----
                val rl = reqs
                if (rl != null && rl.isNotEmpty()) {
                    item {
                        Text(
                            "Follow requests",
                            color = Color(0xFF8E8E8E), fontWeight = FontWeight.Bold, fontSize = 13.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                    items(rl) { pair ->
                        val reqId = pair.first
                        val ru = pair.second
                        var gone by remember(reqId) { mutableStateOf(false) }
                        if (!gone) {
                            Row(
                                Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 7.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AvatarView(url = ru.avatar, size = 44, border = false)
                                Spacer(Modifier.width(12.dp))
                                Column(Modifier.weight(1f)) {
                                    Text(ru.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(ru.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                                }
                                Button(
                                    onClick = {
                                        gone = true
                                        scope.launch { try { Fb.acceptRequest(reqId, ru) } catch (_: Exception) { } }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                                    modifier = Modifier.height(32.dp).padding(end = 6.dp),
                                    shape = RoundedCornerShape(8.dp)
                                ) { Text("Confirm", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp) }
                                Button(
                                    onClick = {
                                        gone = true
                                        scope.launch { try { Fb.deleteRequest(reqId) } catch (_: Exception) { } }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                                    modifier = Modifier.height(32.dp),
                                    shape = RoundedCornerShape(8.dp)
                                ) { Text("Delete", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp) }
                            }
                        }
                    }
                }

                if (list.isEmpty() && (reqs == null || reqs!!.isEmpty())) {
                    item { EmptyBox("No notifications yet", "🔔") }
                }

                items(list) { row ->
                    val actor = row.actor
                    Row(
                        Modifier.fillMaxWidth().clickableSafe(actor?.username, onProfile)
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AvatarView(url = actor?.avatar, size = 44, border = false)
                        Spacer(Modifier.width(12.dp))
                        val uname = actor?.username ?: "someone"
                        val action = when (row.notif.type) {
                            "like" -> "liked your post."
                            "comment" -> "commented on your post."
                            "follow" -> "started following you."
                            "follow_request" -> "requested to follow you."
                            "follow_accept" -> "accepted your follow request."
                            "story_like" -> "liked your story."
                            else -> "interacted with you."
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                buildString { append(uname); append(" "); append(action) },
                                color = Color.White,
                                fontSize = 14.sp,
                                modifier = Modifier.weight(1f, fill = false)
                            )
                            if (row.notif.postId != null) {
                                Spacer(Modifier.width(10.dp))
                                val thumb = row.notif.postId
                                Box(
                                    Modifier.size(44.dp).background(Color(0xFF262626))
                                        .clickable { if (thumb != null) onOpenPost(thumb) }
                                ) { Text("🖼", fontSize = 18.sp, modifier = Modifier.align(Alignment.Center)) }
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun Modifier.clickableSafe(username: String?, onProfile: (String) -> Unit): Modifier {
    if (username == null) return this
    return this.clickable { onProfile(username) }
}
