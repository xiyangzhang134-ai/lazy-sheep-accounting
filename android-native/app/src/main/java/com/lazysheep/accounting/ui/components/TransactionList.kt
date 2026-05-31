package com.lazysheep.accounting.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.lazysheep.accounting.data.db.entities.Record
import com.lazysheep.accounting.ui.theme.*

data class DateGroup(
    val date: String,
    val items: List<Record>,
    val dayIncome: Double,
    val dayExpense: Double
)

fun groupByDate(records: List<Record>): List<DateGroup> {
    val groups = mutableListOf<DateGroup>()
    var current: MutableList<Record>? = null
    var currentDate: String? = null

    for (r in records) {
        if (currentDate != r.date) {
            if (current != null && currentDate != null) {
                val income = current.filter { it.type == "income" }.sumOf { it.amount }
                val expense = current.filter { it.type == "expense" }.sumOf { it.amount }
                groups.add(DateGroup(currentDate, current.toList(), income, expense))
            }
            current = mutableListOf()
            currentDate = r.date
        }
        current?.add(r)
    }
    if (current != null && currentDate != null && current.isNotEmpty()) {
        val income = current.filter { it.type == "income" }.sumOf { it.amount }
        val expense = current.filter { it.type == "expense" }.sumOf { it.amount }
        groups.add(DateGroup(currentDate, current.toList(), income, expense))
    }
    return groups
}

fun formatDate(dateStr: String): String {
    val parts = dateStr.split("-")
    if (parts.size != 3) return dateStr
    val weekMap = listOf("日", "一", "二", "三", "四", "五", "六")
    val dayOfWeek = try {
        val cal = java.util.Calendar.getInstance()
        cal.set(parts[0].toInt(), parts[1].toInt() - 1, parts[2].toInt())
        weekMap[cal.get(java.util.Calendar.DAY_OF_WEEK) - 1]
    } catch (e: Exception) { "" }
    return "${parts[1].toInt()}月${parts[2].toInt()}日 周$dayOfWeek"
}

@Composable
fun TransactionList(
    records: List<Record>,
    onDelete: (String) -> Unit
) {
    val sorted = remember(records) {
        records.sortedWith(compareByDescending<Record> { it.date }.thenByDescending { it.id })
    }
    val grouped = remember(sorted) { groupByDate(sorted) }

    if (grouped.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(Color.White.copy(alpha = 0.8f))
                .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
                .padding(48.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("🐣", fontSize = 48.sp)
                Spacer(Modifier.height(8.dp))
                Text("还没有记录哦～", color = Pink400.copy(alpha = 0.6f), fontSize = 14.sp)
                Text("记下你的第一笔吧！", color = Pink400.copy(alpha = 0.4f), fontSize = 12.sp)
            }
        }
        return
    }

    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("📋 记录列表", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Pink500)
            Text(
                "${sorted.size}",
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Pink400.copy(alpha = 0.1f))
                    .padding(horizontal = 10.dp, vertical = 2.dp),
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Pink500
            )
        }

        Spacer(Modifier.height(8.dp))

        grouped.forEach { group ->
            var deletingId by remember { mutableStateOf<String?>(null) }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.8f))
                    .border(1.dp, Purple400.copy(alpha = 0.1f), RoundedCornerShape(24.dp))
            ) {
                Column {
                    // Date header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.horizontalGradient(
                                    listOf(Purple400.copy(alpha = 0.1f), Pink400.copy(alpha = 0.1f))
                                )
                            )
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "📅 ${formatDate(group.date)}",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Purple500
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            if (group.dayIncome > 0) {
                                Text(
                                    "🌸 ¥${"%.2f".format(group.dayIncome)}",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Emerald500
                                )
                            }
                            if (group.dayExpense > 0) {
                                Text(
                                    "🍰 ¥${"%.2f".format(group.dayExpense)}",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Rose400
                                )
                            }
                        }
                    }

                    // Items
                    group.items.forEach { record ->
                        TransactionItem(
                            record = record,
                            isDeleting = deletingId == record.id,
                            onDelete = { id ->
                                deletingId = id
                                onDelete(id)
                            }
                        )
                    }
                }
            }
        }
    }
}
