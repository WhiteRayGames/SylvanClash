// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        offsetY: 18,
        intervalY: 35,
        duration: 0.3,
        intervalTime: 0.05
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    init (_num, _index) {
        // this.changeNum(_num, _index)
        this.node.y = _num * this.intervalY + this.offsetY;
    },

    changeNum (_num, _index) {
        let self = this;
        if (_num == this.lastNum) {
            let temNum = _num > 4 ? 0 : 9
            this.node.y = temNum * this.intervalY + this.offsetY
            this.scheduleOnce(function(){
                cc.tween(self.node).to(self.duration, {position: cc.v2(0, _num * self.intervalY + self.offsetY)}).start()
            }, _index * self.intervalTime);
        } else {
            this.scheduleOnce(function(){
                cc.tween(self.node).to(self.duration, {position: cc.v2(0, _num * self.intervalY + self.offsetY)}).start()
            }, _index * self.intervalTime);
        }
        
        this.lastNum = _num;
    }

    // update (dt) {},
});
