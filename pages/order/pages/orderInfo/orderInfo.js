// pages/order/orderInfo/orderInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    star: 3,
    data: "",
    orderId: "",
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    that.setData({
      current: options.current,
      orderId: options.id
    })
    that.getOrderData()
  },
  getOrderData: function() {
    let that = this
    wx.request({
      url: that.data.server + 'api/Order/' + this.data.orderId,
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data
        })
        that.getDriverID(res.data.DriverID)
      }
    })
  },
  getDriverID: function(id) {
    wx.request({
      url: this.data.server + 'api/Truck?DriverID=1',
      success: function(res) {
        console.log(res)
      }
    })
  },
  bindDel: function() {
    let that = this
    console.log(app.globalData.ticket)
    wx.request({
      url: this.data.server + 'api/Order/' + this.data.orderId,
      method: "delete",
      header: {
        'Authorization': 'BasicAuth ' + app.globalData.ticket
      },
      success: function(res) {
        console.log(res)
        that.backPage()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  geiStar: function(e) {
    this.setData({
      star: e.currentTarget.dataset.star
    })
  },
  backPage: function() {
    let pages = getCurrentPages();
    console.log(pages)
    pages[0].onLoad()
    wx.navigateBack({
      delta: 1
    })
  },
  bindGoMap: function () {
    wx.navigateTo({
      url: '../map/map',
    })
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