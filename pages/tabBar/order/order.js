// pages/tabBar/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    search: '',
    current: '10',
    data: '',
    dataLen: 1,
    limit: 8,
    date1: '',
    date2: '',
    time1: '',
    time2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.getData()
  },
  navSwitch: function(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
    this.getData()
    this.setData({
      limit: 8
    })
  },
  getData: function() {
    let that = this
    let limit = that.data.limit;
    let State = this.data.current
    let AddUser = app.globalData.UserID || null
    console.log(AddUser)
    console.log(this.data.server + 'api/Order?AddUser=' + AddUser + '&reciveName=&recivePhone=&State=' + State + '&DriverID=0&pageIndex=0&pageSize=' + limit)
    wx.request({
      url: this.data.server + 'api/Order?AddUser=' + AddUser + '&reciveName=&recivePhone=&State=' + State + '&DriverID=0&pageIndex=0&pageSize=' + limit + '&APP=1',
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data.Results || [],
          dataLen: (res.data.Results && res.data.Results.length) || 0,
          limit
        })
      }
    })
  },
  bindSearch: function(e) {
    let that = this
    let State
    if (e.detail.value.length) {
      State = 0
    } else {
      State = this.data.current
    }
    that.setData({
      search: e.detail.value
    })
    console.log(e)
    let limit = that.data.limit + 8;

    wx.request({
      url: this.data.server + 'api/Order?AddUser=' + app.globalData.UserID + '&reciveName=&recivePhone=&State=' + State + '&DriverID=0&pageIndex=0&pageSize=' + limit + '&Keywords=' + e.detail.value + '&Time1=&Time2=&APP=1',
      success: function(res) {
        console.log(res)
        // console.log(that.data.server + 'api/Order?AddUser=' + app.globalData.UserID + '&reciveName=&recivePhone=&State=' + State + '&DriverID=0&pageIndex=0&pageSize=' + limit + '&Keywords=' + e.detail.value + '&Time1=&Time2=')
        that.setData({
          data: res.data.Results,
          dataLen: res.data.Results.length,
          limit
        })
      }
    })
  },
  bindClear: function() {
    this.setData({
      search: '',
      current: '10',
      data: '',
      limit: 8,
      date1: '',
      date2: '',
      time1: '',
      time2: ''
    })
  },
  bindDate1Change(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
    this.getDateData()
  },
  bindDate2Change(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
    this.getDateData()
  },
  bindTime1Change(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time1: e.detail.value
    })
    this.getDateData()
  },
  bindTime2Change(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time2: e.detail.value
    })
    this.getDateData()
  },
  getDateData() {
    let that = this
    let limit = that.data.limit + 8;
    let State = that.data.current
    if (!(that.data.date1 && that.data.date2 && that.data.time1 && that.data.time2)) {
      return
    }
    let Time1 = that.data.date1 + " " + that.data.time1 + ':00'
    let Time2 = that.data.date2 + " " + that.data.time2 + ':00'
    wx.request({
      url: that.data.server + 'api/Order?AddUser=' + app.globalData.UserID + '&reciveName=&recivePhone=&State=0&DriverID=0&pageIndex=0&pageSize=' + limit + '&Keywords=&Time1=' + Time1 + '&Time2=' + Time2 + '&APP=1',
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data.Results,
          dataLen: res.data.Results.length,
          search: '时间筛选',
          limit
        })
      }
    })
  },


  bindGoOrderInfo: function(e) {
    wx.navigateTo({
      url: '../../order/pages/orderInfo/orderInfo?id=' + e.currentTarget.dataset.id + '&current=' + e.currentTarget.dataset.current,
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
    this.getData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    let limit = that.data.limit + 8;
    that.setData({
      limit
    })
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})