package com.vibegram.app

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private val storyFonts = listOf(
    "Default" to FontFamily.SansSerif,
    "Typewriter" to FontFamily.Monospace,
    "Serif" to FontFamily.Serif,
    "Neon" to FontFamily.Cursive
)
private val storyColors = listOf(
    0xFFFFFFFF, 0xFF000000, 0xFFF5D90A, 0xFFE1306C, 0xFF00C853, 0xFF2979FF, 0xFFAA66CC
)

// IG-style story composer: preview + text (fonts/colors, draggable) + music + close friends + share
@Composable
fun StoryComposer(
    imageUri: android.net.Uri,
    onPublished: () -> Unit,
    onCancel: () -> Unit
) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()

    var bmp by remember { mutableStateOf<Bitmap?>(null) }
    LaunchedEffect(imageUri) {
        bmp = withContext(Dispatchers.IO) {
            try {
                // downsample decode — full-size camera photos cause OOM crashes
                val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                ctx.contentResolver.openInputStream(imageUri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
                var sample = 1
                while (bounds.outWidth / (sample * 2) >= 1440 || bounds.outHeight / (sample * 2) >= 1440) sample *= 2
                val o2 = BitmapFactory.Options().apply { inSampleSize = sample }
                ctx.contentResolver.openInputStream(imageUri)?.use { BitmapFactory.decodeStream(it, null, o2) }
            } catch (_: Exception) { null }
        }
    }

    var busy by remember { mutableStateOf(false) }
    var textOpen by remember { mutableStateOf(false) }
    var text by remember { mutableStateOf("") }
    var fontIdx by remember { mutableStateOf(0) }
    var colorIdx by remember { mutableStateOf(0) }
    var textOffset by remember { mutableStateOf(Offset(0.5f, 0.42f)) }
    var song by remember { mutableStateOf<Song?>(null) }
    var songSheet by remember { mutableStateOf(false) }
    var closeOnly by remember { mutableStateOf(false) }
    var pollOn by remember { mutableStateOf(false) }
    var pollQ by remember { mutableStateOf("") }
    var pollA by remember { mutableStateOf("") }
    var pollB by remember { mutableStateOf("") }

    fun publish() {
        val b = bmp ?: return
        if (busy) return
        busy = true
        scope.launch {
            try {
                var maxW = 1080
                var q = 82
                var media = withContext(Dispatchers.IO) { b.toDataUrl(maxW, q) }
                var guard = 0
                while (media.length > 850_000 && guard < 4) {
                    maxW -= 150; q -= 10; guard++
                    media = withContext(Dispatchers.IO) { b.toDataUrl(maxW, q) }
                }
                Fb.addStoryFull(
                    media = media,
                    overlayText = text.takeIf { it.isNotBlank() },
                    overlayFont = storyFonts[fontIdx].first,
                    overlayColor = storyColors[colorIdx],
                    overlayX = textOffset.x,
                    overlayY = textOffset.y,
                    musicTitle = song?.let { it.title + " · " + it.artist },
                    musicUrl = song?.previewUrl,
                    closeOnly = closeOnly,
                    pollQ = pollQ.trim().takeIf { pollOn && it.isNotBlank() },
                    pollA = pollA.trim().takeIf { pollOn && it.isNotBlank() },
                    pollB = pollB.trim().takeIf { pollOn && it.isNotBlank() }
                )
                onPublished()
            } catch (e: Exception) {
                android.widget.Toast.makeText(ctx, "Could not share story: " + (e.message ?: "try again"), android.widget.Toast.LENGTH_LONG).show()
                busy = false
            }
        }
    }

    Box(Modifier.fillMaxSize().background(Color.Black)) {
        // preview
        val b = bmp
        if (b == null) {
            Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator(color = Color.White) }
        } else {
            Image(
                bitmap = b.asImageBitmap(),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                modifier = Modifier.fillMaxSize()
            )
        }

        // draggable text overlay
        if (!textOpen && text.isNotBlank()) {
            BoxWithConstraints(Modifier.fillMaxSize()) {
                Text(
                    text,
                    color = Color(storyColors[colorIdx]),
                    fontFamily = storyFonts[fontIdx].second,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    lineHeight = 32.sp,
                    modifier = Modifier
                        .fillMaxWidth(0.86f)
                        .offset(
                            x = maxWidth * textOffset.x - maxWidth * 0.43f,
                            y = maxHeight * textOffset.y
                        )
                        .pointerInput(Unit) {
                            detectDragGestures { change, dragAmount ->
                                change.consume()
                                textOffset = Offset(
                                    (textOffset.x + dragAmount.x / size.width).coerceIn(0.08f, 0.92f),
                                    (textOffset.y + dragAmount.y / size.height).coerceIn(0.06f, 0.94f)
                                )
                            }
                        }
                )
            }
        }

        // top bar
        Row(
            Modifier.fillMaxWidth().statusBarsPadding().padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onCancel) {
                Icon(androidx.compose.ui.res.painterResource(R.drawable.ic_x), null, tint = Color.White, modifier = Modifier.size(22.dp))
            }
            Spacer(Modifier.width(6.dp))
            // audience chip
            Box(
                Modifier.background(Color(0x66000000), RoundedCornerShape(16.dp))
                    .clickable { closeOnly = !closeOnly }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Text(if (closeOnly) "💚 Close friends" else "🌍 Everyone", color = Color.White, fontSize = 13.sp)
            }
            Box(Modifier.weight(1f))
            Button(
                onClick = { publish() },
                enabled = bmp != null && !busy,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.height(38.dp)
            ) {
                if (busy) CircularProgressIndicator(Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                else Text("Share", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
        }

        // bottom tools
        Column(
            Modifier.align(Alignment.BottomCenter).fillMaxWidth()
                .background(Color(0x33000000))
                .navigationBarsPadding()
                .padding(horizontal = 10.dp, vertical = 10.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // text tool
                Box(
                    Modifier.size(46.dp).background(Color(0xFF262626), CircleShape),
                    contentAlignment = Alignment.Center
                ) { Text("Aa", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp, modifier = Modifier.clickable { textOpen = true }) }
                Spacer(Modifier.width(12.dp))
                // music tool
                Box(
                    Modifier.size(46.dp).background(if (song == null) Color(0xFF262626) else Color(0xFF1B5E20), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("🎵", fontSize = 19.sp, modifier = Modifier.clickable { songSheet = true })
                }
                Spacer(Modifier.width(12.dp))
                // v7.6: poll sticker tool
                Box(
                    Modifier.size(46.dp).background(if (pollOn) Color(0xFF1B3A5E) else Color(0xFF262626), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("📊", fontSize = 18.sp, modifier = Modifier.clickable { pollOn = !pollOn })
                }
                if (song != null) {
                    Spacer(Modifier.width(8.dp))
                    Text(song!!.title, color = Color.White, fontSize = 12.sp, modifier = Modifier.weight(1f), maxLines = 1)
                    Text("✕", color = Color(0xFFBBBBBB), fontSize = 15.sp, modifier = Modifier.clickable { song = null }.padding(6.dp))
                } else {
                    Spacer(Modifier.width(8.dp))
                    Text("Add music", color = Color(0xFFCCCCCC), fontSize = 12.sp)
                }
                Box(Modifier.weight(1f))
                // instant share
                Text(
                    "Share now",
                    color = Color(0xFF0095F6),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier
                        .clickable { publish() }
                        .padding(10.dp)
                )
            }
            if (pollOn) {
                Spacer(Modifier.height(8.dp))
                androidx.compose.material3.OutlinedTextField(
                    value = pollQ,
                    onValueChange = { pollQ = it.take(90) },
                    placeholder = { Text("Ask a question…", color = Color(0xFF8E8E8E), fontSize = 13.sp) },
                    singleLine = true,
                    colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                        cursorColor = Color(0xFF0095F6),
                        focusedBorderColor = Color(0x66FFFFFF), unfocusedBorderColor = Color(0x66FFFFFF)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(6.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    androidx.compose.material3.OutlinedTextField(
                        value = pollA,
                        onValueChange = { pollA = it.take(30) },
                        placeholder = { Text("Option 1", color = Color(0xFF8E8E8E), fontSize = 13.sp) },
                        singleLine = true,
                        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                            cursorColor = Color(0xFF0095F6),
                            focusedBorderColor = Color(0x66FFFFFF), unfocusedBorderColor = Color(0x66FFFFFF)
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                    androidx.compose.material3.OutlinedTextField(
                        value = pollB,
                        onValueChange = { pollB = it.take(30) },
                        placeholder = { Text("Option 2", color = Color(0xFF8E8E8E), fontSize = 13.sp) },
                        singleLine = true,
                        colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                            cursorColor = Color(0xFF0095F6),
                            focusedBorderColor = Color(0x66FFFFFF), unfocusedBorderColor = Color(0x66FFFFFF)
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
            if (!textOpen && text.isNotBlank()) {
                Spacer(Modifier.height(4.dp))
                Text("Drag the text to move it", color = Color(0xFFAAAAAA), fontSize = 11.sp)
            }
        }

        // ---- text editor overlay ----
        if (textOpen) {
            Column(
                Modifier.fillMaxSize().background(Color(0xE6000000)).statusBarsPadding().padding(20.dp),
                verticalArrangement = Arrangement.Top
            ) {
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text("Done", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp,
                        modifier = Modifier.clickable { textOpen = false }.padding(6.dp))
                    Box(Modifier.weight(1f))
                }
                Spacer(Modifier.height(14.dp))
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    placeholder = { Text("Type something…", color = Color(0xFF8E8E8E), fontFamily = storyFonts[fontIdx].second) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color(storyColors[colorIdx]),
                        unfocusedTextColor = Color(storyColors[colorIdx]),
                        cursorColor = Color(0xFF0095F6),
                        focusedBorderColor = Color.Transparent,
                        unfocusedBorderColor = Color.Transparent
                    ),
                    textStyle = TextStyle(
                        fontFamily = storyFonts[fontIdx].second,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        color = Color(storyColors[colorIdx])
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(20.dp))
                Text("Font", color = Color(0xFF8E8E8E), fontSize = 12.sp)
                Spacer(Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    storyFonts.forEachIndexed { i, pair ->
                        Box(
                            Modifier.background(
                                if (fontIdx == i) Color(0xFF0095F6) else Color(0xFF262626),
                                RoundedCornerShape(8.dp)
                            ).clickable { fontIdx = i }.padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Text(pair.first, color = Color.White, fontSize = 13.sp, fontFamily = pair.second)
                        }
                    }
                }
                Spacer(Modifier.height(16.dp))
                Text("Color", color = Color(0xFF8E8E8E), fontSize = 12.sp)
                Spacer(Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    storyColors.forEachIndexed { i, c ->
                        Box(
                            Modifier.size(28.dp).background(Color(c), CircleShape)
                                .clickable { colorIdx = i },
                            contentAlignment = Alignment.Center
                        ) {
                            if (colorIdx == i) {
                                Text(
                                    "✓",
                                    color = if (c == 0xFFFFFFFFL || c == 0xFFF5D90AL) Color.Black else Color.White,
                                    fontSize = 13.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    if (songSheet) {
        SongPickerSheet(
            current = song?.title ?: "",
            onUse = { title, artist, url -> song = Song(title, artist, url, ""); songSheet = false },
            onClear = null,
            onDismiss = { songSheet = false }
        )
    }
}
