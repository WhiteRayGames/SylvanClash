var LvgemMap = require("DB_levelupGem");
var LvUpGemData = require("LvUpGemData");
var LvUpGemMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[LvUpGemData],
        },
    },

    DecodeJson:function(){
        //'["level", "gem"]'
        // var jsonAsset = JSON.parse(LvgemMap.data);
        var jsonAsset = JSON.parse(LvgemMap.data);

        for(var key in jsonAsset){
            var dt = new LvUpGemData();
            dt.level = jsonAsset[key][0];
            dt.gem = jsonAsset[key][1];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
