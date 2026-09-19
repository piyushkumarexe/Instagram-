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
    val anthemArtist: String = ""
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
    val savedByMe: Boolean = false
)

data class VComment(
    val id: String,
    val userId: String,
    val username: String,
    val avatar: String?,
    val text: String,
    val createdAt: Long
)

data class VNotif(
    val id: String,
    val type: String,
    val postId: String?,
    val createdAt: Long
)

data class NotifRow(val notif: VNotif, val actor: VUser?)

data class ThreadInfo(val user: VUser, val lastText: String, val lastAt: Long)

data class VMsg(val id: String, val text: String, val fromMe: Boolean, val at: Long)

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
    val closeOnly: Boolean = false
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
        anthemArtist = getString("anthemArtist") ?: ""
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
        savedByMe = ((get("savedBy") as? List<*>)?.contains(Fb.uid) == true)
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
        createdAt = getTimestamp("createdAt")?.toDate()?.time ?: 0L
    )
}

data class Song(val title: String, val artist: String, val previewUrl: String, val artwork: String)
