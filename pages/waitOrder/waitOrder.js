const cfg = require('../../cfg.js');
const utils = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitOrderList:[],
  },

  //点击展开收起
  show: function(e){
    var id = e.currentTarget.id
    var waitOrderList = this.data.waitOrderList
    waitOrderList[id].status = !waitOrderList[id].status
    this.setData({
      waitOrderList
    })
  },

  //进入订单详情
  showDetail: function(e){
    var id = e.currentTarget.id
    var waitOrder = this.data.waitOrderList[id]
    wx.setStorageSync('waitOrderDetail', waitOrder)
    wx.navigateTo({
      url: '../showDetail/showDetail'
    })
  },

  //买手接单
  orders: function(e){
    var id = e.currentTarget.id
    var waitOrder = this.data.waitOrderList[id]
    wx.showModal({
      title: '提示',
      content: '确认接单吗？接单后，请尽快安排采购哦',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          var legworkId = waitOrder.id
          var buyerId = app.globalData.buyerId
          console.log('buyerId:', buyerId)
          buyerOrders.call(this, legworkId, buyerId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
//获取待接单列表
function getWaitOrderList(){
  var that = this;
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/queryLegworkOrder',
    method: 'POST',
    data: {
      isEnd: 0
    },
    success: (res) => {
      if (res.data.status === 10000){
        var waitOrderList = res.data.data;
        var hiddenWaitOrderList = []
        var openList = []

        waitOrderList.forEach(element => {
          element.status = true
          element.createTime = utils.formatDateNoSecond(element.createTime);
          element.waitDay = parseInt(element.waitTime/24)
          element.waitHour = element.waitTime - element.waitDay * 24
          if (element.nickName){
            element.nickName = element.nickName.substring(0, 1) + '**' + element.nickName.substring(element.nickName.length - 2, element.nickName.length - 1)
          }else{
            element.nickName = "**"
          }
          if (element.itemList.length > 5) {
            element.openList = element.itemList.slice(0, 5)
            element.hiddenWaitOrderList = element.itemList.slice(5)
          }
        })
        that.setData({
          waitOrderList: waitOrderList
        })
        console.log('waitOrderList:', waitOrderList)
      }
    } 
  })
}

//买手接单
function buyerOrders(legworkId, buyerId){
  var that = this;
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/receiveLegworkOrder',
    method: "post",
    data: {
      legworkId: legworkId,
      // buyerId: buyerId,
      buyerId: 2,
      isEnd: 1
    },
    success: (res)=>{
      console.log('res:',res)
      if (res.data.status === 10000){
        wx.showToast({
          title: '接单成功',
          icon: 'none'
        })
        getWaitOrderList.call(that)
      }else{
        wx.showModal({
          title: '提示',
          content: '接单异常',
        })
      }
      
    }
  })

}