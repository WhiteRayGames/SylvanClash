var AtlasType = require("AtlasType");
var AtlasMgr = cc.Class({
    extends: cc.Component,

    properties: {
        gameAtlas:cc.SpriteAtlas,
        plantHeadAtlas:cc.SpriteAtlas
    },

    init:function(){
        var self = this;

        cc.loader.loadRes("atlas/plantHead", cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
        self.plantHeadAtlas = atlas;
        });
    },

    getSpriteFrame:function(type ,spName){
        var data = null;
        switch(type)
        { 
            case AtlasType.PlantHead:
                data = this.plantHeadAtlas.getSpriteFrame(spName);
                break;
        }
        return data;
    },

    getSpriteAtlas:function(type){
        var data = null;
        switch(type)
        { 
            case AtlasType.PlantHead:
                data = this.plantHeadAtlas;
                break;
        }
        return data;
    },
});
module.exports = AtlasMgr;
