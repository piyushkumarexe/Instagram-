package com.vibegram.app

import android.app.Application
import java.io.File

// Global crash logger: writes the stack trace to filesDir/crash.txt
// so the app can show (and the user can share) what went wrong — no silent crashes.
class VibeGramApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Prefs.load(this)
        val default = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { t, e ->
            try {
                File(filesDir, "crash.txt").writeText(
                    buildString {
                        appendLine("time=" + System.currentTimeMillis())
                        appendLine("thread=" + (t?.name ?: "?"))
                        appendLine(android.util.Log.getStackTraceString(e))
                    }
                )
            } catch (_: Exception) { }
            default?.uncaughtException(t, e)
        }
    }

    companion object {
        fun takeCrashReport(ctx: android.content.Context): String? {
            return try {
                val f = File(ctx.filesDir, "crash.txt")
                if (f.exists()) f.readText().takeLast(1200) else null
            } catch (_: Exception) { null }
        }

        fun clearCrashReport(ctx: android.content.Context) {
            try { File(ctx.filesDir, "crash.txt").delete() } catch (_: Exception) { }
        }
    }
}
