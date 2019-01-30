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
        console.log(res)
        that.setData({
          userInfo: res.data,
        })
        app.globalData.PhoneNum = res.data.PhoneNum
        console.log(app.globalData)
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
  bindsignout: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '退出将解除手机号绑定？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: that.data.server + 'api/XcxUserInfo?WxOpenID=' + app.globalData.WxOpenID,
            method: 'DELETE',
            success: function(res) {
              console.log(res)
              wx.reLaunch({
                url: '/pages/tabBar/index/index',
              })
            }
          })

          app.globalData.ticket = ''
          app.globalData.UserID = ''
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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