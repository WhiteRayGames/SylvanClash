var MySprite = cc.Class({
    extends: cc.Sprite,

    properties: {
        
    },

    setSprite:function(atlasType, frame){
        this.atlas = cc.Mgr.AtlasMgr.getSpriteAtlas(atlasType);
        this.spriteFrame = this.atlas.getSpriteFrame(frame);
    },
});
module.exports = MySprite;
