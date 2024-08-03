
var PlantData = cc.Class({
    name: "PlantData",
    properties: {
        level:1,
        cd:1,
        power:0,
        skill:"",
        offline:0,
        price:0,
        gem:0,
        prefab:"",
        shootPos:{
            default:[],
            type:[cc.v2],
        },
        steakColor:"",
        head:"",
        sNeedMask:false,
        isNeedTrail:false, 
        bulletHeight:0,
        bulletNearLeftDis:0,
    },
});
module.exports = PlantData;
