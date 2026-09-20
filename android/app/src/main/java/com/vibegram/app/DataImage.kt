package com.vibegram.app

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.ui.unit.dp
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
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import android.util.LruCache

/**
 * Decoded-image cache sized by BYTES, not by entry count.
 * The old `LruCache(60)` counted entries, so 60 full-screen bitmaps could pin hundreds of
 * MB and get the process killed; this caps the cache at 1/6 of the app's heap and reports
 * the real cost of each bitmap so big images evict first.
 */
private val bmpCache = object : LruCache<String, Bitmap>(
    ((Runtime.getRuntime().maxMemory() / 1024) / 6).toInt().coerceAtLeast(2048)
) {
    override fun sizeOf(key: String, value: Bitmap): Int = value.byteCount / 1024
}

/** Permanent-failure list, bounded so it cannot grow without limit. */
private val failedCache = java.util.LinkedHashSet<String>()

private fun rememberFailure(url: String) {
    if (failedCache.size > 200) failedCache.clear()
    failedCache.add(url)
}

/**
 * Renders media/avatars reliably:
 *  - "data:image/...;base64,..." -> manual Base64 decode + BitmapFactory (never fails silently)
 *  - http(s) urls -> Coil AsyncImage
 *  - null/blank/undecodable -> initial-letter fallback box
 */
@Composable
fun DataImage(
    url: String?,
    modifier: Modifier = Modifier,
    contentScale: ContentScale = ContentScale.Crop,
    fallbackLetter: String = "",
    circle: Boolean = true,
    fallbackSize: Int = 16
) {
    val shape = if (circle) androidx.compose.foundation.shape.CircleShape else androidx.compose.foundation.shape.RoundedCornerShape(4.dp)
    if (url.isNullOrBlank()) {
        if (fallbackLetter.isNotBlank()) {
            Box(
                modifier.background(Color(0xFF262626)).clip(shape),
                Alignment.Center
            ) {
                Text(
                    fallbackLetter.take(1).uppercase(),
                    color = Color(0xFFBBBBBB),
                    fontWeight = FontWeight.Bold,
                    fontSize = fallbackSize.sp
                )
            }
        }
        return
    }

    if (url.startsWith("data:image")) {
        val cached = bmpCache.get(url)
        if (cached != null) {
            Image(
                bitmap = cached.asImageBitmap(),
                contentDescription = null,
                contentScale = contentScale,
                modifier = modifier
            )
            return
        }
        var bmp by remember(url) { mutableStateOf<Bitmap?>(null) }
        var failed by remember(url) { mutableStateOf(failedCache.contains(url)) }
        LaunchedEffect(url) {
            if (failed) return@LaunchedEffect
            val decoded = withContext(Dispatchers.IO) {
                try {
                    val b64 = url.substringAfter("base64,", "")
                    if (b64.isEmpty()) null
                    else {
                        val bytes = Base64.decode(b64, Base64.DEFAULT)
                        val opts = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, opts)
                        var sample = 1
                        while (opts.outWidth / sample > 1600) sample *= 2
                        val o2 = BitmapFactory.Options().apply { inSampleSize = sample }
                        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, o2)
                    }
                } catch (_: Exception) { null }
            }
            if (decoded != null) {
                bmpCache.put(url, decoded)
                bmp = decoded
            } else {
                failed = true
                rememberFailure(url)
            }
        }
        val b = bmp
        if (b != null) {
            Image(
                bitmap = b.asImageBitmap(),
                contentDescription = null,
                contentScale = contentScale,
                modifier = modifier
            )
        } else if (failed) {
            Box(
                modifier.background(Color(0xFF262626)).clip(shape),
                Alignment.Center
            ) {
                Text(
                    fallbackLetter.take(1).uppercase().ifBlank { "•" },
                    color = Color(0xFFBBBBBB), fontWeight = FontWeight.Bold, fontSize = fallbackSize.sp
                )
            }
        } else {
            Box(modifier.background(Color(0xFF262626)))
        }
        return
    }

    // http(s) — crossfade so remote images fade in instead of popping
    AsyncImage(
        model = coil.request.ImageRequest.Builder(androidx.compose.ui.platform.LocalContext.current)
            .data(url)
            .crossfade(180)
            .build(),
        contentDescription = null,
        contentScale = contentScale,
        modifier = modifier
    )
}

