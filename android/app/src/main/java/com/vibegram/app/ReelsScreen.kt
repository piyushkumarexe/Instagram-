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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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

// IG Reels tab: full-screen vertical pages (video posts)
@Composable
fun ReelsScreen(
    me: VUser,
    onLike: (Post) -> Unit,
    onComments: (Post) -> Unit,
    onProfile: (String) -> Unit
) {
    var posts by remember { mutableStateOf<List<Post>?>(null) }

    LaunchedEffect(Unit) {
        posts = try { Fb.feed().filter { it.isVideo } } catch (_: Exception) { emptyList() }
    }

    val list = posts
    if (list == null) {
        LoadingBox()
        return
    }
    if (list.isEmpty()) {
        Column(
            Modifier.fillMaxSize().background(Color.Black).statusBarsPadding(),
            verticalArrangement = androidx.compose.foundation.layout.Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("🎬", fontSize = 44.sp)
            Spacer(Modifier.height(12.dp))
            Text("No reels yet", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(Modifier.height(4.dp))
            Text("Reels shared by people you follow will show up here", color = Color(0xFF8E8E8E), fontSize = 13.sp)
        }
        return
    }

    LazyColumn(Modifier.fillMaxSize().background(Color.Black)) {
        items(list.size) { i ->
            val post = list[i]
            var liked by remember(post.id) { mutableStateOf(Fb.uid != null && post.likes.contains(Fb.uid)) }
            Box(
                Modifier.fillParentMaxSize()
                    .background(Color(0xFF0A0A0A))
                    .clickable { }
            ) {
                // media
                VideoPlayer(media = post.media, modifier = Modifier.fillMaxSize())
                Column(
                    Modifier.align(Alignment.BottomStart).padding(start = 14.dp, bottom = 60.dp)
                ) {
                    Text(post.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp,
                        modifier = Modifier.clickable { onProfile(post.username) })
                    if (post.caption.isNotBlank()) {
                        Spacer(Modifier.height(6.dp))
                        Text(
                            post.caption,
                            color = Color(0xFFEDEDED), fontSize = 13.sp,
                            modifier = Modifier.padding(end = 70.dp)
                        )
                    }
                }

                // right rail (IG)
                Column(
                    Modifier.align(Alignment.BottomEnd).padding(end = 12.dp, bottom = 60.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    IconButton(onClick = { onLike(post); liked = !liked }) {
                        Icon(
                            if (liked) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                            null,
                            tint = if (liked) Color(0xFFED4956) else Color.White,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                    Text(fmtCount(post.likesCount), color = Color.White, fontSize = 12.sp)
                    Spacer(Modifier.height(14.dp))
                    IconButton(onClick = { onComments(post) }) {
                        Icon(Icons.Outlined.ChatBubbleOutline, null, tint = Color.White, modifier = Modifier.size(28.dp))
                    }
                    Text(fmtCount(post.commentsCount), color = Color.White, fontSize = 12.sp)
                }
            }
        }
    }
}
