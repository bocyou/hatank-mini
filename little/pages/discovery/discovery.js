// pages/divcovery/divcovery.js
var api = require('../../config.js').apis.users;
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
  data: {
    unfocusCount:1,
    focus:[],
    tunes:[],
    noFocusData:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.ajax();
  },
  onShow:function(){
    this.ajax();
  },
  toFocus:function(e){
    wx.navigateTo({
      url: '../focus/focus?focusId=' + e.currentTarget.dataset.focusid,
    });
  },
  changeOne:function(){
    this.setData({
      unfocusCount: ++this.data.unfocusCount
    });
    this.ajax();  
  },
  lower: function () {

  },
  ajax:function(cb){
    util.ajax(api.focus, {
      _id: app.globalData.userId,
    }, res => {
      this.setData({
        noFocusData: false
      });
      console.log(res.data);
      if (!res.data.interest.length) {
          this.setData({
            noFocusData: true
          });
      }
      this.setData({
        focus: res.data.interest,
      });
      cb && cb();
    });
    util.ajax(api.unfocus, {
      _id: app.globalData.userId,
      page: this.data.unfocusCount
    }, res => {
      // console.log(res.data.tunes);
      this.setData({
        tunes: res.data.tunes
      });
      cb && cb();
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.ajax(function(){
      wx.stopPullDownRefresh();
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})