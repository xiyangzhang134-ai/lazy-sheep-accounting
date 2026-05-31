package com.lazysheep.accounting.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazysheep.accounting.data.model.Categories
import com.lazysheep.accounting.ui.theme.*

@Composable
fun TransactionForm(
    onAdd: (amount: Double, type: String, category: String, note: String, date: String) -> Unit
) {
    var amount by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("expense") }
    var category by remember { mutableStateOf("") }
    var note by remember { mutableStateOf("") }
    var error by remember { mutableStateOf("") }
    val today = remember { java.time.LocalDate.now().toString() }
    var dateStr by remember { mutableStateOf(today) }

    val categories = Categories.getCategories(type)
    val fieldModifier = Modifier
        .fillMaxWidth()
        .clip(RoundedCornerShape(12.dp))
        .border(2.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
        .background(Color.White.copy(alpha = 0.7f))
        .padding(horizontal = 16.dp, vertical = 12.dp)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(Color.White.copy(alpha = 0.8f))
            .border(1.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(24.dp))
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("✏️ 记一笔", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Pink500)
            LazyDatePicker(dateStr = dateStr, onDateChange = { dateStr = it })
        }

        // Type toggle
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf(
                "expense" to "💸 支出",
                "income" to "🪙 收入"
            ).forEach { (key, label) ->
                val isActive = type == key
                val activeGradient = if (key == "expense")
                    listOf(Rose400, Pink400) else listOf(Emerald400, Color(0xFF14b8a6))
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            if (isActive) Brush.horizontalGradient(activeGradient)
                            else Brush.horizontalGradient(listOf(
                                if (key == "expense") Rose400.copy(alpha = 0.1f) else Emerald400.copy(alpha = 0.1f),
                                if (key == "expense") Pink400.copy(alpha = 0.1f) else Emerald400.copy(alpha = 0.05f)
                            ))
                        )
                        .clickable { type = key; category = "" }
                        .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isActive) Color.White
                        else (if (key == "expense") Rose400 else Emerald500)
                    )
                }
            }
        }

        // Amount & Category
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("💰 金额", fontSize = 12.sp, color = Pink400, fontWeight = FontWeight.Medium)
                Spacer(Modifier.height(4.dp))
                OutlinedTextField(
                    value = amount,
                    onValueChange = { amount = it; error = "" },
                    placeholder = { Text("0.00", color = Color.Gray.copy(alpha = 0.4f)) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = fieldModifier,
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color.Transparent,
                        unfocusedBorderColor = Color.Transparent
                    )
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text("🏷️ 分类", fontSize = 12.sp, color = Pink400, fontWeight = FontWeight.Medium)
                Spacer(Modifier.height(4.dp))
                var expanded by remember { mutableStateOf(false) }
                Box {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .border(2.dp, Pink400.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                            .background(Color.White.copy(alpha = 0.7f))
                            .clickable { expanded = true }
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Text(
                            text = if (category.isEmpty()) "请选择～" else categories.find { it.value == category }?.label ?: category,
                            color = if (category.isEmpty()) Color.Gray.copy(alpha = 0.5f) else Color.DarkGray,
                            fontSize = 14.sp
                        )
                    }
                    DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        categories.forEach { c ->
                            DropdownMenuItem(
                                text = { Text(c.label) },
                                onClick = {
                                    category = c.value
                                    expanded = false
                                    error = ""
                                }
                            )
                        }
                    }
                }
            }
        }

        // Note
        Column {
            Text("📝 备注", fontSize = 12.sp, color = Pink400, fontWeight = FontWeight.Medium)
            Spacer(Modifier.height(4.dp))
            OutlinedTextField(
                value = note,
                onValueChange = { note = it },
                placeholder = { Text("写点什么吧～", color = Color.Gray.copy(alpha = 0.4f)) },
                modifier = fieldModifier,
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color.Transparent,
                    unfocusedBorderColor = Color.Transparent
                )
            )
        }

        // Error
        if (error.isNotEmpty()) {
            Text("🥺 $error", color = Rose400, fontSize = 14.sp, fontWeight = FontWeight.Medium)
        }

        // Submit
        Button(
            onClick = {
                val amt = amount.toDoubleOrNull()
                if (amt == null || amt <= 0) { error = "请输入有效的金额哦～"; return@Button }
                if (category.isEmpty()) { error = "请选一个分类吧～"; return@Button }
                onAdd(amt, type, category, note.ifBlank { "无备注" }, dateStr)
                amount = ""; category = ""; note = ""; error = ""
            },
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(Brush.horizontalGradient(listOf(Pink400, Purple400)))
                .height(48.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
            contentPadding = PaddingValues(0.dp)
        ) {
            Text("✨ 添加记录 ✨", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}
