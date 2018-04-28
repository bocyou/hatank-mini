// pages/newUserName/newUserName.js
var apis = require('../../config.js').apis;
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设置新邮箱',
    });
    this.picCode();
  },
  email: function (e) {
    this.setData({
      needed: true
    });
    // console.log(e.detail.value);
    if (e.detail.value) {
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
  picCodeV:function(e){
    var reg = /^[0-9A-Za-z]{4}$/;
    if(reg.test(e.detail.value)){
      this.setData({
        picCodeS:true
      });
    }
  },
  picCode:function(){
    util.ajax(apis.picCode, {
      userId: app.globalData.userId,
    }, res => {
      console.log(res);
      if (!res.data.success){
        util.showModel(res.data.errMsg);
        return;
      }
      this.setData({
        picCode: 'data:image/png;base64,'+res.data.src
      });
    });
  },
  updateEmail:function(e){
    console.log(e.detail.value);
    util.ajax(apis.users.update, {
      userId: app.globalData.userId,
      email: e.detail.value.email,
      picCode: e.detail.value.picCode,
      type:"updateEmail"
    }, res => {
      console.log(res.data);
      //修改成功
      util.showModel(res.data.errMsg);
      if (res.data.success) {
        wx.navigateTo({
          url: '../settings/settings',
        });
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})