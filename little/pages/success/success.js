// pages/success/success.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tips: options.txt ? options.txt:'操作成功'
    });
    var to = options.to ? options.to:'main';
    this.setData({
      to: '../'+to+'/'+to,
      // from: options.from
    });
  },
  goTo:function(){
    console.log(this.data.to);
    if (this.data.to == '../main/main' || this.data.to == '../discover/discover' || this.data.to == '../mine/mine'){
      wx.switchTab({
        url: this.data.to,
      });
      return;
    }
    wx.navigateTo({
      url: this.data.to,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})