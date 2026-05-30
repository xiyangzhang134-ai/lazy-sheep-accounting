/**
 * 支出分类
 */
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: '🍜 餐饮', color: '#ef4444' },
  { value: 'transport', label: '🚗 交通', color: '#f97316' },
  { value: 'shopping', label: '🛒 购物', color: '#eab308' },
  { value: 'entertainment', label: '🎮 娱乐', color: '#22c55e' },
  { value: 'housing', label: '🏠 住房', color: '#3b82f6' },
  { value: 'medical', label: '💊 医疗', color: '#8b5cf6' },
  { value: 'education', label: '📚 教育', color: '#06b6d4' },
  { value: 'other_expense', label: '💸 其他支出', color: '#6b7280' },
];

/**
 * 收入分类
 */
export const INCOME_CATEGORIES = [
  { value: 'salary', label: '💰 工资', color: '#16a34a' },
  { value: 'bonus', label: '🎁 奖金', color: '#2563eb' },
  { value: 'investment', label: '📈 投资', color: '#9333ea' },
  { value: 'side_hustle', label: '🔧 兼职', color: '#0891b2' },
  { value: 'other_income', label: '📥 其他收入', color: '#4b5563' },
];

/**
 * 根据 type 返回对应分类列表
 */
export function getCategories(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

/**
 * 根据 value 查找分类对象
 */
export function findCategory(value) {
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find((c) => c.value === value);
}
