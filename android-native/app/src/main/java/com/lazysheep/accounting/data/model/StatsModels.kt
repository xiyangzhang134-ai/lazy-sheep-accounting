package com.lazysheep.accounting.data.model

data class Badge(
    val key: String,
    val emoji: String,
    val name: String,
    val desc: String,
    val type: String,       // "checkin" | "streak" | "record"
    val threshold: Int,
    val color: Long         // ARGB color
)

object Badges {
    val all = listOf(
        Badge("checkin_7",   "🌱", "初来乍到", "累计打卡 7 天",   "checkin", 7,   0xFF84cc16),
        Badge("checkin_30",  "🔥", "坚持不懈", "累计打卡 30 天",  "checkin", 30,  0xFFf97316),
        Badge("checkin_100", "👑", "打卡达人", "累计打卡 100 天", "checkin", 100, 0xFFf59e0b),
        Badge("streak_30",   "⭐", "全勤奖",   "连续打卡 30 天",  "streak",  30,  0xFFeab308),
        Badge("record_7",    "📝", "记账新秀", "累计记账 7 天",   "record",  7,   0xFF38bdf8),
        Badge("record_30",   "💰", "理财能手", "累计记账 30 天",  "record",  30,  0xFF3b82f6),
        Badge("record_100",  "🏆", "财务管家", "累计记账 100 天", "record",  100, 0xFFec4899)
    )
}

data class DailySummary(
    val date: String,
    val income: Double = 0.0,
    val expense: Double = 0.0
)

data class WeeklySummary(
    val week: String,
    val income: Double = 0.0,
    val expense: Double = 0.0
)

data class MonthlySummary(
    val month: String,
    val income: Double = 0.0,
    val expense: Double = 0.0
)

data class CategoryBreakdown(
    val category: String,
    val value: Double
)
