var MyEnum = require("MyEnum");
var smallResult = cc.Class({
    extends: cc.Component,

    properties: {
        successNode: cc.Node,
        failedNode: cc.Node,
        failedDb: dragonBones.ArmatureDisplay,
        winDb: dragonBones.ArmatureDisplay
    },

    show:function(suc = false){
        this.successNode.active = suc;
        this.failedNode.active = !suc;

        if(suc)
        {
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.success2);
            this.winDb.playAnimation("success", 1);
        }
        else
        {
            cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.fail);
            this.failedDb.playAnimation("defeat", 1);
        }

        this.scheduleOnce(function(){
            this.node.active = false;
        }, 2.14);
    },
});
module.exports = smallResult;
