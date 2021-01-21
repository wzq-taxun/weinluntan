// pages/about/about.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取用户信息
  getuseinfo: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
            }
          })
        }
      }
    })
  },

  // 登录
  onGetUserInfo: function (e) {
    const that = this;
    wx.showLoading({
      title: '登录中...',
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {
        action: 'getopenid',
      },
      success: res => {
        console.log(res)
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // app.globalData.name = e.detail.userInfo.nickName
        // app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
        //这里执行数据存储到数据库的操作
        wx.hideLoading();
        this.getuseinfo()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.hideLoading();
        wx.navigateTo({
          url: '../index/index',
        })
      }
    })
  },
  // // 获取手机号
  // getPhoneNumber(e) {
  //   console.log(JSON.stringify(e));
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {
  //       action: 'getcellphone',
  //       id: e.detail.cloudID
  //     }
  //   }).then(res => {
  //     console.log('res: ', res)
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuseinfo()
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小王沟社区',
      // desc: '最美家乡',
      path: 'pages/home/home',
      // imageUrl: '分享的图片路径'
    }
  },
})