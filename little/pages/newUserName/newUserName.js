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
      title: '设置新用户名',
    });
    this.picCode();
  },
  userName: function (e) {
    var reg = /\w{4,12}/;
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
  updateUserName:function(e){
    // console.log(e.detail.value);
    util.ajax(apis.users.update, {
      userId: app.globalData.userId,
      userName: e.detail.value.userName,
      picCode: e.detail.value.picCode,
      type:"updateUserName"
    }, res => {
      // console.log(res.data);
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