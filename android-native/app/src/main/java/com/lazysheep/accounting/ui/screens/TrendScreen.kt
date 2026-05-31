package com.lazysheep.accounting.ui.screens

import androidx.compose.animation.animateColorAsState
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
import com.lazysheep.accounting.ui.components.*
import com.lazysheep.accounting.ui.theme.*
import com.lazysheep.accounting.ui.viewmodel.TrendViewModel

data class GranularityOption(
    val key: String,
    val label: String,
    val desc: String
)

val GRANULARITY_OPTIONS = listOf(
    GranularityOption("daily", "📆 日", "近14天"),
    GranularityOption("weekly", "📊 周", "近8周"),
    GranularityOption("monthly", "📅 月", "近6月")
)

@Composable
fun TrendScreen(
    viewModel: TrendViewModel,
    onBack: () -> Unit
) {
    val gran by viewModel.granularity.collectAsState()
    val dateStr by viewModel.dateStr.collectAsState()
    val lineData by viewModel.lineData.collectAsState()
    val breakdown by viewModel.expenseBreakdown.collectAsState()
    val loading by viewModel.loading.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pink50, Purple50, Sky50)))
    ) {
        // Decorative blobs
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
                Text("📈 趋势分析", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = Pink500)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    LazyDatePicker(dateStr = dateStr, onDateChange = { viewModel.setDateStr(it) })
                    Text(
                        "← 返回",
                        modifier = Modifier.clip(RoundedCornerShape(10.dp)).background(Color.White.copy(alpha = 0.5f)).clickable { onBack() }.padding(horizontal = 12.dp, vertical = 6.dp),
                        fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Pink400
                    )
                }
            }

            Spacer(Modifier.height(16.dp))

            // Granularity tabs
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                GRANULARITY_OPTIONS.forEach { opt ->
                    val isActive = gran == opt.key
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (isActive) Brush.horizontalGradient(listOf(Pink400, Purple400))
                                else Brush.horizontalGradient(listOf(Color.White.copy(alpha = 0.4f), Color.White.copy(alpha = 0.4f)))
                            )
                            .clickable { viewModel.setGranularity(opt.key) }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            opt.label,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isActive) Color.White else Pink400.copy(alpha = 0.5f)
                        )
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // Line chart section
            Box(
                modifier = Modifier.fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.8f))
                    .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                    .padding(20.dp)
            ) {
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("📊 收支趋势", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Pink500)
                        Text(
                            GRANULARITY_OPTIONS.find { it.key == gran }?.desc ?: "",
                            fontSize = 12.sp, color = Pink400.copy(alpha = 0.5f)
                        )
                    }
                    Spacer(Modifier.height(8.dp))
                    TrendLineChart(data = lineData, labelMode = gran)
                }
            }

            Spacer(Modifier.height(16.dp))

            // Pie chart section
            Box(
                modifier = Modifier.fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.8f))
                    .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                    .padding(20.dp)
            ) {
                Column {
                    Text("🍩 支出分类占比", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Pink500)
                    Spacer(Modifier.height(8.dp))
                    PieDonutChart(
                        data = breakdown,
                        colors = ChartColors
                    )
                }
            }

            Spacer(Modifier.height(80.dp))
        }
    }
}
