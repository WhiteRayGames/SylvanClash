var AcMap = require("DB_achievementAwards");
var AcData = require("AchieveData");
var AchievenMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[AcData],
        },
    },

    DecodeJson:function(){
        //"id", "Level", "Gain_5", "Gain_20", "Gain_50", "Gain_100", "Gain_200"
        // var jsonAsset = JSON.parse(AcMap.data);

        var jsonAsset = JSON.parse(AcMap.data);

        for(var key in jsonAsset) {
            var dt = new AcData();
            dt.id = jsonAsset[key][0];
            dt.Level = jsonAsset[key][1];
            dt.Gain_5 = jsonAsset[key][2];
            dt.Gain_20 = jsonAsset[key][3];
            dt.Gain_50 = jsonAsset[key][4];
            dt.Gain_100 = jsonAsset[key][5];
            dt.Gain_200 = jsonAsset[key][6];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){;
        return this.dataList[Id];
    },
});
module.exports = AchievenMapMgr;
