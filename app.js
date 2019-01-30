//app.js
App({
  onLaunch: function() {
    let that = this
    // 获取用户信息
    wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      }),
      setInterval(function() {
        let WXOpenId = that.globalData.WXOpenId || '0'
        wx.request({
          url: that.globalData.server + 'api/XcxUserInfo?WxOpenID=' + WXOpenId,
          method: "post",
          data: {
            WxOpenID: that.globalData.WXOpenId,
          },
          success: function(res) {
            console.log(res)
            if (res.data.status) {
              // that.globalData.ticket = res.data.Ticket
              // that.globalData.UserID = res.data.UserID
            } else {
              wx.reLaunch({
                url: '/pages/tabBar/index/index',
              })
              that.globalData.ticket = ''
              that.globalData.UserID = ''
            }
          }
        })
      }, 40000)
  },
  globalData: {
    server: 'https://www.15865267910.com/',
    // server: 'http://wee168.gicp.net:54070/',
    UserID: null,
    userInfo: null,
    PhoneNum: "",
    WXOpenId: "",
    ticket: ""
  }
})