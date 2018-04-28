module.exports = {
  active:0,
  setActive: function (e) {
    console.log('--setActive:---'+e.currentTarget.dataset.active);
    if (e.currentTarget.dataset.active == 0) {
      wx.navigateTo({
        url: '../main/main',
      });
    }
    if (e.currentTarget.dataset.active == 1) {
      wx.navigateTo({
        url: '../discovery/discovery',
      });
    }
    if (e.currentTarget.dataset.active == 2) {
      wx.navigateTo({
        url: '../mine/mine',
      });
    }
    this.setData({
      active: e.currentTarget.dataset.active
    });
  }
};