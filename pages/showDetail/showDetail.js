// pages/showDetail/showDetail.js
const cfg = require('../../cfg.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitOrderDetail:{},
    buyerId:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const waitOrderDetail = wx.getStorageSync('waitOrderDetail')
    this.setData({
      waitOrderDetail
    })
  },

  //买手接单
  orders: function (e) {
    var waitOrderDetail = this.data.waitOrderDetail
    var { buyerId } = this.data
    wx.showModal({
      title: '提示',
      content: '确认接单吗？接单后，请尽快安排采购哦',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          var legworkId = waitOrderDetail.id
          buyerOrders.call(this, legworkId, buyerId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  lookImg: function (e) {
    var url = e.currentTarget.dataset.src
    wx.previewImage({
      current: url ,
      urls: [url]
    })
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

//买手接单
function buyerOrders(legworkId, buyerId) {
  console.log('this:', this)
  var that = this;
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/receiveLegworkOrder',
    method: "post",
    data: {
      legworkId: legworkId,
      buyerId: buyerId,
      isEnd: 1
    },
    success: (res) => {
      console.log('res:', res)
      if (res.data.status === 10000) {
        wx.switchTab({
          url: '../waitOrder/waitOrder',
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
        wx.showToast({
          title: '接单成功',
          icon: 'none'
        })
        
      } else {
        wx.showModal({
          title: '提示',
          content: '接单异常',
        })
      }

    }
  })

}