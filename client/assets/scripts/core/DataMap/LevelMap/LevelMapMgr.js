var LevelMap = require("DB_level");
var LevelData = require("LevelData");
var LevelMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[LevelData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(LevelMap.data);
        for(var key in jsonAsset) {
    		if(jsonAsset[key] != null && jsonAsset[key] != "undefined")
    		{
        		var dt = new LevelData();
	            dt.level = jsonAsset[key][0];
	            dt.wave = jsonAsset[key][1];
	            dt.waveCount = jsonAsset[key][2];
	            dt.zombieID1 = jsonAsset[key][3];
	            dt.zombieCount1 = jsonAsset[key][4];
	            dt.zombieID2 = jsonAsset[key][5];
	            dt.zombieCount2 = jsonAsset[key][6];
            	this.dataList[key] = dt;
    		}
        }
    },

    //lvKey  "2_2"  表示第二关 第二波
    getDataByKey:function(lvKey){
        return this.dataList[lvKey];
    },
});
module.exports = LevelMapMgr;
