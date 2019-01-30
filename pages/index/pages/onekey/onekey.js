// pages/index/pages/onekey.js
const app = getApp()
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.globalData.server,
    radio: '',
    makeCon: '',
    mp3Name: '录音',
    poster: '',
    author: '',
    mp3TempFilePath: '',
    imgTempFilePath: '',
    beginCon: '按住录音'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  bindSetMakeCon: function(e) {
    let that = this
    console.log(e)
    that.setData({
      makeCon: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindChooseImg: function() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: [],
      sourceType: [],
      success: function(res) {
        // that.setData({
        //   imgTempFilePath: res.tempFilePaths
        // })
        wx.uploadFile({
          url: that.data.server + 'api/Upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            console.log(res);
            let imgPathS = []
            let imgPath = that.data.server + JSON.parse(res.data).result
            imgPathS.push(imgPath)
            console.log(imgPath);
            that.setData({
              imgTempFilePath: imgPathS
            })
          }
        })
      },
    })
  },
  bindSeeImg: function(e) {
    console.log(e)
    wx.previewImage({
      urls: e.currentTarget.dataset.src // 需要预览的图片http链接列表
    })
  },
  // 选择方式
  bindRadioChange: function(e) {
    console.log(e)
    let that = this
    let radioIndex = e ? e.detail.value : 0
    console.log(radioIndex)
    that.setData({
      radio: radioIndex
    })
    // if (radioIndex == 0) {
    //   that.setData({
    //     role: "发货",
    //     go: that.data.SomeUserInfo.Addr,
    //     ReciveLong: that.data.SomeUserInfo.Long,
    //     ReciveLat: that.data.SomeUserInfo.Lat,
    //     back: "请选择发货地址",
    //     SendLong: "",
    //     SendLat: "",
    //   })
    // } else if (radioIndex == 1) {
    //   that.setData({
    //     role: "收货",
    //     go: "请选择收货地址",
    //     ReciveLong: "",
    //     ReciveLat: "",
    //     back: that.data.SomeUserInfo.Addr,
    //     SendLong: that.data.SomeUserInfo.Long,
    //     SendLat: that.data.SomeUserInfo.Lat,
    //   })
    // }
  },
  /** 录音开始 */
  speechStart: function(e) {
    let that = this
    that.setData({
      beginCon: '录音中...'
    })
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 64000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
    recorderManager.onStart(() => {});
  },
  speechStop: function(e) {
    let that = this
    that.setData({
      beginCon: '录音'
    })
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log(res)
      wx.uploadFile({
        url: that.data.server + 'api/Upload',
        filePath: res.tempFilePath,
        name: 'file',
        success: function(res) {
          console.log(res);
          let mp3Path = that.data.server + JSON.parse(res.data).result
          console.log(mp3Path)
          that.setData({
            mp3TempFilePath: mp3Path
          })
        }
      })
    })
  },
  //播放声音
  bindPlay: function() {
    console.log(this.data.mp3TempFilePath)
    innerAudioContext.src = this.data.mp3TempFilePath,
      innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  submit: function(e) {
    console.log(e);
    let that = this
    let type
    if (this.data.radio == 1) {
      type = true
    } else if (this.data.radio == 0) {
      type = false
    }
    console.log(type)
    if (that.data.makeCon || that.data.imgTempFilePath || that.data.mp3TempFilePath) {
      wx.request({
        url: that.data.server + 'api/OneKey',
        method: 'post',
        data: {
          UserID: app.globalData.UserID,
          text: that.data.makeCon,
          image: that.data.imgTempFilePath[0],
          audio: that.data.mp3TempFilePath,
          form_id: e.detail.formId,
          OrderType: type
        },
        success: function(res) {
          console.log(res)
          wx.redirectTo({
            url: '../instant/instant?page=sure',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '什么都没输入哦。。。',
        icon: "none",
        duration: 2000
      })
    }
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