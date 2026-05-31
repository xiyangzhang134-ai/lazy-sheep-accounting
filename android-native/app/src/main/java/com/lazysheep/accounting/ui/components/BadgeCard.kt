package com.lazysheep.accounting.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun BadgeCard(
    emoji: String,
    name: String,
    desc: String,
    unlocked: Boolean,
    progressCurrent: Int?,
    progressThreshold: Int?,
    color: Color,
    modifier: Modifier = Modifier
) {
    var showTooltip by remember { mutableStateOf(false) }

    Box(modifier = modifier) {
        Column(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(if (unlocked) color.copy(alpha = 0.08f) else Color(0xFFf9fafb))
                .border(
                    2.dp,
                    if (unlocked) color else Color(0xFFe5e7eb),
                    CircleShape
                )
                .clickable { showTooltip = !showTooltip },
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(emoji, fontSize = 24.sp)
            if (!unlocked && progressCurrent != null && progressThreshold != null) {
                Text(
                    "$progressCurrent/$progressThreshold",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF9ca3af)
                )
            } else if (!unlocked) {
                Text("🔒", fontSize = 10.sp)
            } else {
                Text("✅", fontSize = 10.sp)
            }
        }

        if (showTooltip) {
            Box(
                modifier = Modifier
                    .offset(y = (-80).dp)
                    .align(Alignment.BottomCenter)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.White)
                    .border(1.dp, Color(0xFFfbcfe8), RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        "$emoji $name",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (unlocked) color else Color(0xFF9ca3af)
                    )
                    Text(desc, fontSize = 12.sp, color = Color(0xFF9ca3af))
                    if (!unlocked && progressCurrent != null && progressThreshold != null) {
                        Text(
                            "进度 $progressCurrent/$progressThreshold",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFf472b6)
                        )
                    }
                    if (unlocked) {
                        Text("已解锁 🎉", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34d399))
                    }
                }
            }
        }
    }
}
