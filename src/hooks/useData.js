import { useState, useEffect, useCallback } from 'react';
import { loadRecords, loadCheckins, checkinTodayAsync, addRecordAsync, deleteRecordAsync } from '../utils/storage';

/**
 * 管理记账记录的 hook
 */
export function useRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords().then((r) => {
      setRecords(r);
      setLoading(false);
    });
  }, []);

  const addRecord = useCallback(async (record) => {
    await addRecordAsync(record);
    setRecords((prev) => [record, ...prev]);
  }, []);

  const deleteRecord = useCallback(async (id) => {
    await deleteRecordAsync(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, loading, addRecord, deleteRecord };
}

/**
 * 管理打卡记录的 hook
 */
export function useCheckins() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckins().then((d) => {
      setCheckins(d);
      setLoading(false);
    });
  }, []);

  const doCheckin = useCallback(async () => {
    const result = await checkinTodayAsync();
    setCheckins(result.dates);
    return result;
  }, []);

  return { checkins, loading, doCheckin };
}
