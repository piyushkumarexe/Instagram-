package com.vibegram.app

import android.app.Activity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.firebase.FirebaseException
import kotlinx.coroutines.launch

private val IgGrad = Brush.linearGradient(
    listOf(Color(0xFFF09433), Color(0xFFDC2743), Color(0xFFBC1888))
)

@Composable
fun LoginScreen(onDone: () -> Unit) {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    var busy by remember { mutableStateOf(false) }
    var err by remember { mutableStateOf<String?>(null) }
    var help by remember { mutableStateOf(false) }
    val crashReport = remember { VibeGramApp.takeCrashReport(ctx) }
    var showCrash by remember { mutableStateOf(crashReport != null) }

    // engine 2 (fallback): legacy GoogleSignIn — native in-app account picker,
    // bypasses the newer credential-provider routing entirely
    val legacy = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { res ->
        try {
            val account = GoogleSignIn.getSignedInAccountFromIntent(res.data).getResult(ApiException::class.java)
            val idToken = account?.idToken
            if (idToken != null) {
                scope.launch {
                    try {
                        Fb.signInWithIdToken(idToken)
                        onDone()
                    } catch (e: Exception) {
                        err = "Could not complete sign-in. Please try again."
                        busy = false
                    }
                }
            } else {
                busy = false // cancelled
            }
        } catch (e: ApiException) {
            busy = false // cancelled or no result
        }
    }

    fun legacyFallback() {
        val act = ctx as Activity
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(WEB_CLIENT_ID)
            .requestEmail()
            .build()
        legacy.launch(GoogleSignIn.getClient(act, gso).signInIntent)
    }

    // engine 1: Credential Manager; falls back to engine 2 on failure
    fun signIn() {
        if (busy) return
        busy = true
        err = null
        scope.launch {
            var fell = false
            try {
                val act = ctx as Activity
                val cm = CredentialManager.create(act)
                val option = GetGoogleIdOption.Builder()
                    .setServerClientId(WEB_CLIENT_ID)
                    .setFilterByAuthorizedAccounts(false)
                    .setAutoSelectEnabled(false)
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
                    busy = false
                }
            } catch (e: GetCredentialCancellationException) {
                busy = false // user closed the picker — stay silent
            } catch (e: GetCredentialException) {
                fell = true
            } catch (e: FirebaseException) {
                err = "Could not complete sign-in. Please try again in a moment."
                busy = false
            } catch (e: Exception) {
                fell = true
            }
            if (fell) legacyFallback() // busy stays true until engine 2 returns
        }
    }

    Box(Modifier.fillMaxSize().background(Color(0xFF050505))) {
        // corner circuit traces (hud-style)
        Canvas(Modifier.fillMaxSize()) {
            val line = Color.White.copy(alpha = 0.09f)
            val w = size.width
            val h = size.height
            fun trace(x1: Float, y1: Float, x2: Float, y2: Float, x3: Float, y3: Float) {
                drawLine(line, Offset(x1, y1), Offset(x2, y2), strokeWidth = 2.5f, cap = StrokeCap.Round)
                drawLine(line, Offset(x2, y2), Offset(x3, y3), strokeWidth = 2.5f, cap = StrokeCap.Round)
                drawCircle(Color(0xFFDC2743).copy(alpha = 0.55f), radius = 7f, center = Offset(x3, y3))
                drawCircle(Color(0xFFF09433).copy(alpha = 0.30f), radius = 13f, center = Offset(x3, y3))
            }
            trace(0f, h * 0.10f, w * 0.16f, h * 0.10f, w * 0.16f, h * 0.22f)
            trace(w, h * 0.06f, w * 0.88f, h * 0.06f, w * 0.88f, h * 0.16f)
            trace(0f, h * 0.86f, w * 0.12f, h * 0.86f, w * 0.12f, h * 0.74f)
            trace(w, h * 0.92f, w * 0.84f, h * 0.92f, w * 0.84f, h * 0.80f)
        }

        Column(
            Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // card
            Column(
                Modifier
                    .padding(horizontal = 22.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(26.dp))
                    .background(Color(0xFF111112))
                    .border(1.dp, Color(0xFF232326), RoundedCornerShape(26.dp))
                    .padding(horizontal = 22.dp, vertical = 30.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // gradient logo badge with ring
                Box(
                    Modifier
                        .size(74.dp)
                        .background(Color(0xFF1C1C1F), CircleShape)
                        .border(1.dp, Color(0xFF2E2E33), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        Modifier.size(54.dp).background(IgGrad, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            androidx.compose.ui.res.painterResource(R.drawable.ic_camera),
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(27.dp)
                        )
                    }
                }

                Spacer(Modifier.height(18.dp))
                Text("Welcome Back", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 23.sp)
                Spacer(Modifier.height(7.dp))
                Row {
                    Text("New to Instagram 2.0?  ", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                    Text(
                        "Sign up",
                        color = Color(0xFF3B82F6),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.clickable { signIn() }
                    )
                }

                Spacer(Modifier.height(26.dp))

                // primary action (design's blue button)
                Button(
                    onClick = { signIn() },
                    enabled = !busy,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(Prefs.accentLong),
                        disabledContainerColor = Color(Prefs.accentLong).copy(alpha = 0.55f)
                    ),
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(13.dp)
                ) {
                    if (busy) {
                        CircularProgressIndicator(Modifier.size(22.dp), color = Color.White, strokeWidth = 2.dp)
                    } else {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("G", color = Color.White, fontWeight = FontWeight.Black, fontSize = 18.sp)
                            Spacer(Modifier.width(9.dp))
                            Text("Continue with Google", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                    }
                }

                if (err != null) {
                    Spacer(Modifier.height(14.dp))
                    Text(
                        err ?: "",
                        color = Color(0xFFFF5A6E),
                        fontSize = 12.sp,
                        lineHeight = 17.sp,
                        textAlign = TextAlign.Center
                    )
                }

                Spacer(Modifier.height(20.dp))
                Text(
                    "All your posts, followers and chats —\none account everywhere.",
                    color = Color(0xFF6E6E73),
                    fontSize = 12.sp,
                    lineHeight = 16.sp,
                    textAlign = TextAlign.Center
                )

                Spacer(Modifier.height(18.dp))
                Text(
                    "Trouble signing in?",
                    color = Color(0xFF3B82F6),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { help = true }.padding(4.dp)
                )
            }

            Spacer(Modifier.height(26.dp))
            Text("Made by Piyush", color = Color(0xFF4A4A4F), fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }

    if (help) {
        Dialog(onDismissRequest = { help = false }) {
            Column(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(20.dp)).background(Color(0xFF161618))
                    .border(1.dp, Color(0xFF2A2A2E), RoundedCornerShape(20.dp)).padding(22.dp)
            ) {
                Text("Sign-in help", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Spacer(Modifier.height(12.dp))
                HelpRow("Make sure a Google account is added on this phone (Settings, then Accounts).")
                HelpRow("If the app was installed very recently, wait 10-15 minutes — Google verifies new apps automatically.")
                HelpRow("Check your internet connection, then tap Continue with Google again.")
                Spacer(Modifier.height(16.dp))
                Text(
                    "Got it",
                    color = Color(0xFF3B82F6),
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    modifier = Modifier.clickable { help = false }.padding(vertical = 4.dp)
                )
            }
        }
    }

    if (showCrash && crashReport != null) {
        androidx.compose.material3.AlertDialog(
            onDismissRequest = { showCrash = false },
            title = { Text("Something broke last time", color = Color.White) },
            text = {
                Column {
                    Text(
                        "Tap Copy and send this to Piyush so it gets fixed fast:",
                        color = Color(0xFFC7C7C7), fontSize = 13.sp
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        crashReport.takeLast(600),
                        color = Color(0xFF8E8E8E), fontSize = 10.sp,
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                    )
                }
            },
            confirmButton = {
                Text(
                    "Copy",
                    color = Color(0xFF3B82F6), fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .androidxTapCopy(crashReport, ctx)
                        .padding(6.dp)
                )
            },
            dismissButton = {
                Text(
                    "Dismiss",
                    color = Color(0xFF8E8E8E),
                    modifier = Modifier
                        .clickable {
                            VibeGramApp.clearCrashReport(ctx)
                            showCrash = false
                        }
                        .padding(6.dp)
                )
            },
            containerColor = Color(0xFF1C1C1E)
        )
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
private fun Modifier.androidxTapCopy(text: String, ctx: android.content.Context): Modifier =
    this.then(
        Modifier.clickable {
            val cm = ctx.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
            cm.setPrimaryClip(android.content.ClipData.newPlainText("crash", text))
            android.widget.Toast.makeText(ctx, "Copied", android.widget.Toast.LENGTH_SHORT).show()
        }
    )

@Composable
private fun HelpRow(text: String) {
    Row(Modifier.padding(vertical = 5.dp)) {
        Text("•", color = Color(0xFF8E8E8E), fontSize = 14.sp, modifier = Modifier.padding(end = 8.dp))
        Text(text, color = Color(0xFFC7C7C7), fontSize = 13.sp, lineHeight = 18.sp)
    }
}
