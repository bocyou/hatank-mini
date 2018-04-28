// pages/register/register.js
var apis = require('../../config.js').apis;
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tphoneS:'',
    userNameS:'',
    userPass:'', 
    phone:'',
    code:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '新用户注册',
    });
  },
  userName:function(e){
    // console.log(e.detail.value);
    var reg = /\w{4,16}/
    if(reg.test(e.detail.value)){
      this.setData({
        userNameS:true
      });
      return;
    }
    this.setData({
      userNameS: false
    });
  },
  userPass: function (e) {
    // console.log(e.detail.value);
    var reg = /^[A-Za-z0-9]{6,20}$/
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
  phone: function (e) {
    // console.log(e.detail.value);
    this.setData({
      tphoneS: e.detail.value
    });
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    if (reg.test(e.detail.value)) {
      this.setData({
        phoneS: true,
        phoneF:true,
      });
      this.phoneGet = e.detail.value;
      return;
    }
    this.setData({
      phoneS: false
    });
  },
  sendCode:function(e){
    // console.log('sendCode');
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    //调用发送验证码接口
    util.ajax(apis.sendCode, {
      phone: this.phoneGet,
      userId: app.globalData.userId,
      type:'r'
    }, res => {
      console.log(res.data);
      if(res.data.success){
        util.showModel(res.data.errMsg);
        return;
      }
      util.showModel(res.data.errMsg);
      clearInterval(timer);
    });
    var start = 60;
    var timer = setInterval(()=>{
      start--;
      this.setData({
        sendCodedTxt:start+'s',
        phoneS: false
      });
      if (start===0){
        clearInterval(timer);
        if (!reg.test(this.data.tphoneS)){
          this.setData({
            sendCodedTxt: "发送"
          });
          return;
        }
        this.setData({
          sendCodedTxt:"发送",
          phoneS: true
        });
      }
    },1000);
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
  email: function (e) {
    this.setData({
      needed: true
    });
    // console.log(e.detail.value);
    if (e.detail.value){
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if (reg.test(e.detail.value)) {
        this.setData({
          emailS: true
        });
        return;
      }
      this.setData({
        emailS: false
      });
      return;
    }
    this.setData({
      needed: false
    });
  },
  register:function(e){
    console.log(e.detail.value);
    util.ajax(apis.users.register,{
      forData: JSON.stringify(e.detail.value),
      userId: app.globalData.userId,
    },res=>{
      util.showModel(res.data.errMsg);
      // console.log(res.data.register);
      if (res.data.success){
          wx.navigateTo({
            url: '../success/success?txt=注册成功&&to=login',
          });
      }
    });
  },
  phoneLogin:function(){
    wx.navigateTo({
      url: '../phone/phone?fromR=true',
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})