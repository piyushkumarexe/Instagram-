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
import androidx.compose.material.icons.filled.Person
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
    val stack = remember { mutableStateListOf<Route>() }

    fun goProfile(username: String) {
        stack.add(Route(tab, profileUsername))
        profileUsername = username
        tab = "profile"
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

    val overlayActive = commentsFor != null || chatWith != null || openStory != null || bigAvatar != null
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
                        onChat = { chatWith = it }
                    )
                    "search" -> SearchScreen(onProfile = { goProfile(it) })
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
                    "notifications" -> NotificationsScreen(onProfile = { goProfile(it) })
                    "profile" -> ProfileScreen(
                        username = profileUsername,
                        me = me,
                        onBack = { goBack() },
                        onProfile = { goProfile(it) },
                        onChat = { chatWith = it },
                        onLogout = onLogout,
                        onAvatarChanged = { u -> me = u }
                    )
                }
            }

            NavigationBar(containerColor = Color.Black, contentColor = Color.White, tonalElevation = 0.dp) {
                NavigationBarItem(
                    selected = tab == "feed", onClick = { tab = "feed" },
                    icon = { Icon(Icons.Filled.Home, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "search", onClick = { tab = "search" },
                    icon = { Icon(Icons.Filled.Search, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "create", onClick = { tab = "create" },
                    icon = { Icon(Icons.Filled.AddBox, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "notifications", onClick = { tab = "notifications" },
                    icon = { Icon(Icons.Filled.FavoriteBorder, null) },
                    colors = navColors()
                )
                NavigationBarItem(
                    selected = tab == "profile", onClick = { tab = "profile" },
                    icon = { Icon(Icons.Filled.Person, null) },
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
    }
}

@Composable
private fun navColors() = NavigationBarItemDefaults.colors(
    selectedIconColor = Color.White,
    selectedTextColor = Color.White,
    unselectedIconColor = Color(0xFFB0B0B0),
    unselectedTextColor = Color(0xFFB0B0B0),
    indicatorColor = Color(0xFF1A1A1A)
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
