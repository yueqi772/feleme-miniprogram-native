// 云函数：initUser - 初始化用户档案
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const DB = cloud.database();
exports.main = async (event, context) => {
  const { openid } = event;
  if (!openid) return { error: '缺少 openid' };
  try {
    const exist = await DB.collection('feleme_userProfile').where({ openid }).get();
    if (exist.data.length === 0) {
      await DB.collection('feleme_userProfile').add({ data: { openid, industry: '', workYears: '', favoriteScripts: [], practiceCount: 0, createdAt: Date.now() } });
    }
    const profile = await DB.collection('feleme_userProfile').where({ openid }).get();
    return { success: true, profile: profile.data[0] || {} };
  } catch(e) { return { success: false, error: e.message }; }
};
