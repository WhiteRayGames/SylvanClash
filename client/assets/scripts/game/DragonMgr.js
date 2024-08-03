var DragonType = require("DragonType");
var DragonMgr = cc.Class({
    extends: cc.Component,

    statics:{
        handles_:{},

        create:function(type ,dragon){
            this.handles_[type] = this.handles_[type] || [];
            var index = this.handles_[type].indexOf(dragon);
            if(index > -1)
                return;
            this.handles_[type].push(dragon);          
        },

        playAnimation:function(type ,dragon, aniName, isloop ,spd = 1){
            var index = this.handles_[type].indexOf(dragon);
            if (index > -1) {
                
                this.handles_[type][index].timeScale = spd;
                this.handles_[type][index].playAnimation(aniName, isloop?-1:1);

            }
        }, 

        playPlantAcelerate:function(type, dragon, ac){
            var index = this.handles_[type].indexOf(dragon);
            if(index > -1)
            {
                this.handles_[type][index].timeScale = ac;
            }
        },

        deleteDragon:function(type ,dragon){
            var index = this.handles_[type].indexOf(dragon);
            if (index > -1) { 
                this.handles_[type].splice(index, 1);
            }
        },
    }
});
module.exports = DragonMgr;
