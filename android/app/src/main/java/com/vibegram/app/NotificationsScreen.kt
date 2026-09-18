package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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

@Composable
fun NotificationsScreen(onProfile: (String) -> Unit) {
    var rows by remember { mutableStateOf<List<NotifRow>?>(null) }

    LaunchedEffect(Unit) {
        rows = try { Fb.notifications() } catch (_: Exception) { emptyList() }
    }

    Column(Modifier.fillMaxSize().background(Color.Black)) {
        Header("Notifications")
        val list = rows
        if (list == null) {
            LoadingBox()
        } else if (list.isEmpty()) {
            EmptyBox("No notifications yet", "🔔")
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
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
                            else -> "interacted with you."
                        }
                        Text(
                            buildString { append(uname); append(" "); append(action) },
                            color = Color.White,
                            fontSize = 14.sp
                        )
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
