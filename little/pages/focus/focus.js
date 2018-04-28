// pages/focus/focus.js
var api = require('../../config.js').apis.category;
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    downCount:1,
    last:false,
    categorys:[],
    res:[],
    refreshAnimation: {},
    loading: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.cid = options.cid;
    this.focusId = options.focusId,
    this.userImg = options.userImg ? options.userImg:'';
    this.nickName = options.nickName ? options.nickName : '';
    this.setData({
      nickName: this.nickName,
      userImg: this.userImg,   
    });
    this.isFocus();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ajax();
  },
  loadM: function () {
    util.loading(this.data.loading, animation => {
      this.setData({
        refreshAnimation: animation.export()
      });
    });
  },
  ajax:function(){
   this.setData({
     loading: true
   });
   util.ajax(api.categoryByCid, {
     userId: app.globalData.userId,
     focusId: this.focusId,
     cid: this.cid,
     page: this.data.downCount
   }, res => {
       if (!res.data.result.length) {
         this.setData({
           last: true,
           loading: false
         });
         return;
       }
       this.setData({
         nickName: res.data.nickName,
         userImg: res.data.userImg,
         categorys: this.data.categorys.concat(res.data.result),
         static: {
           counts: res.data.counts,
           focus: res.data.focus,
         },
         loading: false
       });
      //  console.log(this.data);
   });
 },
 isFocus:function(){
   this.focusAjax('', (res) => {
     if (res.data.focus) {
       this.setData({
         focused: 1
       });
     }
   },true);
 },
focus:function(){
  this.focusAjax('add', (res) => {
    console.log(res);
    if(res.data.success){
      this.setData({
        focused:1
      });
    }
  });
},
unfocus: function () {
  this.focusAjax('cancel', (res)=>{
    console.log(res);
    if (res.data.success) {
      this.setData({
        focused: 0
      });
    }
  });
},
focusAjax: function (id, cb, isfocus){
  util.ajax(api.interest, {
    userId: app.globalData.userId,
    focusId: this.focusId,
    type: id,
    isfocus: isfocus
  }, res => {
    // console.log(res);
    cb && cb(res);
  });
},
 //下拉刷新
 onPullDownRefresh:function(){
   this.setData({
     downCount: 1
   });
   this.ajax();
   wx.stopPullDownRefresh();
 },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // console.log('----onReachBottom---');
    this.setData({
      downCount: ++this.data.downCount
    });
    this.ajax();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})