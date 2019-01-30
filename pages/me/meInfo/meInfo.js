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


    Name: "",
    Tel1: "",
    Tel2: "",
    Tel3: "",
    Company: "",
    Addr: "",
    Lat: "",
    Long: "",
    Face: app.globalData.userInfo.avatarUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let that = this
    // that.getSomeUserInfo()
  },
  getSomeUserInfo: function(id) {
    let that = this
    wx.request({
      url: that.data.server + 'api/User/' + app.globalData.UserID + '?user=',
      success: function(res) {
        console.log(res)
        that.setData({
          Name: res.data.Name,
          Tel1: res.data.Tel1,
          Tel2: res.data.Tel2,
          Tel3: res.data.Tel3,
          Company: res.data.Company,
          Addr: res.data.Addr
        })
      }
    })
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
  bindGetAddress: function (e) {
    wx.navigateTo({
      url: '../../index/pages/getAddress/getAddress?form=' + e.currentTarget.dataset.form,
    })
  },
  bindPullData: function() {
    let that = this
    let ajxTelTrue01 = (/^1[34578]\d{9}$/.test(this.data.Tel1))
    let ajxTelTrue02 = (/^1[34578]\d{9}$/.test(this.data.Tel2))
    let ajxTelTrue03 = (/^1[34578]\d{9}$/.test(this.data.Tel3))
    let addr = this.data.Addr
    console.log('BasicAuth ' + app.globalData.ticket)
    if (ajxTelTrue01 && ajxTelTrue02 && ajxTelTrue03 && addr) {
      wx.request({
        url: this.data.server + 'api/User/' + app.globalData.UserID,
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
          Addr: this.data.Addr,
          Lat: this.data.Lat,
          Long: this.data.Long,
          Face: this.data.Face,
        },
        success: function(res) {
          console.log(res)
          that.backPage()
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '请完成填写并确认无误',
        icon: 'none',
        duration: 2000
      })
    }
  },
  backPage: function() {
    let pages = getCurrentPages();
    console.log(pages)
    pages[0].onReady()
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.getSomeUserInfo()
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