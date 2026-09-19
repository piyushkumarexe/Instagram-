package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.widget.VideoView
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

// Video player for base64/remote video media (posts, stories, reels)
@Composable
fun VideoPlayer(media: String, modifier: Modifier = Modifier, muted: Boolean = false, start: Boolean = true) {
    val ctx = LocalContext.current
    var file by remember(media) { mutableStateOf<File?>(null) }
    var failed by remember(media) { mutableStateOf(false) }

    LaunchedEffect(media) {
        file = withContext(Dispatchers.IO) {
            try {
                if (media.startsWith("data:")) {
                    val b64 = media.substringAfter("base64,", "")
                    if (b64.isEmpty()) null
                    else {
                        val bytes = android.util.Base64.decode(b64, android.util.Base64.DEFAULT)
                        val f = File(ctx.cacheDir, "vid_" + media.hashCode() + ".mp4")
                        if (!f.exists() || f.length() != bytes.size.toLong()) {
                            f.outputStream().use { it.write(bytes) }
                        }
                        f
                    }
                } else null
            } catch (_: Exception) { null }
        } ?: run { failed = media.isNotBlank(); null }
    }

    val f = file
    if (f != null) {
        AndroidView(
            factory = { c ->
                VideoView(c).apply {
                    setVideoURI(android.net.Uri.fromFile(f))
                    setOnPreparedListener { mp ->
                        mp.isLooping = true
                        if (muted) mp.setVolume(0f, 0f)
                        if (start) mp.start()
                    }
                }
            },
            update = { },
            modifier = modifier
        )
    } else if (failed) {
        Box(modifier.background(Color(0xFF111111)), Alignment.Center) {
            Text("Video unavailable", color = Color(0xFF8E8E8E), fontSize = 12.sp)
        }
    } else {
        Box(modifier.background(Color(0xFF111111)), Alignment.Center) {
            androidx.compose.material3.CircularProgressIndicator(
                modifier = Modifier.size(26.dp),
                color = Color.White,
                strokeWidth = 2.dp
            )
        }
    }
}
