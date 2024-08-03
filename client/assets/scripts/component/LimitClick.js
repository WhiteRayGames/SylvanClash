cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...

    _startTimer: 0,
    _allowClick: true
  },

  // use this for initialization
  onLoad: function () {
    this.time = 300
  },

  clickTime: function (time) {
    if (time != undefined && time != null) this.time = time
    if (this._allowClick === false) {
      return false
    }

    this._startTimer = Date.now()
    this._allowClick = false
    return true
  },

  update: function () {
    if ((Date.now() - this._startTimer) >= this.time) {
      this._allowClick = true
    }
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
})
