//app.js
var users = require('config.js').apis.users;
var util = require('utils/util.js');
App({
  onLaunch: function() {
    // if (!wx.getStorageSync('session3rd')) {
    //     //获取publicKey
    //     if (!wx.getStorageSync('pbkey')) {
    //       util.security.getPublicKey(()=>{
    //           //获取session3rd
    //           util.security.getSession3rd();
    //       });
    //       return;
    //     }
    //     //获取session3rd
    //     util.security.getSession3rd();
    // }
    wx.setTopBarText({
        text: '菜肴ing'
    });
    this.setGlobal();
    util.weixinLogin(this, (globalData)=>{
      console.log(globalData)
      wx.setStorageSync('userId', globalData.userId);
      wx.setStorageSync('userInfo', globalData.userInfo);
      wx.setStorageSync('loginCode', globalData.loginCode);
      this.setGlobal();
    });
  },
  setGlobal:function(){
    this.globalData.userId = wx.getStorageSync('userId');
    this.globalData.userInfo = wx.getStorageSync('userInfo');
    this.globalData.loginCode = wx.getStorageSync('loginCode');
  },
  globalData: {
    userInfo: null,
    userId:'',
  }
})