var ZombieMap = require("db_zombie");
var ZombieData = require("ZombieData");
var ZombieMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[ZombieData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(ZombieMap.data);
        for(var key in jsonAsset){
            var dt = new ZombieData();
            dt.id = jsonAsset[key][0];
            dt.hp = BigInt(jsonAsset[key][1]);
            dt.spd = jsonAsset[key][2];
            dt.money = BigInt(jsonAsset[key][3]);
            dt.prefab = jsonAsset[key][4];
            dt.gender = jsonAsset[key][5];
        	this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
module.exports = ZombieMapMgr;
