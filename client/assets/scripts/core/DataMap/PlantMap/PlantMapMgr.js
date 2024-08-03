var PlantMap = require("DB_plant");
var PlantData = require("PlantData");
var PlantMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[PlantData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(PlantMap.data);

        for(var key in jsonAsset) {
            var dt = new PlantData();
            dt.level = jsonAsset[key][0];
            dt.cd = jsonAsset[key][1];
            dt.power = BigInt(jsonAsset[key][2]);
            dt.skill = jsonAsset[key][3];
            dt.offline = jsonAsset[key][4];
            dt.price = BigInt(jsonAsset[key][5]);
            dt.gem = jsonAsset[key][6];
            dt.prefab = jsonAsset[key][7];
            var posL = jsonAsset[key][8].split(',');
            
            if(posL.length == 2)
            {
                dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
            }
            else if(posL.length == 4)
            {
                dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
                dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
            }
            else if(posL.length == 6)
            {
                dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
                dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
                dt.shootPos[2] = cc.v2(parseInt(posL[4]), parseInt(posL[5]));
            }
            else if(posL.length == 8)
            {
                dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
                dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
                dt.shootPos[2] = cc.v2(parseInt(posL[4]), parseInt(posL[5]));
                dt.shootPos[3] = cc.v2(parseInt(posL[6]), parseInt(posL[7]));
            }
            else if(posL.length == 10)
            {
                dt.shootPos[0] = cc.v2(parseInt(posL[0]), parseInt(posL[1]));
                dt.shootPos[1] = cc.v2(parseInt(posL[2]), parseInt(posL[3]));
                dt.shootPos[2] = cc.v2(parseInt(posL[4]), parseInt(posL[5]));
                dt.shootPos[3] = cc.v2(parseInt(posL[6]), parseInt(posL[7]));
                dt.shootPos[3] = cc.v2(parseInt(posL[8]), parseInt(posL[9]));
            }
            
            dt.steakColor = jsonAsset[key][9];
            dt.head = jsonAsset[key][10];

            dt.isNeedMask = jsonAsset[key][11];

            // console.log("map NeedMask = " + jsonAsset[key][11]);
            
            dt.isNeedTrail = jsonAsset[key][12];
            dt.bulletHeight = jsonAsset[key][13];
            dt.bulletNearLeftDis = jsonAsset[key][14];
            dt.bulletType = jsonAsset[key][15];
            dt.zoom = jsonAsset[key][16];
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(lv){
        return this.dataList[lv];
    },
});
module.exports = PlantMapMgr;
