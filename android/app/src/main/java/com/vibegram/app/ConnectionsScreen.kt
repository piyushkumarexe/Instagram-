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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
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

// Full page (never popup) with Followers / Following tabs — IG style
// userId passed directly (no extra lookup — that lookup was silently emptying the list)
@Composable
fun ConnectionsScreen(
    userId: String,
    username: String,
    kind: String,
    isPrivate: Boolean,
    isFollowing: Boolean,
    me: VUser,
    onBack: () -> Unit,
    onProfile: (String) -> Unit,
    onChat: (VUser) -> Unit
) {
    var tab by remember { mutableStateOf(kind) }
    var list by remember { mutableStateOf<List<VUser>?>(null) }
    var err by remember { mutableStateOf<String?>(null) }
    var myFollowingIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    var busyId by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()
    val locked = isPrivate && !isFollowing && userId != me.id

    fun load() {
        if (locked) { list = emptyList(); return }
        scope.launch {
            list = null
            err = null
            try {
                val l = if (tab == "followers") Fb.followersOf(userId) else Fb.followingOf(userId)
                list = l
                if (l.isEmpty()) {
                    // surface a real error if the query itself failed (e.g. permissions)
                    // (empty is a valid state too — list stays empty with the friendly empty box)
                }
            } catch (e: Exception) {
                err = e.message ?: "Could not load"
                list = emptyList()
            }
            try { myFollowingIds = Fb.followingOf(me.id).map { it.id }.toSet() } catch (_: Exception) { }
        }
    }

    LaunchedEffect(userId, tab) { load() }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        // header: back + username
        Row(
            Modifier.fillMaxWidth().height(52.dp).padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("←", color = Color.White, fontSize = 21.sp, modifier = Modifier
                .clickable { onBack() }
                .padding(horizontal = 10.dp))
            Text(username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }

        // tabs
        Row(Modifier.fillMaxWidth()) {
            listOf("followers" to "Followers", "following" to "Following").forEach { (key, label) ->
                Column(
                    Modifier.weight(1f).clickable { tab = key },
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Spacer(Modifier.height(12.dp))
                    Text(
                        label,
                        color = if (tab == key) Color.White else Color(0xFF8E8E8E),
                        fontWeight = if (tab == key) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 15.sp
                    )
                    Spacer(Modifier.height(9.dp))
                    Box(
                        Modifier.fillMaxWidth(0.5f).height(2.dp)
                            .background(if (tab == key) Color.White else Color.Transparent)
                    )
                }
            }
        }

        if (locked) {
            Column(
                Modifier.fillMaxSize().padding(30.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = androidx.compose.foundation.layout.Arrangement.Center
            ) {
                Text("🔒", fontSize = 34.sp)
                Spacer(Modifier.height(10.dp))
                Text("This account is private", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Spacer(Modifier.height(4.dp))
                Text("Follow this account to see their " + (if (tab == "followers") "followers" else "following"),
                    color = Color(0xFF8E8E8E), fontSize = 13.sp)
            }
        } else if (err != null) {
            Column(
                Modifier.fillMaxSize().padding(30.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = androidx.compose.foundation.layout.Arrangement.Center
            ) {
                Text("⚠️", fontSize = 34.sp)
                Spacer(Modifier.height(10.dp))
                Text(
                    "Couldn't load " + (if (tab == "followers") "followers" else "following"),
                    color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp
                )
                Spacer(Modifier.height(6.dp))
                Text(
                    err ?: "", color = Color(0xFFFF5A6E), fontSize = 12.sp,
                    lineHeight = 17.sp, textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = { load() },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6))
                ) { Text("Retry", color = Color.White, fontWeight = FontWeight.Bold) }
            }
        } else {
            val l = list
            if (l == null) {
                LoadingBox()
            } else if (l.isEmpty()) {
                EmptyBox(
                    if (tab == "followers") "No followers yet" else "Not following anyone yet",
                    "👥"
                )
            } else {
                LazyColumn(Modifier.fillMaxSize()) {
                    items(l) { u ->
                        val isMe = u.id == me.id
                        var following by remember(u.id) { mutableStateOf(myFollowingIds.contains(u.id)) }
                        Row(
                            Modifier.fillMaxWidth().clickable { onProfile(u.username) }
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AvatarView(url = u.avatar, size = 46, border = false, name = u.username)
                            Spacer(Modifier.width(12.dp))
                            Column(Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    if (u.verified) {
                                        Spacer(Modifier.width(4.dp))
                                        VerifiedBadge(14)
                                    }
                                }
                                Text(u.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                            }
                            if (!isMe) {
                                Button(
                                    onClick = {
                                        if (busyId == u.id) return@Button
                                        busyId = u.id
                                        val want = !following
                                        scope.launch {
                                            try {
                                                val ok = Fb.follow(u, want)
                                                if (ok) following = want else following = false
                                                myFollowingIds = if (want) myFollowingIds + u.id else myFollowingIds - u.id
                                            } catch (_: Exception) {
                                            } finally { busyId = null }
                                        }
                                    },
                                    enabled = busyId != u.id,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (following) Color(0xFF262626) else Color(0xFF0095F6)
                                    ),
                                    modifier = Modifier.height(32.dp),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    if (busyId == u.id) {
                                        CircularProgressIndicator(Modifier.width(14.dp).height(14.dp), color = Color.White, strokeWidth = 2.dp)
                                    } else {
                                        Text(
                                            if (following) "Following" else "Follow",
                                            color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
