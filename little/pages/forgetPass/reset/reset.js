// pages/forgetPass/vertify/reset.js
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
    this.rCode = options.rCode;
    wx.setNavigationBarTitle({
      title: '设置密码',
    });
  },
  userPass:function(e){
    var reg = /^[A-Za-z0-9]{6,20}$/;
    switch (e.currentTarget.dataset.password){
      case 'pass':
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
      break;
      case 'confirm':
        if (!reg.test(e.detail.value)) {
          this.setData({
            userPassConfirmS: false,
          });
          return;
        }
        this.setData({
          userPassConfirm: e.detail.value,
          userPassConfirmS:true,
        });
    }
  },
  resetPass:function(e){
    var formEle = e.detail.value;
    console.log(formEle);
    if (formEle.userPass != formEle.userPassConfirm){
      util.showModel('两次输入的密码不一致！');
      return;
    }
    util.ajax(api.update,{
      userId:app.globalData.userId,
      pass: e.detail.value.userPass,
      rCode: this.rCode,
      type: "updatePass"
    },res=>{
      console.log(res.data);
      if (res.data.success){
        wx.showModal({
          title: '温馨提示',
          content: res.data.errMsg,
          showCancel: true,
          cancelText: '取消',
          confirmText: '随便看看',
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              wx.switchTab({
                url: '../../main/main',
              });
            }
          },
        });
        return;
      }
      wx.showModal({
        title: '温馨提示',
        content: res.data.errMsg,
        showCancel: true,
        cancelText: '取消',
        confirmText: '去验证',
        success: function(res) {
          console.log(res);
          if(res.confirm){
            wx.navigateTo({
              url: '../../phone/phone',
            });
          }
        },
      });
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})