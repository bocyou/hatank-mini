// pages/mine/mine.js
var apis = require('../../config.js').apis;
var category = apis.category;
var users = apis.users;
var util = require('../../utils/util.js'); 
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    lastIdx: 0,
    thisIdx: 0,
    swiperH:'820rpx',
    userName: '',
    userId:'',
    userImg:'',
    cookies:[],
    cookiesLen:0,
    cookiesPage:1,
    cookieLoading:false,
    cookLoading: false,
    fanLoading: false,
    noCookiesData: false,
    noCooksData: false,
    noFansData: false,
    cookieBottom:false,
    cooks: [],
    cooksLen: 0,
    cooksPage:1,
    cooksBottom: false,
    fans: [],
    fansPage:1 ,
    fansBottom: false,
    refreshAnimation: {},
    loading: false
  },
  loadM: function () {
    util.loading(this.data.loading, animation => {
      this.setData({
        refreshAnimation: animation.export()
      });
    });
  },
  //顶部菜单切换
  activeInforMenus: function (e) {
    var currIdx = e.currentTarget.dataset.index;
    this.setData({
      active: currIdx,
      thisIdx: currIdx
    });
    if (currIdx != this.data.lastIdx) {
      this.setData({
        lastIdx: currIdx
      });
    }
    wx.setStorageSync("active", currIdx);
    wx.setStorageSync("thisIdx", currIdx);
  },
  //滑动切换内容
  swiperTo: function (e) {
    var currIdx = e.detail.current;
    this.setData({
      active: currIdx
    });
    if (currIdx != this.data.lastIdx) {
      this.setData({
        lastIdx: currIdx
      });
    }
    wx.setStorageSync("active", currIdx);
    wx.setStorageSync("thisIdx", currIdx);
    this.ajax(currIdx);
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getSystemInfo({
    //   success: res=> {
    //     console.log(res);
    //     this.setData({
    //       swiperH: (res.windowHeight - 200)*2+'rpx'
    //     })
    //     console.log(this.data.swiperH)
    //   },
    // })
    wx.setNavigationBarTitle({
      title: '我的',
    });
    console.log(this.data)
    wx.setStorageSync('thisIdx', '');
    wx.setStorageSync('active', '');
  },
  onHide:function(){
    this.setData({
      // active: 0,
      lastIdx: 0,
      // thisIdx: 0,
      cookies: [],
      cookiesPage: 1,
      cookieBottom: false,
      cooks: [],
      cooksPage: 1,
      cooksBottom: false,
      fans: [],
      fansPage: 1,
      fansBottom: false,
      refreshAnimation: {},
      // loading: false
    });
    // this.data.cooksBottom = false;
    this.cooksActive = false;
    // this.data.fansBottom = false;
    this.fansActive = false;
  },
  onShow:function(){
    var thisIndex = wx.getStorageSync('thisIdx')!=""?wx.getStorageSync('thisIdx'):0;
    var thisActive = wx.getStorageSync('active') != "" ? wx.getStorageSync('active') : 0;
    this.setData({
      thisIdx: thisIndex,
      thisActive:thisActive
    });
    console.log(wx.getStorageSync('thisIdx'))
    this.ajax(thisIndex);
    // this.cookiesAjax();
    // this.cookiesActive = true;
  },
  ajax: function (currIdx){
    console.log(currIdx);
    switch (currIdx){
      case 0:
        if (this.data.cookieBottom || this.cookiesActive){
          return;
        }
        this.cookiesAjax();
      break;
      case 1:
        if (this.data.cooksBottom || this.cooksActive) {
          return;
        }
        this.setData({
          cooks:[],
          cooksPage: 1,
        });
        this.cooksActive = true;
        this.cooksAjax();
        break;
      case 2:
        if (this.data.fansBottom || this.fansActive) {
          return;
        }
        this.fansActive = true;
        this.fansAjax();
        break;
    }
  },
  cookiesAjax:function(){
    this.setData({
      cookieLoading: true,
      userId: app.globalData.userId,
    });
    util.ajax(users.query, {
      mark: 'cookies',
      userId: app.globalData.userId,
      page: this.data.cookiesPage
    }, res => {
      console.log(res.data);
      console.log(this.data.cookiesPage);
        if (this.data.cookiesPage == 1 && !res.data.cookies.length) {
            this.setData({
              noCookiesData:true
            })
        }
        this.setData({
          noCookiesData: false
        })
        if (this.data.cookiesPage == 1){
          this.setData({
            cookiesLen: res.data.cookies.length,
            cooksLen: res.data.cooked
          })
        }
        this.setData({
          static: res.data,
          cookies: this.data.cookies.concat(res.data.data),
          cookieLoading: false,
          userName: res.data.nickName,
          userImg: res.data.userImg,
          cookiesPage: ++this.data.cookiesPage
        });
        if (this.data.cookies.length == this.data.static.cookies.length){
          this.setData({
            cookieBottom: true,
            cookieLoading: false
          }); 
       }
    });
  },
  cooksAjax: function () {
    this.setData({
      cookLoading: true
    });
    util.ajax(users.query, {
      mark: 'cooks',
      userId: app.globalData.userId,
      page: this.data.cooksPage
    }, res => {
      console.log(res)
      if (this.data.cooksPage == 1 && !res.data.data.length) {
          this.setData({
            noCooksData: true
          })
      }
      this.setData({
        cooksPage: ++this.data.cooksPage
      });
      if (res.data.data.length){
        this.setData({
          cooks: this.data.cooks.concat(res.data.data),
          cookLoading: false
        });
      }
      this.setData({
        cookLoading: false
      });
      // console.log('----cooks变量数据---');
      // console.log(this.data.cooks);
      // console.log('----ajax返回数据---');
      // console.log(res.data.data);
      if (this.data.cooks.length == this.data.static.cooked.length) {
        this.setData({
          cooksBottom: true,
          loading: false
        });
      }
    });
  },
  fansAjax: function () {
    this.setData({
      fanLoading: true
    });
    var that = this;
    util.ajax(users.query, {
      mark: 'fans',
      userId: app.globalData.userId,
      page: this.data.fansPage
    }, res => {
      // console.log(res.data);
      if (this.data.fansPage == 1 && !res.data.data.length) {
          this.setData({
            noFansData: true
          })
      }
      // if (res.data.data.length) {
        that.setData({
          fans: this.data.fans.concat(res.data.data),
          fanLoading: false
        });
        this.setData({
          fansPage: ++this.data.fansPage
        });
        // return;
      // }
      if (this.data.fans.length == this.data.static.fans.length) {
        this.setData({
          fansBottom: true,
          fanLoading: false
        });
      }
    });
  },
  reachCookiesBottom:function(e){
    this.cookiesAjax();
  },
  reachCooksBottom: function (e) {
    this.cooksAjax();
    // console.log('reachCooksBottom');
  },
  reachFansBottom: function (e) {
    this.fansAjax();
    // console.log('reachFansBottom');
  },
  /**
   * 取消收藏
   * */
  cancelCookie: function (e) {
    var cancel = e.currentTarget.dataset.cancel;
    console.log(cancel);
    util.ajax(apis.category.cookie, {
      userId: app.globalData.userId,
      id: cancel,
      cancel:true
    }, res => {
      console.log(res.data);
      if (res.data.success){
        var cookies = this.data.cookies;
        console.log(cookies);
        console.log(cookies.length)
        for (var i = 0; i < cookies.length; i++) {
          if (cookies[i]._id == cancel) {
            cookies.splice(i, 1);
            var delIdx = this.data.static.cookies.indexOf(cancel);
            var lastArrs = this.data.static.cookies;
            lastArrs.splice(delIdx,1);
            console.log(lastArrs);
            this.setData({
              cookies: cookies,
              cookiesLen: lastArrs.length,
            });
            if (!cookies.length) {
              this.setData({
                cookiesPage:1,
                noCookiesData: true,
                cookiesLen:0
              });
            }
            break;
          }
        }
        return;
      }
    });
  },
  delCook:function(e){
    var del = e.currentTarget.dataset.del;
    console.log(del);
    util.ajax(category.manger, {
      userId: app.globalData.userId,
      id: del,
      del: true
    }, res => {
      console.log(res.data);
      if (res.data.success) {
        var cooks = this.data.cooks;
        console.log(cooks);
        for (var i = 0; i < cooks.length; i++) {
          if (cooks[i]._id == del) {
            cooks.splice(i, 1);
            this.setData({
              cooks: cooks,
              cooksLen: cooks.length ? cooks.length: 0,
            });
            if (!this.data.cooksLen) {
              this.setData({
                noCooksData: true,
              });
            }
            break;
          }
        }
        return;
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})