var airdropMap = require("DB_airdrop");
var AirDropData = require("AirDropData");
var AirDropMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[AirDropData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(airdropMap.data);
        for(var key in jsonAsset){
            var dt = new AirDropData();
            dt.Level = jsonAsset[key][0];
            dt.Plant1 = jsonAsset[key][1];
            dt.Plant2 = jsonAsset[key][2];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(lv){
        return this.dataList[lv];
    },
});
module.exports = AirDropMapMgr;
