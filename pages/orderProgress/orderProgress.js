// pages/orderProgress/orderProgress.js
const cfg = require('../../cfg.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbtn: false,
    orderReceivedDetail: {},
    //买到填写进度商品图片
    scheduleUrl: '',
    //填写买到商品情况
    note: '',
    //当前商品id
    productId: null,
    legworkId: null
  },

  show: function() {
    var orderReceivedDetail = this.data.orderReceivedDetail
    orderReceivedDetail.status = !orderReceivedDetail.status
    this.setData({
      orderReceivedDetail
    })
  },

  btnclick() {
    this.setData({
      isbtn: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const orderReceivedDetail = wx.getStorageSync('orderReceivedDetail')
    var legworkId = orderReceivedDetail.id
    var { itemList } = orderReceivedDetail
    var buyShopList = []
    if (itemList.length) {
      itemList.forEach(element => {
        if (element.status === 1) {
          buyShopList.push(element)
        }
      })
    }
    this.setData({
      orderReceivedDetail,
      buyShopList,
      legworkId
    })
    console.log('buyShopList:', buyShopList)
  },

  
  buyClick(e) {
    var productId = e.currentTarget.id
    var legworkId = this.data.legworkId
    console.log('11', legworkId, productId)
    this.setData({
      isbtn: true,
      productId,
      legworkId
    })
  },

  cancelBuy() {
    this.setData({
      isbtn: false,
      scheduleUrl: '',
    })
    wx.showTabBar();
  },

  //选择图片
  chooseImg: function () {
    let that = this
    wx.chooseImage({
      // 默认9
      count: 1,
      // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('res:', res)
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
  inputBuyContent: function (e) {
    var note = e.detail.value
    this.setData({
      note
    })
  },

  //确定买到
  submitBuy: function () {
    var { scheduleUrl, productId, legworkId, note } = this.data
    if (!scheduleUrl) {
      wx.showModal({
        title: '提示',
        content: '商品图片必须填写',
      })
    } else {
      buyGoods.call(this, scheduleUrl, productId, legworkId, note)
    }
  },

  //采购完结
  order: function () {
    var orderReceivedDetail = this.data.orderReceivedDetail
    console.log('orderReceivedDetail:', orderReceivedDetail)
    wx.showModal({
      title: '提示',
      content: '本次所有商品已经和客服沟通，确认要结束采购流程吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          var legworkId = orderReceivedDetail.id
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
        wx.switchTab({
          url: '../orderReceived/orderReceived',
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
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
    data: {
      scheduleUrl: scheduleUrl,
      productId: parseInt(productId),
      legworkId: legworkId,
      note: note
    },
    success: (res) => {
      if (res.data.status === 10000) {
        that.setData({
          isbtn: false,
        })
      }
    }
  })
}

//上传图片获取scheduleUrl
function uploadImg(imgUrl) {
  var that = this
  wx.uploadFile({
    url: cfg.localUrl + 'legworkBuyer/fileUplode',
    filePath: imgUrl,
    name: 'file',
    success: function(res) {
      var data = JSON.parse(res.data)
      if (data.status === 10000) {
        wx.showToast({
          title: '上传成功',
          icon: 'none',
        })
        var scheduleUrl = data.data
        that.setData({
          scheduleUrl: scheduleUrl
        })
      } else {
        wx.showToast({
          title: '上传图片异常',
          icon: 'none',
        })
      }
    }
  })

}