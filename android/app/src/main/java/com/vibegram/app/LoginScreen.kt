package com.vibegram.app

import android.app.Activity
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialException
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.NoCredentialException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.firebase.FirebaseException
import kotlinx.coroutines.launch

private val IgGradient = Brush.linearGradient(
    listOf(Color(0xFFF09433), Color(0xFFDC2743), Color(0xFFBC1888))
)

@Composable
fun LoginScreen(onDone: () -> Unit) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var busy by remember { mutableStateOf(false) }
    var err by remember { mutableStateOf<String?>(null) }
    var help by remember { mutableStateOf(false) }

    fun signIn() {
        if (busy) return
        busy = true
        err = null
        scope.launch {
            try {
                val act = ctx as Activity
                val cm = CredentialManager.create(act)
                val option = GetGoogleIdOption.Builder()
                    .setServerClientId(WEB_CLIENT_ID)
                    .setFilterByAuthorizedAccounts(false)
                    .build()
                val request = GetCredentialRequest.Builder().addCredentialOption(option).build()
                val response = cm.getCredential(act, request)
                val cred = response.credential
                if (cred is CustomCredential && cred.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                    val g = GoogleIdTokenCredential.createFrom(cred.data)
                    Fb.signInWithIdToken(g.idToken)
                    onDone()
                } else {
                    err = "Unexpected sign-in response. Please try again."
                }
            } catch (e: GetCredentialCancellationException) {
                // user closed the picker — stay silent
            } catch (e: NoCredentialException) {
                err = "No Google account found. Add a Google account on this phone, then try again."
            } catch (e: GetCredentialException) {
                err = "Google sign-in unavailable. Check your internet and try again."
            } catch (e: FirebaseException) {
                err = "Could not complete sign-in. Please try again in a moment."
            } catch (e: Exception) {
                err = e.message ?: "Sign-in failed. Please try again."
            } finally {
                busy = false
            }
        }
    }

    Column(
        modifier = Modifier.fillMaxSize()
            .background(Color.Black)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.weight(1f))

        // gradient app badge (IG-style rounded square)
        Box(
            modifier = Modifier.size(100.dp).background(IgGradient, RoundedCornerShape(26.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Filled.PhotoCamera,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(52.dp)
            )
        }

        Spacer(Modifier.height(18.dp))
        Text(
            "VibeGram",
            color = Color.White,
            fontSize = 44.sp,
            fontFamily = FontFamily.Cursive,
            fontWeight = FontWeight.Bold
        )
        Spacer(Modifier.height(6.dp))
        Text("Share your moments with the world", color = Color(0xFF9AA0A6), fontSize = 14.sp)

        Spacer(Modifier.height(44.dp))

        // gradient sign-in button
        Button(
            onClick = { signIn() },
            enabled = !busy,
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.Transparent,
                disabledContainerColor = Color.Transparent
            ),
            modifier = Modifier.fillMaxWidth().height(52.dp).background(IgGradient, RoundedCornerShape(13.dp)),
            shape = RoundedCornerShape(13.dp)
        ) {
            if (busy) {
                CircularProgressIndicator(Modifier.size(22.dp), color = Color.White, strokeWidth = 2.dp)
            } else {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("G", color = Color.White, fontWeight = FontWeight.Black, fontSize = 19.sp)
                    Spacer(Modifier.width(10.dp))
                    Text("Continue with Google", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
        }

        if (err != null) {
            Spacer(Modifier.height(16.dp))
            Text(
                err ?: "",
                color = Color(0xFFED4956),
                fontSize = 13.sp,
                lineHeight = 18.sp,
                modifier = Modifier.fillMaxWidth(),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }

        Spacer(Modifier.height(18.dp))
        Text(
            "Trouble signing in?",
            color = Color(0xFF0095F6),
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier
                .clickable { help = true }
                .padding(6.dp)
        )

        Spacer(Modifier.weight(1.15f))

        Text(
            "Same VibeGram account — all your posts,\nfollowers and chats are here.",
            color = Color(0xFF8E8E8E),
            fontSize = 12.sp,
            lineHeight = 17.sp,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )
        Spacer(Modifier.height(10.dp))
        Text("Made by Piyush", color = Color(0xFF5A5A5A), fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(14.dp))
    }

    if (help) {
        Dialog(onDismissRequest = { help = false }) {
            Column(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Color(0xFF1C1C1E)).padding(22.dp)
            ) {
                Text("Sign-in help", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Spacer(Modifier.height(12.dp))
                HelpRow("Make sure a Google account is added on this phone (Settings, then Accounts).")
                HelpRow("If the app was installed very recently, wait 10-15 minutes — Google verifies new apps automatically.")
                HelpRow("Check your internet connection, then tap Continue with Google again.")
                Spacer(Modifier.height(16.dp))
                Text(
                    "Got it",
                    color = Color(0xFF0095F6),
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    modifier = Modifier
                        .clickable { help = false }
                        .padding(vertical = 4.dp)
                )
            }
        }
    }
}

@Composable
private fun HelpRow(text: String) {
    Row(Modifier.padding(vertical = 5.dp)) {
        Text("•", color = Color(0xFF8E8E8E), fontSize = 14.sp, modifier = Modifier.padding(end = 8.dp))
        Text(text, color = Color(0xFFC7C7C7), fontSize = 13.sp, lineHeight = 18.sp)
    }
}
