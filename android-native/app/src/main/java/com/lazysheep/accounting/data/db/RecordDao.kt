package com.lazysheep.accounting.data.db

import androidx.room.*
import com.lazysheep.accounting.data.db.entities.Record
import kotlinx.coroutines.flow.Flow

@Dao
interface RecordDao {
    @Query("SELECT * FROM records ORDER BY date DESC, id DESC")
    fun getAllRecords(): Flow<List<Record>>

    @Query("SELECT * FROM records WHERE date LIKE :monthPrefix ORDER BY date DESC, id DESC")
    fun getRecordsByMonth(monthPrefix: String): Flow<List<Record>>

    @Query("SELECT * FROM records ORDER BY date DESC, id DESC")
    suspend fun getAllRecordsOnce(): List<Record>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(record: Record)

    @Delete
    suspend fun delete(record: Record)

    @Query("DELETE FROM records WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("SELECT COUNT(*) FROM records")
    suspend fun getCount(): Int
}
