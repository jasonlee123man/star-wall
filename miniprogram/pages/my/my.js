const app=getApp()
const db=wx.cloud.database()
Page({
  data: {
    hiddenName: false,
    avatarUrl: '/images/user-unlogin.png',
    userInfo: {},
    takeSession: false,
    requestResult: '',
    isShow:false
  },
  onShow(){
    //页面加载，渲染用户信息
    db.collection("setting").doc("2a86abe7-d653-4de3-8da9-1c8a8324c486")
      .get()
      .then(res => {
        this.setData({
          isShow: res.data.isShow
        })
      })
      .catch(err => {
        console.log(err)
      })

    this.setData({
      userInfo:app.globalData.userInfo,
      isShow:app.globalData.isShow
    })
  },
  getInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hiddenName: !this.data.hiddenName
    })
  },
  //添加用户信息
  addInfo() {
    if(app.globalData.userInfo==undefined){
      wx.showModal({
        title:"温馨提示",
        content:"请您先登录",
        success:res=>{
          if(res.confirm){
            wx.switchTab({
              url:"/pages/my/my"
            })
          }
        }
      })
    }else{
       wx.navigateTo({
        url: '/pages/add/add',
        success: (result) => {
          console.log(1)
        }
      });
    }
  },
  //点击历史信息
  history() {
    if(app.globalData.userInfo){
      wx.navigateTo({
      url: '/pages/history/history',
      success: (res) => {
        console.log(res)
      }
    });
    }else{
     wx.showModal({
        title:"温馨提示",
        content:"请您先登录",
        success:res=>{
          if(res.confirm){
            wx.switchTab({
              url:"/pages/my/my"
            })
          }
        }
      })
    }
    
  },
  //用户同意获取个人信息
  onGetUserInfo: function (e) {
    app.globalData.userInfo=e.detail.userInfo
    this.setData({
        logged: true,
        userInfo: e.detail.userInfo
      })
  },
})