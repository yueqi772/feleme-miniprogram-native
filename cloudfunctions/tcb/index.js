// 云函数：tcb - 通用数据库 CRUD
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const DB = cloud.database();
const _ = DB.command;
exports.main = async (event, context) => {
  const { collection, action, data, query, openid, limit = 20, skip = 0 } = event;
  if (!collection) return { success: false, error: '缺少 collection' };
  const col = DB.collection('feleme_' + collection);
  try {
    if (action === 'add' && data) {
      const res = await col.add({ data: { ...data, createdAt: Date.now() } });
      return { success: true, id: res._id };
    }
    if (action === 'list') {
      let q = col.limit(limit).skip(skip).orderBy('createdAt', 'desc');
      if (openid) q = q.where({ openid });
      const res = await q.get();
      return { success: true, list: res.data };
    }
    if (action === 'get' && query) {
      const res = await col.where(query).limit(1).get();
      return { success: true, data: res.data[0] || null };
    }
    if (action === 'update' && query && data) {
      const setData = {}, incData = {};
      for (const [k, v] of Object.entries(data)) {
        if (String(k).endsWith('_delta')) incData[k.replace(/_delta$/, '')] = v;
        else setData[k] = v;
      }
      const update = {};
      if (Object.keys(setData).length) update.$set = setData;
      if (Object.keys(incData).length) update.$inc = incData;
      await col.where(query).update({ data: update });
      return { success: true };
    }
    return { success: false, error: '不支持的 action: ' + action };
  } catch(err) { return { success: false, error: err.message }; }
};
