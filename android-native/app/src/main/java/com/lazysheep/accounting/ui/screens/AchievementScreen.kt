package com.lazysheep.accounting.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazysheep.accounting.data.model.Badges
import com.lazysheep.accounting.data.repository.AccountingRepository
import com.lazysheep.accounting.ui.components.*
import com.lazysheep.accounting.ui.theme.*
import com.lazysheep.accounting.ui.viewmodel.AchievementViewModel

@Composable
fun AchievementScreen(
    viewModel: AchievementViewModel,
    onBack: () -> Unit
) {
    val recordDays by viewModel.recordDays.collectAsState()
    val checkinDays by viewModel.checkinDays.collectAsState()
    val streakDays by viewModel.streakDays.collectAsState()
    val checkedToday by viewModel.checkedToday.collectAsState()
    val justCheckedIn by viewModel.justCheckedIn.collectAsState()
    val loading by viewModel.loading.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pink50, Purple50, Sky50)))
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Box(modifier = Modifier.size(256.dp).offset(x = (-80).dp, y = (-80).dp).background(Pink400.copy(alpha = 0.1f), RoundedCornerShape(128.dp)))
            Box(modifier = Modifier.size(320.dp).align(Alignment.BottomStart).offset(x = (-80).dp, y = 80.dp).background(Purple400.copy(alpha = 0.08f), RoundedCornerShape(160.dp)))
        }

        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp, vertical = 24.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("🏆 我的成就", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = Pink500)
                Text(
                    "← 返回记账",
                    modifier = Modifier.clip(RoundedCornerShape(10.dp)).background(Color.White.copy(alpha = 0.5f)).clickable { onBack() }.padding(horizontal = 12.dp, vertical = 6.dp),
                    fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Pink400
                )
            }

            Spacer(Modifier.height(20.dp))

            // Progress rings + Checkin button
            Box(
                modifier = Modifier.fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.8f))
                    .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                    .padding(24.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Checkin progress
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        val checkinGoal = Badges.all.find { it.type == "checkin" && checkinDays < it.threshold }?.threshold ?: 100
                        val checkinPct = (checkinDays.toFloat() / checkinGoal * 100).coerceAtMost(100f)

                        ProgressRing(progress = checkinPct, size = 90.dp, color = Color(0xFFf472b6), bgColor = Color(0xFFfce7f3)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$checkinDays", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Pink500)
                                Text("打卡", fontSize = 10.sp, color = Color(0xFF9ca3af))
                                Text("${checkinPct.toInt()}%", fontSize = 9.sp, color = Pink400.copy(alpha = 0.5f))
                            }
                        }
                        if (streakDays >= 3) {
                            Text("🔥 连续 $streakDays 天", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Amber400)
                        }
                    }

                    // Checkin button
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        if (checkedToday) {
                            Box(
                                modifier = Modifier.clip(RoundedCornerShape(16.dp)).background(Color(0xFFecfdf5)).border(1.dp, Color(0xFFa7f3d0), RoundedCornerShape(16.dp)).padding(horizontal = 20.dp, vertical = 16.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("✅", fontSize = 32.sp)
                                    Text("今日已打卡", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald500)
                                    Text(AccountingRepository.todayDateStr(), fontSize = 10.sp, color = Emerald400)
                                }
                            }
                        } else {
                            Box(
                                modifier = Modifier.clip(RoundedCornerShape(16.dp))
                                    .background(Brush.horizontalGradient(listOf(Emerald400, Color(0xFF14b8a6))))
                                    .clickable { viewModel.doCheckin() }
                                    .padding(horizontal = 20.dp, vertical = 16.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("🔥", fontSize = 32.sp)
                                    Text("今日打卡", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        }

                        AnimatedVisibility(visible = justCheckedIn, enter = fadeIn() + scaleIn(), exit = fadeOut()) {
                            Text("+1 🎉", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald400)
                        }
                    }

                    // Record days progress
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        val recordGoal = Badges.all.find { it.type == "record" && recordDays < it.threshold }?.threshold ?: 100
                        val recordPct = (recordDays.toFloat() / recordGoal * 100).coerceAtMost(100f)

                        ProgressRing(progress = recordPct, size = 90.dp, color = Color(0xFFa78bfa), bgColor = Color(0xFFede9fe)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$recordDays", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFa855f7))
                                Text("记账", fontSize = 10.sp, color = Color(0xFF9ca3af))
                                Text("${recordPct.toInt()}%", fontSize = 9.sp, color = Purple400.copy(alpha = 0.5f))
                            }
                        }

                        val unlockedCount = Badges.all.count { badge ->
                            getBadgeProgress(badge, checkinDays, recordDays, streakDays).unlocked
                        }
                        Text(
                            "$unlockedCount/${Badges.all.size} 徽章",
                            fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Purple400
                        )
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // Badge wall
            Box(
                modifier = Modifier.fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.8f))
                    .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                    .padding(20.dp)
            ) {
                Column {
                    val unlockedCount = Badges.all.count { badge ->
                        getBadgeProgress(badge, checkinDays, recordDays, streakDays).unlocked
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("🎖️ 徽章墙", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Pink500)
                        Text("已解锁 $unlockedCount/${Badges.all.size}", fontSize = 12.sp, color = Pink400.copy(alpha = 0.5f))
                    }

                    Spacer(Modifier.height(16.dp))

                    // Badge grid
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Badges.all.chunked(4).forEach { row ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceEvenly
                            ) {
                                row.forEach { badge ->
                                    val (progress, unlocked) = getBadgeProgress(badge, checkinDays, recordDays, streakDays)
                                    BadgeCard(
                                        emoji = badge.emoji,
                                        name = badge.name,
                                        desc = badge.desc,
                                        unlocked = unlocked,
                                        progressCurrent = if (!unlocked) progress else null,
                                        progressThreshold = if (!unlocked) badge.threshold else null,
                                        color = Color(badge.color)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.height(80.dp))
        }
    }
}

data class BadgeState(val total: Int, val unlocked: Boolean)

private fun getBadgeProgress(badge: com.lazysheep.accounting.data.model.Badge, checkinDays: Int, recordDays: Int, streakDays: Int): BadgeState {
    val total = when (badge.type) {
        "checkin" -> checkinDays
        "streak" -> streakDays
        else -> recordDays
    }
    return BadgeState(total, total >= badge.threshold)
}
