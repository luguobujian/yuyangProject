// pages/me/book/book.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: App.globalData.server,
    data: "",
    isShow: false,
    name: "",
    ajxNameTrue: "",
    tel: "",
    ajxTelTrue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.request({
      url: that.data.server + 'api/Contacts?&AddUser=' + App.globalData.UserID + '&Name=&PhoneNum=&pageIndex=0&pageSize=9999',
      success: function(res) {
        console.log(res)
        that.setData({
          data: res.data.Results
        })
      }
    })
  },
  bindDel: function(e) {
    let that = this
    wx.request({
      url: this.data.server + 'api/Contacts/' + e.currentTarget.dataset.id,
      method: 'DELETE',
      success: function(res) {
        console.log(res)
        wx.request({
          url: that.data.server + 'api/Contacts?&AddUser=' + App.globalData.UserID + '&Name=&PhoneNum=&pageIndex=0&pageSize=9999',
          success: function(res) {
            console.log(res)
            that.setData({
              data: res.data.Results
            })
          }
        })
      }
    })
  },
  bindNameValue: function(e) {
    let name = e.detail.value;
    if (!/^[\u4E00-\u9FA5\uf900-\ufa2d·]*$/.test(name)) {
      this.setData({
        ajxNameTrue: false,
        name: ""
      })
    } else {
      this.setData({
        ajxNameTrue: true,
        name: e.detail.value
      })
    }
  },
  bindTelValue: function(e) {　
    let phone = e.detail.value;
    console.log(phone)
    console.log(/^1[34578]\d{9}$/.test(phone))
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
    }
  },
  bindThisMan: function() {
    let that = this
    if (!this.data.ajxNameTrue) {
      wx.showToast({
        title: '提示 : 姓名有误',
        icon: 'none',
        duration: 2000
      })
    } else if (!this.data.ajxTelTrue) {
      wx.showToast({
        title: '提示 : 手机号有误',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: this.data.server + 'api/Contacts',
        method: "post",
        data: {
          Name: this.data.name,
          PhoneNum: this.data.tel,
          AddUser: App.globalData.UserID
        },
        success: function(res) {
          console.log(res)
          if (res.data.msg == "操作成功") {
            that.bindIsShow()
            wx.request({
              url: that.data.server + 'api/Contacts?&AddUser=' + App.globalData.UserID + '&Name=&PhoneNum=&pageIndex=0&pageSize=9999',
              success: function(res) {
                console.log(res)
                that.setData({
                  data: res.data.Results
                })
              },
            })
          }
        }
      })
    }
  },
  bindIsShow: function() {
    if (this.data.isShow) {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }
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