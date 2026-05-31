package com.lazysheep.accounting.data.model

import androidx.compose.ui.graphics.Color

data class Category(
    val value: String,
    val label: String,
    val color: Color
)

object Categories {
    val expenseCategories = listOf(
        Category("food", "🍜 餐饮", Color(0xFFef4444)),
        Category("transport", "🚗 交通", Color(0xFFf97316)),
        Category("shopping", "🛒 购物", Color(0xFFeab308)),
        Category("entertainment", "🎮 娱乐", Color(0xFF22c55e)),
        Category("housing", "🏠 住房", Color(0xFF3b82f6)),
        Category("medical", "💊 医疗", Color(0xFF8b5cf6)),
        Category("education", "📚 教育", Color(0xFF06b6d4)),
        Category("other_expense", "💸 其他支出", Color(0xFF6b7280))
    )

    val incomeCategories = listOf(
        Category("salary", "💰 工资", Color(0xFF16a34a)),
        Category("bonus", "🎁 奖金", Color(0xFF2563eb)),
        Category("investment", "📈 投资", Color(0xFF9333ea)),
        Category("side_hustle", "🔧 兼职", Color(0xFF0891b2)),
        Category("other_income", "📥 其他收入", Color(0xFF4b5563))
    )

    private val allCategories = expenseCategories + incomeCategories

    fun getCategories(type: String): List<Category> {
        return if (type == "income") incomeCategories else expenseCategories
    }

    fun findCategory(value: String): Category? {
        return allCategories.find { it.value == value }
    }
}
