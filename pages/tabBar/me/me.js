// pages/tabBar/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    wxUserInfo: app.globalData,
    userInfo: "",
    phone: "",
    logModalShow: "false",
    telModalShow: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSomeUserInfo() //获取用户信息
    console.log(this.data.wxUserInfo)
    console.log(this.data.userInfo)
  },
  getSomeUserInfo: function(id) {
    let that = this
    wx.request({
      url: that.data.server + 'api/User/' + app.globalData.UserID + '?user=',
      success: function(res) {
        that.setData({
          userInfo: res.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindGoItem: function(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../me/' + item + '/' + item
    })
  },
  bindGoBZ: function(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../me/someInfo/someInfo?pages=someInfo'
    })
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