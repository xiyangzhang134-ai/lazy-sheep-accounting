package com.lazysheep.accounting.data.db.entities

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "records",
    indices = [Index(value = ["date"])]
)
data class Record(
    @PrimaryKey
    val id: String,
    val amount: Double,
    val type: String,       // "income" | "expense"
    val category: String,
    val note: String,
    val date: String        // "YYYY-MM-DD"
)
