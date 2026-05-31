package com.lazysheep.accounting.data.repository

import com.lazysheep.accounting.data.db.AppDatabase
import com.lazysheep.accounting.data.db.entities.Checkin
import com.lazysheep.accounting.data.db.entities.Record
import com.lazysheep.accounting.data.model.*
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.*

class AccountingRepository(private val db: AppDatabase) {

    // ─── Records ────────────────────────────

    fun getAllRecords(): Flow<List<Record>> = db.recordDao().getAllRecords()

    fun getRecordsByMonth(monthPrefix: String): Flow<List<Record>> =
        db.recordDao().getRecordsByMonth(monthPrefix)

    suspend fun addRecord(record: Record) = db.recordDao().insert(record)

    suspend fun deleteRecord(id: String) = db.recordDao().deleteById(id)

    // ─── Checkins ───────────────────────────

    fun getAllCheckins(): Flow<List<Checkin>> = db.checkinDao().getAllCheckins()

    suspend fun checkinToday(): CheckinResult {
        val today = todayDateStr()
        val exists = db.checkinDao().getCheckin(today)
        if (exists != null) {
            val dates = db.checkinDao().getAllCheckinsOnce().map { it.date }
            return CheckinResult(dates, isNew = false)
        }
        db.checkinDao().insert(Checkin(today))
        val dates = db.checkinDao().getAllCheckinsOnce().map { it.date }
        return CheckinResult(dates, isNew = true)
    }

    // ─── Statistics ──────────────────────────

    suspend fun getRecordDays(): Int {
        val records = db.recordDao().getAllRecordsOnce()
        return records.map { it.date }.distinct().size
    }

    suspend fun getConsecutiveCheckinDays(): Int {
        val dates = db.checkinDao().getAllCheckinsOnce().map { it.date }
        if (dates.isEmpty()) return 0
        val sorted = dates.sortedDescending()
        val today = todayDateStr()
        var count = 0
        val cal = Calendar.getInstance()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        sdf.parse(today)?.let { cal.time = it }

        for (d in sorted) {
            val exp = sdf.format(cal.time)
            if (d == exp) {
                count++
                cal.add(Calendar.DAY_OF_YEAR, -1)
            } else if (d < exp) {
                break
            }
        }
        return count
    }

    suspend fun getDailySummary(refDate: String, days: Int = 14): List<DailySummary> {
        val records = db.recordDao().getAllRecordsOnce()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val ref = sdf.parse(refDate) ?: return emptyList()
        val cal = Calendar.getInstance()

        val labels = mutableListOf<String>()
        val map = mutableMapOf<String, DailySummary>()

        cal.time = ref
        for (i in (days - 1) downTo 0) {
            cal.time = ref
            cal.add(Calendar.DAY_OF_YEAR, -i)
            val key = sdf.format(cal.time)
            labels.add(key)
            map[key] = DailySummary(key)
        }

        for (r in records) {
            map[r.date]?.let {
                if (r.type == "income") map[r.date] = it.copy(income = it.income + r.amount)
                else map[r.date] = it.copy(expense = it.expense + r.amount)
            }
        }

        return labels.map { map[it]!! }
    }

    suspend fun getWeeklySummary(refDate: String, weeks: Int = 8): List<WeeklySummary> {
        val records = db.recordDao().getAllRecordsOnce()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val ref = sdf.parse(refDate) ?: return emptyList()
        val cal = Calendar.getInstance()

        data class WeekRange(val label: String, val start: String, val end: String)

        val weekRanges = mutableListOf<WeekRange>()
        for (w in (weeks - 1) downTo 0) {
            cal.time = ref
            cal.add(Calendar.DAY_OF_YEAR, -w * 7)
            val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)
            // Find Sunday
            cal.add(Calendar.DAY_OF_YEAR, if (dayOfWeek == Calendar.SUNDAY) 0 else Calendar.SATURDAY - dayOfWeek + 1)
            val sunday = cal.clone() as Calendar
            cal.add(Calendar.DAY_OF_YEAR, -6)
            val monday = cal

            val label = "${monday.get(Calendar.MONTH) + 1}/${monday.get(Calendar.DAY_OF_MONTH)}~${sunday.get(Calendar.MONTH) + 1}/${sunday.get(Calendar.DAY_OF_MONTH)}"
            val start = sdf.format(monday.time)
            val end = sdf.format(sunday.time)
            weekRanges.add(WeekRange(label, start, end))
        }

        val map = mutableMapOf<String, WeeklySummary>()
        for (wr in weekRanges) map[wr.label] = WeeklySummary(wr.label)

        for (r in records) {
            for (wr in weekRanges) {
                if (r.date >= wr.start && r.date <= wr.end) {
                    val s = map[wr.label]!!
                    map[wr.label] = if (r.type == "income") s.copy(income = s.income + r.amount)
                    else s.copy(expense = s.expense + r.amount)
                    break
                }
            }
        }

        return weekRanges.map { map[it.label]!! }
    }

    suspend fun getMonthlySummary(refDate: String, months: Int = 6): List<MonthlySummary> {
        val records = db.recordDao().getAllRecordsOnce()
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val ref = sdf.parse(refDate) ?: return emptyList()
        val cal = Calendar.getInstance()
        cal.time = ref

        val labels = mutableListOf<String>()
        val map = mutableMapOf<String, MonthlySummary>()

        for (i in (months - 1) downTo 0) {
            cal.time = ref
            cal.add(Calendar.MONTH, -i)
            val key = "${cal.get(Calendar.YEAR)}-${String.format("%02d", cal.get(Calendar.MONTH) + 1)}"
            labels.add(key)
            map[key] = MonthlySummary(key)
        }

        for (r in records) {
            val key = r.date.substring(0, 7)
            map[key]?.let {
                map[key] = if (r.type == "income") it.copy(income = it.income + r.amount)
                else it.copy(expense = it.expense + r.amount)
            }
        }

        return labels.map { map[it]!! }
    }

    suspend fun getExpenseCategoryBreakdown(): List<CategoryBreakdown> {
        val records = db.recordDao().getAllRecordsOnce()
        val map = mutableMapOf<String, Double>()
        for (r in records) {
            if (r.type != "expense") continue
            map[r.category] = (map[r.category] ?: 0.0) + r.amount
        }
        return map.map { CategoryBreakdown(it.key, it.value) }.sortedByDescending { it.value }
    }

    // ─── Utils ──────────────────────────────

    companion object {
        fun todayDateStr(): String {
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
            return sdf.format(Date())
        }

        fun generateId(): String {
            return System.currentTimeMillis().toString(36) +
                    (1000000..9999999).random().toString(36)
        }
    }
}

data class CheckinResult(
    val dates: List<String>,
    val isNew: Boolean
)
