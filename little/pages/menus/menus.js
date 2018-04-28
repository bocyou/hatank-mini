// pages/menus/menus.js
var api = require('../../config.js').apis.category;
var util = require('../../utils/util.js'); 
var colors = ['#D0011B', '#F6A623', '#8B572A', '#7ED321', '#417505', '#BD0FE1', '#9012FE', '#4990E2', '#000000', '#5CB22B'];
colors = colors.concat(colors,colors);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    colors: colors,
    menus: '',
  },
  queryCategory:function(e){
    // console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../focus/focus?&cid=' + e.currentTarget.dataset.id,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ajax();
  },
  ajax:function(){
    util.ajax(api.query, { menus: true }, res => {
      // console.log(res.data.data);
      this.setData({
        menus: res.data.data
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.ajax();
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})