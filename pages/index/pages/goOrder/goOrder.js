// pages/index/pages/goOrder/goOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    orderData: "",
    Notes: "",
    userInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    console.log(options)
    this.setData({
      orderData: options
    })
    // let jl = (that.getFlatternDistance(options.SendLat, options.SendLong, options.ReciveLat, options.ReciveLong)).toFixed(3)

    wx.request({
      url: that.data.server + 'api/User/' + app.globalData.UserID + '?user=',
      success: function(res) {
        that.setData({
          userInfo: res.data,
        })
        if (res.data.Type) {

        } else {
          wx.request({
            url: 'https://api.map.baidu.com/direction/v2/driving?origin=' + options.SendLat + ',' + options.SendLong + '&destination=' + options.ReciveLat + ',' + options.ReciveLong + '&ak=8Lt4avKN0k3vnUF5gKyQqT5oEU6pTqmZ',
            success: function(res) {
              console.log(res)
              let jl = res.data.result.routes[0].distance / 1000
              if (res.data.message == "成功") {
                let pri = (jl - 3) * options.PreviewPrice + options.StartPrice
                console.log((jl - 3) * options.PreviewPrice)
                console.log(options.StartPrice)
                let str = "orderData.Price"
                if (pri > (options.StartPrice - 0)) {
                  let Price = (jl - 3) * options.PreviewPrice - (-options.StartPrice)
                  that.setData({
                    [str]: Price.toFixed(2)
                  })
                } else {
                  let Price = (options.StartPrice - 0).toFixed(2)
                  that.setData({
                    [str]: Price
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  bindGetNotes: function(e) {
    // console.log(e.detail.value)
    this.setData({
      Notes: e.detail.value
    })
  },
  sure: function(e) {
    let str = 'orderData.Notes'
    this.setData({
      [str]: this.data.Notes
    })
    // console.log(this.data.orderData)
    wx.request({
      url: this.data.server + 'api/Order',
      method: 'post',
      data: this.data.orderData,
      success: function(res) {
        console.log(res)
        if (res.data.status) {
          wx.redirectTo({
            url: '../instant/instant?page=sure',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindGoProtocol: function() {
    wx.navigateTo({
      url: '../protocol/protocol'
    })
  },
  bindInstant: function() {
    wx.navigateTo({
      url: '../instant/instant'
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

  },
  getRad: function(d) {
    var PI = Math.PI;
    return d * PI / 180.0;
  },
  getFlatternDistance: function(lat1, lng1, lat2, lng2) {
    var EARTH_RADIUS = 6378137.0; //单位M
    // console.log(lat1)
    // console.log(lng1)
    // console.log(lat2)
    // console.log(lng2)


    var f = this.getRad((lat1 - (-lat2)) / 2);
    var g = this.getRad((lat1 - lat2) / 2);
    var l = this.getRad((lng1 - lng2) / 2);

    // console.log(f)
    // console.log(g)
    // console.log(l)

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    // console.log(w)
    // console.log(r)
    // console.log(d)
    // console.log(h1)
    // console.log(h2)


    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)) / 1000;
  },
})