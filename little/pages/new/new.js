// pages/new/new.js
var api = require('../../config.js').apis;
var util = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aupload:0,
    supload:0,
    banners: [{
      bannerImgUrl: "",
      title: "",
      titleInfo: ""
    }],
    banner:{
      bannerImgUrl: "",
      title: "",
      titleInfo: ""
    },
    swiperActiveIndex: 0,
    swiperStepActiveIndex: 0,
    categorys: [],
    categoryIndexArr: [0, 0],
    steps: [{
      stepName: '',
      step: '',
      img: ''
    }],
    step: {
      stepName: '',
      step: '',
      img: ''
    },
    tips: [{
      title: '',
      content: "",
    }],
    materias: [{
      materiaName: '',
      materiaWeight: ""
    }],
    previewM: false,
    topmenus: [],
    cmenus: [],
    formData:{
      albums: [{
        bannerImgUrl:"",
        title: "",
        titleInfo: ""
      }],
      steps:[{
          stepName: '',
          step: '',
          img:""
        }],
      ingredients : "",
      userId: wx.getStorageSync('userId'),
      _id: "",
      cid: "",
      cname: "",
      topId: "",
      topName: "",
      focused: 0,
      cookied: 0,
      scored: 10,
      agreed: 0,
      commented: [] 
    }
  },
  onLoad: function (options) {
    // util.isLogined()
      this.getMenus()
  },
  getTitle(e) {
    this.data.banner.title = e.detail.value
    this.data.banners[this.data.swiperActiveIndex].title = this.data.banner.title
    this.setData({
      banner: this.data.banners[this.data.swiperActiveIndex],
      banners: this.data.banners
    })
  },
  getTitleInfo(e) {
    this.data.banner.titleInfo = e.detail.value
    this.data.banners[this.data.swiperActiveIndex].titleInfo = this.data.banner.titleInfo
    this.setData({
      banner: this.data.banners[this.data.swiperActiveIndex],
      banners: this.data.banners
    })
  },
  chooseImg:function(){
    wx.chooseImage({
      count: 1,
      success: res=>{
        // console.log(res);
        var tempUrl = res.tempFilePaths[0]
        this.data.banners[this.data.swiperActiveIndex].bannerImgUrl = tempUrl
        this.setData({
          banners: this.data.banners
        })
      }
    })
  },
  //美食相册切换
  swiperBannersChange(e) {
    console.log(e.detail.current)
    this.data.swiperActiveIndex = e.detail.current
    this.setData({
      banner: this.data.banners[this.data.swiperActiveIndex],
      banners: this.data.banners
    })
  },
  //判断美食相册是否有空图片
  isBannerNull: function (cb) {
    this.data.banners.forEach((item, i) => {
      if (!item.bannerImgUrl) {
        util.showModel('请添加您的美食相册图片！');
      }
      if (i === this.data.banners.length - 1 && item.bannerImgUrl) {
        cb && cb()
      }
    })
  },
  //添加另一张美食图片
  addAntherBanner() {
    this.isBannerNull(()=>{
      this.data.banner = {
        bannerImgUrl: "",
        title: '',
        titleInfo: "",
      }
      this.data.banners.push(this.data.banner)
      this.setData({
        banner: this.data.banner,
        swiperActiveIndex: ++this.data.swiperActiveIndex,
        banners: this.data.banners,
      })
    })
  },
  delBanner() {
    if (this.data.banners.length > 1) {
      this.data.banners.splice(this.data.swiperActiveIndex, 1)
    }
    // console.log(this.data.banners);
    // console.log(this.data.swiperActiveIndex)
    this.setData({
      swiperActiveIndex: this.data.banners.length - 1,
      banner: this.data.banners[this.data.banners.length-1],
      banners: this.data.banners
    })
  }, 
  //获取菜谱分类
  getMenus: function () {
    util.ajax(api.category.query, {
      menus: true
    }, res => {
      var data = res.data.data;
      // console.log(data);
      wx.setStorageSync('menus', JSON.stringify(data));
      for (let i = 0; i < data.length; i++) {
        this.data.topmenus.push({
          index: i,
          title: data[i]._id,
          _id: data[i].result[0].topId,
        })
        if (i == 0) {
          this.data.cmenus = data[0].result
        }
      }
      this.data.formData.topId = this.data.topmenus[0]._id
      this.data.formData.topName = this.data.topmenus[0].title
      this.data.formData.cid = this.data.cmenus[0]._id
      this.data.formData.cname = this.data.cmenus[0].title
      this.data.formData._id = util.keyStr(4)
      this.setData({
        categorys: [
          this.data.topmenus,
          this.data.cmenus
        ]
      })
    })
  },
  //选择菜谱分类,点击确定时触发
  getCategory: function (e) {
    // console.log(e.detail); //[0,1]两列
    var valuest = this.data.categorys[0][e.detail.value[0]];
    var valuesc = this.data.categorys[1][e.detail.value[1]];
    this.setData({
      categoryIndexArr: e.detail.value
    });
    this.data.formData.topId = valuest._id
    this.data.formData.topName = valuest.title
    this.data.formData.cid = valuesc._id
    this.data.formData.cname = valuesc.title
    if (!this.data.formData._id){
      this.data.formData._id = util.keyStr(4)
    }
    // console.log(this.data)
  },
  //动态切换第二列数据，滑动列时触发
  getColumnData: function (e) {
    // console.log(e.detail);  //{column:0,value:3}
    var currV = e.detail.value;
    //根据第一列值，动态更改第二列数据
    if (e.detail.column === 0) {
      this.data.categoryIndexArr[0] = currV;
      var cmenus = JSON.parse(wx.getStorageSync('menus'))[currV].result
      this.setData({
        categorys: [this.data.categorys[0], cmenus],
        categoryIndexArr: [this.data.categoryIndexArr[0], 0]
      });
    }
  },
  getMateriaName(e) {
    var currIndex = e.target.dataset.index;
    this.data.materias[currIndex].materiaName = e.detail.value
    this.setData({
      materias: this.data.materias
    })
  },
  getMateriaWeight(e) {
    var currIndex = e.target.dataset.index;
    this.data.materias[currIndex].materiaWeight = e.detail.value
    this.setData({
      materias: this.data.materias
    })
  },
  //判断菜谱原料是否有空
  isMateriaNull: function (cb) {
    this.data.materias.forEach((item, i) => {
      if (!item.materiaName) {
        util.showModel('材料名不能为空')
        return
      }
      if (!item.materiaWeight) {
        util.showModel('材料用量不能为空')
        return
      }
      if (i === this.data.materias.length - 1 && item.materiaName && item.materiaWeight) {
        cb && cb();
      }
    })
  },
  addMateria() {
    this.isMateriaNull(()=>{
      this.data.materias.push({
        materiaName: '',
        materiaWeight: ""
      })
      this.setData({
        materias: this.data.materias
      })
    });
  },
  deleteCurrMateria(index) {
    this.data.materias.splice(index, 1)
    this.setData({
      materias: this.data.materias
    })
  },
  chooseStepsImg(e) {
    wx.chooseImage({
      count: 1,
      success: res => {
        // console.log(res);
        var tempUrl = res.tempFilePaths[0]
        // console.log(tempUrl);
        this.data.steps[this.data.swiperStepActiveIndex].img = tempUrl
        this.setData({
          steps: this.data.steps
        })
      }
    })
  },
  //判断制作步骤是否有空图片
  isStepNull: function (cb) {
    this.data.steps.forEach((item, i) => {
      if (!item.step) {
        util.showModel('菜谱制作步骤' + (i + 1) + '的步骤内容不能为空！')
        return
      }
      if (!item.img) {
        util.showModel('菜谱制作步骤' + (i + 1) + '必须添加一张步骤图片！')
        return
      }
      if (i === this.data.steps.length - 1 && item.img && item.step) {
        cb && cb()
      }
    })
  },
  getStepName(e) {
    this.data.step.stepName = e.detail.value
    this.data.steps[this.data.swiperStepActiveIndex].stepName = this.data.step.stepName
    this.setData({
      step: this.data.steps[this.data.swiperStepActiveIndex],
      steps: this.data.steps
    })
  },
  getStepContent(e) {
    this.data.step.step = e.detail.value
    this.data.steps[this.data.swiperStepActiveIndex].step = this.data.step.step
    this.setData({
      step: this.data.steps[this.data.swiperStepActiveIndex],
      steps: this.data.steps
    })
  },
  swiperStepBannersChange(e) {
    // console.log(e.detail.current)
    this.data.swiperStepActiveIndex = e.detail.current
    this.setData({
      step: this.data.steps[this.data.swiperStepActiveIndex],
      steps: this.data.steps
    })
  },
  addAntherStep() {
    this.isStepNull(() => {
      this.data.step = {
        stepName: '',
        step: "",
        img: "",
      }
      this.data.steps.push(this.data.step)
      this.setData({
        step: this.data.step,
        swiperStepActiveIndex: ++this.data.swiperStepActiveIndex,
        steps: this.data.steps,
      })
    })
  },
  delStep() {
    if (this.data.steps.length > 1) {
      this.data.steps.splice(this.data.swiperStepActiveIndex, 1)
    }
    this.setData({
      swiperStepActiveIndex: this.data.steps.length - 1,
      step: this.data.steps[this.data.steps.length - 1],
      steps: this.data.steps
    })
  },
  getTipTitle(e) {
    var currIndex = e.target.dataset.index;
    this.data.tips[currIndex].title = e.detail.value
    this.setData({
      tips: this.data.tips
    })
  },
  getTipContent(e) {
    var currIndex = e.target.dataset.index;
    this.data.tips[currIndex].content = e.detail.value
    this.setData({
      tips: this.data.tips
    })
  },
  //判断温馨提示是否有空
  isTipNull(cb){
    var tips = this.data.tips
    var str = ''
    tips.forEach(function(item,i){
      if (!item.title) {
          util.showModel('温馨提示项目' + (i + 1) + '的标题不能为空！')
          return
      }
      if (!item.content) {
          util.showModel('温馨提示项目' + (i + 1) + '的标题描述不能为空！')
          return
      }
      if (i === tips.length - 1 && item.title && item.content) {
          cb && cb()
      }
    })
  },
  addTip() {
    // console.log(this.data.tips)
    this.isTipNull(()=>{
      this.data.tips.push({
        title: '',
        content: "",
      })
      this.setData({
        tips: this.data.tips
      })
    })
  },
  delTip(e) {
    if (this.data.tips.length > 1) {
      this.data.tips.splice(e.target.dataset.index, 1);
      this.setData({
        tips: this.data.tips
      })
    }
  },
  //预览菜谱
  previewMenu(e) {
    this.data.formData.title = e.detail.value.title;
    this.data.formData.imtro = e.detail.value.imtro;
    this.data.formData.tags = e.detail.value.tags;
    this.data.formData.albums = this.data.banners
    this.data.formData.steps = this.data.steps
    //判断美食相册是否有空图片
    this.isBannerNull()
    //判断菜谱标题
    if (!this.data.formData.title) {
      util.showModel('请完善菜谱名字！')
      return
    }
    //判断菜谱简介
    if (!this.data.formData.imtro) {
      util.showModel('请完善菜谱简介！')
      return
    }
    //判断菜谱标签
    if (!this.data.formData.tags) {
      util.showModel('请完善菜谱标签！')
      return
    }
    //判断菜谱分类
    if (!this.data.formData._id || !this.data.formData.cid || !this.data.formData.cname || !this.data.formData.topId || !this.data.formData.topName) {
      util.showModel('请完善菜谱分类！')
      return
    }
    //菜谱材料
    var materiaStr = '';
    var materias = this.data.materias;
    this.isMateriaNull(() => {  
      var that = this
      materias.forEach(function(item,i){
        if (i < materias.length - 1) {
            materiaStr += item.materiaName + ',' + item.materiaWeight + ';'
        }
        if (i === materias.length - 1 && item.materiaName && item.materiaWeight)           {
            materiaStr += item.materiaName + ',' + item.materiaWeight;
            that.data.formData.burden = materiaStr
        }
      });
    });
    //判断制作步骤是否有空
    this.isStepNull();
    //判断温馨提示是否有空
    var tipStr = ''
    this.isTipNull(() => {
      var that = this
      var tips = this.data.tips
      for (var i = 0; i < tips.length; i++) {
        if (i < tips.length - 1) {
          tipStr += tips[i].title + '@' + tips[i].content + ';'
        }
        if (i === tips.length - 1 && tips[i].title && tips[i].content) {
          tipStr += tips[i].title + '@' + tips[i].content
          that.data.formData.tips = tipStr;
        }
      }
    })
    // console.log(this.data.formData)
    this.setData({
      formData: this.data.formData,
      previewM: true
    })
  },
  //修改菜谱
  continueUpdate() {
    this.setData({
      previewM: false
    })
  },
  //上传albums美食相册
  uploadAlbumImages(cb) {
    //最后一张
    if (this.data.aupload>this.data.formData.albums.length-1) {
      //上传steps步骤图
      this.uploadStepImages(cb)
     return;
    }
    var tempPath = this.data.formData.albums[this.data.aupload].bannerImgUrl;
    wx.uploadFile({
      url: api.users.uploadNew,
      name:'new',
      filePath: tempPath,
      success:res=>{
        // console.log(res);
        this.data.formData.albums[this.data.aupload].bannerImgUrl = JSON.parse(res.data).url;
        ++this.data.aupload;
        // console.log(this.data.aupload)
        this.uploadAlbumImages(cb)
      }
    });
  },
  //上传steps步骤图
  uploadStepImages(cb) {
    //最后一张
    if (this.data.supload > this.data.formData.steps.length - 1) {
      return;
    }
    wx.uploadFile({
      url: api.users.uploadNew,
      name: 'new',
      filePath: this.data.formData.steps[this.data.supload].img,
      success: res => {
        // console.log(res);
        this.data.formData.steps[this.data.supload].img = JSON.parse(res.data).url
        if (this.data.supload === this.data.formData.steps.length - 1){
          //提交其余数据
          cb && cb()
        }
        this.data.supload++;
        this.uploadStepImages(cb)
      }
    });
  },
  //确定发布菜谱
  publish() {
    //上传图片到服务器
    this.uploadAlbumImages(res => {
      //图片上传完成后返回服务器图片路径，调用新建菜谱接口地址提交数据
      console.log(this.data.formData)
      util.ajax(api.category.new, {
        menuData: JSON.stringify(this.data.formData),
        new:true,
      }, res => {
        // console.log(res.data)
        util.showModel(res.data.errMsg);
        if(res.data.success){
          wx.switchTab({
            url: '../mine/mine',
          })
        }
      })
    })
  }
})