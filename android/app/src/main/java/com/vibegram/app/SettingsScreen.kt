package com.vibegram.app

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.PersonAddAlt1
import androidx.compose.material.icons.outlined.Repeat
import androidx.compose.material.icons.outlined.SmartDisplay
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SwitchDefaults
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
import kotlinx.coroutines.launch

// IG "Settings and activity" page
@Composable
fun SettingsScreen(
    me: VUser,
    onBack: () -> Unit,
    onOpenSaved: () -> Unit,
    onOpenNotifications: () -> Unit,
    onLogout: () -> Unit,
    onPrivacyChanged: (VUser) -> Unit
) {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    var priv by remember { mutableStateOf(me.isPrivate) }
    var boosting by remember { mutableStateOf(false) }
    var q by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val isOwner = Fb.auth.currentUser?.email == "piyushpk811@gmail.com"
    var vq by remember { mutableStateOf("") }
    var vresults by remember { mutableStateOf<List<VUser>>(emptyList()) }
    var vsearching by remember { mutableStateOf(false) }

    LaunchedEffect(vq) {
        if (!isOwner || vq.isBlank()) { vresults = emptyList(); vsearching = false; return@LaunchedEffect }
        vsearching = true
        val query = vq
        kotlinx.coroutines.delay(250)
        vresults = try { Fb.searchUsers(query) } catch (_: Exception) { emptyList() }
        vsearching = false
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Row(
            Modifier.fillMaxWidth().height(56.dp).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            Text("Settings and activity", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 19.sp)
        }

        OutlinedTextField(
            value = q,
            onValueChange = { q = it },
            placeholder = { Text("Search", color = Color(0xFF8E8E8E)) },
            leadingIcon = { Text("🔍", fontSize = 15.sp) },
            colors = OutlinedTextFieldDefaultsColors(),
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp).height(52.dp)
        )

        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            if (isOwner) {
                SectionLabel("Verification (admin)")
                OutlinedTextField(
                    value = vq,
                    onValueChange = { vq = it },
                    placeholder = { Text("Search username to verify", color = Color(0xFF8E8E8E)) },
                    colors = OutlinedTextFieldDefaultsColors(),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp).height(50.dp)
                )
                if (vsearching) {
                    Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        CircularProgressIndicator(Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                        Spacer(Modifier.width(10.dp))
                        Text("Searching…", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                    }
                }
                vresults.forEach { u ->
                    var vstate by remember(u.id) { mutableStateOf(u.verified) }
                    Row(
                        Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AvatarView(url = u.avatar, size = 40, border = false, name = u.username)
                        Spacer(Modifier.width(10.dp))
                        Column(Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                if (vstate) {
                                    Spacer(Modifier.width(4.dp))
                                    VerifiedBadge(14)
                                }
                            }
                            Text(u.name, color = Color(0xFF8E8E8E), fontSize = 12.sp)
                        }
                        Button(
                            onClick = {
                                val nv = !vstate
                                vstate = nv
                                scope.launch { try { Fb.setUserVerified(u.username, nv) } catch (_: Exception) { vstate = !nv } }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (vstate) Color(0xFF262626) else Color(0xFF0095F6)
                            ),
                            modifier = Modifier.height(32.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                if (vstate) "Verified ✓" else "Verify",
                                color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp
                            )
                        }
                    }
                }
            }

            SectionLabel("More")
            SettingsRow(
                icon = { Text("📤", fontSize = 19.sp) },
                title = "Share VibeGram"
            ) {
                val send = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(android.content.Intent.EXTRA_TEXT, "VibeGram — a native Instagram-style app. Made by Piyush!")
                }
                ctx.startActivity(android.content.Intent.createChooser(send, "Share VibeGram"))
            }
            SettingsRow(
                icon = { Text("🔗", fontSize = 19.sp) },
                title = "Copy profile link"
            ) {
                val cm = ctx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                cm.setPrimaryClip(android.content.ClipData.newPlainText("profile", "vibegram://user/" + me.username))
                android.widget.Toast.makeText(ctx, "Link copied", android.widget.Toast.LENGTH_SHORT).show()
            }

            SectionLabel("How you use Instagram")
            if (q.isBlank() || "saved".contains(q, true)) {
                SettingsRow(icon = { Icon(Icons.Filled.BookmarkBorder, null, tint = Color.White, modifier = Modifier.size(24.dp)) }, title = "Saved") { onOpenSaved() }
            }
            if (q.isBlank() || "notifications".startsWith(q, true)) {
                SettingsRow(icon = { Icon(Icons.Outlined.Notifications, null, tint = Color.White, modifier = Modifier.size(24.dp)) }, title = "Notifications") { onOpenNotifications() }
            }
            if (Fb.auth.currentUser?.email == "piyushpk811@gmail.com") {
                SettingsRow(
                    icon = { Icon(Icons.Outlined.PersonAddAlt1, null, tint = Color.White, modifier = Modifier.size(24.dp)) },
                    title = if (boosting) "Adding followers…" else "Boost followers"
                ) {
                    if (!boosting) {
                        boosting = true
                        scope.launch {
                            val n = try { Fb.botsFollowMe() } catch (_: Exception) { 0 }
                            boosting = false
                            android.widget.Toast.makeText(
                                ctx,
                                if (n > 0) "+$n followers added" else "All bots already follow you",
                                android.widget.Toast.LENGTH_LONG
                            ).show()
                        }
                    }
                }
            }

            SectionLabel("Who can see your content")
            if (q.isBlank() || "account privacy".contains(q, true)) {
                Row(
                    Modifier.fillMaxWidth().clickable {
                        priv = !priv
                        scope.launch {
                            try {
                                Fb.setPrivateMe(priv)
                                onPrivacyChanged(me.copy(isPrivate = priv))
                            } catch (_: Exception) { }
                        }
                    }
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("🔒", fontSize = 19.sp)
                    Spacer(Modifier.width(14.dp))
                    Text("Account privacy", color = Color.White, fontSize = 15.sp, modifier = Modifier.weight(1f))
                    Text(if (priv) "Private" else "Public", color = Color(0xFF8E8E8E), fontSize = 14.sp)
                    Spacer(Modifier.width(8.dp))
                    Switch(
                        checked = priv,
                        onCheckedChange = {
                            priv = it
                            scope.launch {
                                try {
                                    Fb.setPrivateMe(it)
                                    onPrivacyChanged(me.copy(isPrivate = it))
                                } catch (_: Exception) { }
                            }
                        },
                        colors = SwitchDefaults.colors(
                            checkedTrackColor = Color(0xFF0095F6),
                            uncheckedTrackColor = Color(0xFF3A3A3C),
                            checkedThumbColor = Color.White,
                            uncheckedThumbColor = Color.White
                        )
                    )
                }
            }

            Spacer(Modifier.height(16.dp))
            Text(
                "Log out",
                color = Color(0xFFED4956),
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { Fb.logout(); onLogout() }
                    .padding(horizontal = 16.dp, vertical = 14.dp)
            )
            Spacer(Modifier.height(20.dp))
            // build version (proof of which APK you're running)
            val vname = try {
                ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName
            } catch (_: Exception) { "?" }
            Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("VibeGram v$vname", color = Color(0xFF6E6E6E), fontSize = 12.sp)
                Spacer(Modifier.height(3.dp))
                Text("Made by Piyush", color = Color(0xFF555555), fontSize = 11.sp)
            }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun OutlinedTextFieldDefaultsColors() = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
    focusedTextColor = Color.White,
    unfocusedTextColor = Color.White,
    cursorColor = Color(0xFF0095F6),
    focusedBorderColor = Color(0xFF2A2A2C),
    unfocusedBorderColor = Color(0xFF2A2A2C)
)

