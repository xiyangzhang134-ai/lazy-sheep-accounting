package com.lazysheep.accounting.data.model

data class Badge(
    val key: String,
    val emoji: String,
    val name: String,
    val desc: String,
    val type: String,       // "checkin" | "streak" | "record"
    val threshold: Int,
    val color: Long,        // ARGB color
    val animal: String,     // cute animal emoji
    val animalName: String,
    val animalDesc: String
)

object Badges {
    val all = listOf(
        Badge("checkin_7",   "🌱", "初来乍到", "累计打卡 7 天",   "checkin", 7,   0xFF84cc16,
            "🐣", "小鸡破壳", "叽叽叽~ 你迈出了第一步！"),
        Badge("checkin_30",  "🔥", "坚持不懈", "累计打卡 30 天",  "checkin", 30,  0xFFf97316,
            "🦊", "火焰小狐", "嗷呜~ 你的热情像火焰一样！"),
        Badge("checkin_100", "👑", "打卡达人", "累计打卡 100 天", "checkin", 100, 0xFFf59e0b,
            "🐧", "帝企鹅",   "啪嗒啪嗒~ 你是打卡界的王者！"),
        Badge("streak_30",   "⭐", "全勤奖",   "连续打卡 30 天",     "streak",  30,  0xFFeab308,
            "🐰", "星星小兔", "蹦蹦跳跳~ 你从未缺席每一天！"),
        Badge("record_7",    "📝", "记账新秀", "累计记账 7 天",    "record",  7,   0xFF38bdf8,
            "🐱", "记账小猫", "喵~ 记账的习惯正在养成！"),
        Badge("record_30",   "💰", "理财能手", "累计记账 30 天",   "record",  30,  0xFF3b82f6,
            "🐶", "理财汪汪", "汪汪~ 金钱管理大师就是你！"),
        Badge("record_100",  "🏆", "财务管家", "累计记账 100 天",  "record",  100, 0xFFec4899,
            "🐻", "管家熊熊", "嗷呜~ 100天的坚持太了不起了！")
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
