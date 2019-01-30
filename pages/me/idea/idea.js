// pages/me/idea/idea.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    idea: "",
    data: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGuest()
  },

  bindGetValue: function(e) {
    this.setData({
      idea: e.detail.value
    })
  },

  bindPullIdea: function() {
    let Notes = this.data.idea
    if (Notes == "") {
      wx.showToast({
        title: '意见为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: this.data.server + 'api/Guest',
        method: 'post',
        data: {
          Notes,
          AddUser: 1
        },
        success: function(res) {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    }
  },

  getGuest: function() {
    let that = this
    wx.request({
      url: this.data.server + 'api/Guest?Title=&Notes=&pageIndex={pageIndex}&pageSize={pageSize}',
      method: 'get',
      success: function(res) {
        console.log(res)
        console.log(that.convertHtmlToText("<p>收到</p>"))
        for (var i = 0; i < res.data.Results.length; i++ ){
          if (res.data.Results[i].Reply) {
            res.data.Results[i].Reply = (that.convertHtmlToText(res.data.Results[i].Reply))
          }
        }
        that.setData({
          data: res.data.Results
        })
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

  },
  convertHtmlToText: function (inputText) {
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

    return returnText;
  }
})


