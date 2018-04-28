// pages/settings/settings.js
var api = require('../../config.js').apis;
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('statusCode'));
    util.ajax(api.isLogined,{
      statusCode:wx.getStorageSync('statusCode')
    },res=>{
      console.log(res.data);
      if(!res.data.success){
        wx.showModal({
          title: '温馨提示',
          content: res.data.errMsg,
          showCancel: true,
          cancelText: '返回',
          confirmText: '去登录',
          success: function(res) {
            if(res.confirm){
              wx.navigateTo({
                url: '../login/login',
              });
              return;
            }
            wx.switchTab({
              url: '../mine/mine',
            });
          },
        })
        return;
      }
      wx.setNavigationBarTitle({
        title: '安全设置',
      });
      util.ajax(api.users.query, {
        userId: app.globalData.userId,
        setting: true
      }, res => {
        // console.log(res.data);
        this.setData({
          nickName: res.data.nickName,
          password: res.data.password,
          phone: res.data.phone ? res.data.phone.substr(0, 3) + ' **** ' + res.data.phone.substr(res.data.phone.length - 4, res.data.phone.length) : '',
          img: res.data.img,
          email: res.data.email ? res.data.email.substr(0, 2) + ' **** ' + res.data.email.substr(res.data.email.length - 8, res.data.email.length) : ''
        });
      });
    });
  },
  updateIcon:function(){
    wx.chooseImage({
      success: res=>{
        console.log(res);
        //上传图片到服务器
        wx.uploadFile({
          url: api.users.upload,
          filePath: res.tempFilePaths[0],
          formData:{
            'userId': app.globalData.userId,
          },
          name: 'icon',
          success: function (res) {
            console.log(res.data);
            if (JSON.parse(res.data).success){
              util.showModel(JSON.parse(res.data).errMsg);
              wx.switchTab({
                url: '../mine/mine'
              })
            }
          }
        }).onProgressUpdate(function (res) {
            // console.log(res);
        });
      },
    });
  },
  updateEmail:function(){
    wx.navigateTo({
      url: '../newEmail/newEmail',
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})