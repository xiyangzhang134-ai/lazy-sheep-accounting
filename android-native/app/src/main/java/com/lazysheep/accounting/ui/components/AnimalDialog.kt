package com.lazysheep.accounting.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazysheep.accounting.data.model.Badge
import kotlin.math.abs
@Composable
fun AnimalDialog(
    badge: Badge,
    unlocked: Boolean,
    total: Int,
    onDismiss: () -> Unit
) {
    val enterScale by animateFloatAsState(
        targetValue = 1f,
        animationSpec = spring(dampingRatio = 0.6f, stiffness = 300f),
        label = "enterScale"
    )
    val tr = rememberInfiniteTransition(label = "motion")
    val chickY by tr.animateFloat(0f, -10f, infiniteRepeatable(tween(600, easing = EaseInOut), RepeatMode.Reverse), "ck")
    val foxR by tr.animateFloat(-8f, 8f, infiniteRepeatable(tween(800, easing = EaseInOut), RepeatMode.Reverse), "fx")
    val penguinR by tr.animateFloat(-10f, 10f, infiniteRepeatable(tween(500, easing = EaseInOut), RepeatMode.Reverse), "pg")
    val bunnyY by tr.animateFloat(0f, -20f, infiniteRepeatable(tween(400, easing = EaseOut), RepeatMode.Reverse), "by")
    val bunnyS by tr.animateFloat(1f, 1.12f, infiniteRepeatable(tween(400, easing = EaseInOut), RepeatMode.Reverse), "bs")
    val catS by tr.animateFloat(1f, 1.08f, infiniteRepeatable(tween(1200, easing = EaseInOut), RepeatMode.Reverse), "cs")
    val catR by tr.animateFloat(-5f, 5f, infiniteRepeatable(tween(1500, easing = EaseInOut), RepeatMode.Reverse), "cr")
    val dogY by tr.animateFloat(0f, -15f, infiniteRepeatable(tween(500, easing = EaseOut), RepeatMode.Reverse), "dy")
    val bearR by tr.animateFloat(-6f, 6f, infiniteRepeatable(tween(1000, easing = EaseInOut), RepeatMode.Reverse), "br")
    val haloRot by tr.animateFloat(0f, 360f, infiniteRepeatable(tween(12000, easing = LinearEasing)), "halo")
    val shadowS by tr.animateFloat(1f, 0.6f, infiniteRepeatable(tween(1500, easing = EaseInOut), RepeatMode.Reverse), "shd")

    val (offsetY, degrees, scaleAmt) = when (badge.animal) {
        "🐣" -> Triple(chickY, 0f, 1f)
        "🦊" -> Triple(foxR * 0.3f, foxR * 0.5f, 1f + abs(foxR) * 0.003f)
        "🐧" -> Triple(0f, penguinR, 1f)
        "🐰" -> Triple(bunnyY, 0f, bunnyS)
        "🐱" -> Triple(0f, catR, catS)
        "🐶" -> Triple(dogY, 0f, 1f)
        "🐻" -> Triple(0f, bearR, 1f)
        else -> Triple(0f, 0f, 1f)
    }

    val animalColor = Color(badge.color)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.35f))
            .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null, onClick = onDismiss),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .padding(24.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(Color.White)
                .border(2.dp, Color(0xFFfbcfe8), RoundedCornerShape(24.dp))
                .padding(24.dp)
                .scale(enterScale)
                .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null, onClick = {}),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (unlocked) Color(0xFFecfdf5) else Color(0xFFf3f4f6))
                        .border(1.dp, if (unlocked) Color(0xFFa7f3d0) else Color(0xFFe5e7eb), RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp, vertical = 2.dp)
                ) {
                    val statusText = if (unlocked) "✅ 已解锁" else "🔒 未解锁 (" + total + "/" + badge.threshold + ")"
                    Text(statusText, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (unlocked) Color(0xFF10b981) else Color(0xFF9ca3af))
                }
                Spacer(Modifier.height(12.dp))
                Text(badge.emoji + " " + badge.name, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF1f2937))
                Text(badge.desc, fontSize = 12.sp, color = Color(0xFF6b7280))
                Spacer(Modifier.height(16.dp))

                // Animal display circle
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .clip(CircleShape)
                        .background(Brush.radialGradient(colors = listOf(animalColor.copy(alpha = if (unlocked) 0.4f else 0.1f), animalColor.copy(alpha = 0.02f)))),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(150.dp)
                            .rotate(if (unlocked) haloRot else 0f)
                            .then(if (unlocked) Modifier.background(Brush.sweepGradient(colors = listOf(Color.Transparent, animalColor.copy(alpha = 0.2f), Color.Transparent, animalColor.copy(alpha = 0.1f), Color.Transparent)), CircleShape) else Modifier)
                    )
                    Text(
                        text = badge.animal, fontSize = 72.sp,
                        modifier = Modifier.offset(y = offsetY.dp).rotate(degrees).scale(if (unlocked) scaleAmt else 0.5f)
                    )
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .offset(y = 8.dp)
                            .size(width = (48 * if (unlocked) shadowS else 0f).dp, height = 6.dp)
                            .clip(CircleShape)
                            .background(if (unlocked) animalColor.copy(alpha = 0.4f * shadowS) else Color.Transparent)
                    )
                }

                Spacer(Modifier.height(12.dp))
                Text(badge.animalName, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = if (unlocked) Color(0xFF374151) else Color(0xFF9ca3af))
                Text(
                    if (unlocked) badge.animalDesc else "继续努力解锁这只小可爱吧~",
                    fontSize = 12.sp, color = Color(0xFF9ca3af), textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )

                if (!unlocked) {
                    Spacer(Modifier.height(16.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("解锁进度", fontSize = 10.sp, color = Color(0xFF9ca3af))
                        Text(total.toString() + "/" + badge.threshold, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF6b7280))
                    }
                    Spacer(Modifier.height(6.dp))
                    val pct = (total.toFloat() / badge.threshold).coerceAtMost(1f)
                    Box(Modifier.fillMaxWidth().height(10.dp).clip(RoundedCornerShape(5.dp)).background(Color(0xFFf3f4f6))) {
                        Box(Modifier.fillMaxWidth(pct).height(10.dp).clip(RoundedCornerShape(5.dp)).background(Brush.horizontalGradient(listOf(animalColor, animalColor.copy(alpha = 0.7f)))))
                    }
                }
            }
        }
    }
}
