package com.lazysheep.accounting.ui.screens

import androidx.compose.foundation.background
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
import com.lazysheep.accounting.ui.components.*
import com.lazysheep.accounting.ui.theme.*
import com.lazysheep.accounting.ui.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigate: (String) -> Unit
) {
    val records by viewModel.records.collectAsState()
    val stats by viewModel.stats.collectAsState()
    val monthFilter by viewModel.monthFilter.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Pink50, Purple50, Sky50)
                )
            )
    ) {
        // Decorative blobs
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 0.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(256.dp)
                    .offset(x = (-80).dp, y = (-80).dp)
                    .background(Pink400.copy(alpha = 0.1f), RoundedCornerShape(128.dp))
            )
            Box(
                modifier = Modifier
                    .size(320.dp)
                    .align(Alignment.BottomStart)
                    .offset(x = (-80).dp, y = 80.dp)
                    .background(Purple400.copy(alpha = 0.08f), RoundedCornerShape(160.dp))
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 24.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "🐑 懒羊羊记账",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Pink500
                )
                if (monthFilter != null) {
                    Text(
                        "← 查看全部",
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.White.copy(alpha = 0.5f))
                            .clickable { viewModel.setMonthFilter(null) }
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Pink400
                    )
                }
            }

            Spacer(Modifier.height(16.dp))

            // Stat cards
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    label = "收入", amount = stats.first, emoji = "🌸",
                    gradientStart = Emerald50, gradientEnd = Teal50,
                    textColor = Emerald500, borderColor = Color(0xFFa7f3d0),
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    label = "支出", amount = stats.second, emoji = "🍰",
                    gradientStart = Rose50, gradientEnd = Color(0xFFfff1f2),
                    textColor = Rose400, borderColor = Color(0xFFfecdd3),
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    label = "结余", amount = stats.third, emoji = "⭐",
                    gradientStart = Purple50, gradientEnd = Indigo50,
                    textColor = Color(0xFFa855f7), borderColor = Color(0xFFddd6fe),
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(Modifier.height(20.dp))

            // Transaction form
            TransactionForm(
                onAdd = { amount, type, category, note, date ->
                    viewModel.addRecord(amount, type, category, note, date)
                }
            )

            Spacer(Modifier.height(20.dp))

            // Transaction list
            TransactionList(
                records = records,
                onDelete = { id -> viewModel.deleteRecord(id) }
            )

            Spacer(Modifier.height(80.dp)) // For bottom nav
        }
    }
}
