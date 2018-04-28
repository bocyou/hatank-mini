// pages/login/login.js
var apis = require('../../config.js').apis;
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    code:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromR: options.fromR!=undefined ? options.fromR:false
    });
    wx.setNavigationBarTitle({
      title: '手机号登录',
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
  login: function (e) {
    console.log(e.detail.value);
    util.ajax(apis.users.phone, {
      forData: JSON.stringify(e.detail.value),
      userId: app.globalData.userId,
    }, res => {
      console.log(res.data);
      if(!res.data.success){
        util.showModel(res.data.errMsg);
        wx.setStorageSync("userId", res.data.userId)
        return;
      }
      wx.setStorage({
        key: 'statusCode',
        data: res.data.statusCode,
        success: function (res) {
          wx.switchTab({
            url: '../mine/mine',
          });
        },
      });
      //未注册，需要设置密码
      if(res.data.type=='n'){
        wx.navigateTo({
          url: '../forgetPass/reset/reset?txt=注册成功&to=login&rCode=' + res.data.rCode,
        });
      }
      //已经注册，保存登录状态，直接跳转
      if (res.data.type == 'l') {
        //登录成功
        util.showModel(res.data.errMsg);
        wx.navigateTo({
          url: '../success/success?txt=登录成功&to=main&from=l',
        });
      }
    });
  },
  userLogin:function(){
    wx.navigateTo({
      url: '../login/login',
    });
  },
  userRigester: function () {
    wx.navigateTo({
      url: '../register/register',
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})