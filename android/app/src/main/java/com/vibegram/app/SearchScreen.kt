package com.vibegram.app

import android.content.Context
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
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay
import org.json.JSONArray

data class RecentUser(val username: String, val name: String, val avatar: String?)

private fun loadRecents(ctx: Context): MutableList<RecentUser> {
    return try {
        val raw = ctx.getSharedPreferences("vibegram", Context.MODE_PRIVATE).getString("recent_searches", "[]") ?: "[]"
        val arr = JSONArray(raw)
        val out = mutableListOf<RecentUser>()
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            out.add(RecentUser(o.getString("username"), o.getString("name"), o.optString("avatar", "")))
        }
        out
    } catch (_: Exception) { mutableListOf() }
}

private fun saveRecents(ctx: Context, list: List<RecentUser>) {
    try {
        val arr = JSONArray()
        for (r in list.take(12)) {
            arr.put(org.json.JSONObject().put("username", r.username).put("name", r.name).put("avatar", r.avatar ?: ""))
        }
        ctx.getSharedPreferences("vibegram", Context.MODE_PRIVATE).edit().putString("recent_searches", arr.toString()).apply()
    } catch (_: Exception) { }
}

// IG search: pill on top, Recent list with avatars on the right + X remove, results with follower counts
@Composable
fun SearchScreen(onProfile: (String) -> Unit) {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    var q by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<VUser>?>(null) }
    var searching by remember { mutableStateOf(false) }
    var recents by remember { mutableStateOf(loadRecents(ctx)) }

    LaunchedEffect(q) {
        if (q.isBlank()) { results = null; searching = false; return@LaunchedEffect }
        searching = true
        val query = q
        delay(250)
        results = try { Fb.searchUsers(query) } catch (_: Exception) { emptyList() }
        searching = false
    }

    fun pushRecent(u: VUser) {
        recents.removeAll { it.username.equals(u.username, true) }
        recents.add(0, RecentUser(u.username, u.name, u.avatar))
        saveRecents(ctx, recents)
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        OutlinedTextField(
            value = q,
            onValueChange = { q = it },
            placeholder = { Text("Search", color = Color(0xFF8E8E8E)) },
            leadingIcon = { Text("🔍", fontSize = 16.sp) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                cursorColor = Color(0xFF0095F6),
                focusedBorderColor = Color(0xFF2A2A2C),
                unfocusedBorderColor = Color(0xFF2A2A2C)
            ),
            singleLine = true,
            shape = RoundedCornerShape(13.dp),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp).height(54.dp)
        )

        if (q.isBlank()) {
            // ---- Recent ----
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Recent", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Box(Modifier.weight(1f))
            }
            if (recents.isEmpty()) {
                EmptyBox("Search people by username", "🔎")
            } else {
                LazyColumn(Modifier.fillMaxSize()) {
                    items(recents) { r ->
                        Row(
                            Modifier.fillMaxWidth().clickable { onProfile(r.username) }
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(r.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                Text(r.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                            }
                            if (r.avatar.isNullOrBlank()) {
                                Box(
                                    Modifier.size(46.dp).background(Color(0xFF262626), CircleShape),
                                    Alignment.Center
                                ) {
                                    Text(
                                        r.username.take(1).uppercase(),
                                        color = Color(0xFFBBBBBB), fontWeight = FontWeight.Bold, fontSize = 18.sp
                                    )
                                }
                            } else {
                                DataImage(
                                    url = r.avatar,
                                    fallbackLetter = r.username.take(1).uppercase(),
                                    modifier = Modifier.size(46.dp)
                                )
                            }
                            Spacer(Modifier.width(12.dp))
                            Text(
                                "✕", color = Color(0xFF8E8E8E), fontSize = 16.sp,
                                modifier = Modifier
                                    .clickable {
                                        recents.removeAll { it.username.equals(r.username, true) }
                                        saveRecents(ctx, recents)
                                    }
                                    .padding(6.dp)
                            )
                        }
                    }
                }
            }
        } else {
            // ---- Results ----
            val res = results
            if (searching && res == null) {
                Box(Modifier.fillMaxWidth().padding(26.dp), Alignment.Center) {
                    CircularProgressIndicator(Modifier.size(24.dp), color = Color.White, strokeWidth = 2.dp)
                }
            }
            if (res != null) {
                if (res.isEmpty()) {
                    EmptyBox("No results found", "😕")
                } else {
                    LazyColumn(Modifier.fillMaxSize()) {
                        items(res) { u ->
                            Row(
                                Modifier.fillMaxWidth().clickable {
                                    pushRecent(u)
                                    onProfile(u.username)
                                }
                                    .padding(horizontal = 14.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                        if (u.verified) {
                                            Spacer(Modifier.width(4.dp))
                                            VerifiedBadge(14)
                                        }
                                    }
                                    Text(
                                        u.name + " • " + fmtCount(u.followersCount) + " followers",
                                        color = Color(0xFF8E8E8E), fontSize = 13.sp, maxLines = 1
                                    )
                                }
                                AvatarView(url = u.avatar, size = 46, border = false, name = u.username)
                            }
                        }
                    }
                }
            }
        }
    }
}
