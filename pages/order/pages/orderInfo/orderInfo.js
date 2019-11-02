// pages/order/orderInfo/orderInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    star: 0,
    someSysInfo: '',
    data: "",
    imgs: [],
    orderId: "",
    current: 1,
    driverData: "",
    starData: "",
    remark: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    that.setData({
      current: options.current,
      orderId: options.id
    })
    that.getOrderData()
    that.getSysInfo()
  },
  getOrderData: function() {
    let that = this
    wx.request({
      url: that.data.server + 'api/Order/' + this.data.orderId,
      success: function(res) {
        console.log(res)
        if (res.data.Stars) {
          for (var i = 0; i < res.data.Stars.length; i++) {
            if (res.data.Stars[i].ReplyContents) {
              res.data.Stars[i].ReplyContents = (that.convertHtmlToText(res.data.Stars[i].ReplyContents))
            }
          }
          that.setData({
            data: res.data,
            imgs: res.data.Images && JSON.parse(res.data.Images),
            current: res.State
          })
        }

        if (res.data.DriverID) {
          that.getDriverID(res.data.DriverID)
        }
      }
    })
  },
  getDriverID: function(id) {
    let that = this
    wx.request({
      url: this.data.server + 'api/Driver?driverid=' + id,
      success: function(res) {
        console.log(res)
        that.setData({
          driverData: res.data
        })
        // that.getStarData()
      }
    })
  },
  getStarData: function() {
    let that = this
    wx.request({
      url: this.data.server + 'api/Stars?DriverID=' + that.data.data.DriverID,
      success: function(res) {
        console.log(res)
        that.setData({
          starData: res.data.Stars
        })
      }
    })
  },
  getSysInfo: function() {
    let that = this
    wx.request({
      url: this.data.server + 'api/SystemInfo',
      success: function(res) {
        // console.log(res)
        that.setData({
          someSysInfo: res.data
        })
      }
    })
  },
  bindCallThisMan: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  bindOpenImage: function(e) {
    console.log(e)
    let urls = []
    urls.push(this.data.server + e.currentTarget.dataset.image)
    wx.previewImage({
      urls: urls
    })
  },
  bindDel: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您要取消这个订单吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: that.data.server + 'api/Order/' + that.data.orderId + '?UserID=' + app.globalData.UserID,
            method: "delete",
            header: {
              'Authorization': 'BasicAuth ' + app.globalData.ticket
            },
            success: function(res) {
              console.log(res)
              that.backPage()
            },
            fail: function(res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    // console.log(app.globalData.ticket)
    // wx.request({
    //   url: this.data.server + 'api/Order/' + this.data.orderId + '?UserID=' + app.globalData.UserID,
    //   method: "delete",
    //   header: {
    //     'Authorization': 'BasicAuth ' + app.globalData.ticket
    //   },
    //   success: function(res) {
    //     console.log(res)
    //     that.backPage()
    //   },
    //   fail: function(res) {
    //     console.log(res)
    //   }
    // })
  },
  geiStar: function(e) {
    this.setData({
      star: e.currentTarget.dataset.star
    })
  },
  bindGiveRemark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  bindGiveStar: function() {
    let that = this
    if (!that.data.star) {
      wx.showToast({
        title: '请选择评分',
        icon: "none",
        duration: 2000
      })
      return
    }
    wx.request({
      url: this.data.server + 'api/Stars',
      method: 'post',
      data: {
        OrderID: that.data.orderId,
        DriverID: that.data.DriverID,
        Star: that.data.star,
        Notes: that.data.remark
      },
      success: function(res) {
        console.log(res)
        that.backPage()
      }
    })
  },
  backPage: function() {
    let pages = getCurrentPages();
    console.log(pages)
    pages[0].onLoad()
    wx.navigateBack({
      delta: 1
    })
  },
  bindGoMap: function() {
    wx.navigateTo({
      url: '../map/map?DriverID=' + this.data.data.DriverID,
    })
  },
  bindPay: function() {
    let that = this

    console.log(this.data.data.Money)
    wx.request({
      url: this.data.server + 'api/PayJsApi?UserID=' + app.globalData.UserID + '&amount=' + this.data.data.Money + '&orderid=' + this.data.data.ID + '&openid=' + app.globalData.WXOpenId,
      success: function(res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': String(res.data.message.timestamp),
          'nonceStr': String(res.data.message.noncestr),
          'package': String(res.data.message.package),
          'signType': 'MD5',
          'paySign': String(res.data.message.sign),
          'success': function(res) {
            console.log(res)
            that.getOrderData()
            let pages = getCurrentPages()
            let prevPages = pages[pages.length - 2]
            prevPages.getData()
          },
          'fail': function(res) {
            console.log(res)
            wx.showToast({
              title: res.requestPayment,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  submit: function(e) {
    let str = 'data.form_id'
    console.log(e)
    this.setData({
      [str]: e.detail.formId
    })
    console.log(this.data.data)
    wx.request({
      url: this.data.server + 'api/Order',
      method: 'post',
      data: this.data,
      success: function(res) {
        console.log(res)
        if (res.data.status) {
          wx.redirectTo({
            url: '../../../index/pages/instant/instant?page=sure',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })
  },
  convertHtmlToText: function(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');
    returnText = returnText.replace(/&nbsp;/ig, '');
    return returnText;
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