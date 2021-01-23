const app = getApp()
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    message: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    idde: '',
    replays: [],
    num: 0
  },
  getopicone: function (val) {
    // 获取话题信息
    let that = this
    db.collection('topic').doc(val).get({
      success: function (res) {
        console.log(res)
        if (res && res.errMsg === 'document.get:ok') {
          if (res.data) {
            that.setData({
              topic: res.data,
            })
          }
        }
      }
    })
  },
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 输入框的值改变
  valchange: function (val) {
    console.log(val.detail)
    this.setData({
      message: val.detail,
    })
  },
  // 点击提交
  tijaio: function () {
    // 判断是否登录   是否输入值 
    if (this.data.canIUse && wx.getStorageSync('userInfo')) {
      if (this.data.message.length == 0 || this.data.message.trim() === '') {
        wx.showToast({
          icon: 'none',
          title: '留言不能为空',
        })
      } else {
        // 
        this.saveReplay()
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '先登录在留言',
      })
      wx.switchTab({
        url: '../about/about',
      })
    }
  },
  saveReplay: function () {
    let that = this
    // console.log(that.data.idde)
    db.collection('replay').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: that.data.message,
        date: new Date(),
        r_id: that.data.idde,
        user: wx.getStorageSync('userInfo'),
      },
      success: function (res) {
        // console.log(res)
        wx.showToast({
          title: '发射成功',
        })
        // 继续查询留言进行展示
        that.getReplay()
      },
      fail: console.error
    })
  },
  getReplay: function () {
    let that = this
    // 获取留言列表
    db.collection('replay')
      .where({
        r_id: that.data.idde
      })
      .get({
        success: function (res) {
          // res.data 包含该记录的数据
          // console.log(res)
          if (res && res.errMsg === "collection.get:ok") {
            if (res.data) {
              that.setData({
                replays: res.data,
                message: '',
                num: res.data.length,
              })
            }
          }
        },
        fail: console.error
      })
  },
  // 绑定的点击事件函数
  onViewTap: function () {
    this.createQrCode(); // 调用生成小程序码
  },

  // 生成小程序码
  createQrCode: function () {
    this.showLoading();
    wx.cloud
      .callFunction({
        // 请求云函数
        // 云函数getQrCode
        name: 'getQrCode',
      })
      .then((res) => {
        console.log(res);
        const fileId = res.result;
        wx.previewImage({
          // 小程序码,生成后直接预览,前台展示
          urls: [fileId],
          current: fileId,
        });
        this.hideLoading();
      });
  },

  // toast生成中
  showLoading: function () {
    wx.showLoading({
      title: '正在生成中...',
      icon: 'none',
    });
  },

  hideLoading: function () {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if (options && options.id) {
      this.getopicone(options.id)
      this.setData({
        idde: options.id
      })
    }
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
    this.getReplay()
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
    return {
      title: '精选小王沟社区',
      // path: '/pages/home/main', // 好友点击分享之后跳转到的小程序的页面
      // desc: '描述',  // 看你需要不需要，不需要不加
      // imageUrl: '分享的图片路径'
    }
  }
})