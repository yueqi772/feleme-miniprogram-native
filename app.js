// app.js
App({
  globalData: {
    userInfo: null,
    openid: '',
    loginToken: '',
    isLogin: false,
  },

  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloudbase-3g22c9ce5bcf0e55',
        traceUser: true,
      });
    }
    // 检查登录状态
    this.checkLogin();
  },

  checkLogin() {
    const loginData = wx.getStorageSync('feleme_login_result') || {};
    if (loginData.openid) {
      this.globalData.openid = loginData.openid;
      this.globalData.loginToken = loginData.loginToken || '';
      this.globalData.userInfo = loginData;
      this.globalData.isLogin = true;
    }
  },

  setLogin(data) {
    this.globalData.openid = data.openid;
    this.globalData.loginToken = data.loginToken || '';
    this.globalData.userInfo = data;
    this.globalData.isLogin = true;
    wx.setStorageSync('feleme_login_result', data);
  },
});
