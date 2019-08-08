const cfg = require('../../cfg.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  formSubmit: function (e) {
    var userName = e.detail.value.userName;
    var passWord = e.detail.value.passWord;
    if (!userName || !passWord) {
      wx.showModal({
        title: '提示',
        content: '账号或密码不能为空',
      })
    } else {
      wx.request({
        url: cfg.localUrl + 'legworkBuyer/login',
        method: 'post',
        data: {
          'userName': userName,
          'password': passWord
        },
        success: (res) => {
          console.log(res)
          if (res.data.status === 10000) {
            wx.switchTab({
              url: '../waitOrder/waitOrder',
            })
            wx.showToast({
              title: '登陆成功',
              icon: 'none'
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '用户名或密码不正确',
            })
          }
        }
      })
    }
  },

  showDialog: function(e) {
    wx.showModal({
      title: '提示',
      content: '敬请期待'
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