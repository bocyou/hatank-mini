// pages/list/list.js
var api = require('../../config.js').apis.category;
var util = require('../../utils/util.js');  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selects:[],
    currSel: 0,
    searchBy:'',
    from:'',
    searchValue:'',
    mark:0,
    default:0,
    defaultData: [],
    defaultPage:1,
    defaultBottom:false,
    defaultReset: 0,
    scored: 0,
    scoredData: [],
    scoredPage: 1,
    scoredBottom: false,
    scoredReset: 0,
    cooked: 0,
    cookedData: [],
    cookedPage: 1,
    cookedBottom: false,
    cookedReset: 0,
    active: 0,
    lastIdx: 0,
    thisIdx: 0,
    slideTo:64,
    topics:[],
    refreshAnimation: {},
    loading: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      selects: [{
        text: '默认',
        searchBy: ''
      }, {
        text: '用户id',
        searchBy: 'uid'
      }, {
        text: '用户名',
        searchBy: 'uname'
      }]
    })
    var that = this;
    if (options.from){
      that.setData({
        searchValue: options.searchValue
      });
    }
    // console.log(that.data.searchValue);
    this.searchBtn();
    this.loadM()
  },
  //选择搜索类型
  changeSel:function(e){
    this.setData({
      default: 0,
      defaultData: [],
      defaultPage: 1,
      defaultBottom: false,
      // defaultReset: 0,
      scored: 0,
      scoredData: [],
      scoredPage: 1,
      scoredBottom: false,
      // scoredReset: 0,
      cooked: 0,
      cookedData: [],
      cookedPage: 1,
      cookedBottom: false,
      // cookedReset: 0,
      currSel:e.detail.value,
      searchBy: this.data.selects[e.detail.value].searchBy
    })
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
    var that = this;
    var currIdx = e.currentTarget.dataset.index;
    this.setData({
      active: currIdx,
      thisIdx: currIdx
    });
    // console.log('--currIdx--' + currIdx + '----lastIdx--' + this.data.lastIdx);
    if (currIdx != this.data.lastIdx) {
      this.setData({
        lastIdx: currIdx,
        mark: currIdx,
        slideTo: ((currIdx - that.data.lastIdx) * 250 )+ that.data.slideTo
      });
    }
  },
  //滑动切换内容
  swiperTo: function (e) {
    var that = this;
    var currIdx = e.detail.current;
    this.setData({
      active: currIdx
    });
    if (currIdx != this.data.lastIdx) {
      this.setData({
        lastIdx: currIdx,
        mark: currIdx,
        slideTo: ((currIdx - that.data.lastIdx) * 250) + that.data.slideTo
      });
    }
    this.toSearch(currIdx);
  }, 
  /*储存search输入*/
  getSearchValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    });
  },
  /*搜索按钮*/
  searchBtn:function(){
    var obj = {
      searchValue: this.data.searchValue,
      mark: this.data.mark,
      searchBy: this.data.searchBy
    };
    this.setData({
      default: 0,
      defaultData: [],
      defaultPage: 1,
      defaultBottom: false,
      defaultReset: 0,
      scored: 0,
      scoredData: [],
      scoredPage: 1,
      scoredBottom: false,
      scoredReset:0,
      cooked: 0,
      cookedData: [],
      cookedPage: 1,
      cookedBottom: false,
      cookedReset:0
    });
    //请求后台数据
    this.ajax(obj,res=>{
      // console.log('ajax-----' + this.data.searchValue);
      console.log(res.data);
      var res = res.data;
      if (this.data.mark == 0) {
        this.setData({
          default: 1,
          defaultData: res,
        });
      }
      if (this.data.mark == 1) {
        this.setData({
          scored: 1,
          scoredData: res,
        });
      }
      if (this.data.mark == 2) {
        this.setData({
          cooked: 1,
          cookedData: res,
        });
      }
    });
  },
  /*点击菜单或滑动对应菜单搜索列表*/
  toSearch: function (currIdx) {
    console.log(this.data.searchBy)
    // console.log('currIdx:' + currIdx +' , '+ 'mark:' + this.data.mark);
    var ajax = cb=>{
      this.ajax({
        searchValue: this.data.searchValue,
        mark: this.data.mark,
        searchBy: this.data.searchBy
      }, res => {
        console.log('ajax');
        console.log(res);
        cb && cb(res);
      });
    };
    if (currIdx == 0 && this.data.default == 0) {
      ajax(res=>{
        this.setData({
          default: 1,
          defaultData: res.data,
        });
      });
    }
    if (currIdx == 1 && this.data.scored == 0) {
      ajax(res => {
        this.setData({
          scored: 1,
          scoredData: res.data,
        });
      });
    }
    if (currIdx == 2 && this.data.cooked == 0) {
      ajax(res => {
        this.setData({
          cooked: 1,
          cookedData: res.data,
        });
      });
    }
  },
  ajax: function (obj,cb) {
    util.ajax(api.search, obj, res => {
      cb && cb(res);
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  reachDefaultBottom: function () {
    this.setData({
      loading: true
    });
    this.ajax({
      searchValue: this.data.searchValue,
      mark: this.data.mark,
      page: ++this.data.defaultPage,
      searchBy: this.data.searchBy
    },res=>{
      if (!res.data.length){
        this.setData({
          defaultBottom:true,
          loading: false
        });
        return;
      }
      this.setData({
        defaultData:this.data.defaultData.concat(res.data),
        loading: false
      });
      console.log(res.data);
      console.log('--totalDefaultData--');
      console.log(this.data.defaultData);
    });
  },
  reachScoredBottom: function () {
    this.setData({
      loading: true
    });
    this.ajax({
      searchValue: this.data.searchValue,
      mark: this.data.mark,
      page: ++this.data.scoredPage,
      searchBy: this.data.searchBy
    }, res => {
      if (!res.data.length) {
        this.setData({
          scoredBottom: true,
          loading: false
        });
        return;
      }
      this.setData({
        scoredData: this.data.scoredData.concat(res.data),
        loading: false
      });
      console.log(res.data);
      console.log('--totalScoredData--');
      console.log(this.data.scoredData);
    });
  },
  reachCookedBottom: function () {
    this.setData({
      loading: true
    });
    this.ajax({
      searchValue: this.data.searchValue,
      mark: this.data.mark,
      page: ++this.data.cookedPage,
      searchBy: this.data.searchBy
    }, res => {
      if (!res.data.length) {
        this.setData({
          cookedBottom: true,
          loading: false
        });
        return;
      }
      this.setData({
        cookedData: this.data.cookedData.concat(res.data),
        loading: false
      });
      console.log(res.data);
      console.log('--totalScoredData--');
      console.log(this.data.cookedData);
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})