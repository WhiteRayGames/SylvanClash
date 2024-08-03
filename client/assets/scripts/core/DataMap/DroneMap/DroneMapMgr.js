var DroneData = require("DroneData");
var DroneMap = require("DB_droneRewards");
var DroneMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[DroneData],
        },
    },

    DecodeJson:function(){
        // var jsonAsset = JSON.parse(DroneMap.data);
        var jsonAsset = JSON.parse(DroneMap.data);

        for(var key in jsonAsset){

            var dt = new DroneData();
            dt.Level = jsonAsset[key][0];
            dt.Drone = jsonAsset[key][1];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(Id){
        return this.dataList[Id];
    },
});
module.exports = DroneMapMgr;