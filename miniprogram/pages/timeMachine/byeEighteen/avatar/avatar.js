const app = getApp()
const util = require('../../../../utils/util.js')
Page({

  data: {
    avatar: "cloud://nankaituanwei-j5pm1.6e61-nankaituanwei-j5pm1-1257843133/resources/defaultAvatar.jpg",
  },
  
  //接受昵称
  onLoad: function (options) {
	  this.setData({
		  nickname: options.nickname
	  })
  },

  //返回昵称
  prev: function () {
    wx.redirectTo({
      url: '../byeEighteen',
    })
  },

  //用户自主选择图片上传
  fromAlbum: async function () {
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片
      sourceType: ['album', 'camera'], //用户可以选择拍照或者相册上传
      success: async function (res) {
        
        //把照片传给avatar
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          avatar: tempFilePaths[0], //res.tempFilePaths是一个string数组
        })
        let ifUpload = await util.uploadPhoto(that.data.avatar)
        if (!ifUpload) {
          // 上传失败
          wx.showToast({
          title: '上传图片失败!',
          icon: 'none',
          duration: 1500
          })
          return
        }
        let verifyResult = await util.verifyRes(ifUpload, that.data.avatar.match(app.globalData.storePattern)[1])
        if (verifyResult.result.errCode != 0) {
          that.setData({
            avatar: ''
          })
          wx.showToast({
            title: '您的图片未能过审!',
            icon: 'none',
            duration: 2000,
          })
          return
        }
        wx.showToast({
          title: '上传成功',
          icon: 'suceess',
          duration: 5000,
          mask: true,
        })
        wx.redirectTo({
          url: '../answer/answer?nickname=' + that.data.nickname + '&avatar=' + that.data.avatar,
        })
      },
      //上传失败
      fail: function (res) {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  //授权上传头像
  getUserProfile: async function(e){
    var that = this;
    wx.getUserProfile({
    desc: '获取微信头像',
    //成功获取授权
    success: async res => {
      that.setData({
        name:res.userInfo.nickName,
        avatar: res.userInfo.avatarUrl
      })
      wx.downloadFile({
        url:res.userInfo.avatarUrl,
        success:async function(res) {
          //把照片传给avatar
          that.setData({
            avatar: res.tempFilePath,
          })
          let ifUpload = await util.uploadPhoto(that.data.avatar)
        if (!ifUpload) {
          // 上传失败
          wx.showToast({
          title: '上传图片失败!',
          icon: 'none',
          duration: 1500
          })
          return
        }
        let verifyResult = await util.verifyRes(ifUpload, that.data.avatar.match(app.globalData.storePattern)[1])
        if (verifyResult.result.errCode != 0) {
          that.setData({
            avatar: ''
          })
          wx.showToast({
            title: '您的图片未能过审!',
            icon: 'none',
            duration: 2000,
          })
          return
        }
          wx.showToast({
          title: '已获得头像',
          icon: 'suceess',
          duration: 5000,
          mask: true,
          })
          wx.redirectTo({
            url: '../answer/answer?nickname=' + that.data.nickname + '&avatar=' + that.data.avatar,
          })
        },
        //下载头像失败
        fail: function (e) {
          wx.showToast({
            title: '头像获取失败',
            icon: 'none',
            duration: 1500
          })
        }
      })
    },
    //获取授权失败
    fail: err => {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1500
      })
    }
  })
  }
})