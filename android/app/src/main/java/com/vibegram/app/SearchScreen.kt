package com.vibegram.app

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import androidx.compose.ui.unit.sp

@Composable
fun SearchScreen(onProfile: (String) -> Unit) {
    var q by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<VUser>?>(null) }
    var busy by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().background(Color.Black)) {
        Header("Search")
        Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = q,
                onValueChange = { q = it },
                placeholder = { Text("Search username", color = Color(0xFF8E8E8E)) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    cursorColor = Color(0xFF0095F6)
                ),
                singleLine = true,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            )
            Spacer(Modifier.width(8.dp))
            Button(
                onClick = {
                    busy = true
                    val query = q
                    kotlinx.coroutines.MainScope().launch {
                        results = try { Fb.searchUsers(query) } catch (_: Exception) { emptyList() }
                        busy = false
                    }
                },
                enabled = !busy && q.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0095F6))
            ) { Text("Go", color = Color.White, fontWeight = FontWeight.Bold) }
        }

        if (results == null) {
            EmptyBox("Search people by username", "🔎")
        } else if (results!!.isEmpty()) {
            EmptyBox("No results found", "😕")
        } else {
            LazyColumn(Modifier.fillMaxSize()) {
                items(results!!) { u ->
                    Row(
                        Modifier.fillMaxWidth().clickable { onProfile(u.username) }
                            .padding(horizontal = 14.dp, vertical = 9.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AvatarView(url = u.avatar, size = 44, border = false)
                        Spacer(Modifier.width(12.dp))
                        Column {
                            Row {
                                Text(u.username, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                if (u.verified) {
                                    Spacer(Modifier.width(4.dp))
                                    Text("✓", color = Color(0xFF1D9BF0), fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                }
                            }
                            Text(u.name, color = Color(0xFF8E8E8E), fontSize = 13.sp)
                        }
                    }
                }
            }
        }
    }
}

