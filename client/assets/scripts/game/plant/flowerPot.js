var MyEnum = require("MyEnum");
var Event = require("Event");
var flowerPot = cc.Class({
    extends: cc.Component,

    properties: {
        
        dragon: dragonBones.ArmatureDisplay,
    },

    init(index,pos)
    {
        // var self = this;
        this.index = index;

        this.node.position = cc.v2(pos.x,pos.y+200);
        cc.tween(this.node).to(0.1,{position:cc.v2(pos.x,pos.y)},{easing: 'quadIn'}).call(()=>{
            if (!cc.Mgr.game.needGuide) {
                this.scheduleOnce(this.playDianji,8)
            }
        }).start();

        this.node.zIndex = 50 + index
        cc.Mgr.DragonMgr.create(MyEnum.DragonType.plant,this.dragon);
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant,this.dragon,"idle",true);
        this.dragon.on(dragonBones.EventObject.FRAME_EVENT, this.onFrameEvent, this)
        this.dragon.on(dragonBones.EventObject.COMPLETE,this.plantDestroy, this);
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

            this.TouchStart(event);
        }, this);

        cc.Mgr.AudioMgr.playSFX(MyEnum.AudioType.flower_pot_land);

        this.hasTouched = false;
    },

    setPlantInfo(level)
    {
        this.level = level;
    },

    setShowDetailsInUI:function(scale, color , isBig = true){
        this.node.getChildByName("shadow").active = false;
        this.dragon.node.color = cc.Mgr.Utils.hexToColor(color);
        if(isBig)
            this.dragon.playAnimation("idle", -1);
        this.node.scale = scale;
    },

    playDianji()
    {
        this.hasTouched = true;
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant,this.dragon,"open",false);
    },

    onFrameEvent: function (e) {
        if (e.name == 'O') {
            var param = {};
            param.level = this.level;
            param.index = this.index;
            
            cc.Mgr.plantMgr.flowerPotOpen(param);

            cc.Mgr.game.openEggCount++;
            if (cc.Mgr.game.openEggCount >= 10) {
                cc.Mgr.game.openEggCount = 0;

                if (cc.Mgr.plantMgr.hasLockGrid()) {
                    // cc.Mgr.UIMgr.openUnlockAllBundle();
                }
            }
        }
    },

    TouchStart(event){
        if (this.hasTouched === true) return;
        this.hasTouched = true;
        cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant,this.dragon,"open",false);
        this.unscheduleAllCallbacks();
    },

    plantDestroy()
    {
        cc.Mgr.DragonMgr.deleteDragon(MyEnum.DragonType.plant,this.dragon);
        this.node.destroy();
        if(cc.Mgr.game.needGuide && cc.Mgr.game.curGuideStep == MyEnum.GuideType.guide6)
        {
            cc.director.GlobalEvent.emit(Event.singleGuideComplete,{"step":MyEnum.GuideType.guide6});
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
module.exports = flowerPot;
