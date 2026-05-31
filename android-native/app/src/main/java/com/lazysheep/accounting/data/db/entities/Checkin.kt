package com.lazysheep.accounting.data.db.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "checkins")
data class Checkin(
    @PrimaryKey
    val date: String    // "YYYY-MM-DD"
)
