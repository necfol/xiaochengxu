//index.js
//获取应用实例
var app = getApp()
var i = 0
import { formatTime} from '../../utils/util.js'
var pageObject = {
  data: {
    btnTitle: '开始记录',
    btnType: 'primary',
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    motto: 'Hello World',
    userInfo: {},
    start: false,
    timer: null,
    dataList: []
  },
  tapFunc: function (e) {
    if(!this.data.start) {
      this.setData({
        btnType: 'warn',
        btnTitle: '停止记录'
      })
      this.getLocation()
    } else {
      this.setData({
        btnType: 'primary',
        btnTitle: '开始记录'
      })
      clearTimeout(this.data.timer)
      this.data.timer = null
      this.data.start = false
    }
  },
  getLocation() {
    var that = this
    that.data.start = true
    wx.getLocation({
      success: function (res) {
        i++
        console.log(i,res.latitude, res.longitude)
        that.setData({
          dataList: [...that.data.dataList, { latitude: res.latitude, longitude: res.longitude, time: formatTime(new Date())}]
        })
        wx.setStorage({
          key: "location",
          data: that.data.dataList
        })
        if (that.data.timer) {
          clearTimeout(that.data.timer)
          that.data.timer = null
        }
        if (that.data.start)
          that.data.timer = setTimeout(() => {
              that.getLocation()
          }, 1000)
      }
    })
  },
  remove() {
    var that = this
    wx.removeStorage({
      key: 'location',
      success: function (res) {
        that.setData({
          dataList: []
        })
      }
    })
  },
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    wx.getStorage({
      key: 'location',
      success: function (res) {
        if(res.data && res.data.length) {
          that.setData({
            dataList: res.data
          })          
        }
      }
    })
  }
}
Page(pageObject)
