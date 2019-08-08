// pages/orderReceived/orderReceived.js
const cfg = require('../../cfg.js');
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1, 1, 1],
    orderReceivedList:[],
    status: true
  },

  show: function () {
    let status = !this.data.status
    this.setData({
      status
    })
  },

  order: function () {
    wx.showModal({
      content: '本次所有商品已经和客服沟通,确定要结束采购流程嘛？',
      success (res) {
        if(res.confirm){
          console.log('用户点击确认')
        }else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })

  },

  showDetail: function () {
    wx.navigateTo({
      url: '../orderProgress/orderProgress',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getOrderReceivedList.call(this)
  },
  detail: function () {
    wx:wx.navigateTo({
      url: '../orderProgress/orderProgress',
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

//获取已接单列表
function getOrderReceivedList() {
  var that = this;
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/queryLegworkOrder',
    method: 'POST',
    data: {
      isEnd: 1
    },
    success: (res) => {
      if (res.data.status === 10000) {
        var orderReceivedList = res.data.data;
        var hiddenOrderReceivedList = []
        var openList = []

        orderReceivedList.forEach(element => {
          element.status = true
          element.createTime = utils.formatDateNoSecond(element.createTime);
          if (element.nickName) {
            element.nickName = element.nickName.substring(0, 1) + '**' + element.nickName.substring(element.nickName.length - 2, element.nickName.length - 1)
          } else {
            element.nickName = "**"
          }
          if (element.itemList.length > 5) {
            element.openList = element.itemList.slice(0, 5)
            element.hiddenOrderReceivedList = element.itemList.slice(5)
          }
        })
        that.setData({
          orderReceivedList: orderReceivedList
        })
        console.log('orderReceivedList:', that.data.orderReceivedList)
      }
    }
  })
}