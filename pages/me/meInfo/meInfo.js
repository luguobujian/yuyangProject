// pages/me/meInfo/meInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,

    ajxTelTrue01: "",
    ajxTelTrue02: "",
    ajxTelTrue03: "",


    Name: app.globalData.userInfo.nickName,
    Tel1: "未设置",
    Tel2: "未设置",
    Tel3: "未设置",
    Company: "未设置",
    Face: app.globalData.userInfo.avatarUrl


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.userInfo)
  },
  bindGetName: function(e) {
    let Name = e.detail.value
    this.setData({
      Name: e.detail.value
    })
  },
  bindGetCallTel01: function(e) {
    let phone = e.detail.value
    this.setData({
      ajxTelTrue01: true,
      Tel1: e.detail.value
    })
  },
  bindGetCallTel02: function(e) {
    let phone = e.detail.value
    this.setData({
      ajxTelTrue02: true,
      Tel2: e.detail.value
    })

  },
  bindGetCallTel03: function(e) {
    let phone = e.detail.value
    this.setData({
      ajxTelTrue03: true,
      Tel3: e.detail.value
    })
  },
  bindGetCompany: function(e) {
    let company = e.detail.value
    this.setData({
      Company: e.detail.value
    })
  },
  bindPullData: function() {
    // console.log(this.data.Tel1)
    // console.log(this.data.Tel2)
    // console.log(app.globalData.ticket)
    let ajxTelTrue01 = (/^1[34578]\d{9}$/.test(this.data.Tel1))
    let ajxTelTrue02 = (/^1[34578]\d{9}$/.test(this.data.Tel2))
    let ajxTelTrue03 = (/^1[34578]\d{9}$/.test(this.data.Tel3))
    // console.log(ajxTelTrue01)
    // console.log(ajxTelTrue02)
    console.log('BasicAuth ' + app.globalData.ticket)
    if (ajxTelTrue01 && ajxTelTrue02 && ajxTelTrue03) {
      wx.request({
        url: this.data.server + 'api/User/1',
        header: {
          'Authorization': 'BasicAuth ' + app.globalData.ticket
        },
        method: "PUT",
        data: {
          Name: this.data.Name,
          Tel1: this.data.Tel1,
          Tel2: this.data.Tel2,
          Tel3: this.data.Tel3,
          Company: this.data.Company,
          Face: this.data.Face
        },
        success: function(res) {
          console.log(res)
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
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