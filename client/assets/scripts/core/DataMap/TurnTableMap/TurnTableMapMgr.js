var turnMap = require("DB_turntable");
var turnData = require("TurnTableData");
var TurnTableMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[turnData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(turnMap.data);

        for(var key in jsonAsset){
            var dt = new turnData();
            dt.id = jsonAsset[key][0];
            dt.type = jsonAsset[key][1];
            dt.rarity = jsonAsset[key][2];
            dt.weight = jsonAsset[key][3];
            dt.rewards = jsonAsset[key][4];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
module.exports = TurnTableMapMgr;
