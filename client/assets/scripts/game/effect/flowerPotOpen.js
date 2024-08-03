var EffectType = require("EffectType");
var flowerPotOpen = cc.Class({
    extends: cc.Component,

    properties: {
        dragon: dragonBones.ArmatureDisplay,
    },

    start(){
        this.dragon.on(dragonBones.EventObject.COMPLETE,this.onAnimComplete, this);
    },

    onAnimComplete:function(){
        cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.flowerPotOpen);
    },

    playAnimation:function() {
        this.dragon.playAnimation("newAnimation", 1);
    },
});
module.exports = flowerPotOpen;
