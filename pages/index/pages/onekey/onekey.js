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
    makeCon: '',
    mp3Name: '录音',
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    author: '',
    mp3TempFilePath: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    imgTempFilePath: '',
    beginCon: '录音'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
        that.setData({
          imgTempFilePath: res.tempFilePaths
        })
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
      that.setData({
        mp3TempFilePath: res.tempFilePath
      })
      wx.uploadFile({
        url: that.data.server + 'api/Upload',
        filePath: res.tempFilePath,
        name: 'file',
        success: function(res) {
          console.log(res);
          let mp3Path = that.data.server + JSON.parse(res.data).result
          // that.setData({
          //   mp3TempFilePath: mp3Path
          // })
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
    wx.request({
      url: that.data.server + 'api/OneKey',
      data: {
        UserID: app.globalData.UserID,
        form_id: e.detail.formId
      },
      method: 'GET',
      success: function(res) {

      },
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