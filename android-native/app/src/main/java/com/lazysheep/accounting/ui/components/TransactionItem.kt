package com.lazysheep.accounting.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import com.lazysheep.accounting.data.model.Categories
import com.lazysheep.accounting.ui.theme.*

@Composable
fun TransactionItem(
    record: Record,
    isDeleting: Boolean,
    onDelete: (String) -> Unit
) {
    val cat = Categories.findCategory(record.category)
    val isIncome = record.type == "income"
    var showConfirm by remember { mutableStateOf(false) }

    AnimatedVisibility(
        visible = !isDeleting,
        exit = fadeOut() + shrinkVertically()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Category icon
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background((cat?.color ?: Color(0xFFf9a8d4)).copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = cat?.label?.take(2) ?: if (isIncome) "💰" else "💸",
                    fontSize = 18.sp
                )
            }

            // Details
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = cat?.label ?: record.category,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF374151)
                )
                if (record.note.isNotEmpty() && record.note != "无备注") {
                    Text(
                        text = record.note,
                        fontSize = 12.sp,
                        color = Color(0xFF9ca3af)
                    )
                }
            }

            // Amount
            Text(
                text = "${if (isIncome) "+" else "-"}¥${"%.2f".format(record.amount)}",
                fontSize = 14.sp,
                fontWeight = FontWeight.ExtraBold,
                color = if (isIncome) Emerald500 else Rose400
            )

            // Delete
            if (!showConfirm) {
                TextButton(
                    onClick = { showConfirm = true },
                    modifier = Modifier.size(32.dp),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Text("🗑", fontSize = 14.sp)
                }
            } else {
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    TextButton(
                        onClick = { onDelete(record.id) },
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(Brush.horizontalGradient(listOf(Rose400, Pink400)))
                    ) {
                        Text("确认", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                    TextButton(
                        onClick = { showConfirm = false },
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFFe5e7eb))
                    ) {
                        Text("取消", fontSize = 12.sp, color = Color(0xFF9ca3af))
                    }
                }
            }
        }
    }
}
