package com.vibegram.app

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddBox
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material.icons.outlined.OndemandVideo
import androidx.compose.material.icons.outlined.SmartDisplay
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

data class Route(val tab: String, val username: String? = null)

@Composable
fun MainApp(initialMe: VUser, onLogout: () -> Unit) {
    var me by remember { mutableStateOf(initialMe) }
    val scope = rememberCoroutineScope()

    var tab by remember { mutableStateOf("feed") }
    var profileUsername by remember { mutableStateOf(initialMe.username) }
    var connKind by remember { mutableStateOf("followers") }
    var postFor by remember { mutableStateOf<Post?>(null) }
    val stack = remember { mutableStateListOf<Route>() }

    fun goProfile(username: String) {
        stack.add(Route(tab, profileUsername))
        profileUsername = username
        tab = "profile"
    }

    fun goConnections(username: String, kind: String) {
        stack.add(Route(tab, profileUsername))
        connKind = kind
        profileUsername = username
        tab = "connections"
    }

    fun pushTabRoute(name: String) {
        stack.add(Route(tab, profileUsername))
        tab = name
    }
    fun goBack() {
        if (stack.isNotEmpty()) {
            val r = stack.removeAt(stack.lastIndex)
            tab = r.tab
            profileUsername = r.username ?: me.username
        }
    }

    // feed state (hoisted — survives tab switches)
    var posts by remember { mutableStateOf<List<Post>?>(null) }
    var feedErr by remember { mutableStateOf<String?>(null) }
    val loadFeed: () -> Unit = {
        scope.launch {
            try { posts = Fb.feed(); feedErr = null } catch (e: Exception) { feedErr = e.message }
        }
    }
    LaunchedEffect(Unit) { loadFeed() }

    fun like(post: Post) {
        val list = posts ?: return
        val i = list.indexOfFirst { it.id == post.id }
        if (i < 0) return
        val p = list[i]
        val idv = Fb.uid ?: return
        val nowLiked = !p.likes.contains(idv)
        val updated = p.copy(
            likes = if (nowLiked) p.likes + idv else p.likes - idv,
            likesCount = p.likesCount + if (nowLiked) 1 else -1
        )
        posts = list.toMutableList().also { it[i] = updated }
        scope.launch { try { Fb.toggleLike(p) } catch (_: Exception) { } }
    }

    // stories
    var storyGroups by remember { mutableStateOf<Map<VUser, List<Story>>>(emptyMap()) }
    var openStory by remember { mutableStateOf<VUser?>(null) }
    val loadStories: () -> Unit = {
        scope.launch { storyGroups = try { Fb.stories() } catch (_: Exception) { emptyMap() } }
    }
    LaunchedEffect(Unit) { loadStories() }

    // overlays
    var commentsFor by remember { mutableStateOf<Post?>(null) }
    var chatWith by remember { mutableStateOf<VUser?>(null) }
    var bigAvatar by remember { mutableStateOf<String?>(null) }

    val overlayActive = commentsFor != null || chatWith != null || openStory != null || bigAvatar != null || postFor != null
    BackHandler(enabled = overlayActive) {
        when {
            bigAvatar != null -> bigAvatar = null
            openStory != null -> openStory = null
            commentsFor != null -> commentsFor = null
            chatWith != null -> chatWith = null
        }
    }
    BackHandler(enabled = !overlayActive && stack.isNotEmpty()) { goBack() }

    Box(Modifier.fillMaxSize().background(Color.Black)) {
        Column(Modifier.fillMaxSize()) {
            Box(Modifier.weight(1f)) {
                when (tab) {
                    "feed" -> FeedScreen(
                        posts = posts,
                        err = feedErr,
                        me = me,
                        storyGroups = storyGroups,
                        onRefresh = { loadFeed(); loadStories() },
                        onLike = { like(it) },
                        onComments = { commentsFor = it },
                        onProfile = { goProfile(it) },
                        onAddStory = { tab = "create" },
                        onOpenStory = { openStory = it },
                        onOpenNotifications = { tab = "notifications" },
                        onOpenCreate = { tab = "create" }
                    )
"search" -> ExploreScreen(onProfile = { goProfile(it) }, onPost = { postFor = it })
                    "messages" -> MessagesScreen(
                        me = me,
                        onChat = { chatWith = it },
                        onProfile = { goProfile(it) }
                    )
                    "create" -> CreateScreen(
                        me = me,
                        onPosted = {
                            scope.launch { loadFeed() }
                            stack.clear()
                            tab = "feed"
                        },
                        onStoryPosted = {
                            loadStories()
                            stack.clear()
                            tab = "feed"
                        },
                        onAvatarChanged = { u -> me = u }
                    )
                    "notifications" -> NotificationsScreen(me = me, onProfile = { goProfile(it) })
                    "reels" -> ReelsScreen(
                        me = me,
                        onLike = { like(it) },
                        onComments = { commentsFor = it },
                        onProfile = { goProfile(it) }
                    )
                    "settings" -> SettingsScreen(
                        me = me,
                        onBack = { goBack() },
                        onOpenSaved = { pushTabRoute("saved") },
                        onOpenNotifications = { pushTabRoute("notifications") },
                        onLogout = onLogout,
                        onPrivacyChanged = { u -> me = u }
                    )
                    "saved" -> SavedScreen(
                        onBack = { goBack() },
                        onOpenPost = { postFor = it }
                    )
                    "connections" -> ConnectionsScreen(
                        username = profileUsername,
                        kind = connKind,
                        me = me,
                        onBack = { goBack() },
                        onProfile = { goProfile(it) },
                        onChat = { chatWith = it }
                    )
                    "profile" -> ProfileScreen(
                        username = profileUsername,
                        me = me,
                        onBack = { goBack() },
                        onProfile = { goProfile(it) },
                        onChat = { chatWith = it },
                        onAddStory = { tab = "create" },
                        onLogout = onLogout,
                        onAvatarChanged = { u -> me = u },
                        onConnections = { uname, kind -> goConnections(uname, kind) },
                        onSettings = { pushTabRoute("settings") },
                        hasStory = storyGroups.keys.any { it.id == me.id }
                    )
                }
            }

            NavigationBar(containerColor = Color.Black, contentColor = Color.White, tonalElevation = 0.dp) {
                NavigationBarItem(
                    selected = tab == "feed", onClick = { tab = "feed" },
                    icon = { Icon(if (tab == "feed") Icons.Filled.Home else Icons.Outlined.Home, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "reels", onClick = { tab = "reels" },
                    icon = { Icon(if (tab == "reels") Icons.Filled.SmartDisplay else Icons.Outlined.OndemandVideo, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "messages", onClick = { tab = "messages" },
                    icon = { Icon(if (tab == "messages") Icons.Filled.Send else Icons.Outlined.Send, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "search", onClick = { tab = "search" },
                    icon = { Icon(Icons.Filled.Search, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "profile", onClick = { tab = "profile" },
                    icon = {
                        Box(Modifier.size(26.dp)) {
                            if (me.avatar.isNullOrBlank()) {
                                Box(
                                    Modifier.fillMaxSize().background(Color(0xFF262626), androidx.compose.foundation.shape.CircleShape),
                                    Alignment.Center
                                ) {
                                    Text(
                                        me.username.take(1).uppercase(),
                                        color = Color(0xFFBBBBBB), fontWeight = FontWeight.Bold, fontSize = 12.sp
                                    )
                                }
                            } else {
                                coil.compose.AsyncImage(
                                    model = me.avatar,
                                    contentDescription = null,
                                    contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize().clip(androidx.compose.foundation.shape.CircleShape)
                                )
                            }
                        }
                    },
                    colors = navColors()
                )
            }
        }

        // overlays
        commentsFor?.let { post ->
            CommentsPanel(
                post = post,
                onDismiss = { commentsFor = null },
                onProfile = { commentsFor = null; goProfile(it) },
                onAvatar = { bigAvatar = it }
            )
        }
        chatWith?.let { user ->
            ChatScreen(
                other = user,
                me = me,
                onProfile = { chatWith = null; goProfile(it) },
                onBack = { chatWith = null }
            )
        }
        openStory?.let { su ->
            StoryViewer(
                user = su,
                stories = storyGroups[su] ?: emptyList(),
                onClose = { openStory = null }
            )
        }
        bigAvatar?.let { url ->
            BigAvatar(url = url, onDismiss = { bigAvatar = null })
        }
        postFor?.let { p ->
            PostModal(
                post = p,
                onLike = { like(it) },
                onComments = { cp -> commentsFor = cp },
                onProfile = { uname -> postFor = null; goProfile(uname) },
                onClose = { postFor = null }
            )
        }
    }
}

@Composable
private fun navColors() = NavigationBarItemDefaults.colors(
    selectedIconColor = Color.White,
    selectedTextColor = Color.White,
    unselectedIconColor = Color.White,
    unselectedTextColor = Color.White,
    indicatorColor = Color.Transparent
)

@Composable
fun Header(title: String, onBack: (() -> Unit)? = null, actions: @Composable (() -> Unit)? = null) {
    Row(
        Modifier.fillMaxWidth().height(54.dp).background(Color.Black).padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (onBack != null) {
            IconButton(onClick = onBack) {
                Text("←", color = Color.White, fontSize = 22.sp)
            }
        }
        Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Box(Modifier.weight(1f))
        if (actions != null) actions()
    }
}

@Composable
fun LoadingBox() {
    Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator(color = Color.White) }
}

@Composable
fun EmptyBox(text: String, emoji: String = "🙈") {
    Column(
        Modifier.fillMaxSize().padding(30.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(emoji, fontSize = 44.sp)
        Text(text, color = Color(0xFFB0B0B0), fontSize = 14.sp)
    }
}

@Composable
fun ErrorBox(text: String?) {
    Column(
        Modifier.fillMaxSize().padding(30.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("😕", fontSize = 44.sp)
        Text(text ?: "Something went wrong", color = Color(0xFFED4956), fontSize = 14.sp)
    }
}
