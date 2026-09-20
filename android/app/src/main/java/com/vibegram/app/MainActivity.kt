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
        val scope = rememberCoroutineScope()

        // zero-blocking boot: signed in? -> straight into the app, profile refreshes in background
        LaunchedEffect(Unit) {
            if (Fb.uid != null) {
                me = Fb.me(retries = 1) ?: Fb.tempMe()
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
        if (user == null) {
            LoginScreen(
                onDone = {
                    // never crash, never block: fetch with retries, else enter with temp profile
                    scope.launch {
                        me = Fb.me(retries = 3) ?: if (Fb.uid != null) Fb.tempMe() else null
                    }
                }
            )
        } else {
            MainApp(initialMe = user, onLogout = { me = null })
        }
    }
}
