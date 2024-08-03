var TransMap = require("DB_i18n");
var TransMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    DecodeJson:function(){
        this.data = {}
        var jsonAsset = TransMap.data;
        for (let i = 0; i < jsonAsset.length; i++) {
            let item = jsonAsset[i]
            this.data[item.Key] = item;
        }
    },

    getDataByKey:function(Id){
        return this.data[Id][cc.Mgr.Config.language];
    },
});
module.exports = TransMapMgr;
