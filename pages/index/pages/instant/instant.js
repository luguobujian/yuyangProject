// pages/index/pages/instant/instant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: '',
    oneKeyInfo: '客服人员马上电话与您联系， 请保持电话畅通！',
    info: "订单提交完成"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      page: options.page
    })
  },
  bindBack: function() {
    let pages = getCurrentPages();
    console.log(pages)
    pages[0].setData({
      carInfo: "",
      back: "请选择发货地址",
      go: "请选择收货地址",
      SendLong: "",
      SendLat: "",
      ReciveLong: "",
      ReciveLat: "",
      date: '',
      callName: "",
      callTel: "",
    })
    pages[0].onLoad()
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