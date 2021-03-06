const app = getApp()

Page({

  data: {
    wish: "好好学习，天天向上，争取尽早做一个日薪越亿的人！",
    avatar: "cloud://nankaituanwei-j5pm1.6e61-nankaituanwei-j5pm1-1257843133/resources/timeMachine/wishNineteen/43988906.png",
    nickname: "南开人",
    imagePath: "cloud://nankaituanwei-j5pm1.6e61-nankaituanwei-j5pm1-1257843133/resources/timeMachine/wishNineteen/76766161.jpg",
  },

  //接收数据
  onLoad: function (options) {
    var that = this;
    that.setData({
      wish: options.wish,
      avatar: options.avatar,
      nickname: options.nickname,
    })
    wx.cloud.downloadFile({
      fileID: that.data.imagePath,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath
        })
      }
    })
  },

  //返回选择头像界面
  prev: function() {
    var that = this
    wx.redirectTo({
      url: '../avatar/avatar?wish=' + that.data.wish + '&avatar=' + that.data.avatar + '&nickname=' + that.data.nickname,
    })
  },

  //绘制海报
  createPoster: function() {
    wx.showToast({
      title: '正在绘制',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
    var that = this;
    var context = wx.createCanvasContext('poster');
    //绘制背景
    var background = this.data.imagePath;
    context.drawImage(background, 0, 0, 1080, 1920);
    //绘制昵称
    var name = that.data.nickname;
    context.setFontSize(60);
    context.setFillStyle('#fff');
    context.setTextAlign('left');
    context.fillText(name, 500, 295);
    context.stroke();
    //绘制感言
    var chr = that.data.wish.split("");
    var temp = "";
    var row = [];
    for (var i = 0; i < chr.length; i++) {
      if (temp.length < 14) {
        temp += chr[i];
      }
      else {
        i--;
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);
    context.setTextAlign('left');
    for (var i = 0; i < row.length; i++) {
      context.fillText(row[i], 120, 560 + i * 100);
    }
    context.stroke();
    //绘制时间
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var time = year + '年' + month + '月' + day + '日';
    context.setTextAlign('right');
    context.fillText(time, 960, 560 + (row.length + 1) * 100);
    //获取头像尺寸用于计算裁剪方案
    wx.getImageInfo({
      src: that.data.avatar,
      success: function (res) {
        that.setData({
          width: res.width,
          height: res.height,
        })
      }
    })
    //等待获取头像片尺寸，延迟计算并绘制头像
    setTimeout(function () {
      var width = that.data.width
      var height = that.data.height
      var xClipFrom = 0;
      var yClipFrom = 0;
      if (width > height) {
        xClipFrom = (width - height) / 2;
        width = height;
      }
      else {
        yClipFrom = (height - width) / 2;
        height = width;
      }
      var avatar = that.data.avatar;
      context.arc(275, 275, 105, 0, 2 * Math.PI)
      context.clip();
      context.drawImage(avatar, xClipFrom, yClipFrom, width, height, 170, 170, 210, 210);
      context.draw();
    }, 2000)
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'poster',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
          });
          wx.redirectTo({
            url: '../poster/poster?imagePath=' + that.data.imagePath,
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '图片生成失败',
            icon: 'none',
            duration: 1500
          })
        }
      });
    }, 3000);
  },

  //获取昵称框里的值
  bindKeyInput: function(e) {
    this.setData({
      nickname: e.detail.value,
    })
  },

  bindConfirm: function() {
    this.createPoster()
  },

  //授权获得昵称
  bindGetNickname: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      that.setData({
        nickname: e.detail.userInfo.nickName,
      })
      that.createPoster()
    }
    else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1500
      })
    }
  },
  getUserProfile:function(){
    let that=this;
    wx.getUserProfile({
      desc:'获取用户昵称',
      success:async function(res){
        wx.showToast({
          title: '授权成功',
          icon:'success',
          mask:true,
          duration:5000
        });
        that.setData({
          nickname: res.userInfo.nickName,
        })
        that.createPoster()
      },
      fail:async function(res){
        wx.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

})