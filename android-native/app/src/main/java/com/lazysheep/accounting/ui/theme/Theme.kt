package com.lazysheep.accounting.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = Pink400,
    onPrimary = Color.White,
    primaryContainer = Pink50,
    secondary = Purple400,
    onSecondary = Color.White,
    secondaryContainer = Purple50,
    tertiary = Sky400,
    onTertiary = Color.White,
    background = Color(0xFFfef3c7),
    surface = Color.White,
    surfaceVariant = Pink50,
    onBackground = Color(0xFF1f2937),
    onSurface = Color(0xFF374151),
    outline = Pink400.copy(alpha = 0.3f)
)

@Composable
fun LazySheepTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography(),
        content = content
    )
}
