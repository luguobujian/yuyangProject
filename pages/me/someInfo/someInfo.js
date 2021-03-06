// pages/me/someInfo/someInfo.js
let WxParse = require('../../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    info: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    if (options.pages == "someInfo") {
      wx.request({
        url: this.data.server + 'api/SystemInfo',
        success: function(res) {
          console.log(res)
          let content = WxParse.wxParse('article', 'html', res.data.FeeScale, that, 5);
        }
      })
    } else {
      wx.request({
        url: this.data.server + 'api/' + options.pages + '/' + options.id,
        success: function(res) {
          console.log(res)

          if (options.pages == "Notice") {
            that.setData({
              info: res.data.Title
            })
            if (res.data.Notes) {
              let content = WxParse.wxParse('article', 'html', res.data.Notes, that, 5);

            } else {
              wx.showToast({
                title: '暂无内容',
                icon: "none",
                duration: 2000
              })
            }
          } else if (options.pages == "Faq") {
            that.setData({
              info: res.data.Ask
            })
            if (res.data.Answer) {
              let content = WxParse.wxParse('article', 'html', res.data.Answer, that, 5);

            } else {
              wx.showToast({
                title: '暂无内容',
                icon: "none",
                duration: 2000
              })
            }
          }

        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})