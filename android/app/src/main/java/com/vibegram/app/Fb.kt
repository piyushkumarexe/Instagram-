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
    suspend fun me(): VUser? {
        val idv = uid ?: return null
        return db.collection("users").document(idv).get().await().toVUser()
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
                .startAt(clean).endAt(clean + "\uf8ff").limit(12).get().await()
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

    suspend fun updateProfile(name: String, bio: String) {
        val idv = uid ?: return
        db.collection("users").document(idv)
            .update("name", name.trim(), "bio", bio.trim()).await()
    }

    // ---------- feed / posts ----------
    suspend fun feed(): List<Post> {
        val snap = db.collection("posts")
            .orderBy("createdAt", Query.Direction.DESCENDING).limit(30).get().await()
        return snap.documents.mapNotNull { it.toPost() }
    }

    suspend fun userPosts(username: String): List<Post> {
        val snap = db.collection("posts").whereEqualTo("username", username).limit(60).get().await()
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
            .orderBy("createdAt", Query.Direction.ASCENDING).limit(100).get().await()
        return snap.documents.mapNotNull { it.toComment() }
    }

    suspend fun addComment(p: Post, text: String) {
        val idv = uid ?: return
        val meDoc = db.collection("users").document(idv).get().await()
        val c = hashMapOf<String, Any?>(
            "userId" to idv,
            "username" to (meDoc.getString("username") ?: ""),
            "avatar" to (meDoc.getString("avatar") ?: ""),
            "text" to text.take(1000),
            "createdAt" to FieldValue.serverTimestamp()
        )
        db.collection("posts").document(p.id).collection("comments").add(c).await()
        db.collection("posts").document(p.id).update("commentsCount", FieldValue.increment(1)).await()
        pushNotify(p.userId, "comment", p.id, p.media)
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
        val snap = db.collection("notifications").whereEqualTo("userId", idv).limit(40).get().await()
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
            .orderBy("createdAt", Query.Direction.DESCENDING).limit(60).get().await()
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
            groups[uidv]?.add(Story(d.id, d.getString("media") ?: "", d.getString("mediaType") == "video", at))
        }
        val out = LinkedHashMap<VUser, List<Story>>()
        for ((k, v) in groups) users[k]?.let { out[it] = v }
        return out
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
        val snap = db.collection("dms").whereArrayContains("uids", idv).limit(50).get().await()
        val out = mutableListOf<ThreadInfo>()
        for (d in snap.documents) {
            @Suppress("UNCHECKED_CAST")
            val uids = (d.get("uids") as? List<String>) ?: continue
            val other = uids.firstOrNull { it != idv } ?: continue
            val ud = db.collection("users").document(other).get().await()
            val u = ud.toVUser() ?: VUser(other, "unknown", "Unknown", null, "", 0, 0, 0, false, false)
            out.add(ThreadInfo(u, d.getString("lastText") ?: "", d.getTimestamp("lastAt")?.toDate()?.time ?: 0L))
        }
        return out.sortedByDescending { it.lastAt }
    }

    suspend fun messages(otherId: String): List<VMsg> {
        val idv = uid ?: return emptyList()
        val pid = pairId(idv, otherId)
        val snap = db.collection("dms").document(pid).collection("messages")
            .orderBy("createdAt", Query.Direction.ASCENDING).limit(200).get().await()
        return snap.documents.mapNotNull { d ->
            val at = d.getTimestamp("createdAt")?.toDate()?.time ?: return@mapNotNull null
            VMsg(d.id, d.getString("text") ?: "", d.getString("from") == idv, at)
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
