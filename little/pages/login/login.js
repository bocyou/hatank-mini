// pages/login/login.js
var apis = require('../../config.js').apis;
var util = require('../../utils/util.js'); 
var app = getApp();
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
    wx.setNavigationBarTitle({
      title: '用户登录',
    });
  },
  userName: function (e) {
    // console.log(e.detail.value);
    var reg = /\w{4,12}/
    if (reg.test(e.detail.value)) {
      this.setData({
        userNameS: true
      });
      return;
    }
    this.setData({
      userNameS: false
    });
  },
  userPass: function (e) {
    // console.log(e.detail.value);
    var reg = /^[A-Za-z0-9]{6,10}$/
    if (reg.test(e.detail.value)) {
      this.setData({
        userPassS: true
      });
      return;
    }
    this.setData({
      userPassS: false
    });
  },
  login: function (e) {
    console.log(e.detail.value);
    var status = wx.getStorageSync('statusCode')==""?'undefined':wx.getStorageSync('statusCode');
    console.log(status);
    util.ajax(apis.users.login, {
      forData: JSON.stringify(e.detail.value),
      statusCode: status,
      userId: app.globalData.userId
    }, res => {
      // console.log(res.data.statusCode);
      //登录成功
      if (res.data.success){
        wx.setStorage({ 
          key: 'statusCode',
          data: res.data.statusCode,
          success: function(res) {
            wx.switchTab({
              url: '../mine/mine',
            });
          },
        });
      }
      util.showModel(res.data.errMsg);
    });
  },
  phoneLogin: function () {
    wx.navigateTo({
      url: '../phone/phone',
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})