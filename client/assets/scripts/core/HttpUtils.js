var httpUtils = cc.Class({
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
  },

  statics: {
    instance: null
  },

  // use this for initialization
  onLoad: function () {
  },

  httpGets: function (url, callback) {
    var request = cc.loader.getXMLHttpRequest()
    console.log('Status: Send Get Request to ' + url)
    request.open('GET', url, true)
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status >= 200 && request.status <= 207) {
          // var httpStatus = request.statusText
          // var response = request.responseText
          // console.log('Status: Got GET response! ' + httpStatus)
          callback(false, request.responseText)
        } else {
          callback(true, request.responseText)
        }
      }
    }
    request.send()
  },

  httpPost: function (url, params, callback) {
    var xhr = cc.loader.getXMLHttpRequest()
    xhr.open('POST', url)
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      var err
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status <= 207) {
          err = false
        } else {
          err = true
        }
        var response = xhr.responseText
        callback(err, response)
      }
    }
    xhr.send(params)
  }
})

module.exports = httpUtils
