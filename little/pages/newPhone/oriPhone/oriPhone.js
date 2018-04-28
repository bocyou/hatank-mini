// pages/newPhone/oriPhone/oriPhone.js
var apis = require('../../../config.js').apis;
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    phone: '',
    code: ''
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    console.log(options);
    this.to = options.type;
    this.param = options.type;
    wx.setNavigationBarTitle({
      title: '验证手机号'
    });
  },
  phone: function (e) {
    this.setData({
      tphoneS: e.detail.value
    });
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    if (reg.test(e.detail.value)) {
      this.setData({
        phoneS: true,
        phoneF: true,
      });
      this.phoneGet = e.detail.value;
      return;
    }
    this.setData({
      phoneS: false
    });
  },
  sendCode: function (e) {
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    //调用发送验证码接口
    util.ajax(apis.sendCode, {
      phone: this.phoneGet,
      userId: app.globalData.userId,
      type: 'p'
    }, res => {
      console.log(res.data);
      if (!res.data.success) {
        util.showModel(res.data.errMsg);
        clearInterval(timer);
        return;
      }
      util.showModel(res.data.errMsg);
    });
    var start = 60;
    var timer = setInterval(() => {
      start--;
      this.setData({
        sendCodedTxt: start + 's',
        phoneS: false
      });
      if (start === 0) {
        clearInterval(timer);
        this.setData({
          sendCodedTxt: "发送",
          phoneS: true
        });
      }
    }, 1000);
  },
  code: function (e) {
    // console.log(e.detail.value);
    var reg = /^[A-Za-z0-9]{6}$/
    if (reg.test(e.detail.value)) {
      this.setData({
        codeS: true
      });
      return;
    }
    this.setData({
      codeS: false
    });
  },
  vertifyPhone: function (e) {
    console.log(e.detail.value);
    util.ajax(apis.users.update, {
      phone: e.detail.value.phone,
      code: e.detail.value.code,
      userId: app.globalData.userId,
      type:'vertifyPhone'
    }, res => {
      console.log(res.data);
      if (!res.data.success) {
        util.showModel(res.data.errMsg);
        return;
      }
      // wx.setStorageSync('rCode', res.data.rCode);
      util.showModel(res.data.errMsg);
      this.toWhere(res.data.rCode);
    });
  },
  toWhat:function(rCode){
    wx.navigateTo({
      url: '../byPass/byPass?type=' + this.param
    });
  },
  toWhere: function (rCode) {
    if (this.to == 'Phone') {
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