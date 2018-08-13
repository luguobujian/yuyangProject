// pages/index/pages/getAddress.js
const app = getApp()
const bmap = require('../../../../libs/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
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
    let pages = getCurrentPages();
    console.log(pages)
    let that = this
    wx.getSetting({
      success: function(res) {
        console.log(res)
        if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] !== true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
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
  getLocation: (that) => {
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: (res) => {
        // console.log(res);
        that.loadCity(res.latitude, res.longitude);
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
  loadCity: function(latitude, longitude) {
    let that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=F2HqMyAayTiaaxYOHeagngK4Ck3nLxeH&location=' + latitude + ',' + longitude + '&output=json',
      success: function(res) {
        console.log(res)
        let address = res.data.result;
        that.setData({
          tempAddress: address.formatted_address,
          address: address.formatted_address,
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
    if (e.detail.value === '') {
      that.setData({
        sugData: '',
        addressName: "当前位置",
        address: that.data.tempAddress
      });
      return;
    } else {
      that.setData({
        addressName: "位置",
        address: e.detail.value
      });
    }
    let BMap = new bmap.BMapWX({
      ak: 'F2HqMyAayTiaaxYOHeagngK4Ck3nLxeH'
    });
    let fail = function(data) {
      console.log(data)
    };
    let success = function(data) {
      console.log(data)
      // let sugData = []
      // for (let i = 0; i < data.result.length; i ++) {
      //   wx.request({
      //     url: 'https://api.map.baidu.com/geocoder/v2/?ak=F2HqMyAayTiaaxYOHeagngK4Ck3nLxeH&location=' + data.result[i].location.lat + ',' + data.result[i].location.lng + '&output=json',
      //     success: function (res) {
      //       // console.log(res)
      //       sugData.push({
      //         name: data.result[i].name,
      //         address: res.data.result.formatted_address
      //       })
      that.setData({
        sugData: data.result
      });
      //     },
      //     fail: function () {},
      //   })
      // }

      console.log(that.data.sugData)
    }
    BMap.suggestion({
      query: e.detail.value,
      region: that.data.city,
      city_limit: true,
      fail: fail,
      success: success
    });
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