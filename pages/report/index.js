// pages/report/index.js
const RISK_CONFIG = [
  { min: 80, level: '低风险职场环境', emoji: '✅', color: '#16a34a', bg: '#f0fdf4', tip: '你的职场环境相对健康，继续保持自我觉察' },
  { min: 60, level: '轻度风险', emoji: '⚠️', color: '#ca8a04', bg: '#fefce8', tip: '存在一定的职场压力源，建议保持边界' },
  { min: 40, level: '中度风险', emoji: '⚠️', color: '#ea580c', bg: '#fff7ed', tip: '可能处于精神控制的环境中，建议开始记录并寻求支持' },
  { min: 0,  level: '高风险职场环境', emoji: '🚨', color: '#dc2626', bg: '#fef2f2', tip: '你正经历严重的职场PUA，请优先保护自己的身心健康' },
];
const CATEGORY_CONFIG = {
  '持续否定': { emoji: '😤', color: '#f97316', bg: '#fff7ed', strategies: ['记录每次否定事件', '要求具体的改进反馈', '与 HR 沟通'] },
  '情绪操控': { emoji: '🎭', color: '#8b5cf6', bg: '#f5f3ff', strategies: ['识别情感勒索模式', '保持情绪边界', '寻求可信赖的朋友倾诉'] },
  '关系贬低': { emoji: '👎', color: '#ec4899', bg: '#fdf2f8', strategies: ['不要内化他人的负面评价', '收集正面反馈记录', '与正能量同事建立联系'] },
  '表现惩罚': { emoji: '❌', color: '#dc2626', bg: '#fef2f2', strategies: ['用数据记录你的工作成果', '了解绩效评估的具体标准', '必要时向管理层申诉'] },
  '言语威胁': { emoji: '😰', color: '#7c3aed', bg: '#ede9fe', strategies: ['保留书面威胁证据', '了解公司的申诉渠道', '必要时寻求法律援助'] },
};

Page({
  data: {
    test: null,
    risk: null,
    categories: [],
    strategies: [],
    advice: '',
    isLoaded: false,
  },

  onLoad(query) {
    const testId = parseInt(query.testId);
    const testHistory = wx.getStorageSync('feleme_testHistory') || [];
    const test = testHistory.find(t => String(t.id) === String(testId)) || testHistory[0];
    if (!test) { wx.showToast({ title: '未找到测试记录', icon: 'none' }); return; }

    const risk = RISK_CONFIG.find(r => test.score >= r.min) || RISK_CONFIG[RISK_CONFIG.length - 1];
    const total = Object.values(test.counts || {}).reduce((a, b) => a + b, 0);
    const categories = Object.entries(test.counts || {})
      .sort(([, a], [, b]) => b - a)
      .map(([cat, count]) => {
        const cfg = CATEGORY_CONFIG[cat] || { emoji: '•', color: '#999', bg: '#f9f9f9', strategies: [] };
        return { cat, emoji: cfg.emoji, color: cfg.color, bg: cfg.bg, count, pct: total ? Math.round(count / total * 100) : 0, strategies: cfg.strategies };
      });

    const adviceList = categories.flatMap(c => c.strategies).slice(0, 3);
    const dateStr = new Date(test.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

    this.setData({ test: { ...test, dateStr }, risk, categories, strategies: adviceList, isLoaded: true });
  },

  onShareAppMessage() {
    return { title: '我在 A里味 做了职场环境评估，结果是' + (this.data.risk?.level || ''), path: '/pages/home/index' };
  },

  goTest() { wx.redirectTo({ url: '/pages/test/index' }); },
  goPractice() { wx.switchTab({ url: '/pages/tools/index' }); },
  goTreehole() { wx.switchTab({ url: '/pages/treehole/index' }); },
});
