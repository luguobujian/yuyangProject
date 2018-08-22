// pages/index/pages/getAddress.js
const app = getApp()
const bmap = require('../../../../libs/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    form: "",
    logModalShow: 1,

    latitude: "",
    longitude: "",
    addressName: "当前位置",
    tempAddress: "",
    address: "",
    city: "",
    sugData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      form: options.form
    })

  },
  getLocation: (that) => {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: (res) => {
        that.loadCity(res.latitude, res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },
  loadCity: function(latitude, longitude) {
    let that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=F2HqMyAayTiaaxYOHeagngK4Ck3nLxeH&location=' + latitude + ',' + longitude + '&output=json',
      success: function(res) {
        let address = res.data.result;
        that.setData({
          tempAddress: address.formatted_address + address.sematic_description,
          address: address.formatted_address + address.sematic_description,
          city: address.addressComponent.city.substr(0, 2)
        });
      },
      fail: function() {
        this.setData({
          city: "失败"
        });
      },
    })
  },
  bindKeyInput: function(e) {
    let that = this;
    if (e.detail.value == '') {
      that.setData({
        sugData: '',
        // addressName: "当前位置",
        // address: that.data.tempAddress
      });
      return;
    } else {
      // that.setData({
      //   addressName: "位置",
      //   address: e.detail.value
      // });
      let BMap = new bmap.BMapWX({
        ak: 'F2HqMyAayTiaaxYOHeagngK4Ck3nLxeH'
      });
      let fail = function(data) {
        // console.log(data)
      };
      let success = function(data) {
        // console.log(data)
        let sugData = []
        for (let i = 0; i < data.result.length; i++) {
          if (data.result[i].location) {
            wx.request({
              url: 'https://api.map.baidu.com/geocoder/v2/?ak=F2HqMyAayTiaaxYOHeagngK4Ck3nLxeH&location=' + data.result[i].location.lat + ',' + data.result[i].location.lng + '&output=json',
              success: function(res) {
                // console.log(res)
                sugData.push({
                  name: data.result[i].name,
                  address: res.data.result.formatted_address + res.data.result.sematic_description,
                  lng: data.result[i].location.lng,
                  lat: data.result[i].location.lat
                })
                if (data.result.length - 1 == sugData.length) {
                  that.setData({
                    sugData
                  });
                  // console.log(that.data.sugData)
                }
              },
              fail: function() {},
            })
          }

        }


      }
      BMap.suggestion({
        query: e.detail.value,
        region: that.data.city,
        city_limit: true,
        fail: fail,
        success: success
      });
    }

  },
  bindChosCity: function() {
    wx.navigateTo({
      url: '../city/city',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindAddress: function(e) {
    let pages = getCurrentPages();
    // console.log(e)
    let prevPage = pages[pages.length - 2]
    // console.log(this.data.form)
    if (this.data.form == "back") {
      prevPage.setData({
        back: e.currentTarget.dataset.address,
        SendLong: e.currentTarget.dataset.lng,
        SendLat: e.currentTarget.dataset.lat,
      })
    } else if (this.data.form == "go") {
      prevPage.setData({
        go: e.currentTarget.dataset.address,
        ReciveLong: e.currentTarget.dataset.lng,
        ReciveLat: e.currentTarget.dataset.lat,
      })
    }
    // console.log(prevPage)
    wx.navigateBack({
      delta: 1,
    })
  },
  // bindGetLocation: function(e) {
  //   console.log(e)
  //   let that = this
  //   that.setData({
  //     userInfo: e.detail.userInfo,
  //     logModalShow: true
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] !== true) {
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
                      that.getLocation(that);
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
        } else {
          that.getLocation(that);
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