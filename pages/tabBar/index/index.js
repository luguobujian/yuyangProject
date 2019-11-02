// pages/tabBar/index/index.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // alert: '',


    scene: '',
    server: app.globalData.server,
    WXOpenId: app.globalData.WXOpenId,
    logModalShow: true,
    telModalShow: false,

    PhoneNum: '',
    SomeUserInfo: '',
    tel: '', //手机号
    ajxTelTrue: '',
    telStatus: '',
    code: '',
    iscode: '',
    codename: '获取验证码',

    userInfo: "",

    carData: "",
    carInfo: "",
    role: "发货",
    radio: '',
    back: "请选择发货地址",
    go: "请选择收货地址",
    SendLong: "",
    SendLat: "",
    ReciveLong: "",
    ReciveLat: "",
    date: '',
    timeChs: '',
    SendName: "",
    SendTel: "",
    ReciveName: "",
    ReciveTel: "",

    currentTab: 0,
    scrollLeft: 0,

    thinks: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getSetting({
      success: function(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userInfo: res.userInfo
              })
            },
          })
          // openId查验
          wx.login({
            success: res => {
              wx.request({
                url: app.globalData.server + 'api/XcxUserInfo?js_code=' + res.code,
                success: function(res) {
                  console.log(JSON.parse(res.data))
                  let codeData = JSON.parse(res.data).openid
                  app.globalData.WXOpenId = codeData
                  that.bindVerOpenId()
                }
              })
            }
          })
        }
      }
    })
    let HM = util.formatHM(new Date())
    let DATE = util.formatDate(new Date())
    if (options.scene) {
      that.setData({
        scene: options.scene
      })
    }
    that.setData({
      date: DATE,
      timeChs: HM
    })
    that.getCarCls()

  },
  clearTime: function() {
    this.setData({
      timeChs: ''
    })
  },
  // 获取车类
  getCarCls: function() {
    let that = this
    wx.request({
      url: that.data.server + 'api/TruckType?Name=',
      success: function(res) {
        that.setData({
          carData: res.data,
          carInfo: res.data[0]
        })
      }
    })
  },
  bindVerOpenId: function() {
    let that = this
    let PhoneNum = that.data.tel || ''
    let scene = that.data.scene || 0
    wx.request({
      url: that.data.server + 'api/XcxUserInfo?PhoneNum=' + PhoneNum + '&DriverID=' + scene + '&Name=' + this.data.userInfo.nickName,
      method: "post",
      data: {
        WxOpenID: app.globalData.WXOpenId,
      },
      success: function(res) {
        console.log(res)
        if (res.data.status) {
          app.globalData.ticket = res.data.Ticket
          app.globalData.UserID = res.data.UserID
          that.getSomeUserInfo()
        }
      }
    })
  },
  // 获取手机号
  // bindTelValue: function(e) {
  //   let phone = e.detail.value
  //   if (!(/^1[34578]\d{9}$/.test(phone))) {
  //     this.setData({
  //       ajxTelTrue: false,
  //       tel: ""
  //     })
  //   } else {
  //     this.setData({
  //       ajxTelTrue: true,
  //       tel: e.detail.value
  //     })
  //     if (phone.length == 11) {
  //       this.verifyTel(phone)
  //     }
  //   }
  // },
  // // 取短信验证码
  // bindCodeValue: function(e) {
  //   let smsCode = e.detail.value
  //   if (smsCode == "") {
  //     this.setData({
  //       ajxCodeTrue: false,
  //       code: ""
  //     })
  //   } else {
  //     this.setData({
  //       ajxCodeTrue: true,
  //       code: e.detail.value
  //     })
  //   }
  // },
  // // 取短信验证码
  // getCode: function() {
  //   let _this = this;
  //   if (!this.data.ajxTelTrue) {
  //     wx.showToast({
  //       title: '手机号有误',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   } else {
  //     var num = 61;
  //     // var timer = setInterval(function() {
  //     num--;
  //     if (num <= 0) {
  //       clearInterval(timer);
  //       _this.setData({
  //         codename: '重新发送',
  //         disabled: false
  //       })
  //     } else {
  //       _this.setData({
  //         codename: num + "s"
  //       })
  //     }
  //     // }, 1000)
  //     wx.request({
  //       url: _this.data.server + 'api/SmsCode?PhoneNum=' + _this.data.tel + '&type=change',
  //       success(res) {
  //         _this.setData({
  //           disabled: true
  //         })
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     })
  //   }
  // },
  // bindGetUserInfo: function(e) {
  //   console.log(e)
  //   let that = this
  //   that.setData({
  //     userInfo: e.detail.userInfo,
  //     logModalShow: true
  //   })
  //   app.globalData.userInfo = e.detail.userInfo
  //   wx.login({
  //     success: res => {

  //       wx.request({
  //         url: app.globalData.server + 'api/XcxUserInfo?js_code=' + res.code,
  //         success: function(res) {
  //           console.log(res)

  //           let codeData = JSON.parse(res.data).openid
  //           app.globalData.WXOpenId = codeData
  //           // that.bindVerOpenId(that)
  //         }
  //       })
  //     }
  //   })
  // },
  // // 验证手机号
  // verifyTel: function(data) {
  //   let that = this
  //   wx.request({
  //     url: this.data.server + 'api/XcxUserInfo?PhoneNum=' + data,
  //     success: function(res) {
  //       console.log(res)
  //       that.setData({
  //         telStatus: res.data.status
  //       })
  //       app.globalData.UserID = res.data.UserID
  //     }
  //   })
  // },
  onReady: function() {
    this.getCarCls()
  },
  swichNav: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current,
      carInfo: this.data.carData[e.currentTarget.dataset.current],
    })
    this.checkCor();
  },
  checkCor: function() {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  bindGoGetAddress: function(e) {
    wx.navigateTo({
      url: '../../index/pages/getAddress/getAddress?form=' + e.currentTarget.dataset.form,
    })
  },
  bindCallName: function(e) {
    let that = this
    let type = this.data.radio

    console.log(this.data.radio)

    if (!type) {
      wx.showToast({
        title: '请选择提货或者送货',
        icon: "none",
        duration: 2000
      })
      return
    }

    let role = e.currentTarget.dataset.role
    wx.request({
      url: that.data.server + 'api/Contacts?Name=' + e.detail.value + '&PhoneNum=&AddUser=' + app.globalData.UserID + '&pageIndex=0&pageSize=999',
      success: function(res) {
        if (res.data.Results.length) {
          that.setData({
            thinks: res.data.Results
          })
          // if (that.data.radio == 0) {
          //   that.setData({
          //     back: res.data.Results[0].Addr,
          //     SendLong: res.data.Results[0].Long,
          //     SendLat: res.data.Results[0].Lat,
          //     SendName: e.detail.value,
          //     SendTel: res.data.Results[0].PhoneNum
          //   })
          // } else if (that.data.radio == 1) {
          //   that.setData({
          //     go: res.data.Results[0].Addr,
          //     ReciveLong: res.data.Results[0].Long,
          //     ReciveLat: res.data.Results[0].Lat,
          //     ReciveName: e.detail.value,
          //     ReciveTel: res.data.Results[0].PhoneNum
          //   })
          // }
        }
      }
    })
  },
  bindCallTel: function(e) {
    let that = this
    let type = this.data.radio
    if (!type) {
      wx.showToast({
        title: '请选择提货或者送货',
        icon: "none",
        duration: 2000
      })
      return
    }
    if (this.data.radio == 1) {
      type = 0
      that.setData({
        ReciveTel: e.detail.value
      })
    } else if (this.data.radio == 0) {
      type = 1
      that.setData({
        SendTel: e.detail.value
      })
    }

    wx.request({
      url: that.data.server + 'api/Contacts?Name=&PhoneNum=' + e.detail.value + '&AddUser=' + app.globalData.UserID + '&pageIndex=0&pageSize=999',
      success: function(res) {
        console.log(res)
        if (res.data.Results.length) {
          that.setData({
            thinks: res.data.Results
          })
          // if (that.data.radio == 0) {
          //   that.setData({
          //     // back: res.data.Results[0].Addr,
          //     // SendLong: res.data.Results[0].Long,
          //     // SendLat: res.data.Results[0].Lat,
          //     // SendName: res.data.Results[0].Name,
          //     SendTel: e.detail.value
          //   })
          // } else if (that.data.radio == 1) {
          //   that.setData({
          //     // go: res.data.Results[0].Addr,
          //     // ReciveLong: res.data.Results[0].Long,
          //     // ReciveLat: res.data.Results[0].Lat,
          //     // ReciveName: res.data.Results[0].Name,
          //     ReciveTel: e.detail.value
          //   })
          // }
        }
      }
    })
  },
  chsthinks: function(e) {
    console.log(e)
    let that = this
    if (that.data.radio == 0) {
      that.setData({
        back: e.currentTarget.dataset.go,
        SendLong: e.currentTarget.dataset.long,
        SendLat: e.currentTarget.dataset.lat,
        SendName: e.currentTarget.dataset.name,
        SendTel: e.currentTarget.dataset.tel
      })
    } else if (that.data.radio == 1) {
      that.setData({
        go: e.currentTarget.dataset.go,
        ReciveLong: e.currentTarget.dataset.long,
        ReciveLat: e.currentTarget.dataset.lat,
        ReciveName: e.currentTarget.dataset.name,
        ReciveTel: e.currentTarget.dataset.tel
      })
    }
    that.setData({
      thinks: []
    })
  },
  bindGoGetContact: function(e) {
    wx.navigateTo({
      url: '../../index/pages/contact/contact?form=' + e.currentTarget.dataset.form,
    })
  },


  submit: function(e) {
    let that = this
    if (!app.globalData.ticket) {
      wx.switchTab({
        url: '/pages/tabBar/me/me'
      })
      return
    }

    let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    if (this.data.back == "请选择发货地址" || this.data.back == "" || !this.data.SendLong || !this.data.SendLat) {
      wx.showToast({
        title: '发货地址异常，请重新选择',
        icon: "none",
        duration: 2000
      })
    } else if (this.data.go == "请选择收货地址" || this.data.go == "" || !this.data.ReciveLong || !this.data.ReciveLat) {
      wx.showToast({
        title: '收货地址异常，请重新选择',
        icon: "none",
        duration: 2000
      })
    } else if (this.data.go == this.data.back) {
      wx.showToast({
        title: '地址位置重复',
        icon: "none",
        duration: 2000
      })
    } else if (this.data.date == "") {
      wx.showToast({
        title: '请输入发货时间',
        icon: "none",
        duration: 2000
      })
    } else if (this.data.callName == "") {
      wx.showToast({
        title: '请选择或输入收货人',
        icon: "none",
        duration: 2000
      })
    } else if (this.data.SendTel == "" || !phoneReg.test(this.data.SendTel) || this.data.ReciveTel == "" || !phoneReg.test(this.data.ReciveTel)) {
      wx.showToast({
        title: '请选择或输入正确的收发货人电话',
        icon: "none",
        duration: 2000
      })
    } else {
      let SendTime = this.data.date + " " + this.data.timeChs + ":00"
      let roleCon
      if (this.data.radio == 0) {
        roleCon =
          "&AddUser=" + app.globalData.UserID +
          '&ReciveUser=0' +
          '&UserPhone=' + this.data.SendTel +
          '&RecivePhone=' + this.data.ReciveTel +
          '&TempSendUser=' + this.data.SendName +
          '&TempReciveUser=' + this.data.ReciveName
      } else if (this.data.radio == 1) {
        roleCon =
          "&AddUser=" + app.globalData.UserID +
          '&ReciveUser=0' +
          '&UserPhone=' + this.data.SendTel +
          '&RecivePhone=' + this.data.ReciveTel +
          '&TempSendUser=' + this.data.SendName +
          '&TempReciveUser=' + this.data.ReciveName
      }
      wx.navigateTo({
        url: '../../index/pages/goOrder/goOrder?TruckType=' + this.data.carInfo.Name +
          '&TruckID=' + this.data.carInfo.ID +
          '&SendAddr=' + this.data.back +
          '&ReciveAddr=' + this.data.go +
          roleCon +
          '&SendTime=' + SendTime +
          '&SendLong=' + this.data.SendLong +
          '&SendLat=' + this.data.SendLat +
          '&ReciveLong=' + this.data.ReciveLong +
          '&ReciveLat=' + this.data.ReciveLat +
          '&Notes=&Price=0' +
          "&PreviewPrice=" + this.data.carInfo.PreviewPrice +
          "&StartPrice=" + this.data.carInfo.StartPrice +
          "&form_id=" + e.detail.formId +
          '&AddOrder=30'
      })
    }
  },
  facility: function() {
    wx.navigateTo({
      url: '../../index/pages/instant/instant',
    })
  },
  getSomeUserInfo: function(id) {
    let that = this
    wx.request({
      url: that.data.server + 'api/User/' + app.globalData.UserID + '?user=',
      success: function(res) {
        that.setData({
          PhoneNum: res.data.PhoneNum,
          SomeUserInfo: res.data
        })
        app.globalData.SomeUserInfo = res.data
        app.globalData.PhoneNum = res.data.PhoneNum
      }
    })
  },
  // 选择方式
  bindRadioChange: function(e) {
    console.log(e)
    let that = this
    let radioIndex = e ? e.detail.value : 0
    that.setData({
      radio: radioIndex
    })
    if (radioIndex == 0) {
      console.log(app.globalData)
      that.setData({
        role: "发货",
        go: app.globalData.SomeUserInfo.Addr || "请选择收货地址",
        ReciveLong: app.globalData.SomeUserInfo.Long,
        ReciveLat: app.globalData.SomeUserInfo.Lat,
        ReciveName: app.globalData.SomeUserInfo.Name,
        ReciveTel: app.globalData.SomeUserInfo.PhoneNum,
        back: "请选择发货地址",
        SendLong: "",
        SendLat: "",
        SendName: "",
        SendTel: "",
      })
    } else if (radioIndex == 1) {
      that.setData({
        role: "收货",
        go: "请选择收货地址",
        ReciveLong: "",
        ReciveLat: "",
        ReciveName: "",
        ReciveTel: "",
        back: app.globalData.SomeUserInfo.Addr || "请选择发货地址",
        SendLong: app.globalData.SomeUserInfo.Long,
        SendLat: app.globalData.SomeUserInfo.Lat,
        SendName: app.globalData.SomeUserInfo.Name,
        SendTel: app.globalData.SomeUserInfo.PhoneNum,
      })
    }
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      timeChs: e.detail.value
    })
  },
  bindOneKey: function(e) {
    if (!app.globalData.ticket) {
      wx.switchTab({
        url: '/pages/tabBar/me/me'
      })
      return
    }
    wx.navigateTo({
      url: '../../index/pages/onekey/onekey',
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