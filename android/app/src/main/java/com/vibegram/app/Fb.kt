package com.vibegram.app

import android.graphics.Bitmap
import android.util.Base64
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FieldPath
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.tasks.await
import java.io.ByteArrayOutputStream
import kotlin.random.Random

const val WEB_CLIENT_ID = "861201865526-kqnu0docnn7sd6co04j29fo0rotnaroc.apps.googleusercontent.com"

// List-style reads MUST hit the server first: Firestore get() otherwise serves a
// locally-cached (possibly empty/stale) result forever and never re-syncs the query.
// SERVER first -> fresh data always when online; CACHE fallback keeps it working offline.
suspend fun Query.fresh(): com.google.firebase.firestore.QuerySnapshot =
    try { get(com.google.firebase.firestore.Source.SERVER).await() }
    catch (_: Exception) { get(com.google.firebase.firestore.Source.CACHE).await() }

object Fb {
    val auth: FirebaseAuth by lazy { FirebaseAuth.getInstance() }
    val db: FirebaseFirestore by lazy { FirebaseFirestore.getInstance() }
    val uid: String? get() = auth.currentUser?.uid

    // ---------- auth ----------
    suspend fun signInWithIdToken(idToken: String): String {
        val cred = GoogleAuthProvider.getCredential(idToken, null)
        val res = auth.signInWithCredential(cred).await()
        val u = res.user ?: throw Exception("Sign-in failed")
        val doc = db.collection("users").document(u.uid).get().await()
        if (!doc.exists()) {
            var uname = baseUsername(u.email)
            while (db.collection("usernames").document(uname).get().await().exists()) {
                uname = uname + Random.nextInt(10, 99)
            }
            val profile = hashMapOf<String, Any?>(
                "username" to uname,
                "name" to (u.displayName ?: uname),
                "email" to (u.email ?: ""),
                "avatar" to (u.photoUrl ?: ""),
                "bio" to "",
                "followersCount" to 0L,
                "followingCount" to 0L,
                "postsCount" to 0L,
                "createdAt" to FieldValue.serverTimestamp()
            )
            db.collection("users").document(u.uid).set(profile).await()
            db.collection("usernames").document(uname).set(hashMapOf("uid" to u.uid)).await()
        }
        return u.uid
    }

    private fun baseUsername(email: String?): String {
        val b = (email ?: "").substringBefore('@').lowercase()
            .filter { it.isLetterOrDigit() || it == '.' || it == '_' }
        return if (b.length >= 3) b else "user" + Random.nextInt(1000, 9999)
    }

    fun logout() = auth.signOut()

    // ---------- users ----------
    suspend fun me(retries: Int = 2): VUser? {
        val idv = uid ?: return null
        // 1) instant local cache (works fully offline)
        try {
            val snap = db.collection("users").document(idv)
                .get(com.google.firebase.firestore.Source.CACHE).await()
            if (snap.exists()) snap.toVUser()?.let { return it }
        } catch (_: Exception) { }
        // 2) network retries
        repeat(retries) { attempt ->
            try {
                val snap = db.collection("users").document(idv)
                    .get(com.google.firebase.firestore.Source.SERVER).await()
                if (snap.exists()) snap.toVUser()?.let { return it }
                return null
            } catch (_: Exception) {
                if (attempt == retries - 1) return null
                kotlinx.coroutines.delay(1000L * (attempt + 1))
            }
        }
        return null
    }

    // creates users/{uid} if missing (self-heal for failed auto-provision), then returns fresh profile
    suspend fun ensureMyDoc(): VUser? {
        val u = auth.currentUser ?: return null
        val ref = db.collection("users").document(u.uid)
        val doc = try { ref.get().await() } catch (_: Exception) { return null }
        if (doc.exists()) return doc.toVUser()
        var uname = baseUsername(u.email)
        var guard = 0
        while (guard < 6 && try { db.collection("usernames").document(uname).get().await().exists() } catch (_: Exception) { false }) {
            uname = uname + Random.nextInt(10, 99)
            guard++
        }
        val profile = hashMapOf<String, Any?>(
            "username" to uname,
            "name" to (u.displayName ?: uname),
            "email" to (u.email ?: ""),
            "avatar" to (u.photoUrl ?: ""),
            "bio" to "",
            "followersCount" to 0L,
            "followingCount" to 0L,
            "postsCount" to 0L,
            "createdAt" to FieldValue.serverTimestamp()
        )
        return try {
            ref.set(profile).await()
            db.collection("usernames").document(uname).set(hashMapOf("uid" to u.uid)).await()
            ref.get().await().toVUser()
        } catch (_: Exception) { null }
    }

