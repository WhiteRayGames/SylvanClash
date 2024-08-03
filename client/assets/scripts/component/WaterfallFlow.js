cc.Class({
  extends: cc.Component,

  properties: {
    _curDir: 0,
    _curAppIndex: 0,
    _lastIndex: 0,
    _updateIdx: -1,
    _showIndexArr: [],
    _totalCount: 0,
    _onePageCount: 0,
    _onePageHeight: 0,
    _scrollViewHeight: 0,
    _totalShowCount: 0,
    _oneItemHeight: 0,
    _updateShowCallback: null,

    itemPrefab: cc.Prefab,
    _showItemArr: [],
    _showItemPool: []
  },

  // use this for initialization
  onLoad: function () {
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this)
    this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchMoved, this)
  },

  touchMoved: function (_event) {
    if (_event.type == cc.Node.EventType.TOUCH_MOVE) {
      this._curDir = _event.getDeltaY() > 0 ? 1 : -1
    } else {
      this._curDir = _event.getScrollY() < 0 ? 1 : -1
    }
  },

  clear: function () {
    if (!this.content) return;
    this._curAppIndex = 0
    this._lastIndex = 0
    this.content.y = 0;
    this._showIndexArr = []
    this._showIndexArr.push(this._curAppIndex)
    this._curDir = 0
    this._updateIdx = -1

    var item
    while (this._showItemArr.length > 0) {
      item = this._showItemArr.pop()
      if (item.parent != null) this.content.removeChild(item)
      this._showItemPool.push(item)
    }
  },

  /*
    * refresh the show at current position when the data have changed
    * */
  refreshAtCurPosition: function () {
    this._refreshAtCurPosition = true

    this._updateIdx = this._showIndexArr.length > 0 ? this._showIndexArr[0] : 0

    if (this._updateDataCallback != null) this._updateDataCallback(this._curAppIndex, this._updateIdx, this._showIndexArr.length)
  },

  /*
    * @parameters
    * _totalCount - total count which your whole data's list
    * _onePageCount - how many item in your showlist in single page
    * _totalShowCount - how many item in your showlist
    * _oneItemHeight - one item's height
    * _updateDataCallback - get your data when the scrollView's index change
    * */
  setBaseInfo: function (_totalCount, _onePageCount, _totalShowCount, _oneItemHeight, _updateDataCallback) {
    this._totalCount = _totalCount
    this._onePageCount = _onePageCount
    this._scrollViewHeight = this.node.height
    this.content = this.node.getComponent('cc.ScrollView').content
    this.content.height = _totalCount * _oneItemHeight
    this._onePageHeight = this._onePageCount * _oneItemHeight
    this._totalShowCount = _totalShowCount
    this._oneItemHeight = _oneItemHeight
    this._updateDataCallback = _updateDataCallback
    this._refreshAtCurPosition = false;
  },

  scrollTo: function(_index) {
    if (!this.content) return;
    this._curAppIndex = Math.floor(_index / this._onePageCount);
    if (this._curAppIndex === 0) {
      this._updateDataCallback(0);
      return;
    }
    let subIndex = _index % this._onePageCount;
    let targetY = this._curAppIndex * this._onePageHeight - ((this._onePageCount - subIndex) * this._oneItemHeight)
    this.content.y = targetY;
    if (this.content.y < 0) this.content.y = 0;
    this._updateIdx = this._curAppIndex - 2;
    if (this._updateIdx < 0) this._updateIdx = 0;
    this._lastIndex = this._updateIdx
    this._showIndexArr = [this._updateIdx, this._updateIdx + 1, this._updateIdx + 2];
    this._updateDataCallback(this._curAppIndex, this._updateIdx, this._showIndexArr.length);
  },

  update: function () {
    if (this._curDir == 0 || !this.content) return
    var offsetY = this._curDir == 1 ? this._scrollViewHeight : -1 * this._scrollViewHeight / 2
    this._curAppIndex = Math.floor((this.content.getPosition().y + offsetY) / this._onePageHeight)
    if (this._curAppIndex * this._onePageCount >= this._totalCount) return
    if (this._curAppIndex < 0) return
    if (this._curAppIndex != this._lastIndex && this._showIndexArr.indexOf(this._curAppIndex) < 0) {
      console.log("this.content.getPosition().y: " + this.content.getPosition().y)
      this._showIndexArr.push(this._curAppIndex)
      this._showIndexArr.sort(function (a, b) {
        return a - b
      })

      if (this._showIndexArr.length > 3) {
        if (this._curAppIndex > this._lastIndex) {
          this._showIndexArr.shift()
        } else {
          this._showIndexArr.pop()
        }
      }

      if (this._updateDataCallback != null) {
        this.node.getComponent('cc.ScrollView').stopAutoScroll()
        this._updateDataCallback(this._curAppIndex, this._updateIdx, this._curDir)
      }

      this._lastIndex = this._curAppIndex
    }
  },

  updateShowList: function (_data, _componentName, _context, _needRefresh) {
    var len = _data.length
    var item
    var itemStartIndx = this._updateIdx == -1 ? this._curAppIndex : this._updateIdx
    if (this._showItemArr.length >= this._totalShowCount && this._refreshAtCurPosition == false) {
      var idx = 0
      var curIdX
      var startPageCount = itemStartIndx == 0 ? 0 : 1
      while (idx < this._onePageCount) {
        if (this._curDir == 1) {
          item = this._showItemArr.shift()
          curIdX = _needRefresh == true ? (idx + this._onePageCount * startPageCount) : idx
          if (idx < _data.length) {
            item.setPosition(0, -1 * (itemStartIndx * this._onePageHeight + idx * this._oneItemHeight))
            item.getComponent(_componentName).setContent(_data[idx])
          } else {
            if (item.parent != null) item.parent.removeChild(item)
            this._showItemPool.push(item)
          }
          this._showItemArr.push(item)
        } else {
          item = this._showItemArr.pop()
          item.setPosition(0, -1 * (itemStartIndx * this._onePageHeight + idx * this._oneItemHeight))
          if (item.parent == null) this.content.addChild(item)
          item.getComponent(_componentName).setContent(_data[idx])
          if (idx == 0) this._showItemArr.unshift(item)
          else this._showItemArr.splice(idx, 0, item)
        }
        idx++
      }
    } else {
      if (this._refreshAtCurPosition == true) {
        var item
        while (this._showItemArr.length > 0) {
          item = this._showItemArr.pop()
          if (item.parent != null && _data.length != this._showItemArr.length) this.content.removeChild(item)
          this._showItemPool.push(item)
        }
        this._refreshAtCurPosition = false
      }
      var maxLen = this._updateIdx == -1 ? this._onePageCount : this._showIndexArr.length * this._onePageCount
      var curIdX
      var startPageCount = itemStartIndx == 0 ? 0 : 1
      for (var i = 0; i < maxLen; i++) {
        if (this._showItemPool.length > 0) {
          item = this._showItemPool.pop()
        } else {
          item = cc.instantiate(this.itemPrefab)
        }
        item.getComponent(_componentName).setParent(_context)
        curIdX = _needRefresh == true ? (i + this._onePageCount * startPageCount) : i
        if (curIdX < _data.length) {
          item.setPosition(0, -1 * (itemStartIndx * this._onePageHeight + i * this._oneItemHeight))
          if (item.parent == null) this.content.addChild(item)
          item.getComponent(_componentName).setContent(_data[i])
        } else {
          if (item.parent != null)item.parent.removeChild(item)
          this._showItemPool.push(item)
        }
        this._showItemArr.push(item)
      }
    }
    if (_needRefresh == true) {
      for (var j = 0; j < this._showItemArr.length; j++) {
        item = this._showItemArr[j]
        item.parent = null
        if (j < _data.length) {
          item.getComponent(_componentName).setContent(_data[j])
          if (item.parent == null) this.content.addChild(item)
        }
      }
    }
    this._updateIdx = -1
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
})
