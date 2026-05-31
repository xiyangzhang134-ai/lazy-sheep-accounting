package com.lazysheep.accounting.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.lazysheep.accounting.data.db.AppDatabase
import com.lazysheep.accounting.data.model.*
import com.lazysheep.accounting.data.repository.AccountingRepository
import com.lazysheep.accounting.ui.components.ChartPoint
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class TrendViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getInstance(application)
    private val repo = AccountingRepository(db)

    private val _granularity = MutableStateFlow("daily")
    val granularity: StateFlow<String> = _granularity.asStateFlow()

    private val _dateStr = MutableStateFlow(AccountingRepository.todayDateStr())
    val dateStr: StateFlow<String> = _dateStr.asStateFlow()

    private val _lineData = MutableStateFlow<List<ChartPoint>>(emptyList())
    val lineData: StateFlow<List<ChartPoint>> = _lineData.asStateFlow()

    private val _expenseBreakdown = MutableStateFlow<List<Pair<String, Double>>>(emptyList())
    val expenseBreakdown: StateFlow<List<Pair<String, Double>>> = _expenseBreakdown.asStateFlow()

    private val _loading = MutableStateFlow(true)
    val loading: StateFlow<Boolean> = _loading.asStateFlow()

    init {
        loadData()
    }

    fun setGranularity(gran: String) {
        _granularity.value = gran
        _dateStr.value = AccountingRepository.todayDateStr()
        loadData()
    }

    fun setDateStr(date: String) {
        _dateStr.value = date
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            _loading.value = true
            val gran = _granularity.value
            val refDate = _dateStr.value

            when (gran) {
                "daily" -> {
                    val summary = repo.getDailySummary(refDate, 14)
                    _lineData.value = summary.map {
                        ChartPoint(it.date, it.income, it.expense)
                    }
                }
                "weekly" -> {
                    val summary = repo.getWeeklySummary(refDate, 8)
                    _lineData.value = summary.map {
                        ChartPoint(it.week, it.income, it.expense)
                    }
                }
                "monthly" -> {
                    val summary = repo.getMonthlySummary(refDate, 6)
                    _lineData.value = summary.map {
                        ChartPoint(it.month, it.income, it.expense)
                    }
                }
            }

            val breakdown = repo.getExpenseCategoryBreakdown()
            _expenseBreakdown.value = breakdown.map { cb ->
                val cat = Categories.findCategory(cb.category)
                (cat?.label ?: cb.category) to cb.value
            }

            _loading.value = false
        }
    }
}
