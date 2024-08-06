var DataType = require("DataType");
var bossComing = cc.Class({
    extends: cc.Component,
    properties: {
        dragon: dragonBones.ArmatureDisplay,
        box:cc.Node,
        monsterContainer: cc.Node,
        mask: cc.Node
    },

    start(){
        if (window.winSize) {
            this.box.width = window.winSize.width / cc.view.getScaleX();
            this.box.height = window.winSize.height / cc.view.getScaleY();
        } else {
            this.box.width = window.innerWidth / cc.view.getScaleX();
            this.box.height = window.innerHeight / cc.view.getScaleY();
        }

        
        this.dragon.on(dragonBones.EventObject.COMPLETE,this.onAnimComplete, this);
    },

    onAnimComplete:function(){
        setTimeout(() => {
            this.zomObj.destroy()
            this.node.active = false;
        }, 1000)
    },

    playAnimation:function(_id) {
        this.mask.setScale(cc.Mgr.game.isPad ? 1.35 : 1);
        var data = cc.Mgr.MapDataMgr.getDataByDataTypeAndKey(DataType.ZombieData, _id.toString());
        this.monsterContainer.x = -400
        this.box.opacity = 150;
        cc.tween(this.box).to(0.2,{opacity:255}).to(0.2,{opacity:150}).to(0.2,{opacity:255}).to(0.2,{opacity:150}).start();
        this.dragon.playAnimation("boss", 1);
        let self = this;
        cc.loader.loadRes("prefab/zombiesnew/" + data.prefab, function (errmsg, prefab) {
            if (errmsg) {
                cc.error(errmsg.message || errmsg);
                return;
            }
            self.zomObj = cc.instantiate(prefab);
            self.zomObj.parent = self.monsterContainer;
            var zombieScript = self.zomObj.getComponent("zombie");
            zombieScript.showComing();
            cc.tween(self.monsterContainer).to(1, {position: cc.v2(-194, 350)}, {easing: "cubicOut"}).start();
        });
    },
});
module.exports = bossComing;