    // instant placeholder from the signed-in Google account (never blocks UI)
    fun tempMe(): VUser {
        val u = auth.currentUser
        val name = u?.displayName ?: u?.email?.substringBefore("@") ?: "Me"
        val uname = (u?.displayName ?: "user").replace(" ", "").lowercase() + (u?.uid?.takeLast(4) ?: "")
        return VUser(u?.uid ?: "", uname, name, null, "", 0, 0, 0, false, false)
    }

    suspend fun userByUsername(uname: String): VUser? {
        val m = db.collection("usernames").document(uname.lowercase()).get().await()
        val uidv = m.getString("uid") ?: return null
        return db.collection("users").document(uidv).get().await().toVUser()
    }

    suspend fun searchUsers(q: String): List<VUser> {
        val clean = q.trim().lowercase().removePrefix("@")
        if (clean.isEmpty()) return emptyList()
        val out = LinkedHashMap<String, VUser>()
        try {
            val snap = db.collection("usernames")
                .orderBy(FieldPath.documentId())
                .startAt(clean).endAt(clean + "\uf8ff").limit(12).fresh()
            for (d in snap.documents) {
                val uidv = d.getString("uid") ?: continue
                val u = db.collection("users").document(uidv).get().await().toVUser() ?: continue
                out[u.id] = u
            }
        } catch (_: Exception) { }
        return out.values.toList()
    }

    suspend fun updateAvatar(bmp: Bitmap) {
        val idv = uid ?: return
        db.collection("users").document(idv).update("avatar", bmp.toDataUrl(320, 85)).await()
    }

    suspend fun updateProfile(name: String, bio: String, link: String = "") {
        val idv = uid ?: return
        db.collection("users").document(idv)
            .update("name", name.trim(), "bio", bio.trim(), "link", link.trim()).await()
    }

    // ---------- feed / posts ----------
    suspend fun feed(limit: Long = 12, before: Long? = null): List<Post> {
        var q = db.collection("posts").orderBy("createdAt", Query.Direction.DESCENDING)
        if (before != null) q = q.startAfter(java.util.Date(before))
        val snap = q.limit(limit).fresh()
        return snap.documents.mapNotNull { it.toPost() }
    }

    suspend fun userPosts(username: String): List<Post> {
        val snap = db.collection("posts").whereEqualTo("username", username).limit(60).fresh()
        return snap.documents.mapNotNull { it.toPost() }.sortedByDescending { it.createdAt }
    }

    suspend fun toggleLike(p: Post) {
        val idv = uid ?: return
        val ref = db.collection("posts").document(p.id)
        if (p.likes.contains(idv)) {
            ref.update("likes", FieldValue.arrayRemove(idv), "likesCount", FieldValue.increment(-1)).await()
        } else {
            ref.update("likes", FieldValue.arrayUnion(idv), "likesCount", FieldValue.increment(1)).await()
            pushNotify(p.userId, "like", p.id, p.media)
        }
    }

    suspend fun comments(postId: String): List<VComment> {
        val snap = db.collection("posts").document(postId).collection("comments")
            .orderBy("createdAt", Query.Direction.ASCENDING).limit(100).fresh()
        return snap.documents.mapNotNull { it.toComment() }
    }

        suspend fun addComment(p: Post, text: String, parent: VComment? = null) {
        val idv = uid ?: return
        val meDoc = db.collection("users").document(idv).get().await()
        val c = hashMapOf<String, Any?>(
            "userId" to idv,
            "username" to (meDoc.getString("username") ?: ""),
            "avatar" to (meDoc.getString("avatar") ?: ""),
            "text" to (if (parent != null) "@" + parent.username + " " else "") + text.take(1000),
            "createdAt" to FieldValue.serverTimestamp()
        )
        if (parent != null) {
            c["parentId"] = parent.id
            c["parentUsername"] = parent.username
        }
        db.collection("posts").document(p.id).collection("comments").add(c).await()
        db.collection("posts").document(p.id).update("commentsCount", FieldValue.increment(1)).await()
        if (p.userId != idv) pushNotify(p.userId, "comment", p.id, p.media)
    }

