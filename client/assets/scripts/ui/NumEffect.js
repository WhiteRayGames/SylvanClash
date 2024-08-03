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
        numColNodeList: [cc.Node],
        numColPrefab: cc.Prefab,
        container: cc.Node,

        symbolNode: cc.Node,
        unitLabel: cc.Label,

        offsetY: 18,
        scaleNumer: 1.5
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.currentNumber = "";
    },

    setNumber (_numStr, _isInit) {
        if (this.currentNumber === _numStr) return;
        this.currentNumber = _numStr;
        _numStr = "" + _numStr;
        this.symbolNode.parent = null;
        this.unitLabel.node.parent = null;
        for (let i = 0; i < this.numColNodeList.length; i++) {
            this.numColNodeList[i].parent = null;
        }
        let currentNumCount = 0;
        for (let i = 0; i < _numStr.length; i++) {
            let currentString = _numStr[i]
            let currentNumber = Number(currentString);
            if (!isNaN(currentNumber)) {
                currentNumCount++;
                let numNode;
                if (i >= this.numColNodeList.length) {
                    numNode = cc.instantiate(this.numColPrefab);
                    numNode.setPosition(0, this.offsetY)
                    numNode.parent = this.container;
                    numNode.getComponent("NumberCol").init(currentNumber, currentNumCount);
                    this.numColNodeList.push(numNode);
                } else {
                    numNode = this.numColNodeList[i];
                    numNode.parent = this.container;
                    if (_isInit) {
                        numNode.getComponent("NumberCol").init(currentNumber, currentNumCount);
                    } else {
                        numNode.getComponent("NumberCol").changeNum(currentNumber, currentNumCount);
                    }
                }
            } else if (currentString === ".") {
                this.symbolNode.parent = this.container;
            } else {
                this.unitLabel.string = currentString;
                this.unitLabel.node.parent = this.container;
            }
        }

        cc.tween(this.node).to(0.2,{scale:this.scaleNumer}).to(0.2,{scale:1}).start();
    }

    // update (dt) {},
});
