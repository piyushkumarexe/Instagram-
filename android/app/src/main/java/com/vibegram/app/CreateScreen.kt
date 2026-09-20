package com.vibegram.app

import android.graphics.BitmapFactory
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.launch

@Composable
fun CreateScreen(
    me: VUser,
    onPosted: () -> Unit,
    onStoryPosted: () -> Unit,
    onAvatarChanged: (VUser) -> Unit
) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var postUri by remember { mutableStateOf<Uri?>(null) }
    var caption by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf<String?>(null) }

    val postPicker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) postUri = uri
    }
    val reelPicker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri == null || busy) return@rememberLauncherForActivityResult
        busy = true
        status = "Uploading reel…"
        scope.launch(kotlinx.coroutines.Dispatchers.IO) {
            try {
                val bytes = ctx.contentResolver.openInputStream(uri)?.use { it.readBytes() }
                    ?: throw Exception("Could not read video")
                if (bytes.size > 700 * 1024) throw Exception("Reel too large for the demo backend (max 700 KB) — try a shorter clip")
                val b64 = android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP)
                Fb.createReel("data:video/mp4;base64," + b64, caption)
                kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) {
                    status = "Reel shared ✅ — the reels algorithm now shows it to every account"
                    caption = ""
                    onPosted()
                }
            } catch (e: Exception) {
                kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) { status = e.message }
            } finally { busy = false }
        }
    }
    val storyPicker = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri == null || busy) return@rememberLauncherForActivityResult
        busy = true
        status = "Adding to your story…"
        scope.launch {
            try {
                val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                ctx.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
                var sample = 1
                while (bounds.outWidth / (sample * 2) >= 1600 || bounds.outHeight / (sample * 2) >= 1600) sample *= 2
                val o2 = BitmapFactory.Options().apply { inSampleSize = sample }
                val bmp = BitmapFactory.decodeStream(ctx.contentResolver.openInputStream(uri), null, o2)
                    ?: throw Exception("Could not read image")
                Fb.addStory(bmp)
                status = "Story added ✅"
                postUri = null
                caption = ""
                onStoryPosted()
            } catch (e: Exception) {
                status = e.message
            } finally {
                busy = false
            }
        }
    }

    Column(
        Modifier.fillMaxSize().background(Color.Black).padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Create new post", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Spacer(Modifier.height(18.dp))

        if (postUri != null) {
            AsyncImage(
                model = postUri,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxWidth().aspectRatio(1f).background(Color(0xFF111111))
            )
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = caption,
                onValueChange = { caption = it.take(2200) },
                placeholder = { Text("Write a caption…", color = Color(0xFF8E8E8E)) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    cursorColor = Color(0xFF0095F6)
                ),
                modifier = Modifier.fillMaxWidth(),
                maxLines = 4,
                shape = RoundedCornerShape(12.dp)
            )
            Spacer(Modifier.height(14.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = {
                        val uri = postUri ?: return@Button
                        if (busy) return@Button
                        busy = true
                        status = "Sharing…"
                        scope.launch {
                            try {
                                val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                                ctx.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
                                var sample = 1
                                while (bounds.outWidth / (sample * 2) >= 1600 || bounds.outHeight / (sample * 2) >= 1600) sample *= 2
                                val o2 = BitmapFactory.Options().apply { inSampleSize = sample }
                                val bmp2 = BitmapFactory.decodeStream(ctx.contentResolver.openInputStream(uri), null, o2)
                                    ?: throw Exception("Could not read image")
                                Fb.createPost(bmp2, caption)
                                status = "Posted ✅"
                                postUri = null
                                caption = ""
                                onPosted()
                            } catch (e: Exception) {
                                status = e.message
                            } finally {
                                busy = false
                            }
                        }
                    },
                    enabled = !busy,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    if (busy) CircularProgressIndicator(Modifier.height(20.dp), color = Color.White, strokeWidth = 2.dp)
                    else Text("Share post", color = Color.White, fontWeight = FontWeight.Bold)
                }
                Button(
                    onClick = { postUri = null },
                    enabled = !busy,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                    modifier = Modifier.width(110.dp).height(48.dp),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Cancel", color = Color.White)
                }
            }
        } else {
            Box(
                Modifier.fillMaxWidth().aspectRatio(1.2f).background(Color(0xFF111111), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("📷", fontSize = 52.sp)
                    Spacer(Modifier.height(10.dp))
                    Text("Select a photo to share", color = Color(0xFFB0B0B0), fontSize = 14.sp)
                }
            }
            Spacer(Modifier.height(18.dp))
            Button(
                onClick = {
                    postPicker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6)),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Select from gallery (post)", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }
            Spacer(Modifier.height(10.dp))
            Button(
                onClick = {
                    storyPicker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                },
                enabled = !busy,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (busy) CircularProgressIndicator(Modifier.height(20.dp), color = Color.White, strokeWidth = 2.dp)
                else Text("Add to your story", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }
            Spacer(Modifier.height(10.dp))
            Button(
                onClick = {
                    reelPicker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.VideoOnly))
                },
                enabled = !busy,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF262626)),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("🎬 Share a reel (reaches everyone)", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }
        }

        status?.let {
            Spacer(Modifier.height(14.dp))
            Text(it, color = Color(0xFFB0B0B0), fontSize = 13.sp)
        }
    }
}
