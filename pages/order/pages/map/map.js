// pages/order/pages/map/map.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    latitude: "",
    longitude: "",
    markers: [{
      id: 1,
      latitude: 33.638406,
      longitude: 116.972672,
      width: 32,
      height: 42,
      iconPath: '../../../../image/icon/Truck32.gif',
      callout: {
        content: "车车",
        color: "#ffffff",
        fontSize: 12,
        padding: 4,
        borderRadius: 8,
        bgColor: '#ca0000',
      }
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      this.getLocation(this);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          this.getLocation(this);
        } else { //授权后默认加载
          this.getLocation(this);
        }
      }
    })

    // let timer = setInterval(function() {
    //   wx.request({
    //     url: that.data.server + 'api/Driver?driverid=' + options.DriverID,
    //     success: function(res) {
    //       console.log(res)
    //     }
    //   })
    // }, 1000)
  },
  getLocation: (that) => {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: (res) => {
        console.log(res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail: function(res) {
        // console.log(res);
      }
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