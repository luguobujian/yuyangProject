// pages/index/pages/Contact/contact.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: App.globalData.server,
    data: "",
    isShow: false,
    name: "",
    ajxNameTrue: "",
    tel: "",
    ajxTelTrue: "",
    dataLen: 1,
    form: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      form: options.form
    })
    wx.request({
      url: that.data.server + 'api/Contacts?&AddUser=' + App.globalData.UserID + '&Name=&PhoneNum=&pageIndex=0&pageSize=9999',
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data.Results,
          dataLen: res.data.Results.length,
        })
      }
    })
  },
  bindChsWho: function(e) {
    console.log(e)
    let pages = getCurrentPages()
    let prevPages = pages[pages.length - 2]
    console.log(prevPages)
    if (this.data.form == "back") {
      prevPages.setData({
        // callId: e.currentTarget.dataset.id,
        back: e.currentTarget.dataset.val.Addr,
        SendLong: e.currentTarget.dataset.val.Long,
        SendLat: e.currentTarget.dataset.val.Lat,
        SendName: e.currentTarget.dataset.val.Name,
        SendTel: e.currentTarget.dataset.val.PhoneNum
      })
    } else if (this.data.form == "go") {
      prevPages.setData({
        // callId: e.currentTarget.dataset.id,
        go: e.currentTarget.dataset.val.Addr,
        ReciveLong: e.currentTarget.dataset.val.Long,
        ReciveLat: e.currentTarget.dataset.val.Lat,
        ReciveName: e.currentTarget.dataset.val.Name,
        ReciveTel: e.currentTarget.dataset.val.PhoneNum
      })
    }
    wx.navigateBack({
      delta: 1,
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