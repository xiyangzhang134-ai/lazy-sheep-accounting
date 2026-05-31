package com.lazysheep.accounting.data.db

import androidx.room.*
import com.lazysheep.accounting.data.db.entities.Checkin
import kotlinx.coroutines.flow.Flow

@Dao
interface CheckinDao {
    @Query("SELECT * FROM checkins ORDER BY date DESC")
    fun getAllCheckins(): Flow<List<Checkin>>

    @Query("SELECT * FROM checkins ORDER BY date DESC")
    suspend fun getAllCheckinsOnce(): List<Checkin>

    @Query("SELECT * FROM checkins WHERE date = :date LIMIT 1")
    suspend fun getCheckin(date: String): Checkin?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(checkin: Checkin)
}
