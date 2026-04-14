// pages/profile/index.js
const INDUSTRIES = ['互联网', '金融', '教育', '医疗', '制造', '零售', '政府/事业单位', '其他'];
const WORK_YEARS = ['< 1年', '1-3年', '3-5年', '5-10年', '> 10年'];

Page({
  data: {
    profile: {},
    testHistory: [],
    diaries: [],
    practiceCount: 0,
    industries: INDUSTRIES,
    workYearsOptions: WORK_YEARS,
    showEdit: false,
    editIndustry: '',
    editWorkYears: '',
  },
  onShow() {
    const profile = wx.getStorageSync('feleme_profile') || {};
    const testHistory = wx.getStorageSync('feleme_testHistory') || [];
    const diaries = wx.getStorageSync('feleme_diaries') || [];
    this.setData({ profile, testHistory, diaries, practiceCount: profile.practiceCount || 0 });
  },
  openEdit() {
    const { profile } = this.data;
    this.setData({ showEdit: true, editIndustry: profile.industry || '', editWorkYears: profile.workYears || '' });
  },
  closeEdit() { this.setData({ showEdit: false }); },
  onIndustryChange(e) { this.setData({ editIndustry: INDUSTRIES[e.detail.value] }); },
  onWorkYearsChange(e) { this.setData({ editWorkYears: WORK_YEARS[e.detail.value] }); },
  saveProfile() {
    const { editIndustry, editWorkYears, profile } = this.data;
    const newProfile = { ...profile, industry: editIndustry, workYears: editWorkYears };
    wx.setStorageSync('feleme_profile', newProfile);
    this.setData({ profile: newProfile, showEdit: false });
    wx.showToast({ title: '保存成功', icon: 'none' });
  },
  goTestHistory() { wx.navigateTo({ url: '/pages/test-history/index' }); },
  clearData() {
    wx.showModal({ title: '清除数据', content: '确定清除所有本地数据？', success: confirm => {
      if (!confirm.confirm) return;
      wx.clearStorageSync();
      this.setData({ profile: {}, testHistory: [], diaries: [], practiceCount: 0 });
      wx.showToast({ title: '已清除', icon: 'none' });
    }});
  },
});
