// pages/orderProgress/orderProgress.js
const cfg = require('../../cfg.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbtn:false,
    orderReceivedDetail:{},
    list:[1,1,1]
  },

  show: function () {
    var orderReceivedDetail = this.data.orderReceivedDetail
    orderReceivedDetail.status = !orderReceivedDetail.status
    this.setData({
      orderReceivedDetail
    })
  },

  btnclick(){
    this.setData({
      isbtn:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderReceivedDetail = wx.getStorageSync('orderReceivedDetail')
    var { itemList } = orderReceivedDetail
    var buyShopList = []
    // if (itemList.length){
    //   itemList.forEach(element => {
    //     if(element.status === 1){
    //       buyShopList.push(element)
    //     }
    //   })
    // }
    this.setData({
      orderReceivedDetail, buyShopList
    })
    console.log('orderReceivedDetail:', orderReceivedDetail)
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
        getOrderReceivedList.call(that);
      }
    }
  })
}

//上传图片获取scheduleUrl
function uploadImg(imgUrl) {
  var that = this
  console.log('this:', this)
  wx.uploadFile({
    url: cfg.localUrl + 'legworkBuyer/fileUplode',
    filePath: imgUrl,
    name: 'file',
    success: function (res) {
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