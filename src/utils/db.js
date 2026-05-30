const DB_NAME = 'accounting_app';
const DB_VERSION = 1;

/** @returns {Promise<IDBDatabase>} */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('records')) {
        const store = db.createObjectStore('records', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains('checkins')) {
        db.createObjectStore('checkins', { keyPath: 'date' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Records ──────────────────────────────

export async function getAllRecords() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readonly');
    const store = tx.objectStore('records');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addRecord(record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    const req = store.add(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRecord(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ─── Checkins ─────────────────────────────

export async function getAllCheckins() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('checkins', 'readonly');
    const store = tx.objectStore('checkins');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result.map((r) => r.date));
    req.onerror = () => reject(req.error);
  });
}

export async function addCheckin(dateStr) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('checkins', 'readwrite');
    const store = tx.objectStore('checkins');
    // put = insert or update (use date as key)
    const req = store.put({ date: dateStr });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function hasCheckin(dateStr) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('checkins', 'readonly');
    const store = tx.objectStore('checkins');
    const req = store.get(dateStr);
    req.onsuccess = () => resolve(!!req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── Migration ─────────────────────────────

/**
 * 首次使用 IndexedDB 时，把 localStorage 的旧数据迁移过来
 */
export async function migrateFromLocalStorage() {
  const db = await openDB();

  // 检查 records 是否已有数据
  const existingRecords = await getAllRecords();
  if (existingRecords.length > 0) return; // 已迁移

  // 从 localStorage 读取旧数据
  try {
    const raw = localStorage.getItem('accounting_records');
    if (raw) {
      const records = JSON.parse(raw);
      const tx1 = db.transaction('records', 'readwrite');
      for (const r of records) tx1.objectStore('records').add(r);
      await new Promise((res) => { tx1.oncomplete = res; });
      localStorage.removeItem('accounting_records');
    }
  } catch { /* ignore */ }

  try {
    const raw = localStorage.getItem('checkin');
    if (raw) {
      const dates = JSON.parse(raw);
      const tx2 = db.transaction('checkins', 'readwrite');
      for (const d of dates) tx2.objectStore('checkins').put({ date: d });
      await new Promise((res) => { tx2.oncomplete = res; });
      localStorage.removeItem('checkin');
    }
  } catch { /* ignore */ }
}
