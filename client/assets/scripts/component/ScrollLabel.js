// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        label: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label.node.x = -1 * this.node.width / 2;
        this.isInit = false;
    },

    start () {
        
    },

    setLabel (_content) {
        this.label.string = _content;

        this.label.node.x = -1 * this.node.width / 2;
        this.isInit = false;
        
        this.minPosX = -1 * this.node.width / 2;
        this.isRight = true;
        
        setTimeout(() => {
            this.intervalTimer = Date.now();
            this.currentTimer = Date.now();
            this.maxPosX = -1 * this.node.width / 2 - (this.label.node.width - this.node.width);
            this.isInit = true;
        }, 1000)
    },

    update (dt) {
        if (this.isInit == false) return;
        if (this.label.node.width <= this.node.width) return;
        if (this.intervalTimer > 0) {
            if (Date.now() - this.intervalTimer >= 3000) {
                this.intervalTimer = 0;
            } else {
                return;
            }
        }
        if (Date.now() - this.currentTimer >= 100) {
            this.currentTimer = Date.now();

            if (this.isRight) {
                this.label.node.x -= 2;
                if (this.label.node.x <= this.maxPosX) {
                    this.label.node.x = this.maxPosX;
                    this.intervalTimer = Date.now();
                    this.isRight = false;
                }
            } else {
                this.label.node.x += 2;
                if (this.label.node.x >= this.minPosX) {
                    this.label.node.x = this.minPosX;
                    this.intervalTimer = Date.now();
                    this.isRight = true;
                }
            }
        }
    },
});
