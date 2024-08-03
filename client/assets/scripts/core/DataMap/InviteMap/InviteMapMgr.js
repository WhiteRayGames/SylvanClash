var inviteMap = require("DB_invite");
var InviteData = require("InviteData");
var InviteMapMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataList:{
            default:[],
            type:[InviteData],
        },
    },

    DecodeJson:function(){
        var jsonAsset = JSON.parse(inviteMap.data);
        for(var key in jsonAsset) {
            var dt = new InviteData();
            dt.id = jsonAsset[key][0];
            dt.invitePeople = jsonAsset[key][1];
            dt.gem = jsonAsset[key][2];
           
            this.dataList[key] = dt;
        }
    },

    getDataByKey:function(lv){
        return this.dataList[lv];
    },
    
});
module.exports = InviteMapMgr;