    suspend fun createPost(bmp: Bitmap, caption: String) {
        val idv = uid ?: return
        val meDoc = db.collection("users").document(idv).get().await()
        val p = hashMapOf<String, Any?>(
            "userId" to idv,
            "username" to (meDoc.getString("username") ?: ""),
            "name" to (meDoc.getString("name") ?: ""),
            "avatar" to (meDoc.getString("avatar") ?: ""),
            "userVerified" to (meDoc.getBoolean("verified") ?: false),
            "media" to bmp.toDataUrl(1080, 82),
            "mediaType" to "image",
            "type" to "post",
            "caption" to caption.take(2200),
            "createdAt" to FieldValue.serverTimestamp(),
            "likes" to emptyList<String>(),
            "likesCount" to 0L,
            "commentsCount" to 0L,
            "savedBy" to emptyList<String>()
        )
        db.collection("posts").add(p).await()
        db.collection("users").document(idv).update("postsCount", FieldValue.increment(1)).await()
    }

    // ---------- follows ----------
    suspend fun isFollowing(targetId: String): Boolean {
        val idv = uid ?: return false
        return db.collection("follows").document("${idv}_${targetId}").get().await().exists()
    }

    /** returns true if follow succeeded, false if a request was sent (private account) */
    suspend fun follow(target: VUser, want: Boolean): Boolean {
        val idv = uid ?: return true
        val key = "${idv}_${target.id}"
        if (want) {
            if (target.isPrivate) {
                db.collection("requests").document("${idv}__${target.id}")
                    .set(hashMapOf("fromId" to idv, "toId" to target.id, "createdAt" to FieldValue.serverTimestamp()))
                    .await()
                pushNotify(target.id, "follow_request", null, null)
                return false
            }
            db.collection("follows").document(key)
                .set(hashMapOf("followerId" to idv, "followingId" to target.id, "createdAt" to FieldValue.serverTimestamp()))
                .await()
            db.collection("users").document(idv).update("followingCount", FieldValue.increment(1)).await()
            db.collection("users").document(target.id).update("followersCount", FieldValue.increment(1)).await()
            pushNotify(target.id, "follow", null, null)
            return true
        } else {
            db.collection("follows").document(key).delete().await()
            db.collection("users").document(idv).update("followingCount", FieldValue.increment(-1)).await()
            db.collection("users").document(target.id).update("followersCount", FieldValue.increment(-1)).await()
            return true
        }
    }

