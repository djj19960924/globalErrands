// pages/orderEnd/orderEnd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { 
        shopList: [{ name: '黛珂紫苏水300ml*1' }, { name: '黛珂紫苏水300ml*1' }, { name: '黛珂紫苏水300ml*1' }, { name: '黛珂紫苏水300ml*1' }] ,
        waitTime : 2,
        orderTime : '2019-07-02 10:10',
        avatarImg : "../images/avatar.png",
        nikeName : "Q***Q"
      },
      { 
        shopList: [{ name: '黛珂紫苏水300ml*1' }, { name: '黛珂紫苏水300ml*1' }],
        waitTime: 2,
        orderTime: '2019-07-02 10:10',
        avatarImg: "../images/avatar.png",
        nikeName: "Q***Q"
      }
    ],
    hiddenShopList:[],
    status: true
  },

  show: function () {
    let status = !this.data.status
    this.setData({
      status
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var list = this.data.list

    list.forEach(item=>{
      let hiddenShopList = []
      let shopList = []
      if (item.shopList.length>3){
        shopList = item.shopList.slice(0, 3)
        hiddenShopList = item.shopList.slice(3)
        this.setData({
          hiddenShopList, shopList
        })  
      }
    })
    console.log(this.data.shopList)
    console.log(this.data.hiddenShopList)
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