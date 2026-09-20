package com.vibegram.app

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.rememberTransformableState
import androidx.compose.foundation.gestures.transformable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.PointerEventPass
import androidx.compose.ui.input.pointer.changedToUp
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.boundsInRoot
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.util.lerp
import kotlin.math.max

/**
 * Instagram's "hold the profile photo to zoom it" interaction.
 *
 *  - press & hold any avatar  -> the photo grows out of its own circle into a large
 *    centred preview over a dark scrim (FLIP: it animates FROM the avatar's real
 *    on-screen rect, so it genuinely looks like it came out of the circle)
 *  - keep holding + drag      -> pan the enlarged photo
 *  - keep holding + pinch     -> zoom 1x .. 4x
 *  - lift the finger          -> it flies back and the overlay goes away
 *  - quick tap                -> whatever the screen wants (open story / profile / picker)
 */

/** What the overlay shows and where it grew from (px, in root coordinates). */
data class ZoomTarget(val url: String, val name: String, val origin: Rect)

/** Screens call this to open the zoom. Provided once, up in [MainApp]. */
val LocalZoomProfilePhoto = staticCompositionLocalOf<((ZoomTarget) -> Unit)?> { null }

/**
 * Drop-in replacement for [AvatarView] that adds tap + hold-to-zoom.
 * Callbacks are captured with [rememberUpdatedState] so the gesture detector is never
 * rebuilt on recomposition (it would otherwise restart on every new lambda instance).
 */
@Composable
fun ZoomableAvatar(
    url: String?,
    size: Int,
    name: String,
    modifier: Modifier = Modifier,
    border: Boolean = false,
    gradientRing: Boolean = false,
    showRing: Boolean = false,
    onTap: (() -> Unit)? = null
) {
    val zoom = LocalZoomProfilePhoto.current
    val haptic = LocalHapticFeedback.current
    var origin by remember { mutableStateOf(Rect.Zero) }
    val currentTap by rememberUpdatedState(onTap)
    val currentZoom by rememberUpdatedState(zoom)
    val currentUrl by rememberUpdatedState(url)
    val currentOrigin by rememberUpdatedState(origin)

    Box(
        modifier
            .onGloballyPositioned { origin = it.boundsInRoot() }
            .pointerInput(Unit) {
                detectTapGestures(
                    onTap = { currentTap?.invoke() },
                    onLongPress = {
                        val z = currentZoom
                        val u = currentUrl
                        if (z == null || u.isNullOrBlank()) {
                            // nothing to enlarge -> behave like a plain tap
                            currentTap?.invoke()
                            return@detectTapGestures
                        }
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        z(ZoomTarget(u, name, currentOrigin))
                    }
                )
            }
    ) {
        AvatarView(
            url = url,
            size = size,
            border = border,
            gradientRing = gradientRing,
            name = name,
            showRing = showRing
        )
    }
}

/** The full-screen preview. Mounted by [MainApp] while a [ZoomTarget] is set. */
@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
fun ProfilePhotoZoom(target: ZoomTarget, onDismiss: () -> Unit) {
    val density = LocalDensity.current
    val spring = remember { Animatable(0f) }
    var pinch by remember { mutableFloatStateOf(1f) }
    var panX by remember { mutableFloatStateOf(0f) }
    var panY by remember { mutableFloatStateOf(0f) }

    LaunchedEffect(target) { spring.animateTo(1f, tween(durationMillis = 280, easing = FastOutSlowInEasing)) }

    val pinchState = rememberTransformableState { zoomChange, panChange, _ ->
        pinch = (pinch * zoomChange).coerceIn(1f, 4f)
        panX += panChange.x
        panY += panChange.y
    }

    BoxWithConstraints(Modifier.fillMaxSize()) {
        val screenW = max(constraints.maxWidth.toFloat(), 1f)
        val screenH = max(constraints.maxHeight.toFloat(), 1f)

        // the enlarged photo occupies ~72% of the smaller screen edge (Instagram-ish)
        val targetPx = minOf(screenW, screenH) * 0.72f
        val originW = max(target.origin.width, 1f)
        val startScale = originW / targetPx
        val originCx = target.origin.center.x
        val originCy = target.origin.center.y
        val targetCx = screenW / 2f
        val targetCy = screenH * 0.40f

        val p = spring.value
        val scale = lerp(startScale, 1f, p) * pinch
        val tx = lerp(originCx - targetCx, 0f, p) + panX
        val ty = lerp(originCy - targetCy, 0f, p) + panY

        // scrim
        Box(
            Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.94f * p))
        )

        Column(
            Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                Modifier
                    .weight(1f)
                    .fillMaxSize()
                    // lift-the-finger-to-close: also catches the up of the press that opened us
                    .pointerInput(Unit) {
                        awaitEachGesture {
                            while (true) {
                                val event = awaitPointerEvent(PointerEventPass.Initial)
                                val anyUp = event.changes.any { it.changedToUp() }
                                val allReleased = event.changes.none { it.pressed }
                                if (anyUp && allReleased) {
                                    onDismiss()
                                    return@awaitEachGesture
                                }
                            }
                        }
                    }
                    .transformable(pinchState),
                contentAlignment = Alignment.Center
            ) {
                DataImage(
                    url = target.url,
                    circle = true,
                    contentScale = ContentScale.Crop,
                    fallbackLetter = target.name.take(1).uppercase(),
                    fallbackSize = 64,
                    modifier = Modifier
                        .size(with(density) { targetPx.toDp() })
                        .clip(CircleShape)
                        .graphicsLayer {
                            scaleX = scale
                            scaleY = scale
                            translationX = tx
                            translationY = ty
                            alpha = 0.25f + 0.75f * p
                        }
                )
            }

            // @username + hint, fading in with the zoom
            Column(
                Modifier.graphicsLayer { alpha = p },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                if (target.name.isNotBlank()) {
                    Text(
                        "@" + target.name,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp
                    )
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    if (pinch > 1.02f) "pinch to zoom \u00b7 lift to close"
                    else "hold to keep \u00b7 pinch to zoom \u00b7 lift to close",
                    color = Color(0xFFB0B0B0),
                    fontSize = 12.sp
                )
                Spacer(Modifier.height(28.dp))
            }
        }
    }
}
