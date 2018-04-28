var CryptoJS = require('../crypto-js-simple/crypto-js.js');
var keyStr = require('./key.js');
// console.log(CryptoJS);
module.exports = {
  encrypt: function (rowdata){
    var strobj = {
      "stra": keyStr(128, ['num', 'en']),
      "strd": keyStr(128, ['num', 'en'])
    }
    wx.setStorageSync('str', CryptoJS.DES.encrypt(JSON.stringify(strobj),'strkey').toString());
    var aesEncryptData = CryptoJS.AES.encrypt(rowdata,
     JSON.parse(
        CryptoJS.DES.decrypt(wx.getStorageSync('str'),'strkey').toString(CryptoJS.enc.Utf8) 
      ).stra).toString();
    var encryptData = CryptoJS.DES.encrypt(aesEncryptData, JSON.parse(
      CryptoJS.DES.decrypt(wx.getStorageSync('str'), 'strkey').toString(CryptoJS.enc.Utf8)
      ).strd).toString();
    return {
      encryptData,
      stra: JSON.parse(CryptoJS.DES.decrypt(wx.getStorageSync('str'), 'strkey').toString(CryptoJS.enc.Utf8)).stra,
      strd: JSON.parse(CryptoJS.DES.decrypt(wx.getStorageSync('str'), 'strkey').toString(CryptoJS.enc.Utf8)).strd,
    };
  },
  decrypt: function (cryptdata) {
    var rowdata = CryptoJS.AES.decrypt(CryptoJS.DES.decrypt(cryptdata, JSON.parse(
      CryptoJS.DES.decrypt(wx.getStorageSync('str'), 'strkey').toString(CryptoJS.enc.Utf8)
      ).strd).toString(CryptoJS.enc.Utf8), JSON.parse(
        CryptoJS.DES.decrypt(wx.getStorageSync('str'), 'strkey').toString(CryptoJS.enc.Utf8)
        ).stra).toString(CryptoJS.enc.Utf8);
    return rowdata;
  }
}