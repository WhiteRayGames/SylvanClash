var shopData = require("ShopData");
var shopMap = require("DB_shopSort");
var ShopMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[shopData],
        },
    },

    DecodeJson:function(){
        ////'["level", "MAX", "MAX_1", "MAX_2", "MAX_3", "MAX_4", "MAX_5", "MAX_6", "MAX_7", "MAX_8"]', 
        // var jsonAsset = JSON.parse(shopMap.data);
        var jsonAsset = JSON.parse(shopMap.data);;

        for(var key in jsonAsset) {
            var dt = new shopData();
            dt.level = jsonAsset[key][0];
            dt.MAX = jsonAsset[key][1];
            dt.MAX_1 = jsonAsset[key][2];
            dt.MAX_2 = jsonAsset[key][3];
            dt.MAX_3 = jsonAsset[key][4];
            dt.MAX_4 = jsonAsset[key][5];
            dt.MAX_5 = jsonAsset[key][6];
            dt.MAX_6 = jsonAsset[key][7];
            dt.MAX_7 = jsonAsset[key][8];
            dt.MAX_8 = jsonAsset[key][9];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
module.exports = ShopMapMgr;
