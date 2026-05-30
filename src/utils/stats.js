/**
 * 按日汇总收支
 * @param {Array} records
 * @param {string} refDate 参考日期 YYYY-MM-DD
 * @param {number} days 往回看几天（含当天）
 * @returns {{ date: string, income: number, expense: number }[]} 升序
 */
export function getDailySummary(records, refDate, days = 14) {
  const ref = new Date(refDate);
  const labels = [];
  const map = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    labels.push(key);
    map[key] = { date: key, income: 0, expense: 0 };
  }

  for (const r of records) {
    if (map[r.date]) {
      if (r.type === 'income') map[r.date].income += r.amount;
      else map[r.date].expense += r.amount;
    }
  }

  return labels.map((k) => map[k]);
}

/**
 * 按周汇总收支（周一~周日）
 * @param {Array} records
 * @param {string} refDate 参考日期 YYYY-MM-DD（所属周为最近一周）
 * @param {number} weeks 往回看几周
 * @returns {{ week: string, income: number, expense: number }[]} 升序
 */
export function getWeeklySummary(records, refDate, weeks = 8) {
  const ref = new Date(refDate);

  // 先生成每周的起止日期（周一~周日）
  const weekRanges = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date(ref);
    end.setDate(end.getDate() - w * 7);
    // 找到这一周的周日（作为 end 的所属周）
    const dayOfWeek = end.getDay(); // 0=Sun, 1=Mon...
    const sunday = new Date(end);
    sunday.setDate(end.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
    const monday = new Date(sunday);
    monday.setDate(sunday.getDate() - 6);

    const label = `${monday.getMonth() + 1}/${monday.getDate()}~${sunday.getMonth() + 1}/${sunday.getDate()}`;
    weekRanges.push({
      label,
      start: `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`,
      end: `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`,
    });
  }

  const map = {};
  for (const wr of weekRanges) {
    map[wr.label] = { week: wr.label, income: 0, expense: 0 };
  }

  for (const r of records) {
    for (const wr of weekRanges) {
      if (r.date >= wr.start && r.date <= wr.end) {
        if (r.type === 'income') map[wr.label].income += r.amount;
        else map[wr.label].expense += r.amount;
        break;
      }
    }
  }

  return weekRanges.map((wr) => map[wr.label]);
}

/**
 * 按月汇总收支
 * @param {Array} records
 * @param {string} refDate 参考日期 YYYY-MM-DD
 * @param {number} months 往回看几个月（含当月）
 * @returns {{ month: string, income: number, expense: number }[]} 升序
 */
export function getMonthlySummary(records, refDate, months = 6) {
  const ref = new Date(refDate);
  const labels = [];
  const map = {};

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    labels.push(key);
    map[key] = { month: key, income: 0, expense: 0 };
  }

  for (const r of records) {
    const key = r.date.slice(0, 7);
    if (map[key]) {
      if (r.type === 'income') map[key].income += r.amount;
      else map[key].expense += r.amount;
    }
  }

  return labels.map((k) => map[k]);
}

/**
 * 支出分类占比
 * @param {Array} records
 * @returns {{ category: string, value: number }[]} 按金额降序
 */
export function getExpenseCategoryBreakdown(records) {
  const map = {};

  for (const r of records) {
    if (r.type !== 'expense') continue;
    if (!map[r.category]) {
      map[r.category] = { category: r.category, value: 0 };
    }
    map[r.category].value += r.amount;
  }

  return Object.values(map).sort((a, b) => b.value - a.value);
}
