import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProgressRing from "../components/ProgressRing";
import AnimalModal from "../components/AnimalModal";
import { useRecords, useCheckins } from "../hooks/useData";
import { getRecordDays, todayDateStr, getConsecutiveCheckinDays } from "../utils/storage";

const BADGES = [
  { key: "checkin_7", emoji: "🌱", name: "初来乍到", desc: "累计打卡 7 天", type: "checkin", threshold: 7, color: "#84cc16", bg: "bg-lime-100", animal: "🐣", animalName: "小鸡破壳", animalColor: "#fde68a", animalDesc: "叽叽叽~ 你迈出了第一步！" },
  { key: "checkin_30", emoji: "🔥", name: "坚持不懈", desc: "累计打卡 30 天", type: "checkin", threshold: 30, color: "#f97316", bg: "bg-orange-100", animal: "🦊", animalName: "火焰小狐", animalColor: "#fed7aa", animalDesc: "嗷呜~ 你的热情像火焰一样！" },
  { key: "checkin_100", emoji: "👑", name: "打卡达人", desc: "累计打卡 100 天", type: "checkin", threshold: 100, color: "#f59e0b", bg: "bg-amber-100", animal: "🐧", animalName: "帝企鹅", animalColor: "#bfdbfe", animalDesc: "啪嗒啪嗒~ 你是打卡界的王者！" },
  { key: "streak_30", emoji: "⭐", name: "全勤奖", desc: "连续打卡 30 天不间断", type: "streak", threshold: 30, color: "#eab308", bg: "bg-yellow-100", animal: "🐰", animalName: "星星小兔", animalColor: "#fce7f3", animalDesc: "蹦蹦跳跳~ 你从未缺席每一天！" },
  { key: "record_7", emoji: "📝", name: "记账新秀", desc: "累计记账 7 天", type: "record", threshold: 7, color: "#38bdf8", bg: "bg-sky-100", animal: "🐱", animalName: "记账小猫", animalColor: "#e0e7ff", animalDesc: "喵~ 记账的习惯正在养成！" },
  { key: "record_30", emoji: "💰", name: "理财能手", desc: "累计记账 30 天", type: "record", threshold: 30, color: "#3b82f6", bg: "bg-blue-100", animal: "🐶", animalName: "理财汪汪", animalColor: "#fef3c7", animalDesc: "汪汪~ 金钱管理大师就是你！" },
  { key: "record_100", emoji: "🏆", name: "财务管家", desc: "累计记账 100 天", type: "record", threshold: 100, color: "#ec4899", bg: "bg-pink-100", animal: "🐻", animalName: "管家熊熊", animalColor: "#fce7f3", animalDesc: "嗷呜~ 100天的坚持太了不起了！" },
];

export default function Achievement() {
  const navigate = useNavigate();
  const { records, loading: recLoading } = useRecords();
  const { checkins, loading: chkLoading, doCheckin } = useCheckins();
  const [checkedToday, setCheckedToday] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const recordDays = useMemo(() => getRecordDays(records), [records]);
  const checkinDays = checkins.length;
  const streakDays = useMemo(() => getConsecutiveCheckinDays(checkins), [checkins]);
  const loading = recLoading || chkLoading;
  useMemo(() => { setCheckedToday(checkins.includes(todayDateStr())); }, [checkins]);
  const handleCheckin = async () => {
    const result = await doCheckin();
    setCheckedToday(true);
    if (result.isNew) { setJustCheckedIn(true); setTimeout(() => setJustCheckedIn(false), 2000); }
  };
  const getProgress = (badge) => {
    let total;
    if (badge.type === "checkin") total = checkinDays;
    else if (badge.type === "streak") total = streakDays;
    else total = recordDays;
    return { total, unlocked: total >= badge.threshold };
  };
  const unlockedCount = BADGES.filter((b) => getProgress(b).unlocked).length;
  const checkinGoal = BADGES.find((b) => b.type === "checkin" && !getProgress(b).unlocked)?.threshold || 100;
  const checkinProgress = Math.min(100, Math.round((checkinDays / checkinGoal) * 100));
  const recordGoal = BADGES.find((b) => b.type === "record" && !getProgress(b).unlocked)?.threshold || 100;
  const recordProgress = Math.min(100, Math.round((recordDays / recordGoal) * 100));
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 flex items-center justify-center"><p className="text-4xl animate-bounce">🐰</p></div>;

  const rdiv = React.createElement;

  return React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50" },
    React.createElement("div", { className: "pointer-events-none fixed inset-0 overflow-hidden" },
      React.createElement("div", { className: "absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" }),
      React.createElement("div", { className: "absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" })
    )
  );
}