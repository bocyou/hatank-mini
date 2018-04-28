// main/main.js
var apis = require('../../config.js').apis;
var category = apis.category;
var users = apis.users;
var util = require('../../utils/util.js'); 
var app = getApp();
var history = [
  {
  id: "1",
  title: "宫保鸡丁"
}, {
  id: "2",
  title: "家常菜"
},
{
  id: "3",
  title: "聚会"
},
{
  id: "4",
  title: "四川菜"
},
{
  id: "5",
  title: "麻辣"
}, {
  id: "6",
  title: "节日庆典"
}
];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    searchShow:false,
    searchValue:'',
    history: history,
    random: '',
    focus: [],
    focusPage:1,
    mainBottom:false,
    topics: '',
    hot:[],
    new:[],
    refreshAnimation: {},
    loading:false,
    noFocusData: false
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.ajax();
    this.loadM();
  },
  /**
   * 验证加解密
   */
  onEncrypt:function(){
      util.http({
        app: "wxInquiryBalanceService",
        func: "InquiryBalance",
        accno:'623166000000118058',
        userName:'陈玉龙',
        money:'10000000亿'
      }, res => {
        //后台返回的数据
        console.log(res);
        this.setData({
          data:res
        })
      });
  },
  loadM:function(){
    util.loading(this.data.loading, animation => {
      this.setData({
        refreshAnimation: animation.export()
      });
    });
  },
  /*主页显示搜索历史*/
  searchMask:function(e){
    // this.onEncrypt()
    this.setData({
      searchShow:true
    });
    // console.log(this.data.searchShow);
  },
  luck:function(){
    wx.navigateTo({
      url: `../detail/detail?id=${parseInt(Math.random() * 2000)}`,
    });
  },
  /*关闭搜索历史*/
  closeMask:function(){
    this.setData({
      searchShow: false,
      searchValue:''
    });
  },
  /*储存search输入*/ 
  getSearchValue:function(e){
    // console.log(e);
    this.setData({
      searchValue:e.detail.value
    });
  },
  /*跳转列表页*/
  toSearch: function () {
    wx.navigateTo({
      url: '../list/list?searchValue=' + this.data.searchValue+'&from=list',
    });
  },
  /*跳转列表页*/
  toQuery:function(e){
    // console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.id){
      wx.navigateTo({
        url: '../list/list?searchValue=' + e.currentTarget.dataset.val+'&from=main',
      });
    }
  },
  toList: function () {
    wx.navigateTo({
      url: '../list/list',
    });
  },
  lower: function (e) {
    // console.log(e);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      searchShow: false,
      searchValue: ''
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.ajax();
    wx.stopPullDownRefresh();
  },
  ajax:function(){
    util.ajax(category.query, {
      hot: 1,
      new: 1
    }, res => {
      // console.log(res.data.result);
      this.setData({
        hot: res.data.result.hot,
        new: res.data.result.new
      });
    });
  },
  ajaxFocus: function () {
    // console.log(wx.getStorageSync('globalData'));
    this.setData({
      userId: app.globalData.userId,
      loading: true
    });
    util.ajax(users.focus, {
      _id: app.globalData.userId,
      main: true,
      page: this.data.focusPage
    }, res => {
      console.log(res.data);
      this.setData({
        noFocusData: false
      });
      console.log(res.data);
      if (!res.data.length) {
        this.setData({
          noFocusData: true
        });
      }
      if (res.data.length){
        this.setData({
          focus: (this.data.focus).concat(res.data),  
          loading: false     
        });
        return;
      }
      this.setData({
        mainBottom:true,
        loading: false
      });
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      focusPage: ++this.data.focusPage
    });
    this.ajaxFocus();
    // console.log('onReachBottom');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})