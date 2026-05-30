import {
  getAllRecords,
  addRecord as dbAddRecord,
  deleteRecord as dbDeleteRecord,
  getAllCheckins,
  addCheckin as dbAddCheckin,
  hasCheckin,
  migrateFromLocalStorage,
} from './db';

// 应用启动时自动迁移旧数据
migrateFromLocalStorage();

// ─── 工具函数（同步） ─────────────────────

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function todayDateStr() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

/**
 * 记账不重复日期个数（同步，传 records）
 * @param {Array} records
 * @returns {number}
 */
export function getRecordDays(records) {
  return new Set(records.map((r) => r.date)).size;
}

// ─── 记账记录（异步） ─────────────────────

export async function loadRecords() {
  return getAllRecords();
}

export async function addRecordAsync(record) {
  return dbAddRecord(record);
}

export async function deleteRecordAsync(id) {
  return dbDeleteRecord(id);
}

// ─── 打卡记录（异步） ─────────────────────

export async function loadCheckins() {
  return getAllCheckins();
}

export async function checkinTodayAsync() {
  const today = todayDateStr();
  const exists = await hasCheckin(today);
  if (exists) {
    const dates = await getAllCheckins();
    return { dates, isNew: false };
  }
  await dbAddCheckin(today);
  const dates = await getAllCheckins();
  return { dates, isNew: true };
}

export async function hasCheckedInTodayAsync() {
  return hasCheckin(todayDateStr());
}

/**
 * 计算连续打卡天数（从今天往回数）
 * @param {string[]} dates 打卡日期数组
 * @returns {number}
 */
export function getConsecutiveCheckinDays(dates) {
  if (dates.length === 0) return 0;
  const sorted = dates.slice().sort().reverse(); // 最新在前
  const today = todayDateStr();
  let count = 0;
  let expected = new Date(today);

  for (const d of sorted) {
    const cur = d;
    const exp = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, '0')}-${String(expected.getDate()).padStart(2, '0')}`;
    if (cur === exp) {
      count++;
      expected.setDate(expected.getDate() - 1);
    } else if (cur < exp) {
      break; // 断了
    }
    // cur > exp 不可能（sorted 是降序）
  }
  return count;
}
