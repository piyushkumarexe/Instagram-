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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * v7.6 global preferences (accent colour + haptics), persisted in the same
 * "vibegram" SharedPreferences file the rest of the app uses.
 */
object Prefs {
    var accentLong by mutableStateOf(0xFF0095F6L)
        private set
    var hapticsOn by mutableStateOf(true)
        private set

    fun load(ctx: android.content.Context) {
        val p = ctx.getSharedPreferences("vibegram", 0)
        accentLong = p.getLong("accent", 0xFF0095F6L)
        hapticsOn = p.getBoolean("haptics_on", true)
    }

    fun setAccent(ctx: android.content.Context, v: Long) {
        accentLong = v
        ctx.getSharedPreferences("vibegram", 0).edit().putLong("accent", v).apply()
    }

    fun setHaptics(ctx: android.content.Context, v: Boolean) {
        hapticsOn = v
        ctx.getSharedPreferences("vibegram", 0).edit().putBoolean("haptics_on", v).apply()
    }
}

// ---------- Your activity → Likes ----------
@Composable
fun LikedPostsScreen(onBack: () -> Unit, onOpenPost: (Post) -> Unit, onProfile: (String) -> Unit = { _ -> }) {
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    LaunchedEffect(Unit) {
        posts = try { Fb.likedPosts() } catch (_: Exception) { emptyList() }
    }
    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Header("Likes", onBack = onBack)
        val pl = posts
        if (pl == null) {
            LoadingBox()
        } else if (pl.isEmpty()) {
            EmptyBox("Posts you like will appear here", "❤️")
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                items(pl.chunked(3)) { row ->
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
                        repeat(3 - row.size) { Box(Modifier.weight(1f).aspectRatio(1f)) }
                    }
                }
            }
        }
    }
}

// ---------- About this account ----------
@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun AboutSheet(u: VUser, onDismiss: () -> Unit) {
    androidx.compose.material3.ModalBottomSheet(onDismissRequest = onDismiss, containerColor = Color(0xFF1C1C1E)) {
        Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 30.dp)) {
            Text("About this account", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
            Spacer(Modifier.height(14.dp))
            @Composable
            fun aboutRow(k: String, v: String) {
                Row(Modifier.fillMaxWidth().padding(vertical = 7.dp)) {
                    Text(k, color = Color(0xFF8E8E8E), fontSize = 14.sp, modifier = Modifier.width(140.dp))
                    Text(v, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                }
            }
            aboutRow("Username", "@" + u.username)
            aboutRow("Account ID", u.id.take(14) + "…")
            aboutRow(
                "Joined",
                if (u.createdAt > 0) java.text.SimpleDateFormat("d MMM yyyy", java.util.Locale.getDefault())
                    .format(java.util.Date(u.createdAt)) else "—"
            )
            aboutRow("Verified", if (u.verified) "Yes ✓" else "No")
            aboutRow("Account type", if (u.isPrivate) "Private" else "Public")
        }
    }
}

// ---------- Insights (own posts) ----------
@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun InsightsSheet(post: Post, onDismiss: () -> Unit) {
    androidx.compose.material3.ModalBottomSheet(onDismissRequest = onDismiss, containerColor = Color(0xFF1C1C1E)) {
        Column(Modifier.padding(horizontal = 20.dp).padding(bottom = 30.dp)) {
            Text("Insights", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
            Spacer(Modifier.height(4.dp))
            Text("Performance of this post", color = Color(0xFF8E8E8E), fontSize = 12.sp)
            Spacer(Modifier.height(14.dp))
            Row(Modifier.fillMaxWidth()) {
                listOf(
                    "Views" to post.views.toString(),
                    "Likes" to post.likesCount.toString(),
                    "Comments" to post.commentsCount.toString()
                ).forEach { (k, v) ->
                    Column(Modifier.weight(1f)) {
                        Text(v, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        Text(k, color = Color(0xFF8E8E8E), fontSize = 12.sp)
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            Box(Modifier.fillMaxWidth().height(1.dp).background(Color(0xFF2A2A2A)))
            Spacer(Modifier.height(12.dp))
            Text(
                "Interactions: " + (post.likesCount + post.commentsCount) +
                    " · Reach grows every time someone opens this post.",
                color = Color(0xFF8E8E8E), fontSize = 13.sp
            )
        }
    }
}
