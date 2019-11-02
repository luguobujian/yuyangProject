// pages/tabBar/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    wxUserInfo: "",
    userInfo: "",
    phone: "",
    tel: "",
    logModalShow: true,
    telModalShow: true,
    codename: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSomeUserInfo() //获取用户信息
    this.setData({
      wxUserInfo: app.globalData.userInfo
    })
  },
  getSomeUserInfo: function(id) {
    let that = this
    wx.request({
      url: that.data.server + 'api/User/' + app.globalData.UserID + '?user=',
      success: function(res) {
        console.log(res)
        that.setData({
          userInfo: res.data,
        })
        app.globalData.SomeUserInfo = res.data
        app.globalData.PhoneNum = res.data.PhoneNum
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindGoItem: function(e) {
    if (!app.globalData.ticket) {
      this.setData({
        logModalShow: false
      })
      return
    }
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../me/' + item + '/' + item
    })
  },
  bindGoBZ: function(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../me/someInfo/someInfo?pages=someInfo'
    })
  },
  bindsignout: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '退出将解除手机号绑定？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.server + 'api/XcxUserInfo?WxOpenID=' + app.globalData.WxOpenID,
            method: 'DELETE',
            success: function(res) {
              console.log(res)
              wx.reLaunch({
                url: '/pages/tabBar/index/index',
              })
            }
          })
          app.globalData.ticket = ''
          app.globalData.UserID = ''
        } else if (res.cancel) {
          console.log('用户点击取消')
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
  // // 验证手机号
  verifyTel: function(data) {
    let that = this
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
  // 取短信验证码
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
      // var timer = setInterval(function() {
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
      // }, 1000)
      wx.request({
        url: _this.data.server + 'api/SmsCode?PhoneNum=' + _this.data.tel + '&type=change',
        success(res) {
          _this.setData({
            disabled: true
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  bindGetUserInfo: function(e) {
    console.log(e)
    let that = this
    that.setData({
      wxUserInfo: e.detail.userInfo,
      userInfo: e.detail.userInfo,
      logModalShow: true
    })
    app.globalData.userInfo = e.detail.userInfo
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.server + 'api/XcxUserInfo?js_code=' + res.code,
          success: function(res) {
            console.log(res)
            let codeData = JSON.parse(res.data).openid
            app.globalData.WXOpenId = codeData
            that.bindVerOpenId(that)
          }
        })
      }
    })
  },
  bindVerOpenId: function() {
    let that = this
    let PhoneNum = that.data.tel || ''
    let scene = that.data.scene || 0
    console.log(PhoneNum)
    console.log(scene)
    console.log(this.data.userInfo.nickName)
    wx.request({
      url: that.data.server + 'api/XcxUserInfo?PhoneNum=' + PhoneNum + '&DriverID=' + scene + '&Name=' + this.data.userInfo.nickName,
      method: "post",
      data: {
        WxOpenID: app.globalData.WXOpenId,
      },
      success: function(res) {
        console.log(res)
        if (res.data.status) {
          that.setData({
            telModalShow: true,
          })
          app.globalData.ticket = res.data.Ticket
          app.globalData.UserID = res.data.UserID
          that.getSomeUserInfo()
        } else {
          that.setData({
            telModalShow: false,
          })
          // that.bindAddUser()
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