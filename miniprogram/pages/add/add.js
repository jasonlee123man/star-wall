const db = wx.cloud.database()
const app=getApp()
var utils=require("../../utils/util.js");

Page({
  data: {
    list: [],
    images: ["/images/add.png"],
    region:['陕西','西安','新城'],
    intro:"",
    fileids:[]
  },
  onLoad(){

  },
  //选中地区
  region(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //提交表单
  submit(e) {
    let data=e.detail.value;
    let region=data.region;
    let intro=this.data.intro;

    //表单验证
    if(intro==""){
      wx.showToast({
        title:"请说点什么",
        icon:"none"
      })
      return;
    }

    if(this.data.images[0]=="/images/add.png"){
      wx.showToast({
        title:"请选择照片",
        icon:"none"
      })
      return;
    }

   
    wx.showLoading({
      title:"正在添加",
      mask:true
    })

    let promiseArr=[];
    for(let i=0;i<this.data.images.length;i++){
      promiseArr.push(new Promise((reslove,reject)=>{
        let item=this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'images/'+new Date().getTime() + suffix,
          filePath: item
        }).then(res => {
          this.setData({
              fileids:this.data.fileids.concat(res.fileID)
          })
        
          reslove()
        })
      }))
    }

    Promise.all(promiseArr).then(res=>{
      db.collection("star").add({
            data: {
              region,
              intro,
              fileids:this.data.fileids,
              addtime:new Date().getTime(),
              status:1,
              nickName:app.globalData.userInfo.nickName,
              avatarUrl:app.globalData.userInfo.avatarUrl
            }
          }).then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            })
            wx.switchTab({
              url: '/pages/index/index'
            })
          })
          .catch(err=>{
            console.log(err)
          })
    })


  },
  //添加图片
  addPic() {
    wx.chooseImage({
      count: 9,
      success: (res => {
        this.setData({
          images: res.tempFilePaths
        })
      })
    })
  },
  //写入简介时触发
  myEditorInput(e){

    this.data.intro=e.detail.html;


  }
})