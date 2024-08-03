var MyEnum = require("MyEnum");
var uav = cc.Class({
    extends: cc.Component,

    properties: {
        dragonNode:cc.Node,
        beClicked:false,
        tip: cc.Node,
        playerPhoto: cc.Sprite,
        playerPhotoNode: cc.Node
    },

    onLoad () {
        
    },

    show:function(){
        if (cc.Mgr.game.needShowUavTip && cc.Mgr.game.level <= 3) {
            this.tip.active = true;
            cc.Mgr.game.needShowUavTip = false;
        } else {
            this.tip.active = false;
        }

        let currentOffsetY = 380 + cc.Mgr.game.ratioOffsetY;

        this.movePos = [cc.v2(200,currentOffsetY),cc.v2(-200,currentOffsetY), cc.v2(-400,currentOffsetY), cc.v2(400, currentOffsetY)];

        this.beClicked = false;
        this.dragonNode.active = false;
        this.node.position = this.movePos[3];
        this.scheduleOnce(function(){
            this.dragonNode.active = true;
            this.moveLeftOrRight();
        }, 0.1);

        cc.Mgr.UIMgr.InGameUI.airDropShowTime++;

        this.isInvite = false;
        this.playerPhotoNode.active = false;

        if (cc.Mgr.UIMgr.InGameUI.airDropShowTime >= 3 && cc.Mgr.inviteManager.friendsList && cc.Mgr.inviteManager.friendsList.length > 0) {
            cc.Mgr.UIMgr.InGameUI.airDropShowTime = 0;

            this.isInvite = true;
            this.playerPhotoNode.active = true;

            let currentFriend = cc.Mgr.inviteManager.friendsList[cc.Mgr.UIMgr.InGameUI.airDropFriendIndex];
            this.friendPhoto = currentFriend.photo;
            this.friendId = currentFriend.id;
            cc.assetManager.loadRemote(currentFriend.photo, (err, texture) => {
                if (err == null) {
                    var spriteFrame = new cc.SpriteFrame(texture);
                    this.playerPhoto.spriteFrame = spriteFrame;
                    this.playerPhoto.node.width = this.playerPhoto.node.height = 65;
                }
            });
            cc.Mgr.UIMgr.InGameUI.airDropFriendIndex++;
            if (cc.Mgr.UIMgr.InGameUI.airDropFriendIndex >= cc.Mgr.inviteManager.friendsList.length) cc.Mgr.UIMgr.InGameUI.airDropFriendIndex = 0;
        }
    },

    moveLeftOrRight:function () {
        let self = this
        self.node.scaleX = -1
        cc.tween(this.node)
            .to(0.5, { position: this.movePos[0]}, { easing: 'sineOut'}).call(()=>{
                cc.Mgr.AudioMgr.playUavSFX(MyEnum.AudioType.plane)
                self.node.scaleX = -1
            })
            .to(2, { position: this.movePos[0]}).call(()=>{
                self.node.scaleX = -1
            })
            .to(4, { position: this.movePos[1]}).call(()=>{
                self.node.scaleX = 1
            })
            .to(2, { position: this.movePos[1]}).call(()=>{
                self.node.scaleX = 1
            })
            .to(4, { position: this.movePos[0]}).call(()=>{
                self.node.scaleX = -1
            })

            .to(2, { position: this.movePos[0]}).call(()=>{
                self.node.scaleX = -1
            })
            .to(4, { position: this.movePos[1]}).call(()=>{
                self.node.scaleX = 1
            })
            .to(2, { position: this.movePos[1]}).call(()=>{
                self.node.scaleX = 1
            })
            .to(4, { position: this.movePos[0]}).call(()=>{
                self.node.scaleX = -1
            })
            .to(2, { position: this.movePos[0]}).call(()=>{
                self.node.scaleX = -1
            })
            .to(4, { position: this.movePos[1]}).call(()=>{
                self.node.scaleX = -1
            })
            .to(1, { position: this.movePos[2]}, { easing: 'sineIn'})
            .call(() => { 
                cc.Mgr.AudioMgr.stopUavSFX();
                cc.Mgr.UIMgr.InGameUI.unscheduleShowUav();
                this.node.stopAllActions();
                cc.Mgr.UIMgr.InGameUI.showUavNextTime(30);
                this.node.active = false; })
            .start();
            
    },

    click:function(){
        cc.Mgr.UIMgr.InGameUI.unscheduleShowUav();
        this.node.stopAllActions();
        this.beClicked = true;
        cc.Mgr.UIMgr.openUavUI(this.isInvite, this.friendPhoto, this.friendId);
        this.tip.active = false;
    },

    uavOutScreen:function(){
        this.node.scaleX = -1
        cc.Mgr.AudioMgr.stopUavSFX();
        cc.tween(this.node)
        .to(1, { position: this.movePos[2]}, { easing: 'sineIn'})
        .call(() => { 
            this.node.stopAllActions();
            // /cc.Mgr.UIMgr.InGameUI.unscheduleShowUav();
            cc.Mgr.UIMgr.InGameUI.showUavNextTime(30);
            this.node.active = false;})
        .start();
        
    },

});
module.exports = uav;
