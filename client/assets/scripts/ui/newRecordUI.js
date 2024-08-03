
var newRecordUI = cc.Class({
    extends: cc.Component,

    properties: {
        recordLbl:cc.Label,
        titleLabel: cc.Label,
        newRecordLabel: cc.Label,

        content: cc.Node,
        blurBg: cc.Node,
        effect: dragonBones.ArmatureDisplay,
        btnLabel: cc.Label,

        timeLbl: cc.Label
    },

    onLoad () {
        this.limitClick = this.node.getComponent('LimitClick')
    },

    showUI:function(){
        this.titleLabel.string = cc.Mgr.Utils.getTranslation("newRecord-title");
        this.newRecordLabel.string = cc.Mgr.Utils.getTranslation("newRecord-level");
        this.recordLbl.string = cc.Mgr.game.level;
        this.btnLabel.string = cc.Mgr.Utils.getTranslation("btn-ok");
        
        this.blurBg.opacity = 0
        this.content.opacity = 0;
        this.content.setScale(.5)
        cc.tween(this.blurBg).to(0.05, {opacity:255}).call().start();
        cc.tween(this.content).to(0.15, {opacity:255, scale: 1}).start();
        cc.Mgr.admob.showBanner("newRecord");

        this.effect.playAnimation("newAnimation", 1);

        this.countDown();        
    },

    countDown:function(){
        this.count = 9
        this.timeLbl.string = "00:0" + this.count;
        this.callback = function () {
            if (this.count == 0) {
                this.closeUI();
            }
            this.timeLbl.string = "00:0" + this.count;
            this.count--;
        }
        this.timeLbl.node.active = true;

        this.schedule(this.callback, 1);
    },

    closeUI:function(){
        if (this.limitClick.clickTime() == false) {
            return
        }
        this.unschedule(this.callback);
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.admob.hideBanner("newRecord");
    	let self = this
        cc.tween(this.blurBg).to(0.15, {opacity:0}).start();
        cc.tween(this.content).to(0.15, {opacity:0, scale: .5}).call(() => {
            self.node.active = false;
            // cc.Mgr.admob.showInterstitial("nextStage", 'next', null, false);

            // if (cc.Mgr.game.level % 5 == 0 && cc.Mgr.game.lastShareOpen != cc.Mgr.game.level) {
            //     cc.Mgr.UIMgr.openShareUI();
            //     cc.Mgr.game.lastShareOpen = cc.Mgr.game.level;
            // }
            // cc.Mgr.UIMgr.openShareUI();
            // cc.Mgr.game.lastShareOpen = cc.Mgr.game.level;

            // cc.Mgr.UIMgr.openTurnTableUI();
        }).start();
        cc.Mgr.UIMgr.reduceShowUICount("record");
    },
});
module.exports = newRecordUI;