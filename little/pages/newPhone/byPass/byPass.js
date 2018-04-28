// pages/newPhone/byPass/byPass.js
var api = require('../../../config.js').apis.users;
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: { 
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.to = options.type;
    this.param = options.type;
    wx.setNavigationBarTitle({
      title: '验证密码'
    }); 
  },
  userPass: function (e) {
    var reg = /^[A-Za-z0-9]{6,20}$/;
    if (!reg.test(e.detail.value)) {
      this.setData({
        userPassS: false,
      });
      return;
    }
    this.setData({
      userPass: e.detail.value,
      userPassS: true,
    });
  },
  vertifyPass: function (e) {
    var formEle = e.detail.value;
    console.log(formEle);
    util.ajax(api.update, {
      userId: app.globalData.userId,
      pass: e.detail.value.userPass,
      type:'vertifyPass'
    }, res => {
      console.log(res.data);
      if (res.data.success) {
        // wx.setStorageSync('rCode', res.data.rCode);
        this.rCode = res.data.rCode;
        util.showModel(res.data.errMsg);
        this.toWhere(this.rCode);
        return;
      }
      util.showModel(res.data.errMsg);
    });
  },
  toWhat: function () {
    wx.navigateTo({
      url: '../oriPhone/oriPhone?type=' + this.param
    });
  },
  toWhere: function (rCode) {
    if (this.to=='Phone'){
      wx.navigateTo({
        url: '../newPhone/newPhone?rCode=' + rCode
      });
    }
    if (this.to == 'Pass') {
      wx.navigateTo({
        url: '../../forgetPass/reset/reset?rCode=' + rCode
      });
    }
  },
}) 