// pages/community/index.js
Page({
  data: {
    posts: [],
    loading: false,
    showNewPost: false,
    postContent: '',
    postIndustry: '',
  },
  onShow() {
    const posts = wx.getStorageSync('feleme_posts') || [];
    this.setData({ posts });
  },
  openNewPost() { this.setData({ showNewPost: true, postContent: '', postIndustry: '' }); },
  closeNewPost() { this.setData({ showNewPost: false }); },
  onContentInput(e) { this.setData({ postContent: e.detail.value }); },
  onIndustryInput(e) { this.setData({ postIndustry: e.detail.value }); },
  submitPost() {
    const { postContent, postIndustry, posts } = this.data;
    if (!postContent.trim()) { wx.showToast({ title: '请输入内容', icon: 'none' }); return; }
    const profile = wx.getStorageSync('feleme_profile') || {};
    const loginData = wx.getStorageSync('feleme_login_result') || {};
    const post = {
      id: Date.now(), content: postContent.trim(), industry: postIndustry,
      author: profile.nickname || loginData.nickname || '匿名用户',
      avatar: profile.avatar || loginData.avatarUrl || '',
      likes: 0, liked: false, resonances: 0, resonated: false,
      comments: [], date: new Date().toLocaleDateString('zh-CN'), createdAt: Date.now(),
    };
    const newPosts = [post, ...posts];
    wx.setStorageSync('feleme_posts', newPosts);
    this.setData({ posts: newPosts, showNewPost: false });
    try { wx.cloud.call({ config: { env: 'cloudbase-3g22c9ce5bcf0e55' }, name: 'tcb', data: { collection: 'posts', action: 'add', data: post }, fail: err => console.error(err) }); } catch(e) {}
  },
  goDetail(e) { wx.navigateTo({ url: '/pages/post-detail/index?postId=' + e.currentTarget.dataset.id }); },
  toggleLike(e) {
    const id = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(p => {
      if (String(p.id) === String(id)) {
        const liked = !p.liked;
        return { ...p, liked, likes: liked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    });
    wx.setStorageSync('feleme_posts', posts);
    this.setData({ posts });
  },
});
