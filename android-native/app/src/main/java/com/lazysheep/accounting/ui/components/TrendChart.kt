package com.lazysheep.accounting.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class ChartPoint(
    val label: String,
    val income: Double,
    val expense: Double
)

@Composable
fun TrendLineChart(
    data: List<ChartPoint>,
    modifier: Modifier = Modifier,
    labelMode: String = "daily" // daily | weekly | monthly
) {
    if (data.isEmpty()) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .height(256.dp),
            contentAlignment = Alignment.Center
        ) {
            Text("📭 暂无数据～", color = Color(0xFFf9a8d4), fontSize = 14.sp)
        }
        return
    }

    Column(modifier = modifier.fillMaxWidth()) {
        // Legend
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(8.dp).background(Color(0xFF10b981), RoundedCornerShape(4.dp)))
                Text(" 收入", fontSize = 12.sp, color = Color(0xFF10b981), fontWeight = FontWeight.Medium)
            }
            Spacer(Modifier.width(24.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(8.dp).background(Color(0xFFf472b6), RoundedCornerShape(4.dp)))
                Text(" 支出", fontSize = 12.sp, color = Color(0xFFf472b6), fontWeight = FontWeight.Medium)
            }
        }

        Spacer(Modifier.height(8.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color.White.copy(alpha = 0.3f))
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(start = 40.dp, end = 16.dp, top = 20.dp, bottom = 30.dp)
            ) {
                val width = size.width
                val height = size.height

                val allValues = data.flatMap { listOf(it.income, it.expense) }
                val maxVal = (allValues.maxOrNull() ?: 1.0).coerceAtLeast(1.0)
                val stepX = width / (data.size - 1).coerceAtLeast(1)

                fun yPos(value: Double): Float = height - (value / maxVal * height).toFloat()

                // Grid lines
                for (i in 0..4) {
                    val y = height * i / 4
                    drawLine(
                        color = Color(0xFFfce7f3),
                        start = Offset(0f, y),
                        end = Offset(width, y),
                        strokeWidth = 1f
                    )
                }

                // Income line
                val incomePath = Path()
                data.forEachIndexed { i, pt ->
                    val x = i * stepX
                    val y = yPos(pt.income)
                    if (i == 0) incomePath.moveTo(x, y) else incomePath.lineTo(x, y)
                }
                drawPath(
                    path = incomePath,
                    color = Color(0xFF10b981),
                    style = Stroke(width = 3f, cap = StrokeCap.Round)
                )

                // Expense line
                val expensePath = Path()
                data.forEachIndexed { i, pt ->
                    val x = i * stepX
                    val y = yPos(pt.expense)
                    if (i == 0) expensePath.moveTo(x, y) else expensePath.lineTo(x, y)
                }
                drawPath(
                    path = expensePath,
                    color = Color(0xFFf472b6),
                    style = Stroke(width = 3f, cap = StrokeCap.Round)
                )

                // Income dots
                data.forEachIndexed { i, pt ->
                    drawCircle(
                        color = Color(0xFF10b981),
                        radius = if (labelMode == "daily") 3f else 5f,
                        center = Offset(i * stepX, yPos(pt.income))
                    )
                }

                // Expense dots
                data.forEachIndexed { i, pt ->
                    drawCircle(
                        color = Color(0xFFf472b6),
                        radius = if (labelMode == "daily") 3f else 5f,
                        center = Offset(i * stepX, yPos(pt.expense))
                    )
                }
            }

            // X-axis labels
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .padding(start = 40.dp, end = 16.dp, bottom = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                val step = when (labelMode) {
                    "daily" -> (data.size / 7).coerceAtLeast(1)
                    else -> 1
                }
                data.forEachIndexed { i, pt ->
                    if (i % step == 0 || i == data.lastIndex) {
                        Text(
                            text = formatChartLabel(labelMode, pt.label),
                            fontSize = if (labelMode == "daily") 8.sp else 10.sp,
                            color = Color(0xFFc084fc)
                        )
                    }
                }
            }
        }
    }
}

private fun formatChartLabel(mode: String, label: String): String {
    return when (mode) {
        "daily" -> {
            val parts = label.split("-")
            if (parts.size >= 3) "${parts[1].toIntOrNull() ?: parts[1]}/${parts[2].toIntOrNull() ?: parts[2]}" else label
        }
        "monthly" -> {
            val parts = label.split("-")
            if (parts.size >= 2) "${parts[1].toIntOrNull() ?: parts[1]}月" else label
        }
        else -> label
    }
}

@Composable
fun PieDonutChart(
    data: List<Pair<String, Double>>,  // label, value
    colors: List<Color>,
    modifier: Modifier = Modifier
) {
    if (data.isEmpty()) {
        Box(modifier = modifier.fillMaxWidth().height(256.dp), contentAlignment = Alignment.Center) {
            Text("🍩 还没有支出记录哦～", color = Color(0xFFf9a8d4), fontSize = 14.sp)
        }
        return
    }

    val total = data.sumOf { it.second }
    if (total <= 0) return

    Column(modifier = modifier.fillMaxWidth()) {
        // Donut chart
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.size(180.dp)) {
                var startAngle = -90f
                data.forEachIndexed { i, (_, value) ->
                    val sweep = (value / total * 360).toFloat()
                    drawArc(
                        color = colors[i % colors.size],
                        startAngle = startAngle,
                        sweepAngle = sweep,
                        useCenter = true,
                        size = size
                    )
                    startAngle += sweep
                }
                // Inner circle (donut hole)
                drawCircle(
                    color = Color.White,
                    radius = size.minDimension / 3.5f
                )
            }
        }

        // Legend
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            data.forEachIndexed { i, (label, value) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .background(colors[i % colors.size], RoundedCornerShape(6.dp))
                        )
                        Text(
                            " $label",
                            fontSize = 12.sp,
                            color = Color(0xFF6b7280)
                        )
                    }
                    Text(
                        "¥${value.toInt()}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF4b5563)
                    )
                }
            }
        }
    }
}
