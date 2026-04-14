// 云函数：login - 换取 openid
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
exports.main = async (event, context) => {
  const { code } = event;
  // 生产环境用 wx-server-sdk 获取 openid
  try {
    const wxContext = cloud.getWXContext();
    return { openid: wxContext.OPENID, appid: wxContext.APPID };
  } catch(e) {
    return { openid: 'debug_' + (code || 'anonymous'), unionid: '' };
  }
};
