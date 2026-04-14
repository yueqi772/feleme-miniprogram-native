// pages/home/index.js
const app = getApp();
const EMOTION_MAP = { '愤怒': '😠', '委屈': '😢', '焦虑': '😰', '失落': '😔', '麻木': '😐' };
const EMOTION_LIST = ['愤怒', '委屈', '焦虑', '失落', '麻木'];
const PRACTICE_SCENARIOS = [
  { id: 'pua-1', icon: '👔', title: '绩效施压', difficulty: 2, desc: '领导以绩效排名威胁' },
  { id: 'pua-2', icon: '🕙', title: '超时工作', difficulty: 2, desc: '强制加班却无回报' },
  { id: 'pua-3', icon: '🚫', title: '孤立排挤', difficulty: 3, desc: '同事故意冷落你' },
];

Page({
  data: {
    industry: '互联网',
    workYears: '3年',
    practiceCount: 0,
    currentMonth: '',
    latestTest: null,
    latestRisk: null,
    practiceScenarios: PRACTICE_SCENARIOS,
    emotionCalendar: {},
    emotionStats: [],
    puaTypes: [],
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    calendarDays: [],
  },

  onLoad() {
    const loginData = app.globalData.userInfo || wx.getStorageSync('feleme_login_result') || {};
    const profile = wx.getStorageSync('feleme_profile') || {};
    const diaries = wx.getStorageSync('feleme_diaries') || [];
    const testHistory = wx.getStorageSync('feleme_testHistory') || [];

    const today = new Date();
    const currentMonth = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

    // Build emotion calendar
    const emotionCalendar = {};
    diaries.forEach(d => {
      if (!emotionCalendar[d.date]) emotionCalendar[d.date] = d.emotion;
    });

    // Build calendar days
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay() || 7;
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const prefix = Array.from({ length: firstDay - 1 }, (_, i) => ({ day: '', isToday: false }));
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { day, dateStr, emotion: emotionCalendar[dateStr] || '', isToday: day === today.getDate() };
    });
    const calendarDays = [...prefix, ...days];

    // Emotion stats
    const emotionStats = EMOTION_LIST.map(e => ({
      emotion: e, emoji: EMOTION_MAP[e],
      count: diaries.filter(d => d.emotion === e).length,
      pct: diaries.length ? Math.round(diaries.filter(d => d.emotion === e).length / diaries.length * 100) : 0,
    })).filter(e => e.count > 0);

    // Latest test
    const latestTest = testHistory[0] || null;
    let latestRisk = null;
    let puaTypes = [];
    if (latestTest) {
      latestRisk = this._getRiskInfo(latestTest.score);
      const totalCount = Object.values(latestTest.counts || {}).reduce((a, b) => a + b, 0);
      puaTypes = Object.entries(latestTest.counts || {})
        .filter(([, c]) => c > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([type, count]) => {
          const info = this._getPUAInfo(type);
          return { type, emoji: info.emoji, count, pct: totalCount ? Math.round(count / totalCount * 100) : 0 };
        });
      latestTest.timeStr = this._formatTime(new Date(latestTest.date).getTime());
    }

    this.setData({
      industry: profile.industry || '互联网',
      workYears: profile.workYears || '3年',
      practiceCount: profile.practiceCount || 0,
      currentMonth,
      latestTest,
      latestRisk,
      emotionCalendar,
      emotionStats,
      puaTypes,
      calendarDays,
    });
  },

  onShow() {
    this.onLoad(); // refresh
  },

  _getRiskInfo(score) {
    if (score >= 80) return { level: '低风险', emoji: '✅', colorClass: 'text-green', bgClass: 'tag-green', bg: 'bg-green-50', color: 'text-green-600' };
    if (score >= 60) return { level: '轻度', emoji: '⚠️', colorClass: 'text-yellow', bgClass: 'tag-yellow', bg: 'bg-yellow-50', color: 'text-yellow-600' };
    if (score >= 40) return { level: '中度', emoji: '⚠️', colorClass: 'text-orange', bgClass: 'tag-orange', bg: 'bg-orange-50', color: 'text-orange-600' };
    return { level: '高风险', emoji: '🚨', colorClass: 'text-red', bgClass: 'tag-red', bg: 'bg-red-50', color: 'text-red-600' };
  },

  _getPUAInfo(type) {
    const map = {
      '持续否定': { emoji: '😤' },
      '情绪操控': { emoji: '🎭' },
      '关系贬低': { emoji: '👎' },
      '表现惩罚': { emoji: '❌' },
      '言语威胁': { emoji: '😰' },
    };
    return map[type] || { emoji: '•' };
  },

  _formatTime(ts) {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  goTest() { wx.navigateTo({ url: '/pages/test/index' }); },
  goPractice() { wx.navigateTo({ url: '/pages/tools/index?tab=practice' }); },
  goPracticeItem(e) {
    const scenario = e.currentTarget.dataset.scenario;
    wx.navigateTo({ url: `/pages/practice/index?scenarioId=${scenario.id}` });
  },
  goTreehole() { wx.switchTab({ url: '/pages/treehole/index' }); },
  goCommunity() { wx.switchTab({ url: '/pages/community/index' }); },
  goTools() { wx.navigateTo({ url: '/pages/tools/index' }); },
  goReport() {
    const latest = this.data.latestTest;
    if (!latest) return;
    wx.navigateTo({ url: `/pages/report/index?testId=${latest.id || latest.localId}` });
  },
});