@Composable
private fun SectionLabel(text: String) {
    Text(
        text,
        color = Color(0xFF8E8E8E),
        fontWeight = FontWeight.Bold,
        fontSize = 13.sp,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)
    )
}

@Composable
private fun SettingsRow(icon: @Composable () -> Unit, title: String, onClick: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 13.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        icon()
        Spacer(Modifier.width(14.dp))
        Text(title, color = Color.White, fontSize = 15.sp, modifier = Modifier.weight(1f))
        Text("›", color = Color(0xFF8E8E8E), fontSize = 20.sp)
    }
}

// IG "Saved" page: grid of saved posts
@Composable
fun SavedScreen(onBack: () -> Unit, onOpenPost: (Post) -> Unit) {
    var posts by remember { mutableStateOf<List<Post>?>(null) }

    LaunchedEffect(Unit) {
        posts = try { Fb.savedPosts() } catch (_: Exception) { emptyList() }
    }

    Column(Modifier.fillMaxSize().background(Color.Black).statusBarsPadding()) {
        Row(
            Modifier.fillMaxWidth().height(56.dp).padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White, modifier = Modifier.size(24.dp))
            }
            Text("Saved", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 19.sp)
        }

        val list = posts
        if (list == null) {
            LoadingBox()
        } else if (list.isEmpty()) {
            EmptyBox("Save posts you want to see again.\nTap the bookmark icon on any post.", "🔖")
        } else {
            val rows = list.chunked(3)
            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
                for (row in rows) {
                    Row(Modifier.fillMaxWidth()) {
                        for (p in row) {
                            Box(
                                Modifier.weight(1f).aspectRatio(1f).padding(0.5.dp)
                                    .background(Color(0xFF101010))
                                    .clickable { onOpenPost(p) }
                            ) {
                                AsyncImage(
                                    model = p.media,
                                    contentDescription = null,
                                    contentScale = ContentScale.Crop,
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
    }
}
