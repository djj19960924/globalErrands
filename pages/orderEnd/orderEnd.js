// pages/orderEnd/orderEnd.js
const cfg = require('../../cfg.js');
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderEndList:[],
    hiddenOrderEndList:[],
  },

  show: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    var orderEndList = this.data.orderEndList
    orderEndList[id].status = !orderEndList[id].status
    this.setData({
      orderEndList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getWaitOrderList.call(this)
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

//获取采购结束列表
function getWaitOrderList() {
  var that = this;
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/queryLegworkOrder',
    method: 'POST',
    data: {
      isEnd: 2
    },
    success: (res) => {
     
      if (res.data.status === 10000) {
        var orderEndList = res.data.data;
        var hiddenOrderEndList = []
        var openList = []
        orderEndList.forEach(element => {
          element.status = true
          element.createTime = utils.formatDateNoSecond(element.createTime);
          element.waitDay = parseInt(element.waitTime / 24)
          element.waitHour = element.waitTime - element.waitDay * 24
          
          if (element.nickName) {
            element.nickName = element.nickName.substring(0, 1) + '**' + element.nickName.substring(element.nickName.length - 2, element.nickName.length - 1)
          } else {
            element.nickName = "***"
          }
          if (element.itemList.length > 5) {
            element.openList = element.itemList.slice(0, 5)
            element.hiddenOrderEndList = element.itemList.slice(5)
          }
        })
        that.setData({
          orderEndList: orderEndList
        })
        console.log('orderEndList:', that.data.orderEndList)
      }
    }
  })
}