    private suspend fun pushNotify(toId: String, type: String, postId: String?, thumb: String?) {
        val idv = uid ?: return
        if (toId == idv) return
        db.collection("notifications").document().set(
            hashMapOf<String, Any?>(
                "userId" to toId, "actorId" to idv, "type" to type,
                "postId" to postId, "postThumb" to thumb, "read" to false,
                "createdAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    // ---------- notifications ----------
    suspend fun notifications(): List<NotifRow> {
        val idv = uid ?: return emptyList()
        val snap = db.collection("notifications").whereEqualTo("userId", idv).limit(40).fresh()
        val docs = snap.documents.sortedByDescending { it.getTimestamp("createdAt")?.toDate()?.time ?: 0L }
        val out = mutableListOf<NotifRow>()
        for (d in docs) {
            val actorId = d.getString("actorId") ?: continue
            val actor = try { db.collection("users").document(actorId).get().await().toVUser() } catch (_: Exception) { null }
            out.add(
                NotifRow(
                    notif = VNotif(d.id, d.getString("type") ?: "", d.getString("postId"), d.getTimestamp("createdAt")?.toDate()?.time ?: 0L),
                    actor = actor
                )
            )
        }
        return out
    }

    // ---------- stories ----------
    suspend fun stories(): Map<VUser, List<Story>> {
        val cutoff = System.currentTimeMillis() - 24L * 3600 * 1000
        val snap = db.collection("stories")
            .orderBy("createdAt", Query.Direction.DESCENDING).limit(60).fresh()
        val groups = LinkedHashMap<String, MutableList<Story>>()
        val users = LinkedHashMap<String, VUser>()
        for (d in snap.documents) {
            val at = d.getTimestamp("createdAt")?.toDate()?.time ?: continue
            if (at < cutoff) continue
            val uidv = d.getString("userId") ?: continue
            if (!users.containsKey(uidv)) {
                users[uidv] = VUser(
                    id = uidv, username = d.getString("username") ?: "?", name = d.getString("username") ?: "?",
                    avatar = d.getString("avatar"), bio = "", 0, 0, 0, false, false
                )
                groups[uidv] = mutableListOf()
            }
            groups[uidv]?.add(
                Story(
                    d.id, d.getString("media") ?: "", d.getString("mediaType") == "video", at,
                    overlayText = d.getString("overlayText"),
                    overlayFont = d.getString("overlayFont"),
                    overlayColor = (d.getLong("overlayColor") ?: 0xFFFFFFFFL).takeIf { d.getString("overlayText") != null },
                    overlayX = (d.getDouble("overlayX") ?: 0.5).toFloat(),
                    overlayY = (d.getDouble("overlayY") ?: 0.5).toFloat(),
                    musicTitle = d.getString("musicTitle"),
                    musicUrl = d.getString("musicUrl"),
                    closeOnly = d.getBoolean("closeOnly") ?: false,
                    likes = d.get("likes") as? List<String> ?: emptyList(),
                    viewsCount = d.getLong("viewsCount") ?: 0L
                )
            )
        }
        val out = LinkedHashMap<VUser, List<Story>>()
        for ((k, v) in groups) {
            val u = users[k] ?: continue
            if (k == uid) { out[u] = v; continue }
            val anyClose = v.any { it.closeOnly }
            var visible = true
            if (anyClose) {
                val cf = try { db.collection("users").document(k).get().await().get("closeFriends") as? List<String> ?: emptyList() } catch (_: Exception) { emptyList<String>() }
                visible = cf.contains(Fb.auth.currentUser?.uid ?: "")
            }
            if (visible && u.isPrivate) {
                val myId = uid ?: ""
                visible = myId.isNotEmpty() && try { db.collection("follows").document("${myId}_$k").get().await().exists() } catch (_: Exception) { false }
            }
            if (visible) out[u] = v
        }
        return out
    }

    suspend fun addStoryFull(
        media: String,
        overlayText: String? = null,
        overlayFont: String? = null,
        overlayColor: Long? = null,
        overlayX: Float = 0.5f,
        overlayY: Float = 0.5f,
        musicTitle: String? = null,
        musicUrl: String? = null,
        closeOnly: Boolean = false
    ) {
        val idv = uid ?: return
        val meDoc = db.collection("users").document(idv).get().await()
        db.collection("stories").add(
            hashMapOf<String, Any?>(
                "userId" to idv,
                "username" to (meDoc.getString("username") ?: ""),
                "avatar" to (meDoc.getString("avatar") ?: ""),
                "media" to media,
                "mediaType" to "image",
                "overlayText" to overlayText,
                "overlayFont" to overlayFont,
                "overlayColor" to overlayColor,
                "overlayX" to overlayX.toDouble(),
                "overlayY" to overlayY.toDouble(),
                "musicTitle" to musicTitle,
                "musicUrl" to musicUrl,
                "closeOnly" to closeOnly,
                "createdAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    suspend fun addStoryUrl(media: String) {
        val idv = uid ?: return
        val meDoc = db.collection("users").document(idv).get().await()
        db.collection("stories").add(
            hashMapOf<String, Any?>(
                "userId" to idv,
                "username" to (meDoc.getString("username") ?: ""),
                "avatar" to (meDoc.getString("avatar") ?: ""),
                "media" to media,
                "mediaType" to "image",
                "createdAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    suspend fun addStory(bmp: Bitmap) {
        val idv = uid ?: return
        val meDoc = db.collection("users").document(idv).get().await()
        db.collection("stories").add(
            hashMapOf<String, Any?>(
                "userId" to idv,
                "username" to (meDoc.getString("username") ?: ""),
                "avatar" to (meDoc.getString("avatar") ?: ""),
                "media" to bmp.toDataUrl(1080, 82),
                "mediaType" to "image",
                "createdAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    // ---------- dms ----------
    fun pairId(a: String, b: String) = listOf(a, b).sorted().joinToString("__")

    suspend fun threads(): List<ThreadInfo> {
        val idv = uid ?: return emptyList()
        val snap = db.collection("dms").whereArrayContains("uids", idv).limit(50).fresh()
        val out = mutableListOf<ThreadInfo>()
        for (d in snap.documents) {
            @Suppress("UNCHECKED_CAST")
            val uids = (d.get("uids") as? List<String>) ?: continue
            val other = uids.firstOrNull { it != idv } ?: continue
            val ud = db.collection("users").document(other).get().await()
            val u = ud.toVUser() ?: VUser(other, "unknown", "Unknown", null, "", 0, 0, 0, false, false)
            val myField = if (uids.firstOrNull() == idv) "unreadA" else "unreadB"
            out.add(ThreadInfo(u, d.getString("lastText") ?: "", d.getTimestamp("lastAt")?.toDate()?.time ?: 0L, (d.getLong(myField) ?: 0L).toInt()))
        }
        return out.sortedByDescending { it.lastAt }
    }

    suspend fun messages(otherId: String): List<VMsg> {
        val idv = uid ?: return emptyList()
        val pid = pairId(idv, otherId)
        val snap = db.collection("dms").document(pid).collection("messages")
            .orderBy("createdAt", Query.Direction.ASCENDING).limit(200).fresh()
        return snap.documents.mapNotNull { d ->
            val at = d.getTimestamp("createdAt")?.toDate()?.time ?: return@mapNotNull null
            VMsg(d.id, d.getString("text") ?: "", d.getString("from") == idv, at, d.getString("from") ?: "", d.getString("reaction"), d.getBoolean("read") ?: false)
        }
    }

    suspend fun sendDm(otherId: String, text: String) {
        val idv = uid ?: return
        val pid = pairId(idv, otherId)
        db.collection("dms").document(pid).collection("messages").add(
            hashMapOf<String, Any?>(
                "from" to idv, "to" to otherId, "text" to text.take(2000),
                "createdAt" to FieldValue.serverTimestamp(), "read" to false
            )
        ).await()
        val myField = if (pid.split("__")[0] == idv) "unreadA" else "unreadB"
        val otherField = if (myField == "unreadA") "unreadB" else "unreadA"
        db.collection("dms").document(pid).set(
            hashMapOf<String, Any?>(
                "uids" to listOf(idv, otherId).sorted(),
                "lastText" to text.take(2000),
                "lastAt" to FieldValue.serverTimestamp(),
                "lastFrom" to idv,
                otherField to FieldValue.increment(1)
            ),
            SetOptions.merge()
        ).await()
    }
    suspend fun deleteStory(storyId: String) {
        db.collection("stories").document(storyId).delete().await()
    }

    suspend fun viewStory(storyId: String) {
        val idv = uid ?: return
        val ref = db.collection("stories").document(storyId)
        ref.update("views", FieldValue.arrayUnion(idv)).await()
        try {
            val v = ref.get().await().get("views") as? List<String> ?: emptyList()
            ref.update("viewsCount", v.size.toLong()).await()
        } catch (_: Exception) { }
    }

    suspend fun storyViewers(storyId: String): List<VUser> {
        val views = db.collection("stories").document(storyId).get().await().get("views") as? List<String> ?: emptyList()
        return views.take(50).mapNotNull { id ->
            try { db.collection("users").document(id).get().await().toVUser() } catch (_: Exception) { null }
        }
    }

    suspend fun likeStory(storyId: String, ownerId: String): Boolean? {
        val idv = uid ?: return null
        val ref = db.collection("stories").document(storyId)
        val liked = (ref.get().await().get("likes") as? List<String> ?: emptyList()).contains(idv)
        if (liked) ref.update("likes", FieldValue.arrayRemove(idv)).await()
        else {
            ref.update("likes", FieldValue.arrayUnion(idv)).await()
            if (ownerId != idv) {
                db.collection("notifications").document().set(
                    hashMapOf<String, Any?>("userId" to ownerId, "actorId" to idv, "type" to "story_like", "postId" to null, "read" to false, "createdAt" to FieldValue.serverTimestamp())
                ).await()
            }
        }
        return !liked
    }

    suspend fun touchPresence() {
        val idv = uid ?: return
        try { db.collection("users").document(idv).update("lastActive", System.currentTimeMillis()).await() } catch (_: Exception) { }
    }

    suspend fun unreadDmCount(): Int {
        val idv = uid ?: return 0
        val snap = db.collection("dms").whereArrayContains("uids", idv).limit(50).fresh()
        var n = 0
        for (d in snap.documents) {
            val myField = if ((d.get("uids") as? List<String>)?.firstOrNull() == idv) "unreadA" else "unreadB"
            n += (d.getLong(myField) ?: 0L).toInt()
        }
        return n
    }

    suspend fun markThreadRead(otherId: String) {
        val idv = uid ?: return
        val pid = pairId(idv, otherId)
        val myField = if (pid.split("__")[0] == idv) "unreadA" else "unreadB"
        db.collection("dms").document(pid).set(
            hashMapOf<String, Any?>(myField to 0, "uids" to listOf(idv, otherId).sorted()),
            SetOptions.merge()
        ).await()
    }

    suspend fun unreadNotifCount(): Int {
        val idv = uid ?: return 0
        val snap = db.collection("notifications").whereEqualTo("userId", idv).whereEqualTo("read", false).limit(30).fresh()
        return snap.size()
    }

    suspend fun markNotifsRead() {
        val idv = uid ?: return
        val snap = db.collection("notifications").whereEqualTo("userId", idv).whereEqualTo("read", false).limit(30).fresh()
        for (d in snap.documents) d.reference.update("read", true).await()
    }

    suspend fun likedBy(postId: String): List<VUser> {
        val likes = db.collection("posts").document(postId).get().await().get("likes") as? List<String> ?: emptyList()
        return likes.take(50).mapNotNull { id ->
            try { db.collection("users").document(id).get().await().toVUser() } catch (_: Exception) { null }
        }
    }

    suspend fun repost(post: Post, on: Boolean): Boolean? {
        val idv = uid ?: return null
        val ref = db.collection("posts").document(post.id)
        if (on) {
            ref.update("repostedBy", FieldValue.arrayUnion(idv)).await()
            if (post.userId != idv) {
                db.collection("notifications").document().set(
                    hashMapOf<String, Any?>("userId" to post.userId, "actorId" to idv, "type" to "repost", "postId" to post.id, "read" to false, "createdAt" to FieldValue.serverTimestamp())
                ).await()
            }
        } else ref.update("repostedBy", FieldValue.arrayRemove(idv)).await()
        return on
    }

    suspend fun repostedPosts(): List<Post> {
        val idv = uid ?: return emptyList()
        val snap = db.collection("posts").whereArrayContains("repostedBy", idv).limit(30).fresh()
        return snap.documents.mapNotNull { it.toPost() }.sortedByDescending { it.createdAt }
    }

    suspend fun getPostById(postId: String): Post? {
        return try { db.collection("posts").document(postId).get().await().toPost() } catch (_: Exception) { null }
    }

    suspend fun updateCaption(postId: String, caption: String) {
        db.collection("posts").document(postId).update("caption", caption.trim().take(2200)).await()
    }

    suspend fun likeComment(postId: String, commentId: String): Boolean? {
        val idv = uid ?: return null
        val ref = db.collection("posts").document(postId).collection("comments").document(commentId)
        val liked = (ref.get().await().get("likes") as? List<String> ?: emptyList()).contains(idv)
        ref.update(
            "likes", if (liked) FieldValue.arrayRemove(idv) else FieldValue.arrayUnion(idv),
            "likesCount", FieldValue.increment(if (liked) -1 else 1)
        ).await()
        return !liked
    }

    suspend fun deleteComment(postId: String, commentId: String) {
        db.collection("posts").document(postId).collection("comments").document(commentId).delete().await()
    }

    suspend fun reactToMessage(otherId: String, msgId: String, emoji: String?) {
        val idv = uid ?: return
        val pid = pairId(idv, otherId)
        val ref = db.collection("dms").document(pid).collection("messages").document(msgId)
        if (emoji == null) ref.update("reaction", FieldValue.delete()).await()
        else ref.update("reaction", emoji).await()
    }

    suspend fun unsendMessage(otherId: String, msgId: String) {
        val idv = uid ?: return
        val pid = pairId(idv, otherId)
        db.collection("dms").document(pid).collection("messages").document(msgId).delete().await()
    }

    suspend fun deletePost(postId: String) {
        try {
            val cs = db.collection("posts").document(postId).collection("comments").limit(100).fresh()
            for (c in cs.documents) c.reference.delete().await()
        } catch (_: Exception) { }
        db.collection("posts").document(postId).delete().await()
    }

    suspend fun suggestions(): List<VUser> {
        val idv = uid ?: return emptyList()
        val mine = followingOf(idv).map { it.id }.toSet()
        val snap = db.collection("users").limit(25).fresh()
        val out = mutableListOf<VUser>()
        for (d in snap.documents) {
            if (d.id == idv || mine.contains(d.id)) continue
            d.toVUser()?.let { out.add(it) }
            if (out.size >= 12) break
        }
        return out
    }

    suspend fun toggleCloseFriend(target: String, on: Boolean) {
        val idv = uid ?: return
        val ref = db.collection("users").document(idv)
        if (on) ref.update("closeFriends", FieldValue.arrayUnion(target)).await()
        else ref.update("closeFriends", FieldValue.arrayRemove(target)).await()
    }

    suspend fun closeFriendIds(): List<String> {
        val idv = uid ?: return emptyList()
        return db.collection("users").document(idv).get().await().get("closeFriends") as? List<String> ?: emptyList()
    }

    suspend fun setUserVerified(username: String, v: Boolean) {
        val uidv = db.collection("usernames").document(username.lowercase().trim()).get().await()
            .getString("uid") ?: return
        db.collection("users").document(uidv).update("verified", v).await()
    }

    suspend fun toggleSave(postId: String): Boolean? {
        val idv = uid ?: return null
        val ref = db.collection("users").document(idv)
        val cur = ref.get().await().get("saved") as? List<String> ?: emptyList()
        val has = cur.contains(postId)
        if (has) ref.update("saved", FieldValue.arrayRemove(postId)).await()
        else ref.update("saved", FieldValue.arrayUnion(postId)).await()
        return !has
    }

    suspend fun savedPosts(): List<Post> {
        val idv = uid ?: return emptyList()
        val saved = db.collection("users").document(idv).get().await().get("saved") as? List<String> ?: emptyList()
        val out = mutableListOf<Post>()
        for (id in saved.take(30)) {
            try { db.collection("posts").document(id).get().await().toPost()?.let { out.add(it) } } catch (_: Exception) { }
        }
        return out
    }

    suspend fun setPrivateMe(v: Boolean) {
        val idv = uid ?: return
        db.collection("users").document(idv).update("isPrivate", v).await()
    }

    // ---------- v5.4 full parity ----------
    val VERIFIED_IDS = setOf("bot-aarav", "bot-priya", "bot-rohan", "bot-ishani", "bot-karan")

    suspend fun listRequests(): List<Pair<String, VUser>> {
        val idv = uid ?: return emptyList()
        val snap = db.collection("requests").whereEqualTo("toId", idv).limit(30).fresh()
        val out = mutableListOf<Pair<String, VUser>>()
        for (d in snap.documents) {
            val fid = d.getString("fromId") ?: continue
            val u = try { db.collection("users").document(fid).get().await().toVUser() } catch (_: Exception) { null } ?: continue
            out.add(d.id to u)
        }
        return out
    }

    suspend fun acceptRequest(reqId: String, requester: VUser) {
        val idv = uid ?: return
        db.collection("requests").document(reqId).delete().await()
        db.collection("follows").document("${requester.id}_${idv}")
            .set(hashMapOf("followerId" to requester.id, "followingId" to idv, "createdAt" to FieldValue.serverTimestamp()))
            .await()
        db.collection("users").document(requester.id).update("followingCount", FieldValue.increment(1)).await()
        db.collection("users").document(idv).update("followersCount", FieldValue.increment(1)).await()
        db.collection("notifications").document().set(
            hashMapOf<String, Any?>("userId" to idv, "actorId" to requester.id, "type" to "follow", "postId" to null, "read" to false, "createdAt" to FieldValue.serverTimestamp())
        ).await()
        db.collection("notifications").document().set(
            hashMapOf<String, Any?>("userId" to requester.id, "actorId" to idv, "type" to "follow_accept", "postId" to null, "read" to false, "createdAt" to FieldValue.serverTimestamp())
        ).await()
    }

    suspend fun deleteRequest(reqId: String) {
        db.collection("requests").document(reqId).delete().await()
    }

    // cached non-suspend check (best-effort)
    @Volatile var lastRequestCheck: Pair<String, Boolean>? = null
    fun amRequestingSync(targetId: String): Boolean {
        val c = lastRequestCheck
        return c?.first == targetId && c.second
    }

    suspend fun amRequesting(targetId: String): Boolean {
        val idv = uid ?: return false
        val r = try { db.collection("requests").document("${idv}__${targetId}").get().await().exists() } catch (_: Exception) { false }
        lastRequestCheck = targetId to r
        return r
    }

    suspend fun followersOf(targetUid: String): List<VUser> {
        val snap = db.collection("follows").whereEqualTo("followingId", targetUid).limit(100).fresh()
        val ids = snap.documents.mapNotNull { it.getString("followerId") }.filter { it != targetUid }
        return ids.take(30).mapNotNull { id -> try { db.collection("users").document(id).get().await().toVUser() } catch (_: Exception) { null } }
    }

    suspend fun followingOf(targetUid: String): List<VUser> {
        val snap = db.collection("follows").whereEqualTo("followerId", targetUid).limit(100).fresh()
        val ids = snap.documents.mapNotNull { it.getString("followingId") }.filter { it != targetUid }
        return ids.take(30).mapNotNull { id -> try { db.collection("users").document(id).get().await().toVUser() } catch (_: Exception) { null } }
    }

    suspend fun explorePosts(): List<Post> {
        val snap = db.collection("posts")
            .orderBy("createdAt", Query.Direction.DESCENDING).limit(48).fresh()
        return snap.documents.mapNotNull { it.toPost() }
    }

    suspend fun updateAnthem(title: String, artist: String, url: String) {
        val idv = uid ?: return
        db.collection("users").document(idv)
            .update("anthem", title.trim(), "anthemArtist", artist.trim(), "anthemUrl", url.trim()).await()
    }

    suspend fun itunesSearch(term: String): List<Song> = kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.IO) {
        try {
            val u = java.net.URL("https://itunes.apple.com/search?term=" +
                java.net.URLEncoder.encode(term, "UTF-8") + "&media=music&entity=song&limit=25")
            val conn = u.openConnection() as java.net.HttpURLConnection
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.setRequestProperty("User-Agent", "VibeGram/1.0")
            val body = conn.inputStream.bufferedReader().readText()
            val arr = org.json.JSONObject(body).getJSONArray("results")
            val out = mutableListOf<Song>()
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                val track = o.optString("trackName")
                val artist = o.optString("artistName")
                val preview = o.optString("previewUrl")
                val art = o.optString("artworkUrl100")
                if (track.isNotEmpty() && preview.isNotEmpty()) out.add(Song(track, artist, preview, art))
            }
            out
        } catch (e: Exception) {
            emptyList()
        }
    }

}

fun Bitmap.toDataUrl(max: Int = 1080, quality: Int = 82): String {
    val scale = minOf(1f, max.toFloat() / maxOf(width, height).toFloat())
    val w = (width * scale).toInt().coerceAtLeast(1)
    val h = (height * scale).toInt().coerceAtLeast(1)
    val b = Bitmap.createScaledBitmap(this, w, h, true)
    val bos = ByteArrayOutputStream()
    b.compress(Bitmap.CompressFormat.JPEG, quality, bos)
    return "data:image/jpeg;base64," + Base64.encodeToString(bos.toByteArray(), Base64.NO_WRAP)
}

