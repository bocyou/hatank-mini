var apis = require('../config.js').apis;
var CryptoJS = require('../crypto-js-simple/crypto-js.js');
var keyStr = require('./key.js');
var RSAUtils = require('./security.js')();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() 
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})
// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})
//模态窗
var showModel = (content, title) => {
  wx.hideToast();
  wx.showModal({
    title: title ? title : '温馨提示',
    content: content,
    showCancel: false
  })
}
/**动画效果 */
var loading = (loading, cb) => {
  var deg = 0;
  var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'linear'
  });
  var timer = setInterval(() => {
    if (!loading) {
      clearInterval(timer);
      return;
    }
    //在Z轴旋转一个deg角度
    animation.rotateZ(deg).step();
    deg += 360;
    cb && cb(animation);
  }, 300);
};
//微信登录
var weixinLogin = (_this, cb) => {
  wx.checkSession({
    //session_key未过期
    success: res => {
      console.log(res);
    },
    //session_key已过期
    fail: function () {
      wx.login({
        success: dataCode => {
          // console.log(dataCode.code);
          // 发送 dataCode.code 到后台换取 openId, sessionKey, unionId
          _this.globalData.loginCode = dataCode.code;
          //调用登录接口 登录成功后返回主页
          getUserInfoBase(_this, cb);
        }
      });
      // 获取用户信息
      wx.getSetting({
        success: res => {
          // console.log(res);
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            getUserInfoBase(_this, cb);
          }
        }
      })
    }
  });
};
//获取用户信息
var getUserInfoBase = function (_this, cb) {
  wx.getUserInfo({
    withCredentials: true,
    lang: 'EN',
    success: res => {
      _this.globalData.userInfo = res.userInfo;
      //调用服务器微信登录接口
      ajax(apis.users.weixin, {
        forData: JSON.stringify(res.userInfo),
        code: _this.globalData.loginCode,
        // iv: res.iv,
      }, rel => {
        // console.log(rel.data);
        _this.globalData.userId = rel.data.userId;
        _this.globalData.userInfo = res.userInfo;
        // _this.globalData.statusCode = rel.data.statusCode;
        cb && cb(_this.globalData);
        if (rel.data.success) {
          wx.showToast({
            title: rel.data.errMsg
          });
        }
      });
    },
  });
};
/** ajax效果封装*/
var ajax = (url,data,callback,method)=>{
  wx.showLoading({
    title: '拼命加载中...',
    mask: true
  });
  wx.showNavigationBarLoading();
  wx.request({
    method: method ? method:'post',
    url: url,
    data:data,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: res => {
      callback && callback(res);
      wx.hideLoading();
      wx.hideNavigationBarLoading();
    },
    fail:function(){
      console.log('获取数据失败！请检查参数！');
    }
  });
};
/**数据加解密 ，获取pubkey，session3rd*/
var security = {
  getPublicKey (cb) {
      var keyUrl = 'http://192.168.4.46/WxEngine/dhc/sys/xcxparamreq.do';
      //获取pubkey
      ajax(keyUrl,{},res=>{
        var ppublicKey = RSAUtils.getKeyPair(res.data.exponent, '', res.data.modules);
        wx.setStorageSync("KeyPair", JSON.stringify(res.data));
        cb && cb();
      });
  },
  getSession3rd(){
    var reqUrl = 'http://192.168.4.46/WxEngine/dhc/sys/xcxreq.do';
    //生成key
    wx.setStorageSync('skey', keyStr(16, ['num', 'en']));
    //生成iv
    wx.setStorageSync('siv', keyStr(16, ['num', 'en']));
    var key = CryptoJS.enc.Latin1.parse(wx.getStorageSync('skey'));
    var iv = CryptoJS.enc.Latin1.parse(wx.getStorageSync('siv'));
    var keypair = JSON.parse(wx.getStorageSync('KeyPair'));
    var ppublicKey = RSAUtils.getKeyPair(keypair.exponent,'',keypair.modules)
    //获取session3rd
    wx.login({
      success(rel) {
        var encryptData = CryptoJS.AES.encrypt(JSON.stringify({
          "app": "xcxgetLoginUserInfoService",
          "func": "getIdentityLable",
          "code": rel.code
        }), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
          });
        // console.log('--key--iv--');
        // console.log('key---' + wx.getStorageSync('skey'));
        // console.log('iv---' + wx.getStorageSync('siv'));
        //后台返回session3rd
        ajax(reqUrl, {
          encryptData: encryptData,
          seckey: RSAUtils.encryptedString(ppublicKey, wx.getStorageSync('skey')),
          seciv: RSAUtils.encryptedString(ppublicKey, wx.getStorageSync('siv'))
        }, res => {
          var retData = JSON.parse(res.data.retdata);
          console.log(retData);
          if (retData.error == "session3rdinval" || retData.error == "xcxcodeinvalid") {
            //重新获取session
            security.getSession3rd();
            return;
          }
          if (retData.error == "getsession3rdfail" || retData.error == "invokEntrservfail" || retData.error == "xcxlogingetparafail" || retData.error) {
            showModel(retData.errmsg);
            return;
          }
          wx.setStorageSync('session3rd', JSON.parse(res.data.retdata).session3rd)
        });
      }
    });
  },
  encrypt(obj, cb){
    var encryptCommon = () => {
      var key = CryptoJS.enc.Latin1.parse(wx.getStorageSync('skey'));
      var iv = CryptoJS.enc.Latin1.parse(wx.getStorageSync('siv'));
      //加密
      var encryptData = CryptoJS.AES.encrypt(encodeURIComponent(JSON.stringify(obj)), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      cb && cb({
        encryptData: encryptData.toString(),
        session3rd: wx.getStorageSync('session3rd')
      });
    };
    if (!wx.getStorageSync('skey') || !wx.getStorageSync('siv')){
      security.getPublicKey(()=>{
        encryptCommon();
      });
      return;
    }
    encryptCommon();
  },
  decrypt: function (cryptdata) {
    //解密
    var key = CryptoJS.enc.Latin1.parse(wx.getStorageSync('skey'));
    var iv = CryptoJS.enc.Latin1.parse(wx.getStorageSync('siv'));
    var decrypted = CryptoJS.AES.decrypt(cryptdata, key, {
      iv: iv,
      padding: CryptoJS.pad.ZeroPadding
    });
    // console.log('--decrypted--');
    // console.log(decrypted);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
/**
 * ajax加密传输数据，回调处理数据
 * data 为对象，包含app，func等参数
 */
var http = (data, callback, method) => {
    var url = 'http://192.168.4.46/WxEngine/dhc/sys/xcxreq.do';
    security.encrypt(data, encryptTotalData=>{
      // encryptTotalData为加密后的数据 包含app，func,session3rd 等参数
      console.log('----前端加密后的数据----');
      console.log(encryptTotalData);
      //向后台传输加密后的数据
      ajax(url, encryptTotalData ,res=>{
        var retData = JSON.parse(res.data.retdata)
        // console.log(retData)
        if (retData.error == "session3rdinval" || retData.error == "xcxcodeinvalid" || retData.error == "xcxreqlostsession3rd") {
              //重新获取session
              security.getSession3rd();
              return;
        }
        if (retData.error == "getsession3rdfail" || retData.error == "invokEntrservfail" || retData.error == "xcxlogingetparafail") {
              showModel(retData.errmsg);
              return;
        }
        if (retData.error){
            showModel(retData.error);
            return
        }
        callback && callback(retData);
      })
    });
};
var isLogined = function(){
    console.log(wx.getStorageSync('statusCode'));
    ajax(apis.isLogined, {
      statusCode: wx.getStorageSync('statusCode')
    }, res => {
      console.log(res.data);
      if (!res.data.success) {
        wx.showModal({
          title: '温馨提示',
          content: res.data.errMsg,
          showCancel: true,
          cancelText: '返回',
          confirmText: '去登录',
          success: function (res) {
            if (res.confirm) {
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
    });
}
module.exports = { formatTime, showBusy, showSuccess, showModel, ajax, loading, weixinLogin, security, http, isLogined, keyStr}
