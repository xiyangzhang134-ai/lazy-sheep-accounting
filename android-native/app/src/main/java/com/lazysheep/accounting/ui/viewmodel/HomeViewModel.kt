package com.lazysheep.accounting.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.lazysheep.accounting.data.db.AppDatabase
import com.lazysheep.accounting.data.db.entities.Record
import com.lazysheep.accounting.data.repository.AccountingRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class HomeViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getInstance(application)
    private val repo = AccountingRepository(db)

    private val _monthFilter = MutableStateFlow<String?>(null)

    val records: StateFlow<List<Record>> = _monthFilter.flatMapLatest { month ->
        if (month != null) repo.getRecordsByMonth(month)
        else repo.getAllRecords()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val stats: StateFlow<Triple<Double, Double, Double>> = records.map { list ->
        val income = list.filter { it.type == "income" }.sumOf { it.amount }
        val expense = list.filter { it.type == "expense" }.sumOf { it.amount }
        Triple(income, expense, income - expense)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), Triple(0.0, 0.0, 0.0))

    val monthFilter: StateFlow<String?> = _monthFilter.asStateFlow()

    fun setMonthFilter(month: String?) {
        _monthFilter.value = month
    }

    fun addRecord(amount: Double, type: String, category: String, note: String, date: String) {
        viewModelScope.launch {
            val record = Record(
                id = AccountingRepository.generateId(),
                amount = amount,
                type = type,
                category = category,
                note = note,
                date = date
            )
            repo.addRecord(record)
        }
    }

    fun deleteRecord(id: String) {
        viewModelScope.launch {
            repo.deleteRecord(id)
        }
    }
}
