const app = getApp()
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    fileList: [],
    textareall: ''
  },
  // 点击发布
  publishall: function () {
    if (this.data.canIUse && wx.getStorageSync('userInfo')) {
      if (this.data.fileList.length == 0 && this.data.textareall.trim() === '') {
        wx.showToast({
          icon: 'none',
          title: '写点东西吧',
        })
      } else {
        this.uploadToCloud()
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '先登录在发布',
      })
      wx.switchTab({
        url: '../about/about',
      })
    }
  },
  // 获取写一写
  getvalues: function (e) {
    this.setData({
      textareall: e.detail.value
    })
  },
  // 删除照片处理
  deletepic: function (e) {
    // console.log(e)
    // console.log(e.detail.index)
    // console.log(this.data.fileList)
    let fileList = this.data.fileList.filter((item, index) => index !== e.detail.index)
    console.log(fileList)
    this.setData({
      fileList,
    })
    // console.log(this.data.fileList)
  },
  afterRead: function (event) {
    console.log(event.detail.file)
    this.setData({
      fileList: [...this.data.fileList, event.detail.file]
    })
    // console.log(this.data.fileList)
    // this.uploadToCloud()
  },
  // 上传图片
  uploadToCloud: function () {
    wx.cloud.init();
    const { fileList } = this.data;
    if (!fileList.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo/${Date.now()}/${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          console.log(data)
          wx.showToast({ title: '上传成功', icon: 'none' });
          // let newFileList = []
          let newFileidall = []
          data.forEach((item) => {
            // newFileList.push({ url: item.fileID })
            newFileidall.push(item.fileID)
          })
          // this.setData({ cloudPath: data, fileList: newFileList, newFileidall, });
          // 此时保存到发布集合中
          this.saveDataToServer(newFileidall)
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    }
  },
  uploadFilePromise: function (fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url
    });
  },
  dateFormat: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    var realMonth = month > 9 ? month : "0" + month
    return year + "-" + realMonth + "-" + day + " " + hour + ":" + minutes + ":" + seconds
  },
  /**
 * 保存到发布集合中
 */
  saveDataToServer: function (event) {
    var date = this.dateFormat(new Date())
    let that = this
    db.collection('topic').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: that.data.textareall,
        date: date,
        images: event,
        user: wx.getStorageSync('userInfo'),
        // isLike: that.data.isLike,
      },
      success: function (res) {
        console.log(res)
        // // 保存到发布历史
        // this.saveToHistoryServer();
        // // 清空数据
        that.setData({
          textareall: '',
          newFileidall: [],
          fileList: []
        })
        that.showTipAndSwitchTab();
      },
    })
  },
  /**
 * 发布成功添加提示，切换页面
 */
  showTipAndSwitchTab: function (event) {
    wx.showToast({
      title: '发布成功',
    })
    wx.switchTab({
      url: '../home/home',
    })
  },
  // /**
  //  * 添加到发布历史集合中
  //  */
  // saveToHistoryServer: function (event) {
  //   db.collection('history').add({
  //     // data 字段表示需新增的 JSON 数据
  //     data: {
  //       content: that.data.content,
  //       date: new Date(),
  //       images: that.data.images,
  //       user: that.data.user,
  //       isLike: that.data.isLike,
  //     },
  //     success: function (res) {
  //       // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
  //       console.log(res)
  //     },
  //     fail: console.error
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})