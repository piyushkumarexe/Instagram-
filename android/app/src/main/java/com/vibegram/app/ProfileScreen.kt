package com.vibegram.app

import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apps
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.SmartDisplay
import androidx.compose.material.icons.outlined.PersonPin
import androidx.compose.material.icons.outlined.Repeat
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.PersonAddAlt1
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    username: String,
    me: VUser,
    onBack: () -> Unit,
    onProfile: (String) -> Unit,
    onChat: (VUser) -> Unit,
    onAddStory: () -> Unit,
    onLogout: () -> Unit,
    onAvatarChanged: (VUser) -> Unit,
    onConnections: (String, String) -> Unit,
    onSettings: () -> Unit = {},
    onDiscover: () -> Unit = {},
    onOpenOwnStory: () -> Unit = {},
    onOpenPost: (Post) -> Unit = {},
    hasStory: Boolean = false
) {
    val ctx = LocalContext.current
    val isOwn = username.equals(me.username, ignoreCase = true)
    val scope = rememberCoroutineScope()

    var user by remember { mutableStateOf<VUser?>(if (isOwn) me else null) }
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    var err by remember { mutableStateOf<String?>(null) }
    var following by remember { mutableStateOf<Boolean?>(null) }
    var busy by remember { mutableStateOf(false) }
    var refreshing by remember { mutableStateOf(false) }
    var menuSheet by remember { mutableStateOf(false) }
    var editSheet by remember { mutableStateOf(false) }
    var ptab by remember { mutableStateOf("grid") }
    var songSheet by remember { mutableStateOf(false) }
    var followerSample by remember { mutableStateOf<List<VUser>>(emptyList()) }

    fun reload(done: () -> Unit = {}) {
        scope.launch {
            try {
                val u = if (isOwn) (Fb.me() ?: me) else Fb.userByUsername(username)
                if (u == null) { err = "User not found"; return@launch }
                user = u
                if (isOwn) onAvatarChanged(u)
                posts = Fb.userPosts(u.username)
                if (!isOwn) {
                    following = Fb.isFollowing(u.id)
                    Fb.amRequesting(u.id)
                    followerSample = try { Fb.followersOf(u.id) } catch (_: Exception) { emptyList() }
                }
                err = null
            } catch (e: Exception) {
                err = e.message
            } finally { done() }
        }
    }

    LaunchedEffect(username) { reload() }
    LaunchedEffect(refreshing) { if (refreshing) reload { refreshing = false } }

    // profile photo picker (own)
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) scope.launch {
            try {
                val bmp = ctx.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it) }
                if (bmp != null) {
                    Fb.updateAvatar(bmp)
                    reload()
                }
            } catch (_: Exception) { }
        }
    }

    if (err != null && user == null) {
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

    Column(Modifier.fillMaxSize().background(Color.Black).navigationBarsPadding()) {
        // ---- top bar (IG: username left, menu right) ----
        Row(
            Modifier.fillMaxWidth().height(54.dp).background(Color.Black).padding(horizontal = 14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (!isOwn) {
                Text("←", color = Color.White, fontSize = 21.sp, modifier = Modifier
                    .clickable { onBack() }
                    .padding(end = 12.dp))
            }
            Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
            if (u.verified) {
                Spacer(Modifier.width(5.dp))
                VerifiedBadge(18)
            }
            if (u.isPrivate) {
                Spacer(Modifier.width(4.dp))
                Icon(
                    Icons.Outlined.Lock, null,
                    tint = Color(0xFFC7C7C7), modifier = Modifier.size(15.dp)
                )
            }
            Box(Modifier.weight(1f))
            if (isOwn) {
                IconButton(onClick = { onSettings() }) {
                    Icon(Icons.Filled.Menu, null, tint = Color.White, modifier = Modifier.size(24.dp))
                }
            }
        }

        PullToRefreshBox(
            isRefreshing = refreshing,
            onRefresh = { refreshing = true },
            modifier = Modifier.fillMaxSize()
        ) {
            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
                // ---- avatar + stats ----
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(contentAlignment = Alignment.BottomEnd) {
                        if (busy) {
                            Box(Modifier.size(86.dp), Alignment.Center) {
                                CircularProgressIndicator(color = Color.White, strokeWidth = 2.dp)
                            }
                        } else {
                            AvatarView(
                                url = u.avatar,
                                size = 84,
                                border = false,
                                name = u.username,
                                showRing = isOwn && hasStory
                            )
                            if (isOwn) {
                                Box(
                                    Modifier
                                        .matchParentSize()
                                        .clickable {
                                            if (hasStory) onOpenOwnStory()
                                            else picker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                                        }
                                ) { }
                            }
                        }
                        if (isOwn) {
                            Box(
                                Modifier
                                    .padding(end = 2.dp)
                                    .size(26.dp)
                                    .background(Color(0xFF0095F6), CircleShape)
                                    .border(2.5.dp, Color.Black, CircleShape)
                                    .clickable { onAddStory() },
                                contentAlignment = Alignment.Center
                            ) { Text("+", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold) }
                        }
                    }
                    Spacer(Modifier.width(24.dp))
                    Row(Modifier.weight(1f), horizontalArrangement = Arrangement.SpaceEvenly) {
                        Stat(ps.size.toLong(), "posts")
                        Box(Modifier.clickable { onConnections(u.username, "followers") }) {
                            Stat(u.followersCount, "followers")
                        }
                        Box(Modifier.clickable { onConnections(u.username, "following") }) {
                            Stat(u.followingCount, "following")
                        }
                    }
                }

                // ---- name + bio ----
                Column(Modifier.padding(horizontal = 16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(u.name, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        if (u.verified) {
                            Spacer(Modifier.width(5.dp))
                            VerifiedBadge(14)
                        }
                    }
                    if (u.bio.isNotBlank()) {
                        Text(u.bio, color = Color.White, fontSize = 13.sp, lineHeight = 18.sp)
                    }
                    if (u.link.isNotBlank()) {
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "🔗 " + u.link.removePrefix("https://").removePrefix("http://"),
                            color = Color(0xFF5B9BD5), fontSize = 13.sp,
                            modifier = Modifier.clickable {
                                try {
                                    val url = if (u.link.startsWith("http")) u.link else "https://" + u.link
                                    ctx.startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url)))
                                } catch (_: Exception) { }
                            }
                        )
                    }
                    if (u.anthem.isNotBlank()) {
                        Spacer(Modifier.height(6.dp))
                        Row(
                            Modifier.background(Color(0xFF1C1C1E), RoundedCornerShape(16.dp))
                                .clickable { if (isOwn) songSheet = true }
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("🎵", fontSize = 12.sp)
                            Spacer(Modifier.width(6.dp))
                            Text(
                                u.anthem + (if (u.anthemArtist.isNotBlank()) " · " + u.anthemArtist else ""),
                                color = Color(0xFFDDDDDD), fontSize = 12.sp
                            )
                            if (isOwn) {
                                Spacer(Modifier.width(8.dp))
                                Text("Edit", color = Color(0xFF0095F6), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                Spacer(Modifier.height(14.dp))

                // ---- action buttons (IG) ----
                Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(7.dp)) {
                    if (isOwn) {
                        Button(
                            onClick = { editSheet = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                            modifier = Modifier.weight(1f).height(40.dp),
                            shape = RoundedCornerShape(9.dp)
                        ) { Text("Edit profile", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp) }
                        Button(
                            onClick = {
                                val i = Intent(Intent.ACTION_SEND).apply {
                                    type = "text/plain"
                                    putExtra(Intent.EXTRA_TEXT, "Follow me on VibeGram! My username is ${u.username}")
                                }
                                ctx.startActivity(Intent.createChooser(i, "Share profile"))
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                            modifier = Modifier.weight(1f).height(40.dp),
                            shape = RoundedCornerShape(9.dp)
                        ) { Text("Share profile", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp) }
                    } else {
                        Button(
                            onClick = {
                                if (busy) return@Button
                                busy = true
                                scope.launch {
                                    try {
                                        val want = following != true
                                        val ok = Fb.follow(u, want)
                                        if (ok) following = want
                                    } catch (_: Exception) {
                                    } finally { busy = false }
                                }
                            },
                            enabled = !busy,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (following == true) Color(0xFF262626) else Color(0xFF0095F6)
                            ),
                            modifier = Modifier.weight(1f).height(40.dp),
                            shape = RoundedCornerShape(9.dp)
                        ) {
                            Text(
                                when (following) {
                                    null -> "…"
                                    true -> "Following ▾"
                                    false -> if (Fb.amRequestingSync(u.id)) "Requested" else "Follow"
                                },
                                color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp
                            )
                        }
                        Box(
                            Modifier.size(40.dp).background(Color(0xFF262626), RoundedCornerShape(9.dp))
                                .clickable { onDiscover() },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Outlined.PersonAddAlt1, null, tint = Color.White, modifier = Modifier.size(20.dp))
                        }
                    }
                }

                // social proof (IG "Followed by ...")
                if (!isOwn && following == false && followerSample.isNotEmpty()) {
                    Spacer(Modifier.height(10.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Row {
                            followerSample.take(2).forEach { f ->
                                Box(Modifier.padding(end = 4.dp)) {
                                    AvatarView(url = f.avatar, size = 22, border = false, name = f.username)
                                }
                            }
                        }
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Followed by " + followerSample.first().username +
                                (if (followerSample.size > 1) " and " + (u.followersCount - 1) + " others" else ""),
                            color = Color.White, fontSize = 12.sp
                        )
                    }
                }

                Spacer(Modifier.height(10.dp))

                // ---- IG profile tabs (grid / reels / reposted / tagged) ----
                Row(Modifier.fillMaxWidth()) {
                    listOf(
                        Triple("grid", Icons.Filled.Apps, "Grid"),
                        Triple("reels", Icons.Filled.SmartDisplay, "Reels"),
                        Triple("reposted", Icons.Outlined.Repeat, "Reposts"),
                        Triple("tagged", Icons.Outlined.PersonPin, "Tagged")
                    ).forEach { (key, ic, _) ->
                        Column(
                            Modifier.weight(1f).clickable { ptab = key },
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Spacer(Modifier.height(8.dp))
                            Icon(ic, null, tint = if (ptab == key) Color.White else Color(0xFF5A5A5A), modifier = Modifier.size(24.dp))
                            Spacer(Modifier.height(7.dp))
                            Box(
                                Modifier.fillMaxWidth(0.6f).height(1.5.dp)
                                    .background(if (ptab == key) Color.White else Color.Transparent)
                            )
                        }
                    }
                }

                // ---- posts grid ----
                if (ptab == "reposted") {
                    var reposts by remember { mutableStateOf<List<Post>?>(null) }
                    LaunchedEffect(Unit) {
                        reposts = try { Fb.repostedPosts() } catch (_: Exception) { emptyList() }
                    }
                    val rl = reposts
                    if (rl == null) {
                        Box(Modifier.fillMaxWidth().padding(40.dp), Alignment.Center) {
                            CircularProgressIndicator(color = Color.White, strokeWidth = 2.dp)
                        }
                    } else if (rl.isEmpty()) {
                        Spacer(Modifier.height(60.dp))
                        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("🔁", fontSize = 36.sp)
                            Spacer(Modifier.height(10.dp))
                            Text("No reposts yet", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    } else {
                        val rrows = rl.chunked(3)
                        Column {
                            for (row in rrows) {
                                Row(Modifier.fillMaxWidth()) {
                                    for (p in row) {
                                        Box(
                                            Modifier.weight(1f).aspectRatio(1f).padding(0.5.dp)
                                                .background(Color(0xFF101010))
                                                .clickable { onOpenPost(p) }
                                        ) {
                                            DataImage(
                                                url = p.media,
                                                fallbackLetter = p.username.take(1).uppercase(),
                                                circle = false,
                                                modifier = Modifier.fillMaxSize()
                                            )
                                        }
                                    }
                                    repeat(3 - row.size) {
                                        Box(Modifier.weight(1f).aspectRatio(1f).background(Color.Black))
                                    }
                                }
                            }
                        }
                    }
                } else if (ptab == "reels") {
                    Spacer(Modifier.height(60.dp))
                    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("▶", fontSize = 36.sp)
                        Spacer(Modifier.height(10.dp))
                        Text("No reels yet", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                } else if (ptab == "tagged") {
                    Spacer(Modifier.height(60.dp))
                    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("👤", fontSize = 36.sp)
                        Spacer(Modifier.height(10.dp))
                        Text("Photos of you", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Spacer(Modifier.height(4.dp))
                        Text("When people tag you in photos, they will appear here", color = Color(0xFF8E8E8E), fontSize = 12.sp)
                    }
                } else if (ps.isEmpty()) {
                    Spacer(Modifier.height(60.dp))
                    Column(
                        Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("📷", fontSize = 40.sp)
                        Spacer(Modifier.height(10.dp))
                        Text(
                            if (isOwn) "Share your first photo" else "No posts yet",
                            color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            if (isOwn) "Photos you share will appear on your profile"
                            else "When they share photos, they will appear here",
                            color = Color(0xFF8E8E8E), fontSize = 12.sp
                        )
                    }
                } else {
                    val rows = ps.chunked(3)
                    Column {
                        for (row in rows) {
                            Row(Modifier.fillMaxWidth()) {
                                for (p in row) {
                                    Box(
                                        Modifier.weight(1f).aspectRatio(1f).padding(0.5.dp)
                                            .background(Color(0xFF101010))
                                            .clickable { onOpenPost(p) }
                                    ) {
                                        DataImage(
                                            url = p.media,
                                            fallbackLetter = p.username.take(1).uppercase(),
                                            circle = false,
                                            modifier = Modifier.fillMaxSize()
                                        )
                                        if (p.isVideo) {
                                            Text("▶", color = Color.White, fontSize = 15.sp, modifier = Modifier.align(Alignment.TopEnd).padding(6.dp))
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

    if (songSheet) {
        SongPickerSheet(
            current = u.anthem,
            onUse = { title, artist, url ->
                songSheet = false
                scope.launch {
                    try {
                        Fb.updateAnthem(title, artist, url)
                        reload()
                    } catch (_: Exception) { }
                }
            },
            onClear = {
                songSheet = false
                scope.launch {
                    try {
                        Fb.updateAnthem("", "", "")
                        reload()
                    } catch (_: Exception) { }
                }
            },
            onDismiss = { songSheet = false }
        )
    }

    // ---- ☰ menu sheet (own) ----
    if (menuSheet) {
        ModalBottomSheet(
            onDismissRequest = { menuSheet = false },
            containerColor = Color(0xFF1C1C1E)
        ) {
            Column(Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                SheetItem("Settings and activity") { menuSheet = false }
                SheetItem("Close") { menuSheet = false }
                SheetItem("Log out", danger = true) {
                    menuSheet = false
                    Fb.logout()
                    onLogout()
                }
                Spacer(Modifier.height(22.dp))
            }
        }
    }

    // ---- edit profile sheet (own) ----
    if (editSheet) {
        var ename by remember { mutableStateOf(u.name) }
        var ebio by remember { mutableStateOf(u.bio) }
        var elink by remember { mutableStateOf(u.link) }
        var saving by remember { mutableStateOf(false) }
        ModalBottomSheet(
            onDismissRequest = { editSheet = false },
            containerColor = Color(0xFF1C1C1E)
        ) {
            Column(Modifier.padding(horizontal = 18.dp)) {
                Text("Edit profile", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(Modifier.height(16.dp))
                OutlinedTextField(
                    value = ename,
                    onValueChange = { ename = it },
                    label = { Text("Name", color = Color(0xFF8E8E8E)) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = Color(0xFF0095F6),
                        focusedBorderColor = Color(0xFF3A3A3C),
                        unfocusedBorderColor = Color(0xFF3A3A3C)
                    ),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(
                    value = elink,
                    onValueChange = { elink = it },
                    label = { Text("Link", color = Color(0xFF8E8E8E)) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = Color(0xFF0095F6),
                        focusedBorderColor = Color(0xFF3A3A3C),
                        unfocusedBorderColor = Color(0xFF3A3A3C)
                    ),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(
                    value = ebio,
                    onValueChange = { ebio = it },
                    label = { Text("Bio", color = Color(0xFF8E8E8E)) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        cursorColor = Color(0xFF0095F6),
                        focusedBorderColor = Color(0xFF3A3A3C),
                        unfocusedBorderColor = Color(0xFF3A3A3C)
                    ),
                    maxLines = 3,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(12.dp))
                Row(
                    Modifier.fillMaxWidth().clickable { songSheet = true }
                        .background(Color(0xFF232326), RoundedCornerShape(9.dp))
                        .padding(horizontal = 12.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("🎵", fontSize = 15.sp)
                    Spacer(Modifier.width(8.dp))
                    Text(
                        if (u.anthem.isBlank()) "Add music to profile" else u.anthem,
                        color = Color.White, fontSize = 14.sp
                    )
                }
                Spacer(Modifier.height(18.dp))
                Button(
                    onClick = {
                        if (saving) return@Button
                        saving = true
                        scope.launch {
                            try {
                                Fb.updateProfile(ename, ebio, elink)
                                reload()
                                editSheet = false
                            } catch (_: Exception) {
                            } finally { saving = false }
                        }
                    },
                    enabled = !saving && ename.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                    modifier = Modifier.fillMaxWidth().height(44.dp),
                    shape = RoundedCornerShape(9.dp)
                ) {
                    if (saving) CircularProgressIndicator(Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                    else Text("Save", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
                Spacer(Modifier.height(30.dp))
            }
        }
    }
}

@Composable
private fun SheetItem(text: String, danger: Boolean = false, onClick: () -> Unit) {
    Text(
        text,
        color = if (danger) Color(0xFFED4956) else Color.White,
        fontWeight = if (danger) FontWeight.Bold else FontWeight.Normal,
        fontSize = 16.sp,
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 14.dp)
    )
}

@Composable
fun Stat(count: Long, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(count.toString(), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Text(label, color = Color.White, fontSize = 13.sp)
    }
}

