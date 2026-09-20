package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import kotlinx.coroutines.launch

// IG Explore tab: search field on top, 3-col discovery grid below
@Composable
fun ExploreScreen(onProfile: (String) -> Unit, onPost: (Post) -> Unit) {
    var q by remember { mutableStateOf("") }
    var users by remember { mutableStateOf<List<VUser>?>(null) }
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    var searching by remember { mutableStateOf(false) }
    var err by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        posts = try { Fb.explorePosts() } catch (_: Exception) { emptyList() }
    }
    LaunchedEffect(q) {
        if (q.isBlank()) { users = null; searching = false; return@LaunchedEffect }
        searching = true
        val query = q
        kotlinx.coroutines.delay(250)
        err = null
        users = try { Fb.searchUsers(query) } catch (e: Exception) { err = e.message ?: "Search failed"; emptyList() }
        searching = false
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Text(
            "Explore",
            color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
        )
        OutlinedTextField(
            value = q,
            onValueChange = { q = it },
            placeholder = { Text("Search", color = Color(0xFF8E8E8E)) },
            leadingIcon = { Text("🔍", fontSize = 15.sp) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                cursorColor = Color(0xFF0095F6),
                focusedBorderColor = Color(0xFF3A3A3C),
                unfocusedBorderColor = Color(0xFF3A3A3C)
            ),
            singleLine = true,
            shape = RoundedCornerShape(11.dp),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp).height(54.dp)
        )

        if (q.isNotBlank()) {
            // user results
            if (searching) {
                Box(Modifier.fillMaxWidth().padding(26.dp), Alignment.Center) {
                    CircularProgressIndicator(color = Color.White, strokeWidth = 2.dp, modifier = Modifier.size(22.dp).aspectRatio(1f))
                }
            }
            val ul = users
            if (ul != null) {
                if (ul.isEmpty()) {
                    Text("No results found", color = Color(0xFF8E8E8E), fontSize = 13.sp, modifier = Modifier.padding(20.dp))
                    err?.let {
                        Text(it, color = Color(0xFFFF5A6E), fontSize = 12.sp, modifier = Modifier.padding(horizontal = 20.dp))
                    }
                } else {
                    LazyColumn(Modifier.fillMaxSize()) {
                        items(ul) { u ->
                            Row(
                                Modifier.fillMaxWidth().clickable { onProfile(u.username) }
                                    .padding(horizontal = 14.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AvatarView(url = u.avatar, size = 44, border = false)
                                Spacer(Modifier.width(12.dp))
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        if (u.verified) {
                                            Spacer(Modifier.width(4.dp))
                                            VerifiedBadge(14)
                                        }
                                    }
                                    Text(u.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // discovery grid
            val pl = posts
            if (pl == null) {
                LoadingBox()
            } else if (pl.isEmpty()) {
                EmptyBox("Nothing to explore yet", "🔍")
            } else {
                // v7.2: IG explore pattern — every 10th tile spans the full row
                androidx.compose.foundation.lazy.grid.LazyVerticalGrid(
                    columns = androidx.compose.foundation.lazy.grid.GridCells.Fixed(3),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(
                        pl.size,
                        span = { i ->
                            if (i % 10 == 0) androidx.compose.foundation.lazy.grid.GridItemSpan(3)
                            else androidx.compose.foundation.lazy.grid.GridItemSpan(1)
                        }
                    ) { i ->
                        val p = pl[i]
                        Box(
                            Modifier.fillMaxWidth()
                                .aspectRatio(if (i % 10 == 0) 16f / 9f else 1f)
                                .padding(0.5.dp)
                                .background(Color(0xFF101010))
                                .clickable { onPost(p) }
                        ) {
                            DataImage(
                                url = p.media,
                                fallbackLetter = p.username.take(1).uppercase(),
                                circle = false,
                                modifier = Modifier.fillMaxSize()
                            )
                            if (p.isVideo) {
                                Text("▶", color = Color.White, fontSize = 13.sp, modifier = Modifier.align(Alignment.TopEnd).padding(6.dp))
                            }
                            if (p.likesCount > 0) {
                                Row(
                                    Modifier.align(Alignment.BottomStart).padding(6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("❤", color = Color.White, fontSize = 11.sp)
                                    Spacer(Modifier.width(3.dp))
                                    Text(p.likesCount.toString(), color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}



// v7.2: hashtag page — every post that used #tag
@Composable
fun HashtagScreen(tag: String, onBack: () -> Unit, onPost: (Post) -> Unit) {
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    LaunchedEffect(tag) {
        posts = try { Fb.hashtagPosts(tag) } catch (_: Exception) { emptyList() }
    }
    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Header("#" + tag, onBack = onBack)
        val pl = posts
        if (pl == null) {
            LoadingBox()
        } else if (pl.isEmpty()) {
            EmptyBox("No posts for #" + tag + " yet", "#️⃣")
        } else {
            androidx.compose.foundation.lazy.grid.LazyVerticalGrid(
                columns = androidx.compose.foundation.lazy.grid.GridCells.Fixed(3),
                modifier = Modifier.fillMaxSize()
            ) {
                items(pl.size) { i ->
                    val p = pl[i]
                    Box(
                        Modifier.fillMaxWidth().aspectRatio(1f).padding(0.5.dp)
                            .background(Color(0xFF101010))
                            .clickable { onPost(p) }
                    ) {
                        DataImage(url = p.media, fallbackLetter = "#", circle = false, modifier = Modifier.fillMaxSize())
                    }
                }
            }
        }
    }
}
