// pages/detail/detail.js
var api = require('../../config.js').apis.category;
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    materia: [],
    currId:'',
    focusId:'',
    detail:{},
    nickName: '',
    imgUrl: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      currId: options.id ? options.id : '24',
      focusId: options.focusId
    });
    this.ajax({
      id: this.data.currId,
      userId: app.globalData.userId
    },res=>{
      this.setData({
        detail: res.data.materias,
        materia: JSON.parse(res.data.materias.ingredients),
        cookied: res.data.cookied,
        agreed: res.data.agree,
        nickName: res.data.nickName,
        imgUrl: res.data.imgUrl,
      });
      // console.log(res.data);
    });
  },
  ajax: function (obj, cb) {
    util.ajax(api.detailById, obj, res => {
      cb && cb(res);
    });
  },
  cookied:function(){
    util.ajax(api.cookie, {
      userId: app.globalData.userId,
      id: this.data.currId
    }, res => {
      console.log(res.data.cookied);
      this.setData({
        cookied: res.data.cookied,
      });
    });
  },
  agreed: function () {
    util.ajax(api.agree, {
      userId: app.globalData.userId,
      id: this.data.currId
    }, res => {
      console.log(res.data.agree);
      this.setData({
        agreed: res.data.agree,
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.ajax({
      id: this.data.currId
    }, res => {
      this.setData({
        detail: res.data.materias,
        materia: JSON.parse(res.data.materias.ingredients)
      });
      console.log(res.data);
      wx.stopPullDownRefresh();
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})