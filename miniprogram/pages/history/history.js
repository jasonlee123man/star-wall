const db = wx.cloud.database()
const app=getApp();
Page({
    data: {
        list: []
    },
    onLoad() {
        let _openid=app.globalData.openid;
        db.collection("star").orderBy('addtime', 'desc')
        .where({_openid})
        .get()
        .then(res => {
            //去除富文本
          res.data.forEach(item=>{
            ///* *、+限定符都是贪婪的，因为它们会尽可能多的匹配文字，只有在它们的后面加上一个?就可以实现非贪婪或最小匹配。*/
            item.intro=item.intro.replace(/<.+?>/g, '');
            if (item.intro.length > 20) {
                item.intro = item.intro.substring(0, 15) + '...';
            }
        })
          this.setData({
            list: res.data
        })
      })

    },
    //删除记录
    del(e) {
        let id=e.target.id;
        let index=e.target.dataset.index;
        
        //获取本条记录的云存储图片
        let fileids=[];
        db.collection('star').doc(id).get()
        .then(res=>{
            fileids=res.data.fileids
        })
        wx.showModal({
             title: '提示',
             content: '确定删除本条数据？',
             success:res=>{
                if (res.confirm){
                    //1.删除数据库
                    db.collection('star').doc(id).remove({
                    success: res => {
                        //2.删除云储存
                        wx.cloud.deleteFile({
                          fileList:fileids,
                          success: res => {
                            console.log(res.fileList)
                          },
                          fail: console.error
                        })
                        //3.修改页面数据
                        this.data.list.splice(index, 1)
                        this.setData({
                            list: this.data.list
                        })
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
                }
             }
        })
        

    }
})