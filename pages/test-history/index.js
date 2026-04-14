// pages/test-history/index.js
Page({
  data: { history: [] },
  onShow() { this.setData({ history: wx.getStorageSync('feleme_testHistory') || [] }); },
  goReport(e) { wx.navigateTo({ url: '/pages/report/index?testId=' + e.currentTarget.dataset.id }); },
  deleteItem(e) {
    wx.showModal({ title: '删除', content: '确定删除这条记录？', success: confirm => {
      if (!confirm.confirm) return;
      const id = e.currentTarget.dataset.id;
      const history = this.data.history.filter(h => String(h.id) !== String(id));
      wx.setStorageSync('feleme_testHistory', history);
      this.setData({ history });
    }});
  },
});
