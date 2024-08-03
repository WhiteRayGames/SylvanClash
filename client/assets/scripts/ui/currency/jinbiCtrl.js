var uiConfig = require("uiConfig");
var MyEnum = require("MyEnum");
cc.Class({
    extends: cc.Component,

    properties: {
       
        type:0,
        jinbiEffectNode:cc.Node,
        jinbis:[cc.Node],

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    jinbiStart()
    {
        var self = this;
        var jinbiScript = this.jinbis[this.index].getComponent("jinbi");
        var targetPos;
        if(this.type == 0)
        {
            let worldPos_coin = cc.Mgr.UIMgr.topCoinNode.convertToWorldSpaceAR(this.node)
            let targetPos_coin = this.node.convertToNodeSpaceAR(worldPos_coin);
            targetPos_coin.x -= 20;

            targetPos = targetPos_coin;
        }
        else
        {
            let worldPos_gem = cc.Mgr.UIMgr.topGemNode.convertToWorldSpaceAR(this.node)
            let targetPos_gem = this.node.convertToNodeSpaceAR(worldPos_gem);
            targetPos_gem.x -= 20;
            targetPos = targetPos_gem;
        }

        let flyoutOffsetY = 0;
        if (this.flyout) {
            flyoutOffsetY = 200;
        }

        let currentTargetPos = cc.v2(targetPos.x, targetPos.y + flyoutOffsetY)

        jinbiScript.init(this.type,currentTargetPos);
        
        jinbiScript.complete = function()
        {
            self.completeNum++;
            if(!self.jinbiEffectNode.active)
            {
                let offsetY = self.type == 0 ? 60 : 100;
                let effectPos = cc.v2(targetPos.x, currentTargetPos.y - offsetY)
                self.jinbiEffectNode.position = effectPos;
                self.jinbiEffectNode.active = true;
            }
            if(self.completeNum == self.jinbis.length)
            {
                self.node.destroy();
            }
        }
        this.index++;
    },

    showUI (_flyout) {
        this.flyout = _flyout;
        this.completeNum = 0;
        this.index = 0;
        var dt = 0;
        var va = 0;
        if(this.type == 0)
        {
            va = 0.03;
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.coin);
        }
        else
        {
            va = 0.045;
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.gem);
        }

        for(var i=0;i<this.jinbis.length;i++)
        {
            this.scheduleOnce(function()
            {
                this.jinbiStart();
            },dt);
            dt+=va;
        }
    },

    start () {

        
    },

    // update (dt) {},
});
