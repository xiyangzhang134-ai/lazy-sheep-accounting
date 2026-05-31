package com.lazysheep.accounting.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazysheep.accounting.ui.theme.Pink400
import java.time.LocalDate

@Composable
fun LazyDatePicker(
    dateStr: String,
    onDateChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var open by remember { mutableStateOf(false) }
    val date = remember(dateStr) {
        try {
            val parts = dateStr.split("-").map { it.toInt() }
            Triple(parts[0], parts[1], parts[2])
        } catch (e: Exception) {
            val today = LocalDate.now()
            Triple(today.year, today.monthValue, today.dayOfMonth)
        }
    }
    var year by remember { mutableIntStateOf(date.first) }
    var month by remember { mutableIntStateOf(date.second) }
    var day by remember { mutableIntStateOf(date.third) }

    val today = LocalDate.now()

    fun emit() {
        onDateChange("$year-${String.format("%02d", month)}-${String.format("%02d", day)}")
    }

    Box(modifier = modifier) {
        TextButton(
            onClick = { open = !open },
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.textButtonColors(
                contentColor = Pink400,
                containerColor = if (open) Pink400.copy(alpha = 0.15f) else Pink400.copy(alpha = 0.05f)
            )
        ) {
            Text("📅 $dateStr", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Pink400)
        }

        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            Column(
                modifier = Modifier.padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Year selector
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    repeat(3) { i ->
                        val y = year - 1 + i
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (y == year) Pink400 else Pink400.copy(alpha = 0.1f))
                                .clickable { year = y; emit() }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                "${y}年",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (y == year) androidx.compose.ui.graphics.Color.White else Pink400
                            )
                        }
                    }
                }

                // Month selector
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    repeat(12) { i ->
                        val m = i + 1
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (m == month) Pink400 else Pink400.copy(alpha = 0.1f))
                                .clickable { month = m; emit() }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                                .weight(1f),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                "${m}月",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (m == month) androidx.compose.ui.graphics.Color.White else Pink400
                            )
                        }
                    }
                }

                TextButton(
                    onClick = {
                        year = today.year
                        month = today.monthValue
                        day = today.dayOfMonth
                        emit()
                        open = false
                    }
                ) {
                    Text("回到今天", color = Pink400, fontSize = 12.sp)
                }
            }
        }
    }
}
