// pages/tabBar/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    current: '1',
    data: '',
    limit: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.getData()
  },
  navSwitch: function(e) {
    console.log(e);
    this.setData({
      current: e.currentTarget.dataset.index
    })
    this.getData()
  },
  getData: function() {
    let that = this
    let limit = that.data.limit + 8;
    let State = this.data.current
    wx.request({
      url: this.data.server + 'api/Order?reciveName=&recivePhone=&State=' + State + '&DriverID=0&pageIndex1&pageSize=' + limit,
      success: function(res) {
        // console.log(res)
        that.setData({
          data: res.data.Results
        })
      }
    })
  },
  bindGoOrderInfo: function() {
    wx.navigateTo({
      url: '../../order/pages/orderInfo/orderInfo'
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
    let that = this;
    let limit = that.data.limit + 6;
    let State = this.data.current
    wx.request({
      url: that.data.server + 'api/Order?reciveName=&recivePhone=&State=' + State + '&DriverID=0&pageIndex1&pageSize=' + limit,
      success: function (res) {
        // console.log(res)
        that.setData({
          data: res.data.Results,
          limit
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})