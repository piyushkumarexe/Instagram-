package com.vibegram.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            val fdb = com.google.firebase.firestore.FirebaseFirestore.getInstance()
            fdb.firestoreSettings = com.google.firebase.firestore.FirebaseFirestoreSettings.Builder()
                .setPersistenceEnabled(true)
                .setCacheSizeBytes(100L * 1024 * 1024)
                .build()
        } catch (_: Exception) { }
        setContent { VibeGramRoot() }
    }
}

@Composable
fun VibeGramRoot() {
    MaterialTheme(colorScheme = darkColorScheme()) {
        var me by remember { mutableStateOf<VUser?>(null) }
        var booted by remember { mutableStateOf(false) }
        var offline by remember { mutableStateOf(false) }
        var signingIn by remember { mutableStateOf(false) }
        val scope = rememberCoroutineScope()

        LaunchedEffect(Unit) {
            if (Fb.uid != null) {
                // signed in — fetch profile with retries; never dump to login on a transient error
                me = Fb.me(retries = 4)
                offline = (me == null)
            }
            booted = true
        }

        if (!booted) {
            Box(Modifier.fillMaxSize().background(Color.Black), Alignment.Center) {
                CircularProgressIndicator(color = Color.White)
            }
            return@MaterialTheme
        }

        val user = me
        if (user == null && offline && Fb.uid != null) {
            // signed-in but profile fetch failed — offline screen, NOT login
            Column(
                Modifier.fillMaxSize().background(Color.Black),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = androidx.compose.foundation.layout.Arrangement.Center
            ) {
                Text("📡", fontSize = 44.sp)
                Spacer(Modifier.height(14.dp))
                Text("You're offline", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(Modifier.height(6.dp))
                Text("Check your internet and try again", color = Color(0xFF8E8E8E), fontSize = 13.sp)
                Spacer(Modifier.height(20.dp))
                Button(
                    onClick = {
                        offline = false
                        booted = false
                        scope.launch {
                            me = Fb.me(retries = 4)
                            offline = (me == null)
                            booted = true
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6))
                ) { Text("Retry", color = Color.White, fontWeight = FontWeight.Bold) }
            }
            return@MaterialTheme
        }

        if (user == null) {
            LoginScreen(
                onDone = {
                    // safe: retries + never crash the app on a transient network error
                    signingIn = true
                    scope.launch {
                        me = Fb.me(retries = 4)
                        if (me == null && Fb.uid != null) {
                            kotlinx.coroutines.delay(1200)
                            me = Fb.me(retries = 2)
                        }
                        signingIn = false
                        offline = (me == null && Fb.uid != null)
                    }
                }
            )
        } else {
            MainApp(initialMe = user, onLogout = { me = null })
        }
    }
}
