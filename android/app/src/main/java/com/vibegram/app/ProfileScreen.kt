package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(
    username: String,
    me: VUser,
    onBack: () -> Unit,
    onProfile: (String) -> Unit,
    onChat: (VUser) -> Unit,
    onLogout: () -> Unit,
    onAvatarChanged: (VUser) -> Unit
) {
    val isOwn = username.equals(me.username, ignoreCase = true)
    val scope = rememberCoroutineScope()

    var user by remember { mutableStateOf<VUser?>(if (isOwn) me else null) }
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    var err by remember { mutableStateOf<String?>(null) }
    var following by remember { mutableStateOf<Boolean?>(null) }
    var busy by remember { mutableStateOf(false) }
    var avatarBusy by remember { mutableStateOf(false) }

    LaunchedEffect(username) {
        err = null
        posts = null
        try {
            val u = if (isOwn) me else Fb.userByUsername(username)
            if (u == null) { err = "User not found"; return@LaunchedEffect }
            user = u
            posts = Fb.userPosts(u.username)
            if (!isOwn) following = Fb.isFollowing(u.id)
        } catch (e: Exception) {
            err = e.message
        }
    }

    if (err != null) {
        Column(Modifier.fillMaxSize().background(Color.Black)) {
            Header(username, onBack = onBack)
            ErrorBox(err)
        }
        return
    }

    val u = user
    val ps = posts
    if (u == null || ps == null) {
        LoadingBox()
        return
    }

    Column(Modifier.fillMaxSize().background(Color.Black)) {
        // header: back + username + verified + settings/logout for own
        Row(
            Modifier.fillMaxWidth().height(54.dp).background(Color.Black).padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (!isOwn) {
                Text("←", color = Color.White, fontSize = 22.sp, modifier = Modifier
                    .clickable { onBack() }
                    .padding(horizontal = 8.dp))
            }
            Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 19.sp)
            if (u.verified) {
                Spacer(Modifier.width(5.dp))
                Text("✓", color = Color(0xFF1D9BF0), fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            if (u.isPrivate) {
                Spacer(Modifier.width(5.dp))
                Text("🔒", fontSize = 13.sp)
            }
            Box(Modifier.weight(1f))
            if (isOwn) {
                Text(
                    "Log out",
                    color = Color(0xFFED4956),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { Fb.logout(); onLogout() }.padding(8.dp)
                )
            } else {
                Text(
                    "✉",
                    color = Color.White,
                    fontSize = 20.sp,
                    modifier = Modifier.clickable { onChat(u) }.padding(8.dp)
                )
            }
        }

        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            // avatar + stats row (IG style)
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (isOwn && avatarBusy) {
                    Box(Modifier.size(86.dp), Alignment.Center) { CircularProgressIndicator(color = Color.White) }
                } else {
                    AsyncImage(
                        model = u.avatar ?: "https://ui-avatars.com/api/?background=333&color=fff&name=${u.username}",
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.size(86.dp).clip(CircleShape).background(Color(0xFF222222))
                    )
                }
                Spacer(Modifier.width(26.dp))
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.SpaceEvenly) {
                    Stat(ps.size, "posts")
                    Stat(u.followersCount, "followers")
                    Stat(u.followingCount, "following")
                }
            }

            // name + bio
            Column(Modifier.padding(horizontal = 20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(u.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    if (u.verified) {
                        Spacer(Modifier.width(5.dp))
                        Text("✓", color = Color(0xFF1D9BF0), fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
                if (u.bio.isNotBlank()) {
                    Text(u.bio, color = Color.White, fontSize = 13.sp, lineHeight = 18.sp)
                }
                if (u.anthem.isNotBlank()) {
                    Text("🎵 " + u.anthem, color = Color(0xFF9AA0A6), fontSize = 12.sp)
                }
            }

            Spacer(Modifier.height(12.dp))

            // actions
            Row(Modifier.fillMaxWidth().padding(horizontal = 20.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (isOwn) {
                    Button(
                        onClick = {
                            if (avatarBusy) return@Button
                            avatarBusy = true
                            scope.launch {
                                try {
                                    // reuse current avatar refresh (photo change comes with gallery picker next round)
                                    val refreshed = Fb.me()
                                    if (refreshed != null) { onAvatarChanged(refreshed); user = refreshed }
                                } finally { avatarBusy = false }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                        modifier = Modifier.weight(1f).height(42.dp),
                        shape = RoundedCornerShape(9.dp)
                    ) { Text("Refresh", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp) }
                } else {
                    Button(
                        onClick = {
                            if (busy) return@Button
                            busy = true
                            scope.launch {
                                try {
                                    val want = following != true
                                    val ok = Fb.follow(u, want)
                                    following = if (ok) want else false
                                } catch (_: Exception) {
                                } finally { busy = false }
                            }
                        },
                        enabled = !busy,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (following == true) Color(0xFF262626) else Color(0xFF0095F6)
                        ),
                        modifier = Modifier.weight(1f).height(42.dp),
                        shape = RoundedCornerShape(9.dp)
                    ) {
                        Text(
                            when (following) {
                                null -> "…"
                                true -> "Following"
                                false -> "Follow"
                            },
                            color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp
                        )
                    }
                    Button(
                        onClick = { onChat(u) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                        modifier = Modifier.weight(1f).height(42.dp),
                        shape = RoundedCornerShape(9.dp)
                    ) { Text("Message", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp) }
                }
            }

            Spacer(Modifier.height(14.dp))

            // grid
            if (ps.isEmpty()) {
                EmptyBox(if (isOwn) "Share your first photo from the + tab!" else "No posts yet", "📷")
            } else {
                val rows = ps.chunked(3)
                Column {
                    for (row in rows) {
                        Row(Modifier.fillMaxWidth()) {
                            for (p in row) {
                                Box(
                                    Modifier.weight(1f).aspectRatio(1f).padding(0.5.dp)
                                        .background(Color(0xFF111111))
                                        .clickable {
                                            // simple: open comments via feed-like overlay not needed here; tap → nothing yet
                                        }
                                ) {
                                    AsyncImage(
                                        model = p.media,
                                        contentDescription = null,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                    if (p.isVideo) {
                                        Text("▶", color = Color.White, fontSize = 22.sp, modifier = Modifier.align(Alignment.TopEnd).padding(6.dp))
                                    }
                                }
                            }
                            repeat(3 - row.size) {
                                Box(Modifier.weight(1f).aspectRatio(1f).background(Color.Black))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun Stat(count: Int, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(count.toString(), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Text(label, color = Color.White, fontSize = 13.sp)
    }
}
