package com.lazysheep.accounting.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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

/**
 * 徽章行卡片 — 水平布局，用于垂直滚动面板
 * 点击后触发 onClick 回调打开动物弹窗
 */
@Composable
fun BadgeRowCard(
    emoji: String,
    name: String,
    desc: String,
    animal: String,
    unlocked: Boolean,
    progressCurrent: Int?,
    progressThreshold: Int?,
    color: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val progressPct = if (!unlocked && progressCurrent != null && progressThreshold != null && progressThreshold > 0) {
        (progressCurrent.toFloat() / progressThreshold).coerceAtMost(1f)
    } else 0f

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(
                if (unlocked) Color.White else Color(0xFFf9fafb).copy(alpha = 0.8f)
            )
            .border(
                2.dp,
                if (unlocked) Color(0xFFfbcfe8) else Color(0xFFe5e7eb),
                RoundedCornerShape(16.dp)
            )
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: badge icon (large rounded square)
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(
                        if (unlocked) color.copy(alpha = 0.12f) else Color(0xFFf3f4f6)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(emoji, fontSize = 28.sp)
            }

            Spacer(Modifier.width(14.dp))

            // Center: name + description
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (unlocked) Color(0xFF1f2937) else Color(0xFF9ca3af)
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    desc,
                    fontSize = 11.sp,
                    color = Color(0xFF9ca3af)
                )
                if (unlocked) {
                    Spacer(Modifier.height(2.dp))
                    Text(
                        "✅ 已解锁",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF10b981)
                    )
                }
            }

            Spacer(Modifier.width(10.dp))

            // Right: animal icon + progress bar
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(animal, fontSize = 28.sp)
                if (!unlocked && progressCurrent != null && progressThreshold != null) {
                    Spacer(Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .width(48.dp)
                                .height(5.dp)
                                .clip(RoundedCornerShape(3.dp))
                                .background(Color(0xFFe5e7eb))
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth(progressPct)
                                    .height(5.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(color)
                            )
                        }
                        Spacer(Modifier.width(4.dp))
                        Text(
                            "${progressCurrent}/${progressThreshold}",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF9ca3af)
                        )
                    }
                } else if (unlocked) {
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "点击查看 →",
                        fontSize = 10.sp,
                        color = Color(0xFFf9a8d4)
                    )
                }
            }
        }
    }
}
