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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// iTunes song search + 30s preview (shared by profile anthem + story composer)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun SongPickerSheet(
    current: String,
    onUse: (String, String, String) -> Unit,
    onClear: (() -> Unit)?,
    onDismiss: () -> Unit
) {
    var q by remember { mutableStateOf("") }
    var songs by remember { mutableStateOf<List<Song>>(emptyList()) }
    var searching by remember { mutableStateOf(false) }
    var playingUrl by remember { mutableStateOf<String?>(null) }
    var player by remember { mutableStateOf<android.media.MediaPlayer?>(null) }

    LaunchedEffect(q) {
        if (q.isBlank()) { songs = emptyList(); return@LaunchedEffect }
        searching = true
        val query = q
        delay(300)
        songs = try { Fb.itunesSearch(query) } catch (_: Exception) { emptyList() }
        searching = false
    }

    androidx.compose.material3.ModalBottomSheet(onDismissRequest = {
        try { player?.stop(); player?.release() } catch (_: Exception) { }
        onDismiss()
    }, containerColor = Color(0xFF1C1C1E)) {
        Column(Modifier.padding(horizontal = 18.dp).height(520.dp)) {
            Text("Add music", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = q,
                onValueChange = { q = it },
                placeholder = { Text("Search songs", color = Color(0xFF8E8E8E)) },
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
            Spacer(Modifier.height(10.dp))
            if (searching) {
                Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                    Spacer(Modifier.width(10.dp))
                    Text("Searching…", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                }
            }
            LazyColumn(Modifier.weight(1f)) {
                items(songs.size) { i ->
                    val song = songs[i]
                    Row(
                        Modifier.fillMaxWidth().clickable {
                            try {
                                player?.stop(); player?.release()
                                val p = android.media.MediaPlayer()
                                p.setDataSource(song.previewUrl)
                                p.prepare()
                                p.start()
                                player = p
                                playingUrl = song.previewUrl
                            } catch (_: Exception) { }
                        }.padding(vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = song.artwork,
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.size(44.dp).background(Color(0xFF333333))
                        )
                        Spacer(Modifier.width(10.dp))
                        Column(Modifier.weight(1f)) {
                            Text(song.title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                            Text(song.artist, color = Color(0xFF8E8E8E), fontSize = 12.sp, maxLines = 1)
                        }
                        Text(
                            if (playingUrl == song.previewUrl) "♪" else "▶",
                            color = Color(0xFF0095F6), fontSize = 15.sp
                        )
                    }
                }
            }
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                if (onClear != null && current.isNotBlank()) {
                    Text(
                        "Remove",
                        color = Color(0xFFED4956), fontWeight = FontWeight.Bold, fontSize = 13.sp,
                        modifier = Modifier.clickable {
                            try { player?.stop(); player?.release() } catch (_: Exception) { }
                            onClear()
                        }.padding(6.dp)
                    )
                    Spacer(Modifier.width(12.dp))
                }
                Button(
                    onClick = {
                        val p = playingUrl
                        if (p != null) {
                            val song = songs.firstOrNull { it.previewUrl == p }
                            if (song != null) {
                                try { player?.stop(); player?.release() } catch (_: Exception) { }
                                onUse(song.title, song.artist, song.previewUrl)
                            }
                        }
                    },
                    enabled = playingUrl != null,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                    modifier = Modifier.weight(1f).height(44.dp),
                    shape = RoundedCornerShape(9.dp)
                ) { Text("Use this song", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp) }
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

// IG "Discover people" page (person-add button target)
@Composable
fun DiscoverScreen(
    me: VUser,
    onBack: () -> Unit,
    onProfile: (String) -> Unit,
    onChat: (VUser) -> Unit
) {
    var list by remember { mutableStateOf<List<VUser>?>(null) }
    var followingIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    var busyId by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    androidx.compose.runtime.LaunchedEffect(Unit) {
        list = try { Fb.suggestions() } catch (_: Exception) { emptyList() }
        followingIds = try { Fb.followingOf(me.id).map { it.id }.toSet() } catch (_: Exception) { emptySet() }
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Row(
            Modifier.fillMaxWidth().height(56.dp).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            androidx.compose.material3.IconButton(onClick = onBack) {
                androidx.compose.material3.Icon(
                    Icons.AutoMirrored.Filled.ArrowBack, null,
                    tint = Color.White, modifier = Modifier.size(24.dp)
                )
            }
            Text("Discover people", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }

        val l = list
        if (l == null) {
            LoadingBox()
        } else if (l.isEmpty()) {
            EmptyBox("No suggestions right now", "🧑‍🤝‍🧑")
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                items(l) { u ->
                    var following by remember(u.id) { mutableStateOf(followingIds.contains(u.id)) }
                    Row(
                        Modifier.fillMaxWidth().clickable { onProfile(u.username) }
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AvatarView(url = u.avatar, size = 48, border = false, name = u.username)
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
                        Button(
                            onClick = {
                                if (busyId == u.id) return@Button
                                busyId = u.id
                                val want = !following
                                scope.launch {
                                    try {
                                        val ok = Fb.follow(u, want)
                                        if (ok) following = want else following = false
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

