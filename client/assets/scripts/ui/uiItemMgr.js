var uiConfig = require("uiConfig");
var uiItemMgr = cc.Class({
    extends: cc.Component,

    statics: {
        shopItemPre:cc.Prefab,
        missionItemPre:cc.Prefab,
        achieveItemPre:cc.Prefab,


        loadItemsPre:function () {
            var self = this;
            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.shopItem.Name, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.shopItemPre = prefab;
            });

            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.missionItem.Name, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.missionItemPre = prefab;
            });

            cc.loader.loadRes("prefab/uiPrefab/" + uiConfig.achieveItem.Name, function (errmsg, prefab) {
                if (errmsg) {
                    cc.error(errmsg.message || errmsg);
                    return;
                }
                self.achieveItemPre = prefab;
            });
        },

        getShopItemPre:function(){
            return this.shopItemPre;
        },

        getMissionItemPre:function(){
            return this.missionItemPre;
        },

        getAchieveItemPre:function(){
            return this.achieveItemPre;
        },
    },
});
module.exports = uiItemMgr;
