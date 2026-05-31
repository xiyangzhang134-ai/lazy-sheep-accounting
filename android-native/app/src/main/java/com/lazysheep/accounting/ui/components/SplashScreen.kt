package com.lazysheep.accounting.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onDone: () -> Unit) {
    var visible by remember { mutableStateOf(true) }
    var fadeOut by remember { mutableStateOf(false) }
    val alpha by animateFloatAsState(if (fadeOut) 0f else 1f, animationSpec = tween(500), label = "splashAlpha")

    // Auto-dismiss after 2.8s
    LaunchedEffect(Unit) {
        delay(2800)
        fadeOut = true
        delay(500)
        onDone()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFFfef3c7),
                        Color(0xFFfef9c3),
                        Color(0xFFffedd5)
                    )
                )
            )
            .alpha(alpha)
            .clickable { fadeOut = true; /* will trigger onDone via delay above */ },
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            // Sheep emoji with gentle bounce animation
            val infiniteTransition = rememberInfiniteTransition(label = "bounce")
            val bounce by infiniteTransition.animateFloat(
                initialValue = 0f,
                targetValue = -10f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1500, easing = EaseInOutCubic),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "bounce"
            )

            Text(
                text = "🐑",
                fontSize = 100.sp,
                modifier = Modifier.offset(y = bounce.dp)
            )

            Spacer(Modifier.height(8.dp))

            // Shadow
            Box(
                modifier = Modifier
                    .width(96.dp)
                    .height(16.dp)
                    .background(Color(0xFFfde68a).copy(alpha = 0.4f), shape = androidx.compose.foundation.shape.RoundedCornerShape(50))
                    .scale(
                        scaleX = animateFloatAsState(
                            if (bounce > -5f) 0.7f else 1f,
                            animationSpec = tween(1500, easing = EaseInOutCubic),
                            label = "shadow"
                        ).value,
                        scaleY = 1f
                    )
            )

            Spacer(Modifier.height(24.dp))

            // Title with pulsing text
            val pulseAlpha by infiniteTransition.animateFloat(
                initialValue = 0.4f,
                targetValue = 1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(1250),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "pulse"
            )

            Text(
                "懒洋洋记账中",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFd97706).copy(alpha = pulseAlpha)
            )

            Spacer(Modifier.height(4.dp))
            Text(
                "别急，让我伸个懒腰...",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFFfbbf24).copy(alpha = pulseAlpha * 0.7f)
            )

            Spacer(Modifier.height(48.dp))
            Text(
                "点击任意位置跳过",
                fontSize = 11.sp,
                color = Color(0xFFfbbf24).copy(alpha = 0.4f)
            )
        }

        // Decorative clouds
        Text("☁️", fontSize = 40.sp, modifier = Modifier.align(Alignment.TopStart).padding(start = 32.dp, top = 60.dp).alpha(0.5f))
        Text("☁️", fontSize = 30.sp, modifier = Modifier.align(Alignment.TopEnd).padding(end = 48.dp, top = 100.dp).alpha(0.3f))
    }
}

private val EaseInOutCubic = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)
