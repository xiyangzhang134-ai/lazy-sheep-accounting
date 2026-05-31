package com.lazysheep.accounting.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazysheep.accounting.ui.theme.Pink400
import com.lazysheep.accounting.ui.theme.Purple400

data class NavItem(
    val route: String,
    val emoji: String,
    val label: String
)

@Composable
fun BottomNavBar(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        NavItem("home", "✏️", "记账"),
        NavItem("trend", "📈", "趋势"),
        NavItem("achievement", "🏆", "成就")
    )

    // Outer Box: push the nav bar 5mm (~19dp) up from screen bottom
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(bottom = 18.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(Color.White.copy(alpha = 0.85f))
                .padding(2.dp),
            horizontalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            items.forEach { item ->
                val isActive = currentRoute == item.route
                val contentColor by animateColorAsState(
                    if (isActive) Color.White else Pink400.copy(alpha = 0.6f),
                    label = "navContent"
                )

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .then(
                            if (isActive) {
                                Modifier.background(
                                    brush = Brush.horizontalGradient(listOf(Pink400, Purple400))
                                )
                            } else Modifier
                        )
                        .clickable(
                            interactionSource = MutableInteractionSource(),
                            indication = null
                        ) { onNavigate(item.route) }
                        .padding(horizontal = 14.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "${item.emoji} ${item.label}",
                        color = contentColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
