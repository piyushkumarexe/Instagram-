package com.vibegram.app

import com.google.firebase.firestore.DocumentSnapshot

data class VUser(
    val id: String,
    val username: String,
    val name: String,
    val avatar: String?,
    val bio: String,
    val followersCount: Long,
    val followingCount: Long,
    val postsCount: Long,
    val verified: Boolean,
    val isPrivate: Boolean,
    val anthem: String = "",
    val anthemArtist: String = "",
    val link: String = "",
    val lastActive: Long = 0,
    val note: String = "",
    val createdAt: Long = 0,
    val blocked: List<String> = emptyList(),
    val mutedPosts: List<String> = emptyList(),
    val mutedStories: List<String> = emptyList(),
    val followedTags: List<String> = emptyList()
)

data class Post(
    val id: String,
    val userId: String,
    val username: String,
    val name: String,
    val avatar: String?,
    val verified: Boolean,
    val media: String,
    val isVideo: Boolean,
    val caption: String,
    val createdAt: Long,
    val likes: List<String>,
    val likesCount: Long,
    val commentsCount: Long,
    val savedByMe: Boolean = false,
    val repostedByMe: Boolean = false,
    val pinnedAt: Long = 0,
    val archived: Boolean = false,
    val commentsOff: Boolean = false,
    val hideLikes: Boolean = false,
    val views: Long = 0
)

data class VComment(
    val id: String,
    val userId: String,
    val username: String,
    val avatar: String?,
    val text: String,
    val createdAt: Long,
    val likes: List<String> = emptyList(),
    val likesCount: Long = 0
)

data class VNotif(
    val id: String,
    val type: String,
    val postId: String?,
    val createdAt: Long,
    val thumb: String? = null,
    val actorId: String? = null
)

data class NotifRow(val notif: VNotif, val actor: VUser?)

data class ThreadInfo(val user: VUser, val lastText: String, val lastAt: Long, val unread: Int = 0)

data class VMsg(
    val id: String,
    val text: String,
    val fromMe: Boolean,
    val at: Long,
    val fromId: String = "",
    val reaction: String? = null,
    val read: Boolean = false,
    val image: String? = null,
    val replyTo: String? = null,
    val replyName: String? = null
)

data class Story(
    val id: String,
    val media: String,
    val isVideo: Boolean,
    val at: Long,
    val overlayText: String? = null,
    val overlayFont: String? = null,
    val overlayColor: Long? = null,
    val overlayX: Float = 0.5f,
    val overlayY: Float = 0.5f,
    val musicTitle: String? = null,
    val musicUrl: String? = null,
    val closeOnly: Boolean = false,
    val likes: List<String> = emptyList(),
    val viewsCount: Long = 0
)

fun DocumentSnapshot.toVUser(): VUser? {
    if (!exists()) return null
    val uname = getString("username") ?: return null
    return VUser(
        id = id,
        username = uname,
        name = getString("name") ?: uname,
        avatar = getString("avatar")?.takeIf { it.isNotBlank() },
        bio = getString("bio") ?: "",
        followersCount = getLong("followersCount") ?: 0L,
        followingCount = getLong("followingCount") ?: 0L,
        postsCount = getLong("postsCount") ?: 0L,
        verified = (getBoolean("verified") ?: false) || Fb.VERIFIED_IDS.contains(id ?: ""),
        isPrivate = getBoolean("isPrivate") ?: false,
        anthem = getString("anthem") ?: "",
        anthemArtist = getString("anthemArtist") ?: "",
        link = getString("link") ?: "",
        lastActive = getLong("lastActive") ?: 0L,
        note = getString("note") ?: "",
        createdAt = getTimestamp("createdAt")?.toDate()?.time
            ?: getLong("createdAt") ?: 0L,
        blocked = (get("blocked") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
        mutedPosts = (get("mutedPosts") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
        mutedStories = (get("mutedStories") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
        followedTags = (get("followedTags") as? List<*>)?.filterIsInstance<String>() ?: emptyList()
    )
}

fun DocumentSnapshot.toPost(): Post? {
    val media = getString("media") ?: return null
    val userId = getString("userId") ?: return null
    @Suppress("UNCHECKED_CAST")
    val likes = get("likes") as? List<String> ?: emptyList()
    return Post(
        id = id,
        userId = userId,
        username = getString("username") ?: "?",
        name = getString("name") ?: "?",
        avatar = getString("avatar")?.takeIf { it.isNotBlank() },
        verified = (getBoolean("userVerified") ?: false) || Fb.VERIFIED_IDS.contains(getString("username") ?: ""),
        media = media,
        isVideo = getString("mediaType") == "video",
        caption = getString("caption") ?: "",
        createdAt = getTimestamp("createdAt")?.toDate()?.time ?: 0L,
        likes = likes,
        likesCount = getLong("likesCount") ?: 0L,
        commentsCount = getLong("commentsCount") ?: 0L,
        savedByMe = ((get("savedBy") as? List<*>)?.contains(Fb.uid) == true),
        repostedByMe = ((get("repostedBy") as? List<*>)?.contains(Fb.uid) == true),
        pinnedAt = getLong("pinnedAt") ?: 0L,
        archived = getBoolean("archived") ?: false,
        commentsOff = getBoolean("commentsOff") ?: false,
        hideLikes = getBoolean("hideLikes") ?: false,
        views = getLong("views") ?: 0L
    )
}

fun DocumentSnapshot.toComment(): VComment? {
    val userId = getString("userId") ?: return null
    return VComment(
        id = id,
        userId = userId,
        username = getString("username") ?: "?",
        avatar = getString("avatar")?.takeIf { it.isNotBlank() },
        text = getString("text") ?: "",
        createdAt = getTimestamp("createdAt")?.toDate()?.time ?: 0L,
        likes = get("likes") as? List<String> ?: emptyList(),
        likesCount = getLong("likesCount") ?: 0L
    )
}

data class Song(val title: String, val artist: String, val previewUrl: String, val artwork: String)
