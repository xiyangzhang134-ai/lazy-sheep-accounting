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
import com.lazysheep.accounting.data.model.Badge
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

    var selectedBadge by remember { mutableStateOf<Badge?>(null) }
    var selectedUnlocked by remember { mutableStateOf(false) }
    var selectedTotal by remember { mutableStateOf(0) }

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
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("🏆 我的成就", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = Pink500)
            }

            Spacer(Modifier.height(20.dp))
            // Stats area - three items with increased gap, equal height
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.8f))
                    .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                    .padding(horizontal = 20.dp, vertical = 24.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(24.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Checkin progress ring
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                        val checkinGoal = Badges.all.find { it.type == "checkin" && checkinDays < it.threshold }?.threshold ?: 100
                        val checkinPct = (checkinDays.toFloat() / checkinGoal * 100).coerceAtMost(100f)
                        ProgressRing(progress = checkinPct, size = 90.dp, color = Color(0xFFf472b6), bgColor = Color(0xFFfce7f3)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(checkinDays.toString(), fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Pink500)
                                Text("打卡", fontSize = 10.sp, color = Color(0xFF9ca3af))
                                Text(checkinPct.toInt().toString() + "%", fontSize = 9.sp, color = Pink400.copy(alpha = 0.5f))
                            }
                        }
                        if (streakDays >= 3) Text("🔥 连续 $streakDays 天", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Amber400)
                        else Spacer(Modifier.height(15.dp))
                    }

                    // Checkin button - same height as rings
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.weight(1f).height(IntrinsicSize.Min)
                    ) {
                        if (checkedToday) {
                            Box(
                                modifier = Modifier.clip(RoundedCornerShape(16.dp)).background(Color(0xFFecfdf5)).border(1.dp, Color(0xFFa7f3d0), RoundedCornerShape(16.dp)).padding(horizontal = 18.dp, vertical = 16.dp).heightIn(min = 90.dp),
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
                                modifier = Modifier.clip(RoundedCornerShape(16.dp)).background(Brush.horizontalGradient(listOf(Emerald400, Color(0xFF14b8a6)))).clickable { viewModel.doCheckin() }.padding(horizontal = 18.dp, vertical = 16.dp).heightIn(min = 90.dp),
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

                    // Record progress ring
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                        val recordGoal = Badges.all.find { it.type == "record" && recordDays < it.threshold }?.threshold ?: 100
                        val recordPct = (recordDays.toFloat() / recordGoal * 100).coerceAtMost(100f)
                        ProgressRing(progress = recordPct, size = 90.dp, color = Color(0xFFa78bfa), bgColor = Color(0xFFede9fe)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(recordDays.toString(), fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFa855f7))
                                Text("记账", fontSize = 10.sp, color = Color(0xFF9ca3af))
                                Text(recordPct.toInt().toString() + "%", fontSize = 9.sp, color = Purple400.copy(alpha = 0.5f))
                            }
                        }
                        val unlockedCount = Badges.all.count { badge -> getBadgeProgress(badge, checkinDays, recordDays, streakDays).unlocked }
                        Text("$unlockedCount/${Badges.all.size} 徽章", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Purple400)
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // Badge wall - vertical scroll panel
            Box(
                modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(24.dp)).background(Color.White.copy(alpha = 0.8f)).border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp)).padding(20.dp)
            ) {
                Column {
                    val unlockedCount = Badges.all.count { badge -> getBadgeProgress(badge, checkinDays, recordDays, streakDays).unlocked }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("🏖️ 徽章墙", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Pink500)
                        Text("已解锁 $unlockedCount/${Badges.all.size}", fontSize = 12.sp, color = Pink400.copy(alpha = 0.7f))
                    }
                    Spacer(Modifier.height(14.dp))
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.heightIn(max = 420.dp).verticalScroll(rememberScrollState())) {
                        Badges.all.forEach { badge ->
                            val (progress, unlocked) = getBadgeProgress(badge, checkinDays, recordDays, streakDays)
                            BadgeRowCard(
                                emoji = badge.emoji, name = badge.name, desc = badge.desc, animal = badge.animal,
                                unlocked = unlocked,
                                progressCurrent = if (!unlocked) progress else null,
                                progressThreshold = if (!unlocked) badge.threshold else null,
                                color = Color(badge.color),
                                onClick = { selectedBadge = badge; selectedUnlocked = unlocked; selectedTotal = progress }
                            )
                        }
                    }
                }
            }
            Spacer(Modifier.height(12.dp))
        }
    }

    selectedBadge?.let { badge ->
        AnimalDialog(badge = badge, unlocked = selectedUnlocked, total = selectedTotal, onDismiss = { selectedBadge = null })
    }
}

data class BadgeState(val total: Int, val unlocked: Boolean)

private fun getBadgeProgress(badge: Badge, checkinDays: Int, recordDays: Int, streakDays: Int): BadgeState {
    val total = when (badge.type) { "checkin" -> checkinDays; "streak" -> streakDays; else -> recordDays }
    return BadgeState(total, total >= badge.threshold)
}
