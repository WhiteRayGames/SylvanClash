var MyEnum = require("MyEnum");
cc.Class({
    extends: cc.Component,

    properties: {
       
        dragon: dragonBones.ArmatureDisplay,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        cc.Mgr.DragonMgr.create(MyEnum.DragonType.jinggai,this.dragon);
        // this.dragon.on(dragonBones.EventObject.FRAME_EVENT, this.onFrameEvent, this);
        // this.dragon.on(dragonBones.EventObject.COMPLETE,this.onAnimComplete, this);

    },

    onCollisionEnter(other)
    {
        if( other.node.group == "zombie" && other.tag == 1)
        {
            // cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.plant,this.dragon,this._IdleAnimName,true, this.dragonTimeScale);
            cc.Mgr.DragonMgr.playAnimation(MyEnum.DragonType.jinggai,this.dragon,"touch",false, 1);
        } 
        
    },
    // onCollisionStay()
    // {

    // },
    onCollisionExit(other)
    {
        if( other.node.group == "zombie" && other.tag == 1)
        {
         
        }
       
    }

    // update (dt) {},
});
