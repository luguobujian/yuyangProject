// pages/tabBar/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    openId: app.globalData.openId,
    logModalShow: false,
    telModalShow: true,

    tel: '', //手机号
    ajxTelTrue: '',
    telStatus: '',
    code: '',
    iscode: '',
    codename: '获取验证码',

    userInfo: "",

    carData: "",
    carInfo: "",

    back: "请选择发货地址",
    go: "请选择收货地址",
    callName: "",
    callTel: "",
    currentTab: 0,
    scrollLeft: 0,
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo,
                logModalShow: true
              })
              // openId查验
              that.bindVerOpenId(that)
            }
          })
        } else {
          that.setData({
            logModalShow: false
          })
        }
      }
    })
    // 处理方法
    that.getCarCls()
  },
  // 获取车类
  getCarCls: function() {
    let that = this
    wx.request({
      url: that.data.server + 'api/TruckType?Name=',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        that.setData({
          carData: res.data,
          carInfo: res.data[0]
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  },
  bindVerOpenId: function(that) {
    console.log(that)
    wx.request({
      url: that.data.server + 'api/XcxUserInfo?WxOpenID=' + app.globalData.openId,
      success: function(res) {
        console.log(res)
        if (res.data.status) {
          that.setData({
            telModalShow: true,
          })
          app.globalData.ticket = res.data.Ticket
        } else {
          that.setData({
            telModalShow: false,
          })
        }
      }
    })
  },
  // 获取手机号
  bindTelValue: function(e) {
    let phone = e.detail.value
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxTelTrue: false,
        tel: ""
      })
    } else {
      this.setData({
        ajxTelTrue: true,
        tel: e.detail.value
      })
      if (phone.length == 11) {
        this.verifyTel(phone)
      }
    }
  },
  // 取短信验证码
  bindCodeValue: function(e) {
    let smsCode = e.detail.value
    if (smsCode == "") {
      this.setData({
        ajxCodeTrue: false,
        code: ""
      })
    } else {
      this.setData({
        ajxCodeTrue: true,
        code: e.detail.value
      })
    }
  },
  // 获取短信验证码
  getCode: function() {
    let _this = this;
    if (!this.data.ajxTelTrue) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
    } else {
      var num = 61;
      var timer = setInterval(function() {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codename: '重新发送',
            disabled: false
          })

        } else {
          _this.setData({
            codename: num + "s"
          })
        }
      }, 1000)
      wx.request({
        url: _this.data.server + 'api/SmsCode?PhoneNum=' + _this.data.tel + '&type=change',
        success(res) {
          console.log(res)
          _this.setData({
            // iscode: res.data.data,
            disabled: true
          })

        }
      })
    }
  },
  //获取验证码
  // getVerificationCode() {
  //   this.getCode();
  //   var _this = this
  //   _this.setData({
  //     disabled: true
  //   })
  // },
  bindGetUserInfo: function(e) {
    console.log(e)
    let that = this
    that.setData({
      userInfo: e.detail.userInfo,
      logModalShow: true
    })
    that.bindVerOpenId(that)
  },
  // 验证手机号
  verifyTel: function(data) {
    let that = this
    // console.log(data)
    wx.request({
      url: this.data.server + 'api/XcxUserInfo?PhoneNum=' + data,
      success: function(res) {
        console.log(res)
        that.setData({
          telStatus: res.data.status
        })
        app.globalData.UserID = res.data.UserID
      }
    })
  },
  // 用户处理
  bindAddUser: function() {
    let that = this
    if (this.data.telStatus == 3) {
      // 注册
      wx.request({
        url: this.data.server + 'api/User?PhoneNum=' + this.data.tel + '&SmsCode=' + this.data.code + '&DriverID=0&Company=&WxOpenID=' + app.globalData.openId,
        success: function(res) {
          console.log(res)
          that.bindVerOpenId(that)
        }
      })
    } else if (this.data.telStatus == 2) {
      wx.showToast({
        title: '手机已被其他用户绑定',
        icon: "none"
      })
    } else if (this.data.telStatus == 1) {
      // 绑定
      wx.request({
        url: this.data.server + "api/User?UserID=" + app.globalData.UserID + "&PhoneNum=" + this.data.tel + "&SmsCode=" + this.data.code + "&WxOpenID=" + app.globalData.openId,
        method: 'post',
        success: function(res) {
          console.log(res)
          that.bindVerOpenId(that)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  bindGoGetContact: function() {
    wx.navigateTo({
      url: '../../index/pages/contact/contact',
    })
  },
  bindGoOrder: function() {
    wx.navigateTo({
      url: '../../index/pages/goOrder/goOrder',
    })
  },
  facility: function() {
    wx.navigateTo({
      url: '../../index/pages/instant/instant',
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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