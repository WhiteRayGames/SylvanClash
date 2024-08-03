var spinMap = require("DB_spinLevel");
var spinLvData = require("SpinLvData");
var SpinLvMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[spinLvData],
        },
    },

    DecodeJson:function(){
        //'["Level", "SpinS", "SpinA", "SpinB", "SpinC"]',
        // var jsonAsset = JSON.parse(spinMap.data);

        var jsonAsset = JSON.parse(spinMap.data);

        for(var key in jsonAsset){
            var dt = new spinLvData();
            dt.Level = jsonAsset[key][0];
            dt.SpinS = jsonAsset[key][1];
            dt.SpinA = jsonAsset[key][2];
            dt.SpinB = jsonAsset[key][3];
            dt.SpinC = jsonAsset[key][4];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
module.exports = SpinLvMapMgr;
