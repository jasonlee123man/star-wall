Page({
  getLocation() {
    wx.getLocation({
      success: function (res) {
        console.log(res)
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        })

      },
    })
  },

})