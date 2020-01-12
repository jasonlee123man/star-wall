let db=wx.cloud.database();
let utils=require("../../utils/util");
Page({
  data:{
    detail:{}
  },
  onLoad(e){
    //接收参数id
    let id=e.id;
    //根据id查询详情
    db.collection("star").doc(id).get()
    .then(res=>{
       res.data.addtime=utils.formatTime(new Date(res.data.addtime));
      this.setData({
        detail:res.data
      })
    })
    .catch(err=>{
      console.log(err)
    })

  },
  //预览图片
  preview(e){
    // console.log(e)
    wx.showLoading({
      title:"正在加载",
      icon:"loading",
      mask:true
    })
    let index=e.target.id;
    wx.previewImage({
      current: this.data.detail.fileids[index], // 当前显示图片的http链接
      urls: this.data.detail.fileids, // 需要预览的图片http链接列表
      success:()=>{
        wx.hideLoading()
      }
    })
  },
  onShareAppMessage(){
    let title="小草上墙-"+this.data.detail.realname;
    let imageUrl=this.data.detail.fileids[0]
      return {
      title:title,
      imageUrl
    }
  }
})