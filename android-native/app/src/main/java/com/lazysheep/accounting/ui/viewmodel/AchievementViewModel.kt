package com.lazysheep.accounting.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.lazysheep.accounting.data.db.AppDatabase
import com.lazysheep.accounting.data.repository.AccountingRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AchievementViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getInstance(application)
    private val repo = AccountingRepository(db)

    private val _recordDays = MutableStateFlow(0)
    val recordDays: StateFlow<Int> = _recordDays.asStateFlow()

    private val _checkinDays = MutableStateFlow(0)
    val checkinDays: StateFlow<Int> = _checkinDays.asStateFlow()

    private val _streakDays = MutableStateFlow(0)
    val streakDays: StateFlow<Int> = _streakDays.asStateFlow()

    private val _checkedToday = MutableStateFlow(false)
    val checkedToday: StateFlow<Boolean> = _checkedToday.asStateFlow()

    private val _justCheckedIn = MutableStateFlow(false)
    val justCheckedIn: StateFlow<Boolean> = _justCheckedIn.asStateFlow()

    private val _loading = MutableStateFlow(true)
    val loading: StateFlow<Boolean> = _loading.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            _loading.value = true

            val checkins = repo.getAllCheckins()
            checkins.collect { list ->
                _checkinDays.value = list.size
                _checkedToday.value = list.any { it.date == AccountingRepository.todayDateStr() }
            }
        }

        viewModelScope.launch {
            _recordDays.value = repo.getRecordDays()
            _streakDays.value = repo.getConsecutiveCheckinDays()
            _loading.value = false
        }
    }

    fun doCheckin() {
        viewModelScope.launch {
            val result = repo.checkinToday()
            _checkinDays.value = result.dates.size
            _checkedToday.value = true
            _streakDays.value = repo.getConsecutiveCheckinDays()

            if (result.isNew) {
                _justCheckedIn.value = true
                kotlinx.coroutines.delay(2000)
                _justCheckedIn.value = false
            }
        }
    }
}
