const app = app || getApp();
const zutils = require('../../utils/zutils.js');

Page({

  data: {
    numHold: 100,
    fee: '10.0'
  },
  num: 100,

  onLoad: function (e) {
    var that = this;
    app.getUserInfo(function (u) {
      that.setData({
        user: u.uid
      })
    });
  },

  selectNum: function (e) {
    var n = ~~e.currentTarget.dataset.num;
    if (n == 999999 && this.__inputHold) {
      this.num = this.__inputHold;
    } else {
      this.num = n == 999999 ? this.num : n;
    }
    this.setData({
      numHold: n,
      fee: (this.num / 10).toFixed(1)
    });
  },

  inputNum: function (e) {
    var n = ~~(e.detail.value || this.num);
    this.num = n;
    this.setData({
      fee: (this.num / 10).toFixed(1)
    });
    this.__inputHold = n;
  },

  buyNow: function (e) {
    var that = this;
    if (this.num <= 0) this.num = 100;

    zutils.get(app, 'api/pay/create-buycoin?num=' + this.num + '&formId=' + (e.detail.formId || ''), function (res) {
      var data = res.data.data;
      data.success = function (res) {
        wx.navigateTo({
          url: '../index/tips?msg=充值成功',
        });
      };
      data.fail = function (res) {
        console.log('充值失败: ' + JSON.stringify(res));
      };
      wx.requestPayment(data);
    });
  }
});