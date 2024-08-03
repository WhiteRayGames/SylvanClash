var EffectType = require("EffectType");
var vertigo = cc.Class({
    extends: cc.Component,

    properties: {
        dragon: dragonBones.ArmatureDisplay,
    },

    start(){
        this.dragon.on(dragonBones.EventObject.COMPLETE,this.onAnimComplete, this);
    },

    onAnimComplete:function(){
        this.node.active = false;
        //if(this.node.activeInHierarchy)
        //    cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.Vertigo);
    },

    playAnimation:function() {
        this.dragon.playAnimation("newAnimation", 1);
    },

    closeEffect:function(){
        this.node.active = false;
    },

    /*
    playAnimation:function(zombieNode, zOffsetY) {
        this.zombieNode = null;
        this.zOffsetY = zOffsetY;
        this.zombieNode = zombieNode;
        this.dragon.playAnimation("newAnimation", 1);
    },
    
    update(){
        if(this.zombieNode != null)
            if(!this.zombieNode.activeInHierarchy)
            {
                cc.Mgr.EffectMgr.ObBackToPool(this.node, EffectType.Vertigo);
            }
            else
            {
                this.node.x = this.zombieNode.x;
                this.node.y = this.zombieNode.y + this.zOffsetY;
            }
    },
    */
});
module.exports = vertigo;
