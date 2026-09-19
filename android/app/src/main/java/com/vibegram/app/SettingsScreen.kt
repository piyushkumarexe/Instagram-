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
    var priv by remember { mutableStateOf(me.isPrivate) }
    var q by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

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
            SectionLabel("How you use Instagram")
            if (q.isBlank() || "saved".contains(q, true)) {
                SettingsRow(icon = { Icon(Icons.Filled.BookmarkBorder, null, tint = Color.White, modifier = Modifier.size(24.dp)) }, title = "Saved") { onOpenSaved() }
            }
            if (q.isBlank() || "notifications".startsWith(q, true)) {
                SettingsRow(icon = { Icon(Icons.Outlined.Notifications, null, tint = Color.White, modifier = Modifier.size(24.dp)) }, title = "Notifications") { onOpenNotifications() }
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
