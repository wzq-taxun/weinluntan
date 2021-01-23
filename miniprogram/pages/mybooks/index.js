const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: []
  },
  // 查询表中每个对应的用户的帖子
  getDatalist: function () {
    const db = wx.cloud.database();
    let that = this
    db.collection('topic').where({
      _openid: wx.getStorageSync('openid')
    })
      .orderBy('date', 'desc')
      .get({
        success: function (res) {
          console.log(res)
          // res.data 是包含以上定义的两条记录的数组
          // console.log("数据：" + res.data)
          if (res && res.errMsg === 'collection.get:ok') {
            if (res && res.data) {
              // 对数据循环然后在依次去查留言表的长度 递归
              // function getId(i) {
              //   if (i == res.data.length) return;
              //   // 获取留言列表
              //   db.collection('replay')
              //     .where({
              //       r_id: res.data[i]._id
              //     })
              //     .get({
              //       success: function (rsp) {
              //         if (rsp && rsp.errMsg === "collection.get:ok") {
              //           if (rsp.data) {
              //             // newall.push({ ...res.data[i], num: rsp.data.length })
              //             res.data[i]['num'] = parseInt(rsp.data.length);
              //             getId(i + 1)
              //           }
              //         }
              //       },
              //       fail: console.error
              //     })
              // }
              // getId(0)
              that.setData({
                topics: res.data,
              })
            }
          }
        },
        fail: function (event) {
          console.log(event)
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
  // 点击携带参数
  jumpDetails: function (event) {
    // console.log(event.currentTarget.dataset.id)
    var name = event.currentTarget.dataset.id
    wx.navigateTo({
      url: "../homedetail/index?id=" + name,
    })
  },
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
    this.getDatalist()
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