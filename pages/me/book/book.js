// pages/me/book/book.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: App.globalData.server,
    name: "",
    ajxNameTrue: "",
    tel: "",
    ajxTelTrue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // wx.request({
    //   url: that.data.server + 'api/Contacts?Name={Name}&PhoneNum={PhoneNum}&pageIndex={pageIndex}&pageSize={pageSize}',
    //   success: function(res) {

    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  bindNameValue: function(e) {
    console.log(e)
    let name = e.detail.value;
    if (!(/^[u4E00-u9FA5]+$/.test(name))) {
      this.setData({
        ajxNameTrue: false,
        name: ""
      })

    } else {
      this.setData({
        ajxNameTrue: true,
        name: e.detail.value
      })
    }
  },
  bindTelValue: function(e) {　
    let phone = e.detail.value;
    if (!(/^ 1[34578]\d{ 9 } $ /.test(phone))) {
      this.setData({
        ajxTelTrue: false,
        tel: ""
      })
    } else {
      this.setData({
        ajxtrue: true,
        tel: e.detail.value
      })
    }
  },
  bindThisMan: function() {
    if (!this.data.ajxNameTrue) {
      wx.showToast({
        title: '提示 : 姓名有误',
        icon: 'none',
        duration: 2000
      })
    } else if (!this.data.ajxTelTrue) {
      wx.showToast({
        title: '提示 : 手机号有误',
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