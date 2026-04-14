// pages/test/index.js
// 职场环境识别测试 - PUA行为检测
const QUESTIONS = [
  {
    id: 1, category: '持续否定', emoji: '😤',
    question: '你的领导或同事是否经常对你说"你做得不够好"、"这点小事都做不好"之类的话？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔（1-2次/月）', score: 1 },
      { text: '经常（1-2次/周）', score: 2 },
      { text: '每天都有', score: 3 },
    ],
  },
  {
    id: 2, category: '情绪操控', emoji: '🎭',
    question: '当你表达不满时，对方是否会说"我这么做都是为你好"、"别人想要还没有呢"之类的话？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '每次都这样', score: 3 },
    ],
  },
  {
    id: 3, category: '关系贬低', emoji: '👎',
    question: '对方是否会当众羞辱你、嘲笑你的想法或工作成果？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '经常发生', score: 3 },
    ],
  },
  {
    id: 4, category: '表现惩罚', emoji: '❌',
    question: '当你达到目标后，对方是否会找其他理由否定你、或设置更高的门槛？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '每次都这样', score: 3 },
    ],
  },
  {
    id: 5, category: '言语威胁', emoji: '😰',
    question: '对方是否用暗示或明示的方式威胁你，如"绩效不达标就走人"、"让别人来接替你的位置"？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '经常', score: 3 },
    ],
  },
  {
    id: 6, category: '持续否定', emoji: '😤',
    question: '你的工作成果是否经常被无条件推翻、要求重做，而没有具体理由？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '每次', score: 3 },
    ],
  },
  {
    id: 7, category: '情绪操控', emoji: '🎭',
    question: '当你坚持自己的立场时，对方是否会突然冷落你、或表现出受伤的样子？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '每次都这样', score: 3 },
    ],
  },
  {
    id: 8, category: '关系贬低', emoji: '👎',
    question: '你是否经常被拿来和其他同事做负面比较，被说"你看看人家"？',
    options: [
      { text: '从未', score: 0 },
      { text: '偶尔', score: 1 },
      { text: '经常', score: 2 },
      { text: '每天都会', score: 3 },
    ],
  },
];

const RISK_CONFIG = [
  { min: 80, level: '低风险职场环境', emoji: '✅', color: '#16a34a', bg: '#f0fdf4', tip: '你的职场环境相对健康，继续保持自我觉察' },
  { min: 60, level: '轻度风险', emoji: '⚠️', color: '#ca8a04', bg: '#fefce8', tip: '存在一定的职场压力源，建议保持边界' },
  { min: 40, level: '中度风险', emoji: '⚠️', color: '#ea580c', bg: '#fff7ed', tip: '可能处于精神控制的环境中，建议开始记录并寻求支持' },
  { min: 0,  level: '高风险职场环境', emoji: '🚨', color: '#dc2626', bg: '#fef2f2', tip: '你正经历严重的职场PUA，请优先保护自己的身心健康' },
];

Page({
  data: {
    questions: QUESTIONS,
    currentIndex: 0,
    answers: {},
    scores: {},
    submitting: false,
    progress: 0,
  },

  onLoad() {
    const testHistory = wx.getStorageSync('feleme_testHistory') || [];
    this.setData({ testHistory });
  },

  onAnswer(e) {
    const { index, score } = e.currentTarget.dataset;
    const { currentIndex, answers } = this.data;
    answers[currentIndex] = score;
    this.setData({ answers, [`scores[${currentIndex}]`]: score });

    // Animate to next
    setTimeout(() => {
      if (currentIndex < this.data.questions.length - 1) {
        this.setData({ currentIndex: currentIndex + 1, progress: Math.round((currentIndex + 2) / this.data.questions.length * 100) });
      } else {
        this.submitTest();
      }
    }, 300);
  },

  goPrev() {
    const { currentIndex } = this.data;
    if (currentIndex > 0) {
      this.setData({ currentIndex: currentIndex - 1, progress: Math.round(currentIndex / this.data.questions.length * 100) });
    }
  },

  submitTest() {
    this.setData({ submitting: true });
    const { answers, questions } = this.data;

    // Calculate
    const counts = {};
    let totalScore = 0;
    questions.forEach((q, i) => {
      const s = answers[i] || 0;
      totalScore += s;
      counts[q.category] = (counts[q.category] || 0) + s;
    });
    const avgScore = Math.round(totalScore / questions.length * (100 / 3));
    const risk = RISK_CONFIG.find(r => avgScore >= r.min) || RISK_CONFIG[RISK_CONFIG.length - 1];

    const testResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      score: avgScore,
      totalScore,
      counts,
      riskLevel: risk.level,
      emoji: risk.emoji,
      answers,
    };

    // Save
    const testHistory = wx.getStorageSync('feleme_testHistory') || [];
    testHistory.unshift(testResult);
    wx.setStorageSync('feleme_testHistory', testHistory);

    // Save to cloud
    this._saveToCloud(testResult);

    // Navigate
    wx.redirectTo({ url: `/pages/report/index?testId=${testResult.id}` });
  },

  _saveToCloud(result) {
    try {
      wx.cloud.call({
        config: { env: 'cloudbase-3g22c9ce5bcf0e55' },
        name: 'tcb',
        data: { collection: 'testHistory', action: 'add', data: result },
        success: res => { console.log('[cloud] testHistory saved:', res.result); },
        fail: err => { console.error('[cloud] testHistory save failed:', err); },
      });
    } catch (e) { console.error(e); }
  },
});
