var buttonMap = require("DB_buyButton");
var buttonData = require("BuyButtonData");
var BuyButtonMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[buttonData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(buttonMap.data);
        for(var key in jsonAsset){
            var dt = new buttonData();
            dt.Level = jsonAsset[key][0];
            dt.button = jsonAsset[key][1];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
module.exports = BuyButtonMapMgr;
