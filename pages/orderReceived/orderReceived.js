// pages/orderReceived/orderReceived.js
const cfg = require('../../cfg.js');
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderReceivedList: [],
    isbtn: false,
    //买到填写进度商品图片
    scheduleUrl:'', 
    //填写买到商品情况
    note:'',
    //当前商品id
    productId:null,
    legworkId:null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getOrderReceivedList.call(this)
  },

  //点击展开收起
  show: function(e) {
    var id = e.currentTarget.id
    var orderReceivedList = this.data.orderReceivedList
    orderReceivedList[id].status = !orderReceivedList[id].status
    this.setData({
      orderReceivedList
    })
  },

  //进入订单详情
  showDetail: function(e) {
    var id = e.currentTarget.id
    console.log('id:', id)
    var orderReceived = this.data.orderReceivedList[id]
    wx.setStorageSync('orderReceivedDetail', orderReceived)
    wx.navigateTo({
      url: '../orderProgress/orderProgress'
    })
  },

  buyClick(e) {
    var productId = e.currentTarget.id
    var legworkId = e.currentTarget.dataset.legworkid
    this.setData({
      isbtn: true,
      productId,
      legworkId
    })
    wx.hideTabBar();
  },

  cancelBuy() {
    this.setData({
      isbtn: false,
      scheduleUrl: '',
    })
    wx.showTabBar();
  },

  //选择图片
  chooseImg: function() {
    let that = this
    wx.chooseImage({
      // 默认9
      count: 1,
      // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['original', 'compressed'], 
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'], 
      success: (res)=>{
        console.log('res:',res)
        var tempFilePaths = res.tempFilePaths
        //上传中
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        uploadImg.call(this, tempFilePaths[0])
      }
    })
  },

  //填写买到情况
  inputBuyContent: function(e) {
    var note = e.detail.value 
    this.setData({
      note
    })
  },

  //确定买到
  submitBuy: function() {
    var { scheduleUrl, productId, legworkId, note} = this.data
    if (!scheduleUrl){
      wx.showModal({
        title: '提示',
        content: '商品图片必须填写',
      })
    }else{
      buyGoods.call(this,scheduleUrl, productId, legworkId, note)
    }
  },

  //采购完结
  order: function(e) {
    var id = e.currentTarget.id
    var orderReceived = this.data.orderReceivedList[id]
    var { buyerId } = this.data.buyerId
    wx.showModal({
      content: '本次所有商品已经和客服沟通,确定要结束采购流程嘛？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确认')
          var legworkId = orderReceived.id
          buyFinish.call(this, legworkId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    getOrderReceivedList.call(this)
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
      }
    }
  })
}

//采购完结
function buyFinish(legworkId) {
  var that = this;
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/buyFinish',
    method: "post",
    data: {
      legworkId: legworkId
    },
    success: (res) => {
      if (res.data.status === 10000) {
        wx.showToast({
          title: '采购成功',
          icon: 'none'
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '采购异常',
        })
      }

    }
  })
}

//买到商品
function buyGoods(scheduleUrl, productId, legworkId, note) {
  var that = this
  wx.request({
    url: cfg.localUrl + 'legworkBuyer/buyGoods',
    method: 'post',
    data:{
      scheduleUrl: scheduleUrl,
      productId: parseInt(productId),
      legworkId: legworkId,
      note: note
    },
    success: (res) => {
      if(res.data.status === 10000){
        that.setData({
          isbtn: false,
        })
        wx.showTabBar();
        getOrderReceivedList.call(that);
      }
    }
  })
}

//上传图片获取scheduleUrl
function uploadImg (imgUrl){
  var that = this
  console.log('this:', this)
  wx.uploadFile({
    url: cfg.localUrl + 'legworkBuyer/fileUplode',
    filePath: imgUrl,
    name: 'file',
    success: function(res){
      var data = JSON.parse(res.data)
      if(data.status === 10000){
        wx.showToast({
          title: '上传成功',
          icon: 'none',
        })
        var scheduleUrl = data.data
        that.setData({
          scheduleUrl: scheduleUrl
        })
      }else{
        wx.showToast({
          title: '上传图片异常',
          icon: 'none',
        })
      }
    }
  })

